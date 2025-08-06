import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", isAuthenticated, isAuthorized("admin", "User") ,getDashboardStats);

export default router;
