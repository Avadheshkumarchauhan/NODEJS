import {Router} from "express";
import { registerUser, homePase } from "../controllers/user.controller.js";
import {upload } from "../middlewares/multer.middleware.js";
 const router = Router();
    router.get("/", homePase)
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
      ])
      
      ,registerUser);


 export default router;