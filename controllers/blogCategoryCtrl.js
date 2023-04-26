const BCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//* Create Blog Category
exports.createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BCategory.create(req.body);
    res.json({ status: "success", newCategory });
  } catch (error) {
    throw new Error(error);
  }
});

//* Update Blog Category
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateCategory = await BCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ status: "success", updateCategory });
  } catch (error) {
    throw new Error(error);
  }
});

//! Delete Blog Category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteCategory = await BCategory.findByIdAndDelete(id);
    res.json({ status: "success", deleteCategory });
  } catch (error) {
    throw new Error(error);
  }
});

//* Get Blog Category
exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getCategory = await BCategory.findById(id);
    res.json({ status: "success", getCategory });
  } catch (error) {
    throw new Error(error);
  }
});

//* Get All Blog category
exports.getAllCategory = asyncHandler(async (req, res) => {
  try {
    const getallCategory = await BCategory.find();
    res.json({ status: "success", getallCategory });
  } catch (error) {
    throw new Error(error);
  }
});
