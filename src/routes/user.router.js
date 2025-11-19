import {Router} from "express";
import { registerUser, homePage, LoginUser, LogoutUser, refreshAccessToken, changeCurrentPassword, getUser, updateAccountDetails, updateAvatar, updateCoverImage } from "../controllers/user.controller.js";
import {upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

/**
 * Home page Api
*/

router.get("/", homePage);

/**
 * SignUp page Api
 */
router.route("/register").post(
      upload.fields([
         {
            name: "avatar",
            maxCount: 1
         },
         {
            name: "coverImage",
            maxCount: 1
         }
      ]) ,registerUser);
/**
 * Login page Api
 */

router.route("/login").post(LoginUser);

   /**
    * Logout page
    */
router.route("/logout").get(verifyJWT,LogoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/changePassword").patch(verifyJWT,changeCurrentPassword)

router.route("/profile").get(verifyJWT,getUser)

router.route("/updateAccount").patch(verifyJWT,updateAccountDetails)

router.route("/updateAvatar").patch(verifyJWT,
    upload.single(
      "avatar"        
      ),updateAvatar)
      
router.route("/updateCoverImage").patch(verifyJWT,
    upload.single(
         "coverImage"
      )
   ,updateCoverImage)


 export default router;