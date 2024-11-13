const SubSection = require("../models/SubSection")
const Section = require("../models/Section");
const { uploadImage } = require("../models/Util/imageUpload");


exports.createSubSection = async (req,res)=>{

    try{ 

        const{sectionId,title, timeDuration, description,} = req.body;
        // extracting the file/video
        const video = req.files.video;
        // validation
        if(!sectionId||!title||!timeDuration||!description||!video){
            return res.status(400).json({
                success:false,
                messsage:"All fields are required!"
            })
        }

        // uploading video to cloudinary
        const uploadfile = await uploadImage(video,process.env.FOLDER_NAME)
        // creating sub section

        const Subsection = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description: description,
            videoUrl: uploadfile.secure_url

        })

        // updating the subsection to section

        const uploadSubSection = await Section.findByIdAndUpdate({_id:sectionId},{
                                                                  $push:{
                                                                    subSection : Subsection._id
                                                                  }},{new:true})
          const showall = await Section.find({_id:sectionId}).populate("subSection").exec() 
          
          console.log(showall);

     return res.json({
        success:true,
        message:"Subsection Updated Successfully",
        showall
     })
                                                  
        





    }catch(err){
        console.log(err)
      return  res.status(400).json({
        successs:false,
        message:err

        })
    }



}
exports.updateSubSection= async(req,res)=>{

    try{
        const{title,timeDuration,description,videoUrl,subSectionID} = req.body
        if(!title||!timeDuration||!description||!videoUrl||!subSectionID){
            return res.json({
                success:false,
                message:"Error please fill all details"
            })
        }
        const subUpdate = await SubSection.findByIdAndUpdate({_id:subSectionID},{title:title,timeDuration:timeDuration,description:description,videoUrl:videoUrl},{new:true})
        return res.json({
            success:true,
            message:"SubSection Updated successfully"
        })



    }catch(err){
        console.log(err)
      return  res.status(400).json({
        successs:false,
        message:err

        })
    }
}

exports.deleteSubSection = async(req,res)=>{

    try{
        const{subSectionID}= req.params;
        console.log(subSectionID)
        if(!subSectionID){
            return res.json({
                success:false,
                message:"Error in obtaining id"
            })
        }
        await SubSection.findByIdAndDelete({_id:subSectionID})
        return res.json({
            success:true,
            message:'SubSection deleted successfully'
        })
        


    }catch(err){
        console.log(err)
      return  res.status(400).json({
        successs:false,
        message:err

        })
    }
}