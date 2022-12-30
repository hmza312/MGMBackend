const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
  },
  title: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  hasLiked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogReview",
    },
  ],
});

exports.Blog = mongoose.model("Blog", blogSchema);
