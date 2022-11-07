//extracting router method from express module
const express = require("express");
const router = express.Router();

//extracting auth-controllers 
const authController = require("../controllers/auth-controllers"); 

//setting rest APIs
router.get("/googleAuthlink",authController.googleAuthPage);
router.get("/googleAuth", authController.redirectGoogleEmail);
router.get("/authLogin", authController.authLogin);
router.get("/logout",authController.authLogout);

module.exports = router;