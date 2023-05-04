const express = require("express");
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages } = require("../controllers/productCtrl");
const router = express.Router();
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

router.post("/", authMiddleware, isAdmin, createProduct)
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images",10), productImgResize, uploadImages)
router.get("/:id", getProduct)
router.get("/", getAllProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.put("/wishlist", authMiddleware, addToWishlist)
router.put("/rating", authMiddleware, rating)
router.put("/:id", authMiddleware, isAdmin, updateProduct)

module.exports = router