const RatingANDReview = require("../models/RatingANDReview")
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");


//  creating rating and review
exports.createRating = async(req,res)=>{

    try{

        // rating review and courseID
        const{rating,review,courseID} = req.body 
        // getting userId
        const userID = req.user.id;

        // checking if user is already enrolled
        const courseDetails = await Course.findOne({_id:courseID,StudentsEnrolled:{$elemMatch:{$eq: userID}}})
        if(!courseDetails){
            return res.json({
                success:false,
                message:"Student is not present in the course"
            })
        }
        // checking if already reviewd
        const check = await RatingANDReview.findOne({userID,courseID})
        if(check){
            return res.status(403).json({
                success:false,
                message:"You have already reviewd "

            })
        }
        // adding rating and review

        const ratings = await RatingANDReview.create({
                                                 rating: rating,
                                                  review:review,
                                                  Course:courseID,
                                                  user:userID
                                                })

          // pushing it to rating review
          
       const updated =    await Course.findByIdAndUpdate(courseID,{ $push:{
                                                              ratingANDreview:ratings._id

          }
          },{new:true})

          connsole.log(updated)
          return res.json({
            success:true,
            message:updated
          })
       



    }catch(err){
        return res.json({
            success:false,
            message: err
        })



    }
}

// average rating
exports. getAverageRating = async(req,res)=>{

    try{
        const courseID = req.body.courseID
        // cal avg

        const result = await RatingANDReview.aggregate([
            {
                $match:{course: new mongoose.Types.ObjectId(courseID)}
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])

        if(result.length>0){
            return res.json({
                success:true,
                averageRating: result[0].averageRating    // finalresult is at 0 position
            })
        }
        return res.json({
            success:true,
            message:  " Average rating is 0"
        })


    }catch(err){
        console.log(err)
        return res.json({
            success:false,
            message: err
        })

    }
}
exports.getAllRating = async(req,res)=>{

    try{

        const allReviews = await RatingANDReview.find({}).sort({rating:"desc"})
                                                          .populate({
                                                            path:"user",
                                                            select:"firstName lastName images "
                                                          })
                                                          .populate({
                                                            path:"course",
                                                            select:"title"
                                                          })
        if(!allReviews){
            return res.json({
                success:false,
                message:"Error while fetching data"
            })
        }
        return res.status(200).json({
            success:true,
            data:allReviews
        })
        

    }catch(err){
        console.log(err)
        return res.json({
            success:false,
            message: err
        })

    }
}



