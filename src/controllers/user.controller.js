import {asyncHandler} from "../utills/asycHandler.js";
import { ApiError} from "../utills/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utills/Cloudinary.js";
import { ApiResponse } from "../utills/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) =>{
    try {
       const user = await User.findById(userId);
       const accessToken = user.generateAccessToken();
       const refreshToken = user.generateRefreshToken();
       user.refreshToken = refreshToken;
         await user.save({validateBeforeSave: false});
         return {accessToken ,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token");
    }
}

const homePage = asyncHandler ( async( req ,res ) => {
    res.send("<h1> Hello , Avadhesh kumar chauhan </h1>")
});
const registerUser = asyncHandler ( async( req ,res ) => {
    const {username, email , fullname,password} = req.body;

    //console.log("email : ",email," ",username," ",password," ",fullname);
    if (
        [fullname,email,username,password].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400,"All fields are required");
    }

    const existedUser =await User.findOne({
        $or: [{username},{email}]
    });
    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists ");
    }

  // const avatarLocalPath = req.files?.avatar[0]?.path;
    /**
     * OR
     */
     let avatarLocalPath = null;
   if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
    avatarLocalPath = req.files.avatar[0].path;
   }

   //const coverImageLocalPath = req.files?.coverImage[0]?.path;
   let coverImageLocalPath = null;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path;
   }
  
   
   
   
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   



   if(!avatar){
        throw new ApiError(400,"Avatar file is required");
   }
  

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )  

    if (!createdUser) {
        throw new ApiError(500,"Something went wrong  rigistering the user ")
    }
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered successfully")
        );


});
const LoginUser = asyncHandler( async (req, res) =>{

        const {email, username, password} = req.body

        if(!(username || email)){
            throw new ApiError(400,"Username and email is required ");
        }

        const user = await User.findOne({
            $or: [{email},{username}]
        });

        if (!user) {
            throw new ApiError(404,"User does not exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if(!isPasswordValid){
            throw new ApiError(401,"Invalid user password");
        }

         const {refreshToken, accessToken} = await generateAccessAndRefreshToken(user._id);
        //console.table([refreshToken,accessToken])
        const LoggedInUser = await User.findById(user._id).
        select("-password -refreshToken");

        const option = {
            httpOnly:true,
            secure: false
        }
        return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200, 
                {
                user: LoggedInUser,accessToken,
                refreshToken
                },
                "User logged in successfully"
          )
        )
         
});

const LogoutUser = asyncHandler(async (req, res) =>{
      await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
       );
    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken", option)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged Out successfully "
        )
    );
       
})

export {
    registerUser,
    homePage,
    LoginUser,
    LogoutUser
}