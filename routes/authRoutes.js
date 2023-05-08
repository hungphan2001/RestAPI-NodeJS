const express = require("express");
const {createUser,loginUserController,getAllUser} = require("../controller/userController");
const router= express.Router();
router.post("/signup",createUser);
router.post("/login",loginUserController);
router.get("/all-users",getAllUser);
module.exports = router;