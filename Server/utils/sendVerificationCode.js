import { generateVerificationOtpEmailTemplet } from "../utils/emailTemplates";
// import { sendEmail } from "../utils/sendEmail"; // Uncomment if needed

export async function sendVerificationCode(verificationCode, email, res) {
    try {
        const message = generateVerificationOtpEmailTemplate(verificationCode);
        sendEmail({
            email,
            subject: "Verification Code (Librery Management System)",
            message,
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
