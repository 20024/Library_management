import express from "express";
import { addBook, getAllBooks, deleteBook } from "../controllers/bookControllers.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);

router.get("/all",isAuthenticated,isAuthorized("Admin", "user"), getAllBooks);
router.delete("/books/:id",isAuthenticated, isAuthorized("Admin"), deleteBook);

export default router;
