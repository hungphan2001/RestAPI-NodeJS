const express = require("express");
const {createUser,loginUserController} = require("../controller/userController");
const router= express.Router();
router.post("/signup",createUser);
router.post("/login",loginUserController);
module.exports = router;