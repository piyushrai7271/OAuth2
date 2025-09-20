import express from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserDetails,
  refreshAccessToken,
  logOut,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/change-password",userAuth,changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/get-user-details",userAuth,getUserDetails);
router.post("/refresh-access-token",refreshAccessToken);
router.post("/logout",userAuth,logOut);



export default router;
