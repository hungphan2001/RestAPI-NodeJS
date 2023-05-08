const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../config/jwtToken");

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
    try {
        const getAUser = await User.findById(id);
        res.json({
            getAUser,
        });
        console.log(id);
    } catch (error) {
        throw new Error(error);
    }
})

//Update a user 
const updateUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
      const updateUser = await User.findByIdAndUpdate(
        id,
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

//Delete a user

const deleteAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
            deleteUser,
        })
    } catch (error) {
        throw new Error(error);
    }
})
module.exports = { 
    createUser, 
    loginUserController, 
    getAllUser, 
    getAUser,
    updateUser, 
    deleteAUser 
};