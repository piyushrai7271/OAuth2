import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required:true,
        trim:true
    },
    email :{
        type:String,
        trim:true,
        unique:true,
        match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please enter a valid email address",
      ]
    },
    mobileNumber: {
        type: String,
        unique:true,
        trim:true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    },
    googleId: {
      type: String,
      index: true,
      sparse: true // allows multiple nulls
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "mixed"], // local = email/pass, google = only Google, mixed = both
      default: "local"
    },
    avatar: {
      type: String // store Google profile picture if available
    }
},{timestamps:true});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});


userSchema.methods.isPasswordCorrect = async function (inputPassword){
    if(!inputPassword){
         throw Error("Password is not comming")
    }
    return await bcrypt.compare(inputPassword.toString(),this.password);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            id:this._id,
            userName:this.userName,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


const User = mongoose.model("User",userSchema);
export default User;