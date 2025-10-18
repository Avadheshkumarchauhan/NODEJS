import {Router} from "express";
import { registerUser, homePase } from "../controllers/user.controller.js";
 const router = Router();
    router.get("/", homePase)
    router.route("/registerUser").post(registerUser);


 export default router;