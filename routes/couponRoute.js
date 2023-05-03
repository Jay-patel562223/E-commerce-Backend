const express = require("express");
const { createCoupon, getAllCoupon, getCoupon, updateCoupon } = require("../controllers/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/getallcoupon", authMiddleware, isAdmin, getAllCoupon)
router.put("/:id", authMiddleware, isAdmin, updateCoupon)
router.get("/:id", authMiddleware, isAdmin, getCoupon)
router.post("/", authMiddleware, isAdmin, createCoupon)

module.exports = router