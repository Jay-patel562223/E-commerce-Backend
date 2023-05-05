const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asynchandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { cloudinaryUploadImg } = require("../utils/cloudinary");

//* Create Blog
exports.createBlog = asynchandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      status: "success",
      newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//* Update Blog
exports.updateBlog = asynchandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      status: "success",
      updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//* Get Blog
exports.getBlog = asynchandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      getBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//* Get All Blog
exports.getAllBlogs = asynchandler(async (req, res) => {
  try {
    const getBlog = await Blog.find();
    res.json({
      status: "success",
      getBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//! Delete Blog
exports.deleteBlog = asynchandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    if (!deleteBlog) {
      return res.json({
        status: "fail",
        message: "Blog Not Found! OR Blog was deleted!",
      });
    }
    res.json({
      status: "success",
      deleteBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//* Like Blog
exports.likeBlog = asynchandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  //find the login user
  const loginUserId = req?.user?._id;
  //find if the user has liked the blog
  const isLiked = blog?.isLiked;
  //find if the user has desliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    return res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    return res.json(blog);
  }
});

//* Dislike Blog
exports.dislikeBlog = asynchandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  //find the login user
  const loginUserId = req?.user?._id;
  //find if the user has disliked the blog
  const isDisLiked = blog?.isDisliked;
  //find if the user has liked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    return res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});

//* upload Images
exports.uploadImages = asynchandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});
