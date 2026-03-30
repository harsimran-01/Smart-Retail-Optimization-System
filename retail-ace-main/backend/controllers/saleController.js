const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Alert = require("../models/Alert");

// GET /api/sales
exports.getSales = async (req, res, next) => {
  try {
    const sales = await Sale.find().populate("product", "name sku").sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    next(error);
  }
};

// POST /api/sales
exports.createSale = async (req, res, next) => {
  try {
  //   await require("../controllers/alertController")
  // .generateAlerts(req, res, () => {});
    const { product: productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock. Available: ${product.stock}` });
    }

    const sale = await Sale.create({
      product: productId,
      productName: product.name,
      quantity,
      revenue: product.price * quantity,
      date: req.body.date || new Date(),
    });

    // Reduce stock
    product.stock -= quantity;
    await product.save();

    // ✅ Low stock alert check
if (product.stock <= product.minStock) {
  const alert = await Alert.create({
    type: "low_stock", // must match enum
    severity: "high",
    title: "Low Stock Warning",
    message: `Low stock alert for ${product.name}`,
    product: product._id,
    read: false,
  });

  const io = req.app.get("io");
  if (io) {
    io.emit("low_stock_alert", alert);
  }
}
    // Emit real-time event via Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.emit("new_sale", {
        sale,
        updatedProduct: { id: product._id, name: product.name, stock: product.stock },
      });
    }

    res.status(201).json(sale);
  } catch (error) {
    next(error);
  }
};
