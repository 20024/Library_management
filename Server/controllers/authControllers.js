import { use } from "react";
import { catchAsycErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../middleware/errorMiddleware";
import { User } from "../models/userModels";
import bcrypt from "bcryptjs";
import crypt from "crypto";

export const register = catchAsycErrors(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(new ErrorHandler("Please fill in all fields", 400));
        }
        const user = await User.findOne({ email, accountVerifiedfield: true });
        if (isRegisterd) {
            return next(new ErrorHandler("user Already Exist", 400));
        }
        const registeractionAttemptsByUser = await User.find({
            email,
            accountVerifiedfield: false,
        });
        if (registeractionAttemptsByUser.length >= 5) {
            return next(new ErrorHandler("Too many failed login attempts", 400));
        }
        if (password.length < 8 || password.length > 16) {
            return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
        }
        const hashhePassword = await bcrypt.hash(password, 10);
        const User = await User.create({
            name,
            email,
            password: hashhePassword
        })
        const verificationCode = await user.generateVerificationCode();
        await use.save();
        sendVerificationCode(verificationCode, email, res);
    } catch (error) {
        next(error);
    }

});