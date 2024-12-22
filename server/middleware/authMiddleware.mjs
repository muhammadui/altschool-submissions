import { verifyToken } from "../utils/jwtUtils.mjs";
import User from "../models/User.mjs";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const decoded = verifyToken(token);

    if (decoded) {
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
      }
    }
  }

  next();
};
