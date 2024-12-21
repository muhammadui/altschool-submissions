const User = require("../models/User");
const logger = require("../utils/logger");
const Joi = require("joi");
const EmailService = require("../utils/emailService");

const resendApiKey = process.env.RESEND_API_KEY;
const emailService = new EmailService(resendApiKey);

const userSchema = Joi.object({
  fullname: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name cannot exceed 50 characters",
      "string.pattern.base": "Full name can only contain letters and spaces",
    }),
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
    }),
});

exports.signup = async (req, res) => {
  try {
    // Validate request body
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).render("auth/signup", {
        error: error.details[0].message,
        formData: req.body,
      });
    }

    const { fullname, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("auth/signup", {
        error: "User with this email already exists",
        formData: req.body,
      });
    }

    // Create new user
    const user = new User({ fullname, email, password });
    await user.save();

    // Send welcome email (async, won't block signup) -- can only send message to me because am using the free tier of resend.
    // If you want to send it to everyone, buy premium subscription.
    emailService.sendWelcomeEmail(email, fullname).catch((emailError) => {
      logger.error(`Welcome email failed for ${email}:`, emailError);
    });

    logger.info(`User ${email} registered successfully`);

    // Auto-login
    req.login(user, (loginError) => {
      if (loginError) {
        logger.error("Auto login error:", loginError);
        return res.redirect("/login");
      }
      return res.redirect("/todos");
    });
  } catch (error) {
    logger.error("Signup process error:", error);
    res.status(500).render("auth/signup", {
      error: "An unexpected error occurred during signup",
      formData: req.body,
    });
  }
};

exports.login = (req, res) => {
  logger.info(`User ${req.user.email} logged in successfully`);
  res.redirect("/todos");
};

exports.logout = (req, res) => {
  req.logout((logoutError) => {
    if (logoutError) {
      logger.error("Logout error:", logoutError);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
};

module.exports = exports;
