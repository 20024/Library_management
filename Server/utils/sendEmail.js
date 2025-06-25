import nodemailer from "nodemailer";
import { generateVerificationOtpEmailTemplate } from "./generateVerificationOtpEmailTemplate.js"; // adjust the path as needed

export async function sendEmail({ to, subject, otpCode }) {
  try {
    // 1. Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,         // e.g., "smtp.mailtrap.io", "smtp.gmail.com"
      port: parseInt(process.env.SMTP_PORT),  // usually 587 or 465
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,       // SMTP username
        pass: process.env.SMTP_PASS,       // SMTP password
      },
    });

    // 2. Mail options
    const mailOptions = {
      from: `"Your App Name" <${process.env.SMTP_USER}>`,
      to,
      subject: subject || "Your Verification Code",
      html: generateVerificationOtpEmailTemplate(otpCode),
    };

    // 3. Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}
