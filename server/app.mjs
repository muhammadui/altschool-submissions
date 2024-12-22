import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/database.mjs";

// Route imports
import userRoutes from "./routes/userRoutes.mjs";
import blogRoutes from "./routes/blogRoutes.mjs";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Gobal Import Fix for FileSystem API
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(mongoSanitize());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net"
  );
  next();
});

// Connect to Database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
