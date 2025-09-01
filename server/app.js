import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import configureGoogleStrategy from "./src/config/passport.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

configureGoogleStrategy();
// Initialize passport (even without sessions)
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//Routes Import and handling
import userRoutes from "./src/routes/user.routes.js";

app.use("/api/user", userRoutes);

export default app;
