import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "../utilis/forgetPassword.js";

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
      SameSite: "None",
    };

    // send success response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User loged In successfull !!",
        accessToken: accessToken,
        LoggerInUser,
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
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Validate email presence
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ✅ Find user by email
    const user = await User.findOne({ email });

    // Always respond with generic message, even if user doesn't exist
    if (!user) {
      // Simulate sending email for non-existent user to prevent email enumeration
      return res.status(200).json({
        success: true,
        message:
          "If the email is registered, you will receive a password reset link shortly.",
      });
    }

    // ✅ Send password reset email
    const result = await sendPasswordResetEmail(user);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message:
          "If the email is registered, you will receive a password reset link shortly.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send reset link. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { token } = req.params; // ⬅️ Get token from URL params

    // ✅ Validate required fields
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Token, password, and confirmPassword are required.",
      });
    }

    // ✅ Validate password format
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // ✅ Check password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword do not match.",
      });
    }

    // ✅ Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // ✅ Find user by token payload
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ✅ Update and hash new password (will trigger pre-save middleware)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message:"Password reset Successfully !! ",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error:error.message
    });
  }
};
const getUserDetails = async (req, res) =>{
   try {
     const userId = req.userId;

     //validate userId 
     if(!userId){
       return res.status(404).json({
         success:false,
         message:"User id didn't got"
       })
     }

     //find user by Id
     const user = await User.findById(userId);
     if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found with id"
      })
     }

     //return response
     return res.status(200).json({
      success:true,
      message:"user data found successfully !!",
      data :{
        id: user._id,
        userName: user.userName,
        email: user.email,
        mobileNumber: user.mobileNumber
      }
     })
   } catch (error) {
    console.error(`Error in geting user details : ${error}`);
    return res.status(500).json({
      success:false,
      message:"Internal server Error !!"
    })
   }
}
const googleCallback = async (req, res) => {
  try {
    // req.user comes from Passport's Google strategy
    const user = req.userId;
    if (!user?._id) {
      return res.redirect(`${FRONTEND_BASE_URL}/login?error=OAuthUserMissing`);
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // Persist refreshToken if required
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Cookie options directly here
    const cookieOptions = {
      httpOnly: true,
      secure: true,       // Always secure for production
      sameSite: "None",   // For cross-site cookies if needed
    };

    // Set Access Token cookie (15 min)
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    });

    // Set Refresh Token cookie (30 days)
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect to frontend dashboard after successful login
    return res.redirect(`${FRONTEND_BASE_URL}/dashboard`);

  } catch (err) {
    console.error("Google callback error:", err);
    return res.redirect(`${FRONTEND_BASE_URL}/login?error=OAuthFailed`);
  }
};
const unlinkGoogle = async (req, res) => {
  try {
    const user = req.user;

    //validate comming user
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Prevent lockout: must set a password before unlinking
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Set a password before unlinking Google.",
      });
    }

    user.googleId = undefined;
    user.authProvider = "local";
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
       success: true,
       message: "Google unlinked successfully." 
      });
  } catch (error) {
    console.error("unlinkGoogle error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error"
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
      SameSite: "None",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "User Logout successfully !!",
      });
  } catch (error) {
    console.error("Error in logout ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error !!",
    });
  }
};

export {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserDetails,
  googleCallback,
  unlinkGoogle,
  logOut,
};
