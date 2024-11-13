const User = require("../models/User")
const mailSender = require("../models/Util/mailSend")
const bcrypt = require("bcrypt")
const crypto = require("crypto")



// Reset Password Token
exports.resetPasswordToken = async(req,res)=>{
    try{
          //get mail from body and validate it
    const {email} = req.body;
    const user = await  User.findOne({email});
    if(!user){
        return res.json({
           message: "Mail is not registered"
        })
    }
    


    //generate A token
    const token = crypto.randomUUID();
    // update user by adding token and expiration time
    const updated = await User.findOneAndUpdate({email},
                                                {
                                                    token:token,
                                                    resetPasswordExpiry: Date.now()+ 5*60*1000,
                                                },
                                                {new:true});
    console.log(updated)
    
    //create url//
    
    const local = `https://localhost:3000/update-password/${token}`

    //send it to mail
    await mailSender(email,'Reset Your Password',`hello ${updated.firstName} here is the link to reset ypur password ${local}`)
    //return response

    return res.json({
        success:true,
        message:"Email sent successfully"
    })
    }catch(err){
        return res.json({
            success:false,
            message:"Error"+err
        })
    }

  


   


}



// Reset Passoword

exports.resetPassword = async(req,res)=>{

    try{
        // data fetch
    const{password,confirmPassword,token} = req.body

    // validation
    if(password!==confirmPassword){
        return res.json({
            success:false,
            message:"Password did not match"
        })

    }
    //get user details from user
    const userDetails = await User.findOne({token:token})

    // token check
    if(!userDetails){
        return res.json({
            success:false,
            message:"This is invalid token"
        })
    }
    //token time check
    if(userDetails.resetPasswordExpiry<Date.now()){
        return res.json({
            success:false,
            message:"Token is expired! Regenerate it"
        })

    }
    // hash pwd
    const hashPass = await bcrypt.hash(password,10)

    //update passwrd
    await User.findOneAndUpdate({token:token},{password:hashPass},{new:true})
                                  

    //return response
    return res.json({
        success:true,
        message: "Password reset Successful!!"
    })
    }catch(err){
        return res.json({
            success:false,
            message:"Reset Failed"
        })
    }

    

}