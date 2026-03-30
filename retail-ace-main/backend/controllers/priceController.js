const Product = require("../models/Product");
const Sale = require("../models/Sale");

exports.getPriceSuggestions = async (req, res) => {
  const products = await Product.find();

  const suggestions = [];

  for (const product of products) {

    // sales last 30 days
    const sales = await Sale.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: null, qty: { $sum: "$quantity" } } }
    ]);

    const velocity = sales[0]?.qty || 0;

    let action = "increase";
    let changePercent = 5;

    if (velocity < 5 && product.stock > product.minStock * 2) {
      action = "decrease";
      changePercent = 10;
    }

    const suggestedPrice =
      action === "increase"
        ? product.price * 1.05
        : product.price * 0.9;

    suggestions.push({
      productId: product._id,
      productName: product.name,
      category: product.category,
      currentPrice: product.price,
      suggestedPrice,
      changePercent,
      action,
      expectedImpact:
        action === "increase"
          ? "Higher profit margin expected"
          : "Increase sales velocity",
      reason: "Based on sales velocity and inventory levels"
    });
  }

  res.json(suggestions);
};
exports.applyPriceSuggestion = async (req, res) => {
  const { productId, newPrice } = req.body;

  const product = await Product.findById(productId);

  if (!product)
    return res.status(404).json({ message: "Product not found" });

  product.price = newPrice;
  await product.save();

  res.json({
    message: "Price updated successfully",
    updatedPrice: product.price
  });
};