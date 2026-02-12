import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your DevDrawer account",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #18181b; font-size: 24px; margin-bottom: 16px;">Welcome to DevDrawer!</h1>
          <p style="color: #71717a; margin-bottom: 24px;">
            Please verify your email address by clicking the button below:
          </p>
          <a 
            href="${verificationUrl}" 
            style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500;"
          >
            Verify Email
          </a>
          <p style="color: #71717a; margin-top: 24px; font-size: 14px;">
            Or copy and paste this link into your browser:<br/>
            <a href="${verificationUrl}" style="color: #3b82f6;">${verificationUrl}</a>
          </p>
          <p style="color: #71717a; margin-top: 24px; font-size: 12px;">
            This link will expire in 24 hours.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your DevDrawer password",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #18181b; font-size: 24px; margin-bottom: 16px;">Reset your password</h1>
          <p style="color: #71717a; margin-bottom: 24px;">
            Click the button below to reset your password:
          </p>
          <a 
            href="${resetUrl}" 
            style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500;"
          >
            Reset Password
          </a>
          <p style="color: #71717a; margin-top: 24px; font-size: 14px;">
            Or copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color: #3b82f6;">${resetUrl}</a>
          </p>
          <p style="color: #71717a; margin-top: 24px; font-size: 12px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}
