//extracting router method from express module
const express = require("express");
const router = express.Router();

//extracting user-model router functions
const userController = require("../controllers/user-controllers");

//setting rest APIs
router.post("/createAccount",userController.createAccount);

module.exports = router;
