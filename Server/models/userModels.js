import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    accountVerifiedfield: {
      type: Boolean,
      default: false,
    },
    verificationCode: Number,
    verificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    borrowdBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Borrow",
        },
        returned: {
          type: Boolean,
          default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
      },
    ],
    avatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

// ✅ OTP Generator Method
userSchema.methods.generateVerificationCode = function () {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const verificationCode = parseInt(firstDigit + remainingDigits);
  this.verificationCode = verificationCode;
  this.verificationExpire = new Date(Date.now() + 2 * 60 * 1000); // 2 mins
  return verificationCode;
};

// ✅ JWT Token Generator Method
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const User = mongoose.model("User", userSchema);
