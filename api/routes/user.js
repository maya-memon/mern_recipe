import express from "express";
import { login, register ,profile} from "../controllers/user.js";
import { Authenticate } from "../middleware/auth.js";
const router=express.Router();


router.post("/register",register);
router.post("/login",login);
router.get('/user',Authenticate,profile)
export default router;