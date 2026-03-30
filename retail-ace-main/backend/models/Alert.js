const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["low_stock", "sales_drop", "demand_spike"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
