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
    const { userName, email, mobileNumber, password } = req.body;

    //validate comming input
    if (!userName || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required !!",
      });
    }

    //find user with email
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }, { mobileNumber }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User with this email, username, or mobile number already exists",
      });
    }

    //create user in db as if it doesn't exist
    const user = await User.create({
      userName,
      email,
      mobileNumber,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }

    // return response
    return res.status(201).json({
      success: true,
      message: "User regestered successfully !!!",
      data: createdUser,
    });
  } catch (error) {
    console.error(`Error while registering user: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server Error !!",
      error: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate comming input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required for login",
      });
    }

    //find user with email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "For login first register yourself.",
      });
    }

    //check password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect.",
      });
    }

    //Access and refresh Token
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const LoggerInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    //handling cookies
    const options = {
      httpOnly: true,
      secure: true,
      SameSite:"None",
    };

    // send success response
    return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json({
        success: true,
        message: "User loged In successfull !!",
        accessToken:accessToken,
        LoggerInUser
      });
  } catch (error) {
    console.error("Error in login :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server !!",
      error: error.message,
    });
  }
};
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.userId;

    //validate comming input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All the fields are requitred for changing password !!",
      });
    }
    //check newPassword and confirmPassword are same
    if (newPassword !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "newPassword and confirmPassword are not matching",
      });
    }
    // validating user id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unathorised user !!",
      });
    }
    //find user with user id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doen't exist ",
      });
    }

    // check current password is correct or not
    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Password is invalid !!",
      });
    }

    // changing password in db
    user.password = newPassword;
    await user.save();

    // send response for success
    return res.status(200).json({
      success: true,
      message: "Password changed successfully !!",
    });
  } catch (error) {
    console.error("Error in change Password", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
    });
  }
};
const logOut = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
    req.userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    SameSite:"None"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        success:true,
        message:"User Logout successfully !!"
    });
  } catch (error) {
    console.error("Error in logout ",error);
    return res.status(500).json({
        success:false,
        message:"Internal server error !!"
    })
  }
};

export { register, login, changePassword, logOut };
