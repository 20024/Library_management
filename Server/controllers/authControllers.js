import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { User } from "../models/userModels.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js"
import { generateForgetPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";


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
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  const verificationCode = newUser.generateVerificationCode();
  await newUser.save();

  sendVerificationCode(verificationCode, email, res);

});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email or OTP is missing.",
    });
  }

  try {
    const userAllEntries = await User.find({
      email,
      accountVerifiedfield: false,
    });
    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHandler("User not found.", 404));
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];

      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerifiedfield: false,
      });
    } else {
      user = userAllEntries[0];
    }

    console.log("Entered OTP:", otp);
    console.log("Stored OTP:", user.verificationCode);
    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid or already used OTP.", 400));
    }

    console.log("Entered OTP:", otp);
    console.log("Stored OTP:", user.verificationCode);
    console.log("Expiry:", user.verificationExpire, "Current time:", Date.now());


    const currentTime = Date.now();
    const verificationCodeExpire = new Date(user.verificationExpire).getTime();

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP expired.", 400));
    }

    // Mark the user as verified
    user.accountVerifiedfield = true;
    user.verificationCode = undefined;
    user.verificationExpire = undefined;
    await user.save({ validateModifiedOnly: true });

    // ✅ Send final response only ONCE
    sendToken(user, 200, "OTP verified successfully. Account activated.", res);

  } catch (error) {
    return next(new ErrorHandler("Internal server error.", 500));
  }
});
export const login = catchAsyncErrors(async (req, res, next) => {
  //const { email, password } = req.body;
  const email = req.body?.email;
  const password = req.body?.password;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found (even unverified).", 404));
  }

  if (!user.accountVerifiedfield) {
    return next(new ErrorHandler("Account not verified by OTP.", 403));
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Password incorrect", 401));
  }

  sendToken(user, 200, "Login successful", res);
});


export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

const message = generateForgetPasswordEmailTemplate(resetUrl);

  console.log("WORKING TILL HERE");
  console.log(user.email);
  console.log(message);

  try {
      await sendEmail({
  to: user.email,
  subject: "Password Reset Request",
  html: generateForgetPasswordEmailTemplate(resetUrl),
});

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  }  catch (err) {
  console.error("SEND EMAIL ERROR:", err);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });

  return next(new ErrorHandler("Email could not be sent", 500));
}

});




