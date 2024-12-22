import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
  getPublishedBlogs,
  getSingleBlog,
} from "../controllers/blogController.mjs";
import {
  authenticateUser,
  optionalAuthenticate,
} from "../middleware/authMiddleware.mjs";
import {
  validateBlogCreation,
  validateBlogUpdate,
} from "../middleware/validationMiddleware.mjs";

const router = express.Router();

// Public Routes (with optional authentication)
router.get("/", optionalAuthenticate, getPublishedBlogs);
router.get("/:id", optionalAuthenticate, getSingleBlog);

// Protected Routes
router.post("/", authenticateUser, validateBlogCreation, createBlog);
router.patch("/:id", authenticateUser, validateBlogUpdate, updateBlog);
router.delete("/:id", authenticateUser, deleteBlog);
router.get("/user/blogs", authenticateUser, getUserBlogs);

export default router;
