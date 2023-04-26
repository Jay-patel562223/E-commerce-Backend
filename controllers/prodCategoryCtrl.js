const PCategory = require("../models/prodCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//* Create Category
exports.createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await PCategory.create(req.body);
    res.json({ status: "success", newCategory });
  } catch (error) {
    throw new Error(error);
  }
});

//* Update Category
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateCategory = await PCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ status: "success", updateCategory });
  } catch (error) {
    throw new Error(error);
  }
});

//! Delete Category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteCategory = await PCategory.findByIdAndDelete(id);
    res.json({ status: "success", deleteCategory });
  } catch (error) {
    throw new Error(error);
  }
});

//* Get Category
exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getCategory = await PCategory.findById(id);
    res.json({ status: "success", getCategory });
  } catch (error) {
    throw new Error(error);
  }
});

//* Get All category
exports.getAllCategory = asyncHandler(async (req, res) => {
  try {
    const getallCategory = await PCategory.find();
    res.json({ status: "success", getallCategory });
  } catch (error) {
    throw new Error(error);
  }
});
