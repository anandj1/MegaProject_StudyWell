const nodemailer = require("nodemailer");

const mailSender = async(mail,title,body)=>{
    try{

        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass: process.env.MAIL_PASS

            }
            

        })
        let info = await transporter.sendMail({
            from: 'StudyWell - by Anand',
            to:`${mail}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(info)
        
    }catch(err){
        console.log(err)

    }


}
module.exports= mailSender