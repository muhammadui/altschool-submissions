import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.plugin(mongoosePaginate);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
