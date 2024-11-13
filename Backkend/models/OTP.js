const mongoose = require('mongoose')
const mailSender = require('./Util/mailSend')

const OTP = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    }

})

// sending mail

async function sendMail(email,otp){

    try{

        const mailres = await mailSender(email,"Verificat1ion Email from StudyWell",otp);
        console.log("Email sent Successfully",mailres);

    }catch(error){
        console.error(error)

    }
}
OTP.pre("save",async function(next){
    await sendMail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTP",OTP)