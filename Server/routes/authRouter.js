import express from "express";
import { register } from "../controllers/authControllers.js";
import { verifyOTP } from "../controllers/authControllers.js";
import { login } from "../controllers/authControllers.js";
import { logout, getUser, forgotPassword, resetPassword, updatePassword } from "../controllers/authControllers.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);

export default router;
