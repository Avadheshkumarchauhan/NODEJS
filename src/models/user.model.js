import {config} from "dotenv";
import mongoose, { Schema }  from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
config({
    quiet: true,
    path: "./.env"
})
const userSchema = new mongoose.Schema(
 {
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,//cloudinary url
        required: true,
    },
    coverImage:{
        type: String,

    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "video"

    }],
    password: {
        type: String,
        required: true,
        trim: [true,"Password is required "]
    },
    refreshToken: {
        type: String
    }

 },
   {timestamps: true}
);

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next();


    this.password =await bcrypt.hash(this.password,10);
    //return
     next();
});
userSchema.methods.isPasswordCorrect = async function (password){
     return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function (){
   return JWT.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
         process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }   
    )
}
userSchema.methods.generateAccessToken = function (){
   return JWT.sign(
        {
            _id: this.id          
           
        },
         process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }   
    )
}

export const User = mongoose.model("User",userSchema);