import { body, validationResult } from "express-validator";

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Sign Up Validation
export const validateSignUp = [
  body("first_name").trim().notEmpty().withMessage("First name is required"),
  body("last_name").trim().notEmpty().withMessage("Last name is required"),
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter"),
  handleValidationErrors,
];

// Sign In Validation
export const validateSignIn = [
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Blog Creation Validation
export const validateBlogCreation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("body").trim().notEmpty().withMessage("Blog body is required"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  handleValidationErrors,
];

// Blog Update Validation
export const validateBlogUpdate = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("body")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Blog body cannot be empty"),
  body("state")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Invalid blog state"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  handleValidationErrors,
];

// Validation for forgot password request
export const validateForgotPassword = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for password reset
export const validateResetPassword = [
  body("token").not().isEmpty().withMessage("Reset token is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-zA-Z0-9]/)
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character"
    ),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
