// Import the required modules
const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  sendotp,
  changePassword,
} = require("../controllers/Auth");

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signUp);

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp);

// Route for Changing the password
router.post("/changepassword", changePassword);

module.exports = router;
