import express from "express";
import { recordBorroedBook, returnBorrowedBook, getUserBorrowRecords } from "../controllers/borrowControllers.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js"; 

const router = express.Router();


router.post("/recordallBooks", recordBorroedBook);
router.put("/return/:borrowId", returnBorrowedBook);
router.get('/recordBooks', isAuthenticated,isAuthorized("admin", "User") , getUserBorrowRecords);

export default router;
