const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  // Log the error
  logger.error("Unhandled error:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    user: req.user ? req.user.username : "Guest",
  });

  // Determine status code
  const statusCode = err.status || 500;

  // Render error page
  res.status(statusCode).render("error", {
    message: err.message || "An unexpected error occurred",
    status: statusCode,
  });
};
