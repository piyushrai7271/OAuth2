import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required:true,
        trim:true,
        unique:true
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
    profileImage:{
        type:String,
        default:"",
    },
    password:{
        type:String,
        require:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next ();

    this.password = await bcrypt.hash(this.password,10)
    next ();
});

userSchema.methods.isPasswordCorrect = async function (inputPassword){
    if(!commingPassword){
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