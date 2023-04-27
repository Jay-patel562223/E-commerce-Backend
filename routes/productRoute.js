const express = require("express");
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating } = require("../controllers/productCtrl");
const router = express.Router();
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware')

router.post("/", authMiddleware, isAdmin, createProduct)
router.get("/:id", getProduct)
router.get("/", getAllProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.put("/wishlist", authMiddleware, addToWishlist)
router.put("/rating", authMiddleware, rating)
router.put("/:id", authMiddleware, isAdmin, updateProduct)

module.exports = router