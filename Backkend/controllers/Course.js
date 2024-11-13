const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const {uploadImage}  = require("../models/Util/imageUpload")

exports.createCourse =  async(req,res)=>{

    try{

        // fetching data
        const{title,courseDesc, whatulearn,price,category,Tag} = req.body
        // getting thumbnail
        const {thumbnail} = req.files;
        // validation
        if(!title||!courseDesc||!whatulearn||!price||!category){
            return res.json({
                success:false,
                message:"Please fill all the details!"
            })


        }

        // getting instructor details
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log('instructors details =>',instructorDetails)

        if(!instructorDetails){
            return res.json({
                success:false,
                message:"Details not found"
            })
        }
        // checking Categorys

        const Categorydetails = await Category.findById(category);
        if(!Categorydetails){
            return res.json({
                success:false,
                message:"Category Detials not found"
            })
        }

        // upload thumbnail to cloudinary
        const thumbnailImage = await uploadImage(thumbnail,process.env.FOLDER_NAME)
        const newCourse = await Course.create({
            title,
            courseDesc,
            instructor:instructorDetails._id,
            whatulearn,
            price,
            Tag: Tag,
            Category:Categorydetails._id,
            thumbnail:thumbnailImage.secure_url


        })

        // adding new Course to that particular Instructor's Course
        await User.findOneAndUpdate(
           { _id:instructorDetails._id},
        {
            $push:{
                courses:newCourse._id
            }
        },
        {new:true}
    );

    // Updating Category Schema
    await Category.findOneAndUpdate({
        _id:category
    },
{
    $push:{
        course:newCourse._id

    },

},{new:true})



    return res.json({
        success:true,
        message:"Course Created Successfully!",
        details:newCourse
    })



         
          

    }catch(err){
        console.log(err);
        res.json({
            message:false,
            message:err

        })
    }
}


// Showing All courses

exports.getAllCourses = async (req,res) =>{
    try{
        const allcourses = await Course.find({},{
            title:true,
            courseDesc:true,
            instructor:true,
            whatulearn:true,
            price:true,
            thumbnail:true,
            Category:true}).populate("instructor").exec();


            res.json({
                success:true,
                message:"Data for all course fetched successfully",
                data:allcourses
            })
   

    }
    catch(err){
        console.log(err);
        res.json({
            message:false,
            message:err

        })

    }
}

exports.getCourseDetails = async(req,res)=>{

    try{
        const {courseID} = req.body;
        console.log(courseID)

        const courseDetails = await Course.findById({_id:courseID})
                                                   .populate({
                                                      path:"instructor",
                                                      select:"firstName lastName",
                                                      populate:{
                                                        path:"additionalDetails"
                                                      }

                                                   }
                                                )
                                                .populate("Category")
                                                // .populate("RatingANDReview")
                                                .populate({
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"subSection",
                                                        
                                                    }
                                                })
                                                .exec()
                                                console.log(courseDetails)

       if(!courseDetails){
        return res.json({
            success:false,
        message:"Error in finding data"
        })
        
       }                 
         return res.json({
            success:true,
            message:"Data fetched successfully",
            data:courseDetails

         })                                       


    }catch(err){
        return res.json({
            success:false,
            message:"False"+err


        })
    }



}