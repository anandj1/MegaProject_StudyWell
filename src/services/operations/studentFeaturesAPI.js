import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

// Load the Razorpay SDK
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Send Payment Success Email
const sendPaymentSuccessEmail = async (data, token) => {
  try {
    console.log("Sending payment success email with data:", data);
    const response = await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    
    if (!response?.data?.success) {
      throw new Error(response.data?.message || "Failed to send success email");
    }
    console.log("Payment success email sent");
  } catch (error) {
    console.error("PAYMENT SUCCESS EMAIL ERROR:", error);
    toast.error("Failed to send payment confirmation email");
  }
};

// Buy Course Function
export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
  if (!token) {
    toast.error("Please login first");
    navigate("/login");
    return;
  }

  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    toast.error("Please select at least one course");
    return;
  }

  const toastId = toast.loading("Processing payment...");
  dispatch(setPaymentLoading(true));

  try {
    // Fetch course details and prices
    const courseData = await Promise.all(
      courses.map(async (course) => {
        const courseId = typeof course === "string" ? course : course._id;
        const response = await apiConnector(
          "POST",
          "/course/getCourseDetails",
          { courseId }
        );

        if (!response?.data?.success) {
          throw new Error(`Could not fetch details for course: ${courseId}`);
        }

        const courseDetails = response.data.data.courseDetails;
        const price = Number(courseDetails.price);
        
        if (isNaN(price)) {
          throw new Error(`Invalid price for course: ${courseId}`);
        }

        return {
          id: courseId,
          name: courseDetails.courseName,
          price: price,
        };
      })
    );

    // Calculate total amount
    const totalAmount = courseData.reduce((sum, course) => sum + course.price, 0);

    // Handle free courses
    if (totalAmount === 0) {
      const response = await apiConnector(
        "POST",
        COURSE_VERIFY_API,
        {
          courses: courseData.map((course) => course.id),
          totalAmount: 0,
          paymentType: "free",
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response?.data?.success) {
        throw new Error(response.data?.message || "Could not enroll in free course");
      }

      toast.success("Successfully enrolled in the course!");
      navigate("/dashboard/enrolled-courses");
      dispatch(resetCart());
      return;
    }

    // Create order for paid courses
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses: courseData.map((course) => course.id),
        totalAmount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!orderResponse?.data?.success) {
      throw new Error(orderResponse.data?.message || "Could not create order");
    }

    // Load Razorpay SDK
    const razorpayLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!razorpayLoaded) {
      throw new Error("Razorpay SDK failed to load");
    }

    // Configure Razorpay
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      currency: orderResponse.data.data.currency || "INR",
      amount: orderResponse.data.data.amount,
      order_id: orderResponse.data.data.id,
      name: "Study Well",
      description: "Course Purchase",
      prefill: {
        name: `${userDetails?.firstName || ""} ${userDetails?.lastName || ""}`.trim(),
        email: userDetails?.email || "",
      },
      handler: async function (response) {
        const verifyToastId = toast.loading("Verifying payment...");
        try {
          // Verify payment
          const verifyResponse = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              courses: courseData.map((course) => course.id),
              totalAmount,
            },
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (!verifyResponse?.data?.success) {
            throw new Error(
              verifyResponse.data?.message || "Payment verification failed"
            );
          }

          // Send payment success email
          await sendPaymentSuccessEmail(
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: orderResponse.data.data.amount,
            },
            token
          );

          toast.success("Payment successful! You are enrolled in the course.");
          navigate("/dashboard/enrolled-courses");
          dispatch(resetCart());
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error(error.message || "Payment verification failed");
        } finally {
          toast.dismiss(verifyToastId);
          dispatch(setPaymentLoading(false));
        }
      },
      modal: {
        ondismiss: function () {
          dispatch(setPaymentLoading(false));
          toast.dismiss(toastId);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      toast.error(response.error?.description || "Payment failed");
      dispatch(setPaymentLoading(false));
    });
    paymentObject.open();

  } catch (error) {
    console.error("Course purchase error:", error);
    toast.error(error.message || "Failed to process purchase");
    dispatch(setPaymentLoading(false));
  } finally {
    toast.dismiss(toastId);
  }
}