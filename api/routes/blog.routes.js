const express = require("express");
const router = express.Router();

const { authMiddle, isDeleted } = require("../middleware/auth.middleware");
const blogCtrl = require("../controllers/blog.controller");

router.get("/mine", authMiddle, isDeleted, blogCtrl.getMyBlogs);
router.get("/all", authMiddle, isDeleted, blogCtrl.getAllBlogs);
router.get("/:id", authMiddle, isDeleted, blogCtrl.getBlogById);
router.post("/post", authMiddle, isDeleted, blogCtrl.postBlog);
router.put("/:id", authMiddle, isDeleted, blogCtrl.updateBlogById);
router.delete("/:id", authMiddle, isDeleted, blogCtrl.deleteBlogById);

module.exports = router;
