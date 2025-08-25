import User from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Error in generating token !");
  }
};
const register = async (req, res) => {
  try {
    const { userName, email, mobileNumber, password, profileImage } = req.body;

    //validate comming input
    if (!userName || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required !!",
      });
    }
    // handling file
    const profileImageUrl = req.file.path;
    if (!profileImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Profile image url is missing !!",
      });
    }

    //find user with email
    const existingUser = await User.find(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email",
      });
    }

    //create user in db as if it doesn't exist
    const user = await User.create({
      userName,
      email,
      mobileNumber,
      profileImage: profileImageUrl,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if(!createdUser){
        return res.status(500).json({
            success:false,
            message :"Something went wrong"
        })
    }

    // return response
    return res.status(200).json({
        success:true,
        message:"User regestered successfully !!!",
        data : createdUser
    })
  } catch (error) {
    console.error(`Error while registering user: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server Error !!",
      error: error.message,
    });
  }
};
const login = async (req, res) => {};
const changePassword = async (req, res) => {};
const logOut = async (req, res) => {};

export { register, login, changePassword, logOut };
