const Todo = require("../models/Todo");
const logger = require("../utils/logger");
const Joi = require("joi");

// Validation schema
const todoSchema = Joi.object({
  title: Joi.string().trim().max(100).required(),
  description: Joi.string().trim().max(500).allow("", null).optional(),
});

exports.getAllTodos = async (req, res) => {
  try {
    const { status = "pending" } = req.query;

    // Exclude 'deleted' tasks by default
    const query = {
      user: req.user._id,
      status: status !== "deleted" ? status : { $ne: "deleted" },
    };

    const todos = await Todo.find(query).sort({ createdAt: -1 });

    // Determine greeting based on time of day
    const currentHour = new Date().getHours();
    let greeting = "Good Morning";
    if (currentHour >= 12 && currentHour < 18) {
      greeting = "Good Afternoon";
    } else if (currentHour >= 18) {
      greeting = "Good Evening";
    }

    res.render("todos/index", {
      todos,
      user: req.user,
      currentStatus: status,
      greeting: greeting,
    });
  } catch (error) {
    logger.error("Get todos error:", error);
    res.status(500).render("error", {
      message: "Error fetching todos",
    });
  }
};

exports.createTodo = async (req, res) => {
  try {
    // Validate request body
    const { error } = todoSchema.validate(req.body);
    if (error) {
      return res.status(400).render("todos/create", {
        error: error.details[0].message,
      });
    }

    const { title, description } = req.body;

    const todo = new Todo({
      title,
      description,
      user: req.user._id,
    });

    await todo.save();

    logger.info(`Todo created by ${req.user.fullname}`);
    res.redirect("/todos");
  } catch (error) {
    logger.error("Create todo error:", error);
    res.status(500).render("error", {
      message: "Error creating todo",
    });
  }
};

exports.updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    logger.info(`Todo status updated by ${req.user.fullname}`);
    res.redirect("/todos");
  } catch (error) {
    logger.error("Update todo status error:", error);
    res.status(500).render("error", {
      message: "Error updating todo status",
    });
  }
};
