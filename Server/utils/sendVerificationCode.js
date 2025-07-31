import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
    try {
        const message = generateVerificationOtpEmailTemplate(verificationCode);

        sendEmail({
            to: email,
            subject: "Verification Code (Librery Management System)",
            otpCode: verificationCode, 
        });
        res.status(200).json({
            success: true,
            message: "Verification code sent to your email",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send verification code",
        });
    }
}

