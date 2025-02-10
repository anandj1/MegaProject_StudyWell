// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")

const { auth } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Add this route to handle direct URL access
router.get("/update-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ 
      token: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    res.json({
      success: true,
      message: "Token is valid"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error validating token"
    });
  }
});


// Export the router for use in the main application
module.exports = router
