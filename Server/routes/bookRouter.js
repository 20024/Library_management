import express from "express";
import { addBook, getAllBooks, deleteBook } from "../controllers/bookControllers.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("admin"), addBook);

router.get("/all",isAuthenticated,isAuthorized("admin", "User"), getAllBooks);
router.delete("/books/:id",isAuthenticated, isAuthorized("admin"), deleteBook);

export default router;
