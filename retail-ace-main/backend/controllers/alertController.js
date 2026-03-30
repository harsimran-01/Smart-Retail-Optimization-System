const Alert = require("../models/Alert");
const Product = require("../models/Product");
const Sale = require("../models/Sale");

// GET /api/alerts — get all alerts

exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find()
      .populate("product", "name sku")
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await Alert.countDocuments({ read: false });
    res.json({ alerts, unreadCount });
  } catch (error) {
    next(error);
  }
};
// GET /api/alerts — get all alerts for logged-in user

// POST /api/alerts/generate — scan and auto-generate alerts
exports.generateAlerts = async (req, res, next) => {
  console.log("🔥 generateAlerts called");
  try {
    const generated = [];

    // 1. Low stock alerts
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$stock", "$minStock"] },
    });
    for (const p of lowStockProducts) {
      const exists = await Alert.findOne({
        type: "low_stock",
        product: p._id,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });
      if (!exists) {
        const alert = await Alert.create({
          type: "low_stock",
          severity: p.stock === 0 ? "high" : p.stock <= p.minStock / 2 ? "high" : "medium",
          title: `Low Stock: ${p.name}`,
          message: `Current stock (${p.stock}) is at or below minimum (${p.minStock}). Restock immediately.`,
          product: p._id,
        });
        generated.push(alert);
      }
    }

    // 2. Sales drop detection (compare last 3 days vs previous 3 days)
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

    const recentSales = await Sale.aggregate([
      { $match: { date: { $gte: threeDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$revenue" } } },
    ]);
    const prevSales = await Sale.aggregate([
      { $match: { date: { $gte: sixDaysAgo, $lt: threeDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$revenue" } } },
    ]);

    const recentTotal = recentSales[0]?.total || 0;
    const prevTotal = prevSales[0]?.total || 1;
    const dropPct = ((prevTotal - recentTotal) / prevTotal) * 100;

    if (dropPct > 30) {
      const exists = await Alert.findOne({
        type: "sales_drop",
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });
      if (!exists) {
        const alert = await Alert.create({
          type: "sales_drop",
          severity: dropPct > 50 ? "high" : "medium",
          title: "Significant Sales Drop Detected",
          message: `Revenue dropped ${dropPct.toFixed(0)}% compared to the previous 3-day period ($${recentTotal.toFixed(2)} vs $${prevTotal.toFixed(2)}).`,
        });
        generated.push(alert);
      }
    }

    // 3. Demand spike detection
    const productSpikes = await Sale.aggregate([
      { $match: { date: { $gte: threeDaysAgo } } },
      { $group: { _id: "$product", recentQty: { $sum: "$quantity" }, name: { $first: "$productName" } } },
    ]);

    for (const spike of productSpikes) {
      const prevQtyAgg = await Sale.aggregate([
        { $match: { product: spike._id, date: { $gte: sixDaysAgo, $lt: threeDaysAgo } } },
        { $group: { _id: null, qty: { $sum: "$quantity" } } },
      ]);
      const prevQty = prevQtyAgg[0]?.qty || 1;
      const increase = ((spike.recentQty - prevQty) / prevQty) * 100;

      if (increase > 100) {
        const exists = await Alert.findOne({
          type: "demand_spike",
          product: spike._id,
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });
        if (!exists) {
          const alert = await Alert.create({
            type: "demand_spike",
            severity: increase > 200 ? "high" : "medium",
            title: `Demand Spike: ${spike.name}`,
            message: `Sales increased by ${increase.toFixed(0)}% over the last 3 days (${spike.recentQty} vs ${prevQty} units).`,
            product: spike._id,
          });
          generated.push(alert);
        }
      }
    }

    res.json({ generated, count: generated.length });
  }catch (error) {
  console.log("❌ ALERT GENERATION ERROR:", error);
  next(error);
}
};

// PATCH /api/alerts/:id/read
exports.markRead = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/alerts/read-all
exports.markAllRead = async (req, res, next) => {
  try {
    await Alert.updateMany({ read: false }, { read: true });
    res.json({ message: "All alerts marked as read" });
  } catch (error) {
    next(error);
  }
};
