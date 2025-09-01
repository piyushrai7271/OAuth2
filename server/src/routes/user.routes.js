import express from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import passport from "passport";
import {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserDetails,
  googleCallback,
  unlinkGoogle,
  logOut,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/change-password",userAuth,changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/get-user-details",userAuth,getUserDetails);
router.post("/logout",userAuth,logOut);


// --- Google OAuth ---
router.get(
  "/google",
  // state protects against CSRF replay; scope requests OIDC basics
  passport.authenticate("google", {
    scope: ["openid", "profile", "email"],
    session: false,
    state: true
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);

router.post("/google/unlink", userAuth, unlinkGoogle);



export default router;
