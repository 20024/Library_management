import express from "express";
import { getAllUsers, registerNewAdmin } from "../controllers/userControllers.js";
import { isAuthenticated } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/register", registerNewAdmin);
router.get("/all", isAuthenticated, getAllUsers);

export default router;
