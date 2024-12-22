import User from "../models/User.mjs";
import { generateToken } from "../utils/jwtUtils.mjs";

export const signUp = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const user = new User({
      first_name,
      last_name,
      email,
      password,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};
