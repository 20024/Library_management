import express from "express";
import { recordBorroedBook, returnBorrowedBook } from "../controllers/borrowControllers.js";

const router = express.Router();


router.post("/recordallBooks", recordBorroedBook);
router.put("/return/:borrowId", returnBorrowedBook);

export default router;
