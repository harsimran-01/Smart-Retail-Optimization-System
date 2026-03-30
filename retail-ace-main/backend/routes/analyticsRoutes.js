const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getDailySales,
  getProductPerformance,
} = require("../controllers/analyticsController");

router.get("/dashboard", getDashboardStats);
router.get("/daily-sales", getDailySales);
router.get("/product-performance", getProductPerformance);

module.exports = router;
