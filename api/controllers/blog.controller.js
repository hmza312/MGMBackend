const mongoose = require("mongoose");

const { Blog } = require("../data/blogs.model");

module.exports.postBlog = async (req, res) => {
  console.log("Inside Post Job api");

  const {
    body: { title, description },
    user: { _id: owner },
  } = req;
  try {
    const blog = new Blog({
      title,
      owner,
      description,
    });

    blog.save();

    res.send({ blog, error: false, message: "Blog Posted successfully" });
  } catch (err) {
    console.log("Blog post api failed: ", err.message);
    res.status(500).send({
      error: true,
      message: err.message,
    });
  }
};

module.exports.getMyBlogs = async (req, res) => {
  console.log("Inside Get My blogs API");
  const {
    user: { _id },
  } = req;
  try {
    let Blogs = [];
    const blogs = await Blog.find({ owner: _id, isDeleted: false });
    for (let blog of blogs) {
      blog = blog.toJSON();
      blog["hasLiked"] = false;
      blog.likes.forEach((like) => {
        if (like.toString() === _id) return (blog["hasLiked"] = true);
      });
      Blogs.push(blog);
    }

    res.send({ blogs: Blogs, message: "My blogs fetched successfully" });
  } catch (err) {
    console.log("Get my blogs api failed: ", err);
    return res.status(500).send({ error: true, message: err.message });
  }
};
module.exports.getAllBlogs = async (req, res) => {
  console.log("Inside Get All blog API");
  const {
    user: { _id },
  } = req;
  try {
    let Blogs = [];
    const blogs = await Blog.find({ isDeleted: false });
    for (let blog of blogs) {
      blog = blog.toJSON();
      blog["hasLiked"] = false;
      blog.likes.forEach((like) => {
        if (like.toString() === _id) return (blog["hasLiked"] = true);
      });
      Blogs.push(blog);
    }

    res.send({ blogs: Blogs, message: "Blogs Fetched successfully" });
  } catch (err) {
    console.log("get all blog api failed: ", err);
    return res.status(500).send({ error: true, message: err.message });
  }
};

module.exports.getBlogById = async (req, res) => {
  console.log("Inside Get blog API");
  const {
    params: { id },
    user: { _id },
  } = req;
  try {
    let blog = await Blog.findById({ _id: id }).populate({
      path: "reviews",
      populate: {
        path: "reviewer",
        select: { profileImg: 1, firstName: 1, lastName: 1 },
      },
    });
    const hasLiked = blog.likes.includes(_id) ? true : false;
    // blog = { ...blog, hasLiked };
    res.send({ blog, hasLiked, message: "blog Fetched successfully" });
  } catch (err) {
    console.log("get blog api failed: ", err);
    res.status(500).send({ error: true, message: err.message });
  }
};
module.exports.updateBlogById = async (req, res) => {
  console.log("Inisde update blog details api");
  const {
    params: { id },
    body,
  } = req;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      { _id: id },
      { $set: { ...body } },
      { new: true, upsert: true }
    );
    res.send({ blog: updatedBlog, message: "Job updated successfully" });
  } catch (err) {
    console.log("update blog details api failed: ", err);
    res.status(500).send({ error: true, message: err.message });
  }
};

module.exports.deleteBlogById = async (req, res) => {
  console.log("Inisde delete blog details api");
  const {
    params: { id },
  } = req;

  try {
    const blog = await Blog.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true, upsert: true }
    );
    res.send({ blog, message: "blog deleted successfully" });
  } catch (err) {
    console.log("delete blog api failed: ", err);
    res.status(500).send({ error: true, message: err.message });
  }
};
