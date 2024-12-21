const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Get all todos (with optional status filter)
router.get("/", todoController.getAllTodos);

// Create todo page
router.get("/create", (req, res) => {
  res.render("todos/create");
});

// Create new todo
router.post("/create", todoController.createTodo);

// Update todo status
router.post("/:id/status", async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "completed", "deleted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).redirect("/todos");
    }

    // Call the update method from the controller
    await todoController.updateTodoStatus(req, res);

    // Log the status change
    logger.info(
      `Todo ${todoId} status changed to ${status} by ${req.user.fullname}`
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
