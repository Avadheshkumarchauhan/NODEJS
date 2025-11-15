import { config } from "dotenv";
config({
    quiet: true,
    path: "./.env"
});
import { ApiError } from "../utills/ApiError.js";
import { asyncHandler } from "../utills/asycHandler.js"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const verifyJWT = asyncHandler(async (requestAnimationFrame, res, next) =>{
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
 
     if (!token) {
         throw new ApiError(401,"Unauthorized request ");
     }
 
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     const user = await User.findById(decodedToken._id ).select("-password -refreshToken");
 
     if(!user){
 
         //Nest video : discuss about frontend
 
         throw new ApiError(401,"Invalid Access Token");
     }
 
     req.user = user;
     next();
     
   } catch (error) {
         
        throw new ApiError(401, error?.message || "Invalid access token ")
   }

 })

 export {
    verifyJWT,
 }