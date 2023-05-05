const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../models/userModel");
const { default: mongoose, Error } = require("mongoose");
const validateMongoDbId = require("../utils/validateMongodbId");
const { cloudinaryUploadImg } = require("../utils/cloudinary");

//* Create Product
exports.createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//* Update Product
exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//! Delete Product
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//* Get Product
exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//* Get All Product
exports.getAllProduct = asyncHandler(async (req, res) => {
  try {
    //* Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    //* Price Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    //* Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //* Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //* Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page does not exists");
    }
    console.log(page, limit, skip);

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

//* Add Wishlist
exports.addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { proId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === proId);
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: proId },
        },
        {
          new: true,
        }
      );
      return res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: proId },
        },
        {
          new: true,
        }
      );
      return res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//* Product rating
exports.rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, prodId } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const totalRating = await Product.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(prodId) } },
      { $unwind: "$ratings" },
      { $project: { "ratings.star": 1 } },
      { $project: { Star: "$ratings.star" } },
      {
        $group: {
          _id: `${prodId}`,
          total: { $avg: "$Star" },
        },
      },
    ]);
    const finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: totalRating[0].total,
      },
      {
        new: true,
      }
    );
    return res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//* Upload images
exports.uploadImages = asyncHandler(async (req, res) => {
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
    const findProduct = await Product.findByIdAndUpdate(
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
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});
