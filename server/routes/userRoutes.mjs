import express from "express";
import { signUp, signIn } from "../controllers/userController.mjs";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/passwordResetController.mjs";

import {
  validateSignUp,
  validateSignIn,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validationMiddleware.mjs";

const router = express.Router();

router.post("/signup", validateSignUp, signUp);

router.post("/signin", validateSignIn, signIn);

router.post("/forgot-password", validateForgotPassword, forgotPassword);

router.post("/reset-password", validateResetPassword, resetPassword);

export default router;
