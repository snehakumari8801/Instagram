const express = require("express");
const router = express.Router();
const {signup,login, getProtectedData, logout, updateProfile, forgotPassword, verifyOtp, resetPassword, getAllPosts, likePost} = require("../controllers/user");
const { authMiddleware } = require("../middleware/auth");
const upload = require('../middleware/mullter');
const { postImageVideo } = require("../controllers/user");

router.post("/register", upload.single("profilePic"), signup);


// router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout", logout);
router.put("/updateProfile/:userId",upload.single("profilePic") ,authMiddleware, updateProfile);  //authMiddleware 
router.get("/auth" , authMiddleware , getProtectedData);
router.get("/forgotPassword" , forgotPassword);
// router.post("/verifyOtp" , verifyOtp);
router.post("/resetPassword/:token" , resetPassword);
router.post("/postImageVideo" ,upload.fields([
    {name:"image",maxCount:5},
    {name:"video",maxCount:1}
]), postImageVideo);

router.get("/getAllPosts" , getAllPosts);
router.post("/postLike/:postId" ,authMiddleware, likePost);



 
module.exports = router;