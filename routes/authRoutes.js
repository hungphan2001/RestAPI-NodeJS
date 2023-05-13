const express = require("express");
const {createUser,
    loginUserController,
    getAllUser,
    getAUser,
    updateUser,
    deleteAUser,
    blockUser,
    unlockUser,
    handleRefreshToken,
    logout,
    updatePassword,
} = require("../controller/userController");

const {authMiddleware,isAdmin} = require("../middlewares/authMiddleware");
const router= express.Router();
router.post("/signup",createUser);
router.post("/login",loginUserController);
router.put("/change-password",authMiddleware,updatePassword);
router.get("/all-users",getAllUser);
router.get("/refreshtoken",handleRefreshToken);
router.get("/logout",logout);
router.get("/:id",authMiddleware,isAdmin,getAUser);
router.delete("/:id",deleteAUser);
router.put("/edit-user",authMiddleware,updateUser);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unlockUser);

module.exports = router;