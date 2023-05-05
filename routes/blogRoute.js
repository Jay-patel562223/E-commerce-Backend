const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require("../controllers/blogCtrl");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");

router.post("/", authMiddleware, isAdmin, createBlog)
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images",2), blogImgResize, uploadImages)
router.put("/likes", authMiddleware, likeBlog)
router.put("/dislikes", authMiddleware, dislikeBlog)
router.put("/:id", authMiddleware, isAdmin, updateBlog)
router.get("/getallblogs", getAllBlogs)
router.get("/:id", getBlog)
router.delete("/:id", authMiddleware, isAdmin, deleteBlog)

module.exports = router