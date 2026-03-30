const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// POST /api/seasonal/apply
router.post(
  "/apply",
  protect,
  authorize("admin"), // only admin can execute
  async (req, res) => {
    const { productId } = req.body;

    console.log("Seasonal optimization applied for:", productId);

    // 👉 later you will update stock/price here
    res.json({
      success: true,
      message: "Seasonal optimization applied successfully"
    });
  }
);

module.exports = router;