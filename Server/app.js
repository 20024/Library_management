import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import authRouter from "./routes/authRouter.js"; 
import bookRouter from "./routes/bookRouter.js"; 
import borrowRoutes from "./routes/borrowRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notifyUsers } from "./services/notifyUsers.js";


config({ path: "./config/config.env" });

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
 tempFileDir: "/tmp/"
}));

// app.get("/", (req, res) => {
//   res.send("Library Management Backend is running");
// });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRoutes);
app.use("/api/v1/user", userRoutes);
connectDB();
notifyUsers();
app.use(errorMiddleware);

export default app;
