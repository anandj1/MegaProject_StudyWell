    const User = require("../models/User")
const OTP = require("../models/OTP")
const otpgen = require("otp-generator")
const bcrypt = require("bcrypt")
const Profile = require("../models/Profile")
const jwt = require("jsonwebtoken")
const mailSender = require("../models/Util/mailSend")

exports.sendotp = async (req,res)=>{
    try{
         // Fetching Email
    const{email} = req.body;

    // check if user with that mail exist

    const checkEmail = await User.findOne({email});
    if(checkEmail){
        return res.status(401).json({
            success:false,
            message:"User with that mail already exist!"
        })
    }
    let otp = otpgen.generate(5,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
        
    });
    console.log("OTP IS ",otp);
    // check unique otp;
    const result = await OTP.findOne({otp})
    // similar otp exists!!!
    while(result){
     otp =   otpgen.generate(5,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
        
    });
    result = await OTP.findOne({otp})

    }

    const otpsend = {email,otp}
    // entry in db
    const otpbody = await OTP.create(otpsend);
    console.log(otpbody);

    res.status(200).json({
        success:true,
        message:"OTP sent Successfully"
    })

     



    }catch(err){
        console.log(err);
        res.json({
            status:false,
            message: err
        })
    }

   



}

// Signup Auth
exports.signup = async(req,res)=>{

    try{
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp
        } = req.body
        if(!firstName || !lastName||!email||!password||!confirmPassword||!otp ){
            return res.json({
                success:false,
                message:"Please fill all details"
            })
        }
        // password matching
        if(password!== confirmPassword){
            return res.json({
                success:false,
                message:"Password does not match"
            })
        }
        // check user exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({
                success:false,
                message:"User already exists"
            })
        }

        // Finding Most recent Otp
        // check by findone also
        const recent= await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recent);
        if(recent.length===0){
            return res.json({
                status:false,
                message:" OTP not found"
            })
        }else if(otp !== recent[0].otp){
            return res.json({
                status:false,
                message:" OTP Invalid"
            })
        };

        // otp matched!

        const hashPass = await bcrypt.hash(password,10) ;

        const profile = await Profile.create ({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber: null
        });

        // entry in db
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashPass,
            accountType,
            additionalDetails:profile._id,
            images:`https://api.dicebear.com/9.x/initials/svg?radius=40&seed=${firstName} ${lastName}`




            



        })

        return res.json({
            success:true,
            message:"Entry done successfully",
            data: user,

        })







    }catch(err){
        console.log(err)
        res.json({
            success:false,
            message:err
        })

    }
}



// Login AUth

exports.login= async(req,res)=>{
    try{
        const{email,password} = req.body;
        if(!email||!password){
            return res.json({
                status:false,
                message:"Fill all details"
            })
        }
        // checking for user
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                status:false,
                message:"No user exists Please signUp"
            })
        }
        // Matchind pass
        if(await bcrypt.compare(password,user.password)){
            const payload ={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
        

        //Matching done genrating token now

       
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"1H"
            })
            user.token = token;
            user.password = undefined;

            // create cookie
            const options ={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true


            }
            return res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged In Successfully"
            })
        }
        else{
            return res.json({
                success:false,
                message:"Password is incorrect"
            })
        }


        


    }catch(err){
        console.log(err)
        res.json({
            success:false,
            message: err
        })

    }
}
exports.changePassword = async(req,res)=>{

    try{
        const{password,newPassword,confirmnewPassword} = req.body
        const email= req.user.email
        if(!newPassword||!password||!confirmnewPassword){
            return res.json({
                success:false,
                message:"Please fill all the details"
            })
        }
        if(newPassword!==confirmnewPassword){
            return res.json({
                success:false,
                message:"Password did not match"
            })

        }
        const user = await User.findOne({email})
        if(!user){
            return res.json({
                success:false,
                message:"No user found please signup!"
            })

        }
        
        if(await bcrypt.compare(password,user.password)){

            const hashPass =  await bcrypt.hash(newPassword,10);
            user.password = hashPass;
            await user.save();

            await mailSender(email,'Password Changed Successfully',`Hello! ${user.firstName} your password is changed successfully`)

        }else{
            return res.json({
                success:false,
                message:"password did not match"

            })
        }
        return res.status(200).json({
            success:true,
            message:"Password Changed successfuly!"
        })



    }catch(err){
        return res.json({
            success:false,
            message:"error while changing pass"
        })

    }
    

}

// Get user details
exports.getUserdetails = async(req,res)=>{

    try{
        const{email} = req.user;
        console.log(email)
        if(!email) {
            return res.json({
                success:false,
                message:"Please login"
            })
        }
        const details = await User.findOne({email},{firstName:true, lastName:true,email:true, additionalDetails:true,accountType:true,images:true}).populate("additionalDetails").exec()
        if(!details){
            return res.json({
                success:false,
                message:"Mail did not match"
            })
        }
        return res.json({
            success:true,
            message:"Data fetched successfully",
            data:details

        })

    }catch(err){
        return res.json({
            success:false,
            message: err


        })
    }
}

