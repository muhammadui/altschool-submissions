import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  constructor(resendClient) {
    this.resend = resendClient;
    this.defaultSender = "AltBlog <onboarding@resend.dev>";
  }

  async _sendEmail(to, subject, html, sender = this.defaultSender) {
    try {
      const response = await this.resend.emails.send({
        from: sender,
        to: [to],
        subject,
        html,
      });
      console.log("Email sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new Error("Failed to send email");
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email, name) {
    const subject = "Welcome to AltBlog!";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for registering with AltBlog. We're excited to have you on board!</p>
        <p>Get started by exploring our features and setting up your profile.</p>
        <br>
        <p>Best regards,<br>AltBlog Team</p>
      </div>
    `;
    return this._sendEmail(email, subject, html);
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetToken) {
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    const subject = "Password Reset Request";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password. Click the button below to reset:</p>
        <p>
          <a href="${resetLink}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br>AltBlog Security Team</p>
      </div>
    `;
    return this._sendEmail(email, subject, html);
  }

  // Send password change confirmation email
  async sendPasswordChangeConfirmation(email, name) {
    const subject = "Password Changed Successfully";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Changed</h2>
        <p>Hello ${name},</p>
        <p>Your account password has been successfully changed. If this was not you, contact our support team immediately.</p>
        <br>
        <p>Best regards,<br>AltBlog Team</p>
      </div>
    `;
    return this._sendEmail(email, subject, html);
  }

  // Send two-factor authentication setup confirmation
  async sendTwoFactorSetupEmail(email, name) {
    const subject = "Two-Factor Authentication Enabled";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Two-Factor Authentication Activated</h2>
        <p>Hello ${name},</p>
        <p>Your two-factor authentication has been successfully enabled. If this was not you, contact our support team immediately.</p>
        <br>
        <p>Best regards,<br>AltBlog Team</p>
      </div>
    `;
    return this._sendEmail(email, subject, html);
  }

  // Send unusual login activity alert
  async sendUnusualLoginAlert(email, name, loginDetails) {
    const subject = "Unusual Login Detected";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Unusual Login Detected</h2>
        <p>Hello ${name},</p>
        <p>We detected an unusual login to your account:</p>
        <ul>
          <li>Location: ${loginDetails.location}</li>
          <li>Device: ${loginDetails.device}</li>
          <li>Time: ${loginDetails.time}</li>
        </ul>
        <p>If this was not you, please change your password immediately and contact support.</p>
        <br>
        <p>Best regards,<br>AltBlog Team</p>
      </div>
    `;
    return this._sendEmail(email, subject, html);
  }
}

// Export EmailService instance
export const emailService = new EmailService(resend);
export default emailService;
