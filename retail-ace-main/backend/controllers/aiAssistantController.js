const Product = require("../models/Product");
const Sale = require("../models/Sale");

// POST /api/ai/assistant
exports.askAssistant = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const q = question.toLowerCase();
    let answer = "";
    let data = null;

    // Pattern matching for common queries
    if (q.includes("restock") || q.includes("low stock") || q.includes("out of stock")) {
      const lowStock = await Product.find({ $expr: { $lte: ["$stock", "$minStock"] } }).sort({ stock: 1 });
      answer = lowStock.length > 0
        ? `You have ${lowStock.length} product(s) that need restocking:\n${lowStock.map((p) => `• ${p.name}: ${p.stock} left (min: ${p.minStock})`).join("\n")}`
        : "All products are currently above their minimum stock levels. No restocking needed right now.";
      data = lowStock;

    } else if (q.includes("best sell") || q.includes("top product") || q.includes("popular")) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const topProducts = await Sale.aggregate([
        { $match: { date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$product", name: { $first: "$productName" }, qty: { $sum: "$quantity" }, rev: { $sum: "$revenue" } } },
        { $sort: { rev: -1 } },
        { $limit: 5 },
      ]);
      answer = topProducts.length > 0
        ? `Top sellers (last 30 days):\n${topProducts.map((p, i) => `${i + 1}. ${p.name} — ${p.qty} units, $${p.rev.toFixed(2)}`).join("\n")}`
        : "No sales data available for the last 30 days.";
      data = topProducts;

    } else if (q.includes("performance") || q.includes("this week") || q.includes("summary") || q.includes("overview")) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const weekStats = await Sale.aggregate([
        { $match: { date: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, revenue: { $sum: "$revenue" }, orders: { $sum: 1 }, units: { $sum: "$quantity" } } },
      ]);
      const stats = weekStats[0] || { revenue: 0, orders: 0, units: 0 };
      const totalProducts = await Product.countDocuments();
      const lowStock = await Product.countDocuments({ $expr: { $lte: ["$stock", "$minStock"] } });
      answer = `This week's performance:\n• Revenue: $${stats.revenue.toFixed(2)}\n• Orders: ${stats.orders}\n• Units sold: ${stats.units}\n• Total products: ${totalProducts}\n• Low stock items: ${lowStock}`;
      data = stats;

    } else if (q.includes("slow") || q.includes("not selling")) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const allProducts = await Product.find();
      const slowMoving = [];
      for (const p of allProducts) {
        const count = await Sale.countDocuments({ product: p._id, date: { $gte: thirtyDaysAgo } });
        if (count <= 2 && p.stock > 0) slowMoving.push({ name: p.name, stock: p.stock, salesCount: count });
      }
      answer = slowMoving.length > 0
        ? `Slow-moving products (≤2 sales in 30 days):\n${slowMoving.map((p) => `• ${p.name}: ${p.salesCount} sales, ${p.stock} in stock`).join("\n")}\nConsider running promotions.`
        : "No slow-moving products detected. All items are selling at a healthy rate.";
      data = slowMoving;

    } else {
      answer = "I can help with:\n• \"Which products should I restock?\"\n• \"Show this week's performance\"\n• \"What are my best sellers?\"\n• \"Which products are slow-moving?\"\n\nTry asking one of these questions!";
    }

    res.json({ question, answer, data, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
};
