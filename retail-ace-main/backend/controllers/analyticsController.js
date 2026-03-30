const Product = require("../models/Product");
const Sale = require("../models/Sale");

// GET /api/analytics/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const products = await Product.find();
    const totalProducts = products.length;
    const lowStockItems = products.filter((p) => p.stock <= p.minStock);
    const inventoryValue = products.reduce((sum, p) => sum + p.cost * p.stock, 0);

    const sales = await Sale.find();
    const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0);
    const totalOrders = sales.length;

    res.json({
      totalProducts,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      totalRevenue: +totalRevenue.toFixed(2),
      totalOrders,
      inventoryValue: +inventoryValue.toFixed(2),
      avgOrderValue: totalOrders ? +(totalRevenue / totalOrders).toFixed(2) : 0,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/daily-sales
exports.getDailySales = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailySales = await Sale.aggregate([
      { $match: { date: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          revenue: { $sum: "$revenue" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: { $round: ["$revenue", 2] },
          orders: 1,
        },
      },
    ]);

    res.json(dailySales);
  } catch (error) {
    next(error);
  }
};
// GET /api/analytics/product-performance
// GET /api/analytics/product-performance
exports.getProductPerformance = async (req, res, next) => {
  try {
    const performance = await Sale.aggregate([
      {
        $group: {
          _id: "$product",
          totalUnitsSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$revenue" },
          salesCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products",        // Mongo collection name
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      {
        $project: {
          _id: 1,
          productName: "$product.name",
          sku: "$product.sku",
          category: "$product.category",
          price: "$product.price",
          cost: "$product.cost",
          stock: "$product.stock",
          totalUnitsSold: 1,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          salesCount: 1,
        },
      },

      { $sort: { totalRevenue: -1 } },
    ]);

    res.json(performance);
  } catch (error) {
    next(error);
  }
};