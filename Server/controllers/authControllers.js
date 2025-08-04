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
    accountVerifiedfield: false,
  });

  const verificationCode = newUser.generateVerificationCode();

  await newUser.save();

  sendVerificationCode(verificationCode, email, res);
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "User already verified" });
  }

  console.log("Entered OTP:", otp);
  console.log("Stored OTP from DB:", user.verificationCode);
  console.log("OTP Expiry:", user.verificationExpire);

  if (
    !user.verificationCode ||
    user.verificationCode !== Number(otp) ||
    user.verificationExpire < new Date()
  ) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  user.accountVerifiedfield = true;
  user.verificationCode = undefined;
  user.verificationExpire = undefined;

  await user.save();

  const token = user.generateToken();

  res.status(200).json({
    success: true,
    message: "Account verified successfully",
    token,
  });
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

  // const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/password/reset/${resetToken}`;
     const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

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
  } catch (err) {
    console.error("SEND EMAIL ERROR:", err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent", 500));
  }

});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetToken = req.params.token;

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired reset token", 400));
  }

  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful. You can now log in.",
  });
});


export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect.", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New password and confirm new password do not match.", 400));
  }

  if (newPassword.length < 8 || newPassword.length > 16 || confirmNewPassword.length < 8 || confirmNewPassword.length > 16) {
    return next(new ErrorHandler("Password must be between 8 to 16 characters.", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated.",
  });
});