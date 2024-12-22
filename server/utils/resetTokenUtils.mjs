import crypto from "crypto";

// Generate a secure, random token
export const generateResetToken = () => {
  // Generate a 32-character hex token
  return crypto.randomBytes(16).toString("hex");
};

// Validate token format (optional, but can be useful)
export const isValidResetToken = (token) => {
  // Check if token is a 32-character hex string
  return token && /^[0-9a-fA-F]{32}$/.test(token);
};
