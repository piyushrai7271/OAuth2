import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const userAuth = async (req, res, next) => {
  try {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify Access Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please refresh your token.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authentication failed.",
      });
    }

    // Check decoded payload
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token payload",
      });
    }

    // Fetch user details (optional)
    const user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach to request object
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in authentication middleware",
    });
  }
};

export { userAuth };










// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// const userAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized: No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     if (!decoded || !decoded.id) {
//       // ✅ only checking id
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized: Invalid token" });
//     }

//     const user = await User.findById(decoded.id).select(
//       "-password -refreshToken"
//     );
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     req.user = user;
//     req.userId = user._id;
//     next();
//   } catch (error) {
//     console.error("Auth Middleware Error:", error);
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized: Token verification failed",
//     });
//   }
// };

// export { userAuth };
