import {Router} from "express";
import { registerUser, homePage, LoginUser, LogoutUser, refreshAccessToken, changeCurrentPassword } from "../controllers/user.controller.js";
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
router.route("/logout").post(verifyJWT,LogoutUser)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT,changeCurrentPassword)


 export default router;