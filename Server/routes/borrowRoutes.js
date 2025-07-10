import express from "express";
import { recordBorroedBook } from "../controllers/borrowControllers.js";

const router = express.Router();


router.post("/recordallBooks", recordBorroedBook);

export default router;
