import nodemailer from "nodemailer";
import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";

export async function sendEmail({ to, subject, otpCode }) {
  try {

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),  // usually 587 or 465
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,       
        pass: process.env.SMTP_PASS,      
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
