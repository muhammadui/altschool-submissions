const logger = require("../utils/logger");

// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  logger.warn("Unauthorized access attempt");
  res.redirect("/login");
};

// Middleware to redirect authenticated users
exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/todos");
  }

  next();
};
