const Product = require("../models/Product");
const Sale = require("../models/Sale");

// GET /api/analytics/advanced
exports.getAdvancedAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Top products by revenue
    const topProducts = await Sale.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: "$product",
          productName: { $first: "$productName" },
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$revenue" },
          salesCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: 1,
          totalQuantity: 1,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          salesCount: 1,
        },
      },
    ]);

    // 2. Category performance
    const categoryPerformance = await Sale.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalRevenue: { $sum: "$revenue" },
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: { $multiply: ["$productDetails.cost", "$quantity"] } },
          salesCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalRevenue: { $round: ["$totalRevenue", 2] },
          totalQuantity: 1,
          profit: { $round: [{ $subtract: ["$totalRevenue", "$totalCost"] }, 2] },
          margin: {
            $round: [
              { $multiply: [{ $divide: [{ $subtract: ["$totalRevenue", "$totalCost"] }, "$totalRevenue"] }, 100] },
              1,
            ],
          },
          salesCount: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    // 3. Profit trend (daily for last 30 days)
    const profitTrend = await Sale.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          revenue: { $sum: "$revenue" },
          cost: { $sum: { $multiply: ["$productDetails.cost", "$quantity"] } },
          orders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: { $round: ["$revenue", 2] },
          cost: { $round: ["$cost", 2] },
          profit: { $round: [{ $subtract: ["$revenue", "$cost"] }, 2] },
          orders: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // 4. Inventory health summary
    const products = await Product.find();
    const inventoryHealth = {
      totalProducts: products.length,
      healthyStock: products.filter((p) => p.stock > p.minStock * 1.5).length,
      warningStock: products.filter((p) => p.stock > p.minStock && p.stock <= p.minStock * 1.5).length,
      criticalStock: products.filter((p) => p.stock <= p.minStock).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
      totalInventoryValue: +products.reduce((s, p) => s + p.cost * p.stock, 0).toFixed(2),
      totalRetailValue: +products.reduce((s, p) => s + p.price * p.stock, 0).toFixed(2),
    };

    res.json({
      topProducts,
      categoryPerformance,
      profitTrend,
      inventoryHealth,
      period: "Last 30 days",
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
