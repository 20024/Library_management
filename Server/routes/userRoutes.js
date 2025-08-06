import express from "express";
import { getAllUsers, registerNewAdmin } from "../controllers/userControllers.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/register", registerNewAdmin);
router.get("/all", isAuthenticated, isAuthorized("admin"), getAllUsers);

export default router;
