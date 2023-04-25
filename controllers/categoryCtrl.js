const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

exports.createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json({ status: "success", newCategory });
  } catch (error) {
    throw new Error(error);
  }
});
