const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../config/jwtToken");
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const { validateMongoDbId } = require("../utils/validateMongodbdId");
const sendEmail  = require("./emailController");
const crypto =require('crypto');
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //Create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User Already Exist");
    }
});

const loginUserController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(
            findUser.id,
            {
              refreshToken:refreshToken,
            },{ new:true }
        );
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            maxAge:72* 60*60*1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            //role:findUser?.role,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials")
    }
    //console.log(email,password);
})

//Handle refresh token

const handleRefreshToken = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    //console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error("No refresh token present in db or not matched");
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err||user.id !=decoded.id){
            throw new Error("There is sth wrong with refresh token");
        }
        //const accessToken = generateToken(user?._id);
        const accessToken = generateToken(user?._id)
        res.json({accessToken});
    });
});

//Handle logout

const logout = asyncHandler(async(req,res)=>{
  const cookie = req.cookies;
  if(!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user) {
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken,{
        refreshToken:"",
    });
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
    });
    res.sendStatus(204);
});

//Get/Read all users

const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
})

//Get a single user

const getAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getAUser = await User.findById(id);
        res.json({
            getAUser,
        });
       //console.log(id);
    } catch (error) {
        throw new Error(error);
    }
})


//Update a user 
const updateUser = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
      const updateUser = await User.findByIdAndUpdate(
        _id,
        {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile, 
        },{
            new:true,
        }
        );
        res.json({
            updateUser,
        })
    } catch (error){
        throw new Error(error);
    }
})

// Update password

const updatePassword = asyncHandler(async(req,res)=>{
    const {_id}= req.user;
    const {password}= req.body;
     validateMongoDbId(_id);
     const user = await User.findById(_id);
     if(password){
        user.password=password;
        const updatePassword = await user.save();
        res.json(updatePassword);
   } else{
    res.json(user);
   }
})

//Delete a user

const deleteAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
            deleteUser,
        })
    } catch (error) {
        throw new Error(error);
    }
})

const blockUser = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
       const block = await User.findByIdAndUpdate(
        id,
        {
            isBlocked:true,
        },{
            new:true,
        }
       );
       res.json(block)
    }catch(error){
        throw new error(error);
    }
});
const unlockUser = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:false,
            },
            {
                new:true,
            }
        );

        res.json(unblock)
    } catch(error){
        throw new error(error);
    }
});
//Get token password
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      sendEmail(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
  });

  const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  });
module.exports = { 
    createUser, 
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
    forgotPasswordToken,
    resetPassword
};