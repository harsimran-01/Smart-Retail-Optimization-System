const Product = require("../models/Product");
const Sale = require("../models/Sale");

exports.getReorderRecommendations = async (req, res, next) => {
  try {
    const products = await Product.find();
    const recommendations = [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const product of products) {

      // sales velocity (real)
      const sales = await Sale.aggregate([
        { $match: { product: product._id, date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, qty: { $sum: "$quantity" } } }
      ]);

      const salesVelocity = (sales[0]?.qty || 0) / 30;

      const forecastDemand = Math.round(salesVelocity * 7);
      const leadTimeDays = 5; // later supplier-based
      const safetyStock = Math.ceil(salesVelocity * 2);

      const demandDuringLead = Math.ceil(salesVelocity * leadTimeDays);
      const reorderPoint = demandDuringLead + safetyStock;

      const recommendedQty =
        Math.max(0, reorderPoint + forecastDemand - product.stock);

      let urgency = "low";
      if (product.stock <= safetyStock) urgency = "critical";
      else if (product.stock <= reorderPoint) urgency = "high";
      else if (product.stock <= reorderPoint * 1.5) urgency = "medium";

      if (recommendedQty > 0) {
        recommendations.push({
          productId: product._id,
          productName: product.name,
          sku: product.sku,
          currentStock: product.stock,
          recommendedQty,
          forecastDemand,
          leadTimeDays,
          safetyStock,
          urgency,
          reason: `Reorder point ${reorderPoint}. Based on real sales velocity.`,
        });
      }
    }

    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => order[a.urgency] - order[b.urgency]);

    res.json(recommendations);
  } catch (err) {
    next(err);
  }
};
// POST /api/reorder/place
exports.placeReorder = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Missing productId or quantity" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // simulate supplier delivery → increase stock
    product.stock += quantity;

    await product.save();

    res.json({
      message: "Reorder placed successfully",
      newStock: product.stock,
    });
  } catch (err) {
    next(err);
  }
};