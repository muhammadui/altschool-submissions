const EmailService = require("./emailService");
const dotenv = require("dotenv");

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;

const emailService = new EmailService(resendApiKey);

// Test email integration with my own creds
async function testEmailSend() {
  const recipientEmail = "muhammad***@gmail.com";

  try {
    console.log(`Attempting to send test email to: ${recipientEmail}`);

    const testEmailHtml = `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>Hello World!</h1>
        <p>This is a test email from Todo App.</p>
        <p>If you received this, the email service is working correctly.</p>
        <p>Sent: ${new Date().toLocaleString()}</p>
      </body>
      </html>
    `;

    const response = await emailService.sendWelcomeEmail(
      recipientEmail,
      "Test User"
    );

    console.log("Email sent successfully!");
    console.log("Resend API Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Email sending failed:", error);
    console.error(
      "Full error details:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
  }
}

testEmailSend();
