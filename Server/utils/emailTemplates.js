export function generateVerificationOtpEmailTemplate(otpCode) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Email Verification</h2>
        <p style="font-size: 16px; color: #555;">Thank you for registering! Please use the OTP below to verify your email address:</p>
        <div style="font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">${otpCode}</div>
        <p style="font-size: 14px; color: #777;">This OTP is valid for only 10 minutes. Do not share it with anyone.</p>
        <p style="font-size: 14px; color: #aaa;">If you did not request this, please ignore this email.</p>
      </div>
    </div>`;
}
