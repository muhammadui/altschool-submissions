import User from "../models/User.mjs";
import { generateResetToken } from "../utils/resetTokenUtils.mjs";
import { emailService } from "../utils/emailService.mjs";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "No account associated with this email" });
    }

    const resetToken = generateResetToken();

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour

    // Save the user with reset token
    await user.save();

    // Replace url after doing resend subscription
    const resetURL = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Send reset email
    await emailService.sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to process password reset",
      details: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    console.log("Request Body:", req.body); // Log incoming request

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    // Check if user exists and token is valid
    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = password; // Mongoose pre-save hook will hash this
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password successfully reset",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to reset password",
      details: error.message,
    });
  }
};
