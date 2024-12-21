const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const authController = require("../controllers/authController");
const {
  redirectIfAuthenticated,
  isAuthenticated,
} = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

// Login routes
router.get("/login", redirectIfAuthenticated, (req, res) => {
  res.render("auth/login");
});

router.post("/login", redirectIfAuthenticated, (req, res, next) => {
  const { email, password } = req.body;
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      logger.error("Login error:", err);
      return next(err);
    }

    if (!user) {
      // Authentication failed
      return res.status(400).render("auth/login", {
        error: info.message || "Login failed",
      });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        logger.error("Login session error:", loginErr);
        return next(loginErr);
      }

      logger.requestLog(req, "info");
      return res.redirect("/todos");
    });
  })(req, res, next);
});

// Signup routes
router.get("/signup", redirectIfAuthenticated, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", redirectIfAuthenticated, authController.signup);

// Logout route
router.get("/logout", isAuthenticated, authController.logout);

module.exports = router;
