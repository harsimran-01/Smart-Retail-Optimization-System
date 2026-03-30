const Product = require("../models/Product");
const Sale = require("../models/Sale");

// GET /api/ai/insights
exports.getInsights = async (req, res, next) => {
  try {
    const insights = [];

    // ---- 1. Low stock predictions ----
    const products = await Product.find();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const product of products) {
      // Average daily sales for this product over last 30 days
      const salesAgg = await Sale.aggregate([
        { $match: { product: product._id, date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, totalQty: { $sum: "$quantity" }, count: { $sum: 1 } } },
      ]);

      const totalQty = salesAgg[0]?.totalQty || 0;
      const avgDailySales = totalQty / 30;

      // Predict days until out of stock
      if (avgDailySales > 0) {
        const daysUntilOOS = Math.floor(product.stock / avgDailySales);
        if (daysUntilOOS <= 7) {
          insights.push({
            type: "restock",
            priority: daysUntilOOS <= 2 ? "High" : "Medium",
            title: `Restock ${product.name}`,
            description: `At current sales rate (${avgDailySales.toFixed(1)}/day), stock will run out in ~${daysUntilOOS} days. Current stock: ${product.stock}.`,
            suggestedAction: `Order at least ${Math.ceil(avgDailySales * 14)} units (2-week supply).`,
            productId: product._id,
          });
        }
      }

      // Low stock alert (below minStock)
      if (product.stock <= product.minStock && !insights.find((i) => i.productId?.equals(product._id) && i.type === "restock")) {
        insights.push({
          type: "restock",
          priority: product.stock === 0 ? "High" : "Medium",
          title: `${product.name} below minimum stock`,
          description: `Current stock (${product.stock}) is at or below minimum threshold (${product.minStock}).`,
          suggestedAction: `Restock to at least ${product.minStock * 2} units.`,
          productId: product._id,
        });
      }
    }

    // ---- 2. Slow-moving inventory ----
    for (const product of products) {
      const recentSales = await Sale.countDocuments({
        product: product._id,
        date: { $gte: thirtyDaysAgo },
      });
      if (recentSales <= 2 && product.stock > 0) {
        insights.push({
          type: "slow_moving",
          priority: "Low",
          title: `Slow-moving: ${product.name}`,
          description: `Only ${recentSales} sale(s) in the last 30 days with ${product.stock} units in stock. Consider a promotion or discount.`,
          suggestedAction: "Run a 15-20% discount campaign or create a bundle deal.",
          productId: product._id,
        });
      }
    }

    // ---- 3. Best sellers ----
    const bestSellers = await Sale.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$product", totalQty: { $sum: "$quantity" }, totalRevenue: { $sum: "$revenue" }, productName: { $first: "$productName" } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: 3 },
    ]);

    bestSellers.forEach((item, i) => {
      insights.push({
        type: "best_seller",
        priority: i === 0 ? "High" : "Medium",
        title: `Top seller: ${item.productName}`,
        description: `${item.totalQty} units sold generating $${item.totalRevenue.toFixed(2)} in the last 30 days.`,
        suggestedAction: "Ensure consistent stock levels and consider premium placement.",
        productId: item._id,
      });
    });

    // Sort by priority
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    res.json({ insights, generatedAt: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
};
