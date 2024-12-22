import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Default

const resend = new Resend(process.env.RESEND_API_KEY);

// Async function to send welcome email
async function sendWelcomeEmail(email, name) {
  try {
    const { data, error } = await resend.emails.send({
      from: "AltBlog <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to  AltBlog!",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for joining our platform. We're excited to have you on board!</p>
        <p>Get started by exploring our <b>features</b> and setting up your profile.</p>
        <br>
        <p>Best regards,<br>AltBlog Inc</p>
      `,
    });

    if (error) {
      console.error("Email send failed:", error);
      return false;
    }

    console.log("Welcome email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
}

// Example usage
export async function registerUser(userData) {
  // Your user registration logic here
  try {
    // Create user in database
    const newUser = await User.create(userData);

    // Send welcome email
    await sendWelcomeEmail(newUser.email, newUser.name);

    return newUser;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

sendWelcomeEmail("muhammad@gmail.com", "Muhammad");
