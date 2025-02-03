const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");

// Capture the payment
exports.capturePayment = async (req, res) => {
    try {
        const { courses } = req.body;
        const userId = req.user.id;

        if (!courses || !Array.isArray(courses)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course data"
            });
        }

        let total_amount = 0;
        const courseDetails = [];

        // Fetch all course details and calculate total
        for (const courseId of courses) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: `Course with ID ${courseId} not found`
                });
            }

            // Check if user is already enrolled
            if (course.studentsEnrolled.includes(userId)) {
                return res.status(400).json({
                    success: false,
                    message: `Already enrolled in course: ${course.courseName}`
                });
            }

            // Normalize price
            let price = 0;
            if (typeof course.price === 'number') {
                price = course.price;
            } else if (typeof course.price === 'string') {
                price = parseFloat(course.price.replace(/[^0-9.]/g, ''));
            }

            if (isNaN(price)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid price for course ${course.courseName}`
                });
            }

            total_amount += price;
            console.log("total_amount is",total_amount)
            console.log("course_id is ",course._id)
            courseDetails.push({
                id: course._id,
                name: course.courseName,
                price: price
            });
        }

        // Handle free courses
        if (total_amount === 0) {
            await enrollStudents(courses, userId);
            return res.status(200).json({
                success: true,
                message: "Enrolled in free course successfully",
                data: {
                    courses: courseDetails,
                    totalAmount: 0,
                    paymentType: "free"
                }
            });
        }

        // Create Razorpay order for paid courses
        const options = {
            amount: Math.round(total_amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const paymentResponse = await instance.orders.create(options);
        
        res.status(200).json({
            success: true,
            message: "Order created successfully",
            data: {
                ...paymentResponse,
                courses: courseDetails,
                totalAmount: total_amount
            }
        });
    } catch (error) {
        console.error("Payment capture error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



// Verify the payment
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courses,
            paymentType = "paid"
        } = req.body;

        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        // Handle both free and paid courses
        try {
            await enrollStudents(courses, userId);

            // For paid courses, verify payment signature
            if (paymentType === "paid") {
                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                    throw new Error("Missing payment verification details");
                }

                const body = razorpay_order_id + "|" + razorpay_payment_id;
                const expectedSignature = crypto
                    .createHmac("sha256", process.env.RAZORPAY_SECRET)
                    .update(body.toString())
                    .digest("hex");

                if (expectedSignature !== razorpay_signature) {
                    throw new Error("Invalid payment signature");
                }
            }

            return res.status(200).json({ 
                success: true, 
                message: `${paymentType === "free" ? "Free enrollment" : "Payment"} successful and enrollment completed`,
                data: {
                    courses,
                    paymentType,
                    ...(paymentType === "paid" && {
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id
                    })
                }
            });

        } catch (error) {
            throw new Error(`Enrollment failed: ${error.message}`);
        }

    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Payment verification failed"
        });
    }
}


// Send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide all required details" 
        });
    }

    try {
        const enrolledStudent = await User.findById(userId);
        if (!enrolledStudent) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        );

        return res.status(200).json({
            success: true,
            message: "Payment success email sent"
        });
    } catch (error) {
        console.log("Error in sending payment success email:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Could not send email" 
        });
    }
}

// Helper function to enroll students
const enrollStudents = async (courses, userId) => {
    if (!courses || !userId) {
        throw new Error("Missing course ID or user ID");
    }

    try {
        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        for (const courseId of courses) {
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                throw new Error(`Invalid course ID: ${courseId}`);
            }

            // Update Course - add student to enrolled list
            const enrolledCourse = await Course.findByIdAndUpdate(
                courseId,
                { $addToSet: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                throw new Error(`Course not found: ${courseId}`);
            }

            // Update User - add course to their courses list
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { courses: courseId } },
                { new: true }
            );

            // Create course progress entry
            await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: []
            });

            // Send enrollment confirmation email
            const emailContent = courseEnrollmentEmail(
                user.firstName,
                enrolledCourse.courseName
            );
            await mailSender(
                user.email,
                `Successfully Enrolled in ${enrolledCourse.courseName}`,
                emailContent
            );
        }
    } catch (error) {
        console.error("Enrollment error:", error);
        throw new Error(error.message);
    }
};
