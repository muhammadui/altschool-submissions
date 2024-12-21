const { Resend } = require("resend");
const logger = require("./logger");

class EmailService {
  constructor(resendApiKey) {
    if (!resendApiKey) {
      logger.error("Resend API key is missing");
      throw new Error("Resend API key is required for email service");
    }

    try {
      this.resend = new Resend(resendApiKey);
      this.defaultSender = "Todo App <onboarding@resend.dev>";
    } catch (initError) {
      logger.error("Failed to initialize Resend client", initError);
      throw initError;
    }
  }

  _extractFirstName(fullName) {
    const nameParts = fullName.trim().split(/\s+/);
    return nameParts[0] || "User";
  }

  async sendEmail(options) {
    const { to, subject, html, from = this.defaultSender } = options;

    if (!to || !subject || !html) {
      const error = new Error("Missing required email parameters");
      logger.error("Email send failed", error);
      throw error;
    }

    try {
      const emailPayload = { from, to, subject, html };

      logger.info(`Sending email to: ${to}, Subject: ${subject}`);

      const response = await this.resend.emails.send(emailPayload);

      if (response.error) {
        logger.error("Resend API Error", response.error);
        throw new Error(`Email send failed: ${JSON.stringify(response.error)}`);
      }

      logger.info(`Email sent successfully to: ${to}`);
      return response;
    } catch (error) {
      logger.error("Email sending failed", {
        to,
        subject,
        errorMessage: error.message,
        errorStack: error.stack,
      });
      throw error;
    }
  }

  async sendWelcomeEmail(email, fullName) {
    // Extract first name
    const firstName = this._extractFirstName(fullName);

    const subject = "Welcome to Todo App!";
    const html = this._generateWelcomeEmailHTML(email, firstName);

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  _generateWelcomeEmailHTML(email, firstName) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
        <header style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Todo App</h1>
        </header>

        <main style="padding: 20px;">
          <p style="color: #333; font-size: 18px;">Hi ${firstName},</p>
          <p style="color: #666;">
            Welcome to Todo App! We're excited to help you stay organized and productive. 
            Start creating and managing your todos with ease.
          </p>
          <p style="color: #666;">
            If you have any questions, feel free to reach out to our support team.
          </p>
        </main>

        <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Todo App. All Rights Reserved.</p>
          <p>This email was sent to ${email}. If you did not sign up, please ignore this email.</p>
        </footer>
      </body>
      </html>
    `;
  }
}

module.exports = EmailService;
