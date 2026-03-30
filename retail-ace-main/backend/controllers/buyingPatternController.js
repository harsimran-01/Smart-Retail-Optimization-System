const Sale = require("../models/Sale");

exports.getBuyingPatterns = async (req, res, next) => {
  try {
    // group products bought together
    const orders = await Sale.aggregate([
      {
        $group: {
          _id: "$orderId",   // IMPORTANT: same order identifier
          products: { $push: "$productName" }
        }
      }
    ]);

    const pairCount = {};
    const productCount = {};

    orders.forEach(order => {
      const items = [...new Set(order.products)];

      items.forEach(p => {
        productCount[p] = (productCount[p] || 0) + 1;
      });

      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const key = [items[i], items[j]].sort().join("|");
          pairCount[key] = (pairCount[key] || 0) + 1;
        }
      }
    });

    const patterns = Object.entries(pairCount).map(([pair, count]) => {
      const [A, B] = pair.split("|");

      const confidence = Math.round(
        (count / productCount[A]) * 100
      );

      return {
        productA: A,
        productB: B,
        occurrences: count,
        confidence,
        suggestion: "Bundle / Cross-sell"
      };
    });

    res.json(patterns.sort((a,b)=>b.confidence-a.confidence));

  } catch (err) {
    next(err);
  }
};