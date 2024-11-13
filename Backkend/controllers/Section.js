const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async(req,res)=>{
    try{
        const{sectionName,courseID} = req.body;
        if(!sectionName||!courseID) {
            return res.json({
                success:false,
                message:"Please fill al details"
            })
        }
        // create section
        const newSection = await Section.create({sectionName:sectionName});

        // Update course details with added Section
        const updatedCourse = await Course.findOneAndUpdate({_id:courseID},{
                                                             $push:{
                                                                courseContent: newSection._id,


                                                             }},
                                                             {new:true},

        



        )
        console.log(updatedCourse)

        const CoursePrint = await Course.findById((courseID),{title:true, courseDesc:true,instructor:true, whatulearn:true,courseContent:true,price:true}).populate("courseContent").populate({path:"instructor",select:"firstName"}).exec()
                                      console.log(CoursePrint)
            

           return res.status(200).json({
            success:true,
            message:"Section added Successfully",
            CoursePrint
           })                           
                                    


    }catch(err){
        console.log(err)
      return  res.status(400).json({
        successs:false,
        message:err

        })
    }


}

exports.updateSection = async(req,res)=>{
   
     // Updating name of section
     try{
        const{sectionName,sectionId} = req.body;

        if(!sectionName||!sectionId){
            return res.json({
                success:false,
                message:"Fill all details"
            })
        }

        const section = await Section.findOneAndUpdate({_id:sectionId},{sectionName},{new:true})

        return  res.json({
            success:true,
            message:'Section Updated successfully!',
            details: section
        })
                                                    





     }catch(err){
        console.log(err)
      return  res.status(400).json({
        successs:false,
        message:err

        })
    }
}


exports.deleteSection = async(req,res)=>{

    try{
        const{sectionId} = req.params;
        if(!sectionId){
            return res.json({
                success:false,
                message:"Please fill all details"
            })
        }
        // const CourseDel = await Course.findByIdAndDelete({courseContent.})
        const sectionDelete = await Section.findByIdAndDelete({_id:sectionId})
        console.log(sectionDelete)

        // Should we delete from Course Schema

    
        return res.status(200).json({
            success:true,
            message:"Id deleted Successfully!!",
            CourseDel

        })

    }catch(err){
        console.log(err)
        return res.json({
            success:false,
            message:"Error in deleting"
        })
    }




}