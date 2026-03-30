const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { protect, authorize } = require("./middleware/auth");

// Route imports
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiRoutes = require("./routes/aiRoutes");
const forecastRoutes = require("./routes/forecastRoutes");
const alertRoutes = require("./routes/alertRoutes");
const advancedAnalyticsRoutes = require("./routes/advancedAnalyticsRoutes");
const seasonalRoutes = require("./routes/seasonalRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Make io accessible in controllers via req.app
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());

// ---------- Public routes ----------
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});


// ---------- Protected routes ----------
// Products: Admin = full CRUD, Staff = read only
app.use("/api/products", protect, productRoutes);

// Sales: Both Admin and Staff can create/view sales
app.use("/api/sales", protect, saleRoutes);

// Analytics: Admin only
app.use("/api/analytics", protect, authorize("admin"), analyticsRoutes);
app.use("/api/analytics/advanced", protect, authorize("admin"), advancedAnalyticsRoutes);

// AI features: Admin only
app.use("/api/ai", protect, authorize("admin"), aiRoutes);
app.use("/api/forecast", protect, authorize("admin"), forecastRoutes);

// Alerts: All authenticated users
app.use("/api/alerts", protect, alertRoutes);

// Error handler
app.use(errorHandler);

//reorder optimization
app.use("/api/reorder", require("./routes/reorderRoutes"));
//price optimization
app.use("/api/pricing", require("./routes/priceRoutes"));
//buying pattern route
app.use("/api/buying-patterns",
  require("./routes/buyingPatternRoutes"));
  app.use("/api/seasonal", seasonalRoutes);

// ---------- Socket.IO ----------
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO ready on port ${PORT}`);
  });
});
