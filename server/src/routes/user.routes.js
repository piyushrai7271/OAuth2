import express from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  logOut,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/change-password",userAuth,changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout",userAuth,logOut);



export default router;
