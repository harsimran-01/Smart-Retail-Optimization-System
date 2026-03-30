const mongoose = require("mongoose");

const forecastSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },
    predictions: [
      {
        date: { type: String, required: true },
        predictedQuantity: { type: Number, required: true },
        predictedRevenue: { type: Number, required: true },
      },
    ],
    confidence: { type: Number, default: 0.75 },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Forecast", forecastSchema);
