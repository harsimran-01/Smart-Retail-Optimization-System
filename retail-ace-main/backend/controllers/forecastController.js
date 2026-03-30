const Product = require("../models/Product");
const Sale = require("../models/Sale");
const Forecast = require("../models/Forecast");

// GET /api/forecast/generate — generate 7-day demand forecast for all products
exports.generateForecast = async (req, res, next) => {
  try {
    const products = await Product.find();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const forecasts = [];

    for (const product of products) {
      // Get daily sales for last 30 days
      const dailySales = await Sale.aggregate([
        { $match: { product: product._id, date: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            quantity: { $sum: "$quantity" },
            revenue: { $sum: "$revenue" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const totalDays = 30;
      const totalQty = dailySales.reduce((s, d) => s + d.quantity, 0);
      const totalRev = dailySales.reduce((s, d) => s + d.revenue, 0);
      const avgDailyQty = totalQty / totalDays;
      const avgDailyRev = totalRev / totalDays;

      // Simple weighted moving average: recent days weighted more
      // Use last 7 days average vs overall average, blend 60/40
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentSales = await Sale.aggregate([
        { $match: { product: product._id, date: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, qty: { $sum: "$quantity" }, rev: { $sum: "$revenue" } } },
      ]);

      const recentAvgQty = (recentSales[0]?.qty || 0) / 7;
      const recentAvgRev = (recentSales[0]?.rev || 0) / 7;
      const blendedQty = recentAvgQty * 0.6 + avgDailyQty * 0.4;
      const blendedRev = recentAvgRev * 0.6 + avgDailyRev * 0.4;

      // Generate 7-day predictions
      const predictions = [];
      for (let i = 1; i <= 7; i++) {
        const forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + i);
        // Add slight random variation (±15%)
        const variation = 1 + (Math.random() * 0.3 - 0.15);
        predictions.push({
          date: forecastDate.toISOString().split("T")[0],
          predictedQuantity: Math.max(0, Math.round(blendedQty * variation)),
          predictedRevenue: +(blendedRev * variation).toFixed(2),
        });
      }

      // Confidence based on data volume
      const confidence = Math.min(0.95, 0.5 + dailySales.length * 0.015);

      // Upsert forecast
      const forecast = await Forecast.findOneAndUpdate(
        { product: product._id },
        {
          product: product._id,
          productName: product.name,
          predictions,
          confidence: +confidence.toFixed(2),
          generatedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      forecasts.push(forecast);
    }

    res.json({ forecasts, generatedAt: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
};

// GET /api/forecast — get stored forecasts
exports.getForecasts = async (req, res, next) => {
  try {
    const forecasts = await Forecast.find()
      .populate("product", "name sku stock")
      .sort({ "predictions.0.predictedRevenue": -1 });
    res.json(forecasts);
  } catch (error) {
    next(error);
  }
};
