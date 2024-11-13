const jwt = require("jsonwebtoken")
require("dotenv").config();
const User = require("../models/User");

//auth

exports.auth = async (req, res, next) => {
    try{
        // extracting token

        const token = req.cookies.token||req.body.token||req.header("Authorisation").replace("Bearer ","");
        if(!token){
            return res.json({
                success:false,
                message:"Error in getting token"
            })
        }


        // verifcation of the token

        try{
            const decode =  jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;


        }catch(err){
            return res.json({
                success:false,
                message:err
            })
        }
        next()

    }catch(err){
        console.log(err);
        return res.json({
            status:false,
            message:"Error"+ err
        })
    }
}

// is student?

exports.isStudent = async(req,res,next)=>{

    try{
        if(req.user.accountType!=='Student'){
            return res.json({
                success:false,
                message:"This is route for students !"
            })
        }
        next()



    }catch(err){
        return res.json({
            success:false,
            message: err

        }) 
    }
}

// is Teacher?

exports.isInstructor = async(req,res,next)=>{
    console.log(req.user.accountType)

    try{
        if(req.user.accountType!=='Instructor'){
            return res.json({
                success:false,
                message:"This is route for Instructor !"
            })
        }
        next()



    }catch(err){
        return res.json({
            success:false,
            message: err

        }) 
    }
}
    // is Admin?
    

exports.isAdmin = async(req,res,next)=>{

    try{
        if(req.user.accountType!=='Admin'){
            return res.json({
                success:false,
                message:"This is route for Admin !"
            })
        }
        next()



    }catch(err){
        return res.json({
            success:false,
            message: err

        }) 
    }
}



