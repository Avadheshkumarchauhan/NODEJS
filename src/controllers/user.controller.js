import {asyncHandler} from "../utills/asycHandler.js";

const homePase = asyncHandler ( async( req ,res ) => {
    res.send("<h1> Hello , Avadhesh kumar chauhan </h1>")
});
const registerUser = asyncHandler ( async( req ,res ) => {
    res.status(200).json({
        message: "ok",
    })
});

export {
    registerUser,
    homePase,
}