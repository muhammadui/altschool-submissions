import Blog from "../models/Blog.mjs";
import User from "../models/User.mjs";
import calculateReadingTime from "../utils/readTimeCalculator.mjs";

export const createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;

    // Check if blog with same title already exists
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res
        .status(400)
        .json({ error: "Blog with this title already exists" });
    }

    // Calculate reading time
    const reading_time = calculateReadingTime(body);

    // Create new blog
    const blog = new Blog({
      title,
      description,
      author: req.user._id,
      tags,
      body,
      reading_time,
    });

    await blog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: {
        ...blog.toObject(),
        author: req.user,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Blog creation failed", details: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, body, state } = req.body;

    // Find blog and check ownership
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Ensure only the owner can update
    if (blog.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this blog" });
    }

    // Update fields
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (tags) blog.tags = tags;
    if (body) {
      blog.body = body;
      blog.reading_time = calculateReadingTime(body);
    }
    if (state && ["draft", "published"].includes(state)) {
      blog.state = state;
    }

    await blog.save();

    res.json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Blog update failed", details: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find blog and check ownership
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Ensure only the owner can delete
    if (blog.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(id);

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Blog deletion failed", details: error.message });
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, state } = req.query;
    const userId = req.user._id;

    // Build query
    const query = { author: userId };
    if (state) query.state = state;

    // Pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const blogs = await Blog.paginate(query, options);

    res.json({
      blogs: blogs.docs,
      totalBlogs: blogs.totalDocs,
      totalPages: blogs.totalPages,
      currentPage: blogs.page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch blogs", details: error.message });
  }
};

export const getPublishedBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query
    const query = { state: "published" };

    // Search logic
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { "author.first_name": { $regex: search, $options: "i" } },
        { "author.last_name": { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;

    // Pagination and population
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions,
      populate: {
        path: "author",
        select: "first_name last_name email",
      },
    };

    const blogs = await Blog.paginate(query, options);

    res.json({
      blogs: blogs.docs,
      totalBlogs: blogs.totalDocs,
      totalPages: blogs.totalPages,
      currentPage: blogs.page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch blogs", details: error.message });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find blog and populate author
    const blog = await Blog.findOne({
      _id: id,
      state: "published",
    }).populate("author", "first_name last_name email");

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Increment read count
    blog.read_count += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch blog", details: error.message });
  }
};
