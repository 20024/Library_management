import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { User } from "../models/userModels.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";


export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill in all fields", 400));
  }

  const user = await User.findOne({ email, accountVerifiedfield: true });

  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const previousAttempts = await User.find({
    email,
    accountVerifiedfield: false,
  });

  if (previousAttempts.length >= 5) {
    return next(new ErrorHandler("Too many failed registration attempts", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const verificationCode = await newUser.generateVerificationCode();
  sendVerificationCode(verificationCode, email, res);

});
