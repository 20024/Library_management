import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js"; 
import ErrorHandler from "../middleware/errorMiddleware.js"; 
import { User } from "../models/userModels.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find(); // You can filter later with { accountVerified: true }

    console.log("All Users in DB:", users);

    res.status(200).json({
        success: true,
        users, 
    });
});


export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Admin avatar is required.", 400));
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }

    const isRegistered = await User.findOne({ email, accountVerified: true });

    if (isRegistered) {
        return next(new ErrorHandler("User already registered.", 400));
    }

    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 to 16 characters.", 400));
    }

    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(new ErrorHandler("Only PNG or JPEG images are allowed.", 400));
    }

const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
        folder: "Librery_management_admin_avatars",
    });
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary error:",cloudinaryResponse.error || "Unknown cloudinary error.");
        return next(new ErrorHandler("Failed to upload image to cloudinary.",500))
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
        accountVerified: true,
    });
    res.status(201).json({
        success: true,
        message: "Admin registered successfully.",
    });
});
