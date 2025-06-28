import express from "express";
import { register } from "../controllers/authControllers.js";
import { verifyOTP } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);


export default router;
