const Profile = require("../models/Profile")
const User = require("../models/User")
const Course = require("../models/Course")

exports.updateProfile = async(req,res)=>{

    try{
        // get data
        const{dateOfBirth,gender,about,contactNumber} = req.body;
        // get userid
        const id = req.user.id
        // validate
        if(!dateOfBirth|| !gender|| !about||!contactNumber){
            return res.json({
                success:false,
                message:'Please fill all details'
            })
        }

        // find profile
        const userDetails = await User.findById(id)
        const profile = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profile);
        console.log(profileDetails)

        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save()

        // return response
        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully"

        })

    }catch(err){
        console.log(err)
      return  res.status(400).json({
        successs:false,
        message:err

        })
    }
}

// Delete Account

exports.deleteAccount = async(req,res) =>{

    try{
        // get id

        const id  = req.user.id
        // validate
        if(!id){
            return res.json({
                success:false,
                message:"Id not available"
            })
        }
        const profileid =  await User.findById(id)
        // console.log(profileid.courses)
        


           await Profile.findByIdAndDelete(profileid.additionalDetails)
           await Course.updateMany({StudentsEnrolled:id},{$pull:{StudentsEnrolled:id}},{new:true})
        

           await User.findByIdAndDelete(id)

        console.log("user id  =>"+ id +" is deleted")

        return res.json({
            success:true,
            message:"Profile Delted Successfully!"
        })



    }catch(err){
        console.log(err)
      return  res.status(400).json({
        successs:false,
        message:err

        })
    }
}

