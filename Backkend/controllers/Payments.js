const { mongo, default: mongoose } = require("mongoose")
const {instance} = require("../controllers/Razorpay")
const Course = require("../models/Course")
const User =require("../models/User")
const mailSender = require("../models/Util/mailSend")

// Noting down the payment and initiating the order


exports.capturePayment = async(req,res)=>{
    const{course_id} = req.body
    const{user_id} = req.user.body
        if(!course_id){
            res.status(400).json({
                success:false,
                message:"Please provide Course ID"
            })
        }
        // valid coursedetail

    let course;
        try{
            course = await Course.findById({course_id});
            if(!course){
                res.status(400).json({
                    success:false,
                    message:"Please provide valid course"
                })

            }
            // checking whther user alrady purchased course or not
            const uid =  new mongoose.Types.ObjectId(user_id)
            if(course.StudentsEnrolled.includes(uid)){
                res.status(200).json({
                    success:false,
                    message:"Course Already purchased"
                })

            }




        }catch(err){
            res.json({
                success:false,
                message:err
            })
        }

         // order creation

    const amount =  course.price
    const currency = "INR";

    const options  ={
        amount: amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            course_id,
            user_id

        }

    }
     try{

        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        return res.json({
            success:true,
            courseName: course.title,
            courseDesc: course.courseDesc,
            price: course.price,
            currency: paymentResponse.currency,
            orderID: paymentResponse.id,
            amount:paymentResponse.amount

        })
     }catch(err){
        res.json({
            success:false,
            message:err
        })}

    }


    // payment verification

    exports.verifyPayment = async(req,res)=>{

        // we will match the webhoook's key with backend key

        const webhookSecret = "123456"
// webhook's key =>  
const signature = req.headers("x-razorpay-signature");

const shasum  = crypto.createHmac("sha256",webhookSecret);
shasum.update(JSON.stringify(req.body) );
const digest = shasum.digest("hex");

if(signature === digest){
    console.log("Payment authorized")
}

const {course_id,user_id} = req.body.payload.payment.entity.notes

try{


    const enrolled = await Course.findOneAndUpdate({_id:course_id},{$push:{StudentsEnrolled:user_id

    }},{new:true})
    if(!enrolled){
        res.json({
            success:false,
            message:'Course Not found'
        })

    }
    conosle.log(enrolled)

    // find user and updating the student's course

    const user_enrolled = await User.findByIdAndUpdate({user_id},{$push:{courses:course_id}},{new:true})

    console.log(user_enrolled)


    // sending confirmation mail

    const sendEmail = await mailSender(user_enrolled.email,`Congratulations ${user_enrolled.firstName} `,`Congratulations for buying ${enrolled.title}`
                    
    )
    return res.json({
        success:true,
        message:"Signature verified and coure added"
    })


}catch(err){
    res.json({
        success:false
    })



    }
}
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body

    const userId = req.user.id
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
}






   