const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//* Create Brand
exports.createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json({ status: "success", newBrand });
  } catch (error) {
    throw new Error(error);
  }
});

//* Update Brand
exports.updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ status: "success", updateBrand });
  } catch (error) {
    throw new Error(error);
  }
});

//! Delete Brand
exports.deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.json({ status: "success", deleteBrand });
  } catch (error) {
    throw new Error(error);
  }
});

//* Get Brand
exports.getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBrand = await Brand.findById(id);
    res.json({ status: "success", getBrand });
  } catch (error) {
    throw new Error(error);
  }
});

//* Get All Brand
exports.getAllBrand = asyncHandler(async (req, res) => {
  try {
    const getallBrand = await Brand.find();
    res.json({ status: "success", getallBrand });
  } catch (error) {
    throw new Error(error);
  }
});
