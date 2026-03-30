// Mock API service — set BASE_URL to your Express backend to connect
// Example: const BASE_URL = "http://localhost:5000/api";
const BASE_URL = "http://localhost:5000/api"; // Empty = use mock data below
const USE_MOCK = !BASE_URL;
// const USE_MOCK = false;
const getToken = () => localStorage.getItem("token");

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  lastRestocked: string;
}

export interface SaleEntry {
  id: string;
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
}

export interface SmartAlert {
  id: string;
  type: "low_stock" | "overstock" | "slow_moving" | "demand_spike";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  message: string;
  productName: string;
  productId: string;
  read: boolean;
  createdAt: string;
}

export interface ProductPerformance {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  profitMargin: number;
  salesVelocity: number; // units per day
  inventoryTurnover: number; // times per month
  totalUnitsSold: number;
  totalRevenue: number;
  daysOfSupply: number;
}

export interface ForecastEntry {
  date: string;
  productName: string;
  productId: string;
  predictedDemand: number;
  confidence: number;
}

export interface CategoryPerformance {
  category: string;
  totalRevenue: number;
  totalQuantity: number;
  profit: number;
  margin: number;
  salesCount: number;
}

export interface AdvancedAnalytics {
  topProducts: { productName: string; totalRevenue: number; totalQuantity: number; salesCount: number }[];
  categoryPerformance: CategoryPerformance[];
  profitTrend: { date: string; revenue: number; cost: number; profit: number; orders: number }[];
  inventoryHealth: {
    totalProducts: number;
    healthyStock: number;
    warningStock: number;
    criticalStock: number;
    outOfStock: number;
    totalInventoryValue: number;
    totalRetailValue: number;
  };
}

export interface ReorderRecommendation {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  recommendedQty: number;
  forecastDemand: number;
  leadTimeDays: number;
  safetyStock: number;
  urgency: "critical" | "high" | "medium" | "low";
  reason: string;
}

export interface PriceSuggestion {
  productId: string;
  productName: string;
  category: string;
  currentPrice: number;
  suggestedPrice: number;
  changePercent: number;
  action: "increase" | "decrease";
  expectedImpact: string;
  reason: string;
}

export interface BuyingPattern {
  productA: string;
  productB: string;
  confidence: number;
  occurrences: number;
  suggestion: string;
}

export interface SeasonalTrend {
  productId: string;
  productName: string;
  patternType: string;
  description: string;
  peakPeriod: string;
  upliftPercent: number;
  data: { label: string; value: number }[];
}

const mockProducts: Product[] = [
  { id: "1", name: "Organic Coffee Beans", sku: "COF-001", category: "Beverages", price: 14.99, cost: 8.50, stock: 45, minStock: 20, lastRestocked: "2026-02-18" },
  { id: "2", name: "Whole Wheat Bread", sku: "BRD-001", category: "Bakery", price: 4.49, cost: 2.10, stock: 8, minStock: 15, lastRestocked: "2026-02-20" },
  { id: "3", name: "Fresh Milk 1L", sku: "DRY-001", category: "Dairy", price: 3.29, cost: 1.80, stock: 32, minStock: 25, lastRestocked: "2026-02-19" },
  { id: "4", name: "Avocados (pack of 3)", sku: "FRT-001", category: "Produce", price: 5.99, cost: 3.20, stock: 5, minStock: 10, lastRestocked: "2026-02-17" },
  { id: "5", name: "Almond Butter", sku: "SPR-001", category: "Pantry", price: 9.99, cost: 5.50, stock: 28, minStock: 10, lastRestocked: "2026-02-15" },
  { id: "6", name: "Greek Yogurt 500g", sku: "DRY-002", category: "Dairy", price: 4.99, cost: 2.40, stock: 3, minStock: 12, lastRestocked: "2026-02-16" },
  { id: "7", name: "Sparkling Water 6-pack", sku: "BEV-002", category: "Beverages", price: 6.49, cost: 3.00, stock: 52, minStock: 20, lastRestocked: "2026-02-20" },
  { id: "8", name: "Dark Chocolate Bar", sku: "SNK-001", category: "Snacks", price: 3.99, cost: 1.80, stock: 18, minStock: 15, lastRestocked: "2026-02-14" },
];

const mockSalesHistory: DailySales[] = [
  { date: "Feb 15", revenue: 1240, orders: 34 },
  { date: "Feb 16", revenue: 1580, orders: 42 },
  { date: "Feb 17", revenue: 980, orders: 28 },
  { date: "Feb 18", revenue: 1890, orders: 51 },
  { date: "Feb 19", revenue: 2100, orders: 58 },
  { date: "Feb 20", revenue: 1750, orders: 47 },
  { date: "Feb 21", revenue: 1420, orders: 39 },
];

const mockRecentSales: SaleEntry[] = [
  { id: "s1", date: "2026-02-21", productId: "1", productName: "Organic Coffee Beans", quantity: 3, revenue: 44.97 },
  { id: "s2", date: "2026-02-21", productId: "3", productName: "Fresh Milk 1L", quantity: 5, revenue: 16.45 },
  { id: "s3", date: "2026-02-21", productId: "8", productName: "Dark Chocolate Bar", quantity: 8, revenue: 31.92 },
  { id: "s4", date: "2026-02-21", productId: "5", productName: "Almond Butter", quantity: 2, revenue: 19.98 },
  { id: "s5", date: "2026-02-20", productId: "7", productName: "Sparkling Water 6-pack", quantity: 4, revenue: 25.96 },
  { id: "s6", date: "2026-02-20", productId: "1", productName: "Organic Coffee Beans", quantity: 5, revenue: 74.95 },
  { id: "s7", date: "2026-02-19", productId: "4", productName: "Avocados (pack of 3)", quantity: 6, revenue: 35.94 },
  { id: "s8", date: "2026-02-19", productId: "6", productName: "Greek Yogurt 500g", quantity: 10, revenue: 49.90 },
  { id: "s9", date: "2026-02-18", productId: "2", productName: "Whole Wheat Bread", quantity: 12, revenue: 53.88 },
  { id: "s10", date: "2026-02-18", productId: "3", productName: "Fresh Milk 1L", quantity: 8, revenue: 26.32 },
];

let products = [...mockProducts];
let sales = [...mockRecentSales];
let alerts: SmartAlert[] = [];

// Simulate async API calls
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// Helper: generate smart alerts from current data
function generateAlerts(): SmartAlert[] {
  const now = new Date().toISOString();
  const result: SmartAlert[] = [];

  // Compute sales per product
  const salesByProduct: Record<string, number> = {};
  sales.forEach(s => {
    salesByProduct[s.productId] = (salesByProduct[s.productId] || 0) + s.quantity;
  });

  products.forEach(p => {
    // Low stock
    if (p.stock <= p.minStock && p.stock > 0) {
      result.push({
        id: `alert-low-${p.id}`,
        type: "low_stock",
        severity: p.stock <= p.minStock * 0.5 ? "critical" : "high",
        title: `Low Stock: ${p.name}`,
        message: `Only ${p.stock} units remaining (min threshold: ${p.minStock}). Restock immediately to avoid stockouts.`,
        productName: p.name,
        productId: p.id,
        read: false,
        createdAt: now,
      });
    }
    // Out of stock
    if (p.stock <= 0) {
      result.push({
        id: `alert-oos-${p.id}`,
        type: "low_stock",
        severity: "critical",
        title: `Out of Stock: ${p.name}`,
        message: `${p.name} is completely out of stock. Revenue is being lost.`,
        productName: p.name,
        productId: p.id,
        read: false,
        createdAt: now,
      });
    }
    // Overstock
    if (p.stock > p.minStock * 3) {
      result.push({
        id: `alert-over-${p.id}`,
        type: "overstock",
        severity: "medium",
        title: `Overstock: ${p.name}`,
        message: `${p.stock} units in stock (min: ${p.minStock}). Consider running a promotion to move excess inventory.`,
        productName: p.name,
        productId: p.id,
        read: false,
        createdAt: now,
      });
    }
    // Slow-moving
    const unitsSold = salesByProduct[p.id] || 0;
    if (unitsSold < 3 && p.stock > 10) {
      result.push({
        id: `alert-slow-${p.id}`,
        type: "slow_moving",
        severity: "low",
        title: `Slow-Moving: ${p.name}`,
        message: `Only ${unitsSold} units sold recently with ${p.stock} in stock. Consider discounting or bundling.`,
        productName: p.name,
        productId: p.id,
        read: false,
        createdAt: now,
      });
    }
    // Demand spike
    if (unitsSold > 8) {
      result.push({
        id: `alert-spike-${p.id}`,
        type: "demand_spike",
        severity: "high",
        title: `Demand Spike: ${p.name}`,
        message: `${unitsSold} units sold recently — significantly above average. Ensure sufficient restocking.`,
        productName: p.name,
        productId: p.id,
        read: false,
        createdAt: now,
      });
    }
  });

  return result;
}

// Helper: compute product performance
function computePerformance(): ProductPerformance[] {
  const salesByProduct: Record<string, { units: number; revenue: number; count: number }> = {};
  sales.forEach(s => {
    if (!salesByProduct[s.productId]) salesByProduct[s.productId] = { units: 0, revenue: 0, count: 0 };
    salesByProduct[s.productId].units += s.quantity;
    salesByProduct[s.productId].revenue += s.revenue;
    salesByProduct[s.productId].count += 1;
  });

  return products.map(p => {
    const data = salesByProduct[p.id] || { units: 0, revenue: 0, count: 0 };
    const profitMargin = p.price > 0 ? +((p.price - p.cost) / p.price * 100).toFixed(1) : 0;
    const salesVelocity = +(data.units / 7).toFixed(1); // units per day over 7 days
    const inventoryTurnover = p.stock > 0 ? +((data.units / p.stock) * 4.3).toFixed(1) : 0; // monthly
    const daysOfSupply = salesVelocity > 0 ? Math.round(p.stock / salesVelocity) : 999;

    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      cost: p.cost,
      stock: p.stock,
      profitMargin,
      salesVelocity,
      inventoryTurnover,
      totalUnitsSold: data.units,
      totalRevenue: +data.revenue.toFixed(2),
      daysOfSupply,
    };
  });
}

// Helper: generate forecast
function generateForecast(): ForecastEntry[] {
  const salesByProduct: Record<string, number> = {};
  sales.forEach(s => {
    salesByProduct[s.productId] = (salesByProduct[s.productId] || 0) + s.quantity;
  });

  const forecasts: ForecastEntry[] = [];
  const today = new Date();

  products.forEach(p => {
    const avgDaily = (salesByProduct[p.id] || 0) / 7;
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const variation = 0.8 + Math.random() * 0.4; // ±20%
      forecasts.push({
        date: date.toISOString().split("T")[0],
        productName: p.name,
        productId: p.id,
        predictedDemand: Math.max(1, Math.round(avgDaily * variation)),
        confidence: +(70 + Math.random() * 25).toFixed(0),
      });
    }
  });

  return forecasts;
}

// Helper: advanced analytics
function computeAdvancedAnalytics(): AdvancedAnalytics {
  const salesByProduct: Record<string, { name: string; revenue: number; quantity: number; count: number }> = {};
  const salesByCategory: Record<string, { revenue: number; quantity: number; cost: number; count: number }> = {};

  sales.forEach(s => {
    if (!salesByProduct[s.productId]) salesByProduct[s.productId] = { name: s.productName, revenue: 0, quantity: 0, count: 0 };
    salesByProduct[s.productId].revenue += s.revenue;
    salesByProduct[s.productId].quantity += s.quantity;
    salesByProduct[s.productId].count += 1;

    const product = products.find(p => p.id === s.productId);
    if (product) {
      const cat = product.category;
      if (!salesByCategory[cat]) salesByCategory[cat] = { revenue: 0, quantity: 0, cost: 0, count: 0 };
      salesByCategory[cat].revenue += s.revenue;
      salesByCategory[cat].quantity += s.quantity;
      salesByCategory[cat].cost += product.cost * s.quantity;
      salesByCategory[cat].count += 1;
    }
  });

  const topProducts = Object.values(salesByProduct)
    .map(p => ({ productName: p.name, totalRevenue: +p.revenue.toFixed(2), totalQuantity: p.quantity, salesCount: p.count }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  const categoryPerformance: CategoryPerformance[] = Object.entries(salesByCategory).map(([category, d]) => ({
    category,
    totalRevenue: +d.revenue.toFixed(2),
    totalQuantity: d.quantity,
    profit: +(d.revenue - d.cost).toFixed(2),
    margin: d.revenue > 0 ? +((d.revenue - d.cost) / d.revenue * 100).toFixed(1) : 0,
    salesCount: d.count,
  })).sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Profit trend (reuse daily sales + estimate cost at 55%)
  const profitTrend = mockSalesHistory.map(d => ({
    date: d.date,
    revenue: d.revenue,
    cost: +(d.revenue * 0.55).toFixed(2),
    profit: +(d.revenue * 0.45).toFixed(2),
    orders: d.orders,
  }));

  const healthyStock = products.filter(p => p.stock > p.minStock * 1.5).length;
  const warningStock = products.filter(p => p.stock > p.minStock && p.stock <= p.minStock * 1.5).length;
  const criticalStock = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  return {
    topProducts,
    categoryPerformance,
    profitTrend,
    inventoryHealth: {
      totalProducts: products.length,
      healthyStock,
      warningStock,
      criticalStock,
      outOfStock,
      totalInventoryValue: +products.reduce((s, p) => s + p.cost * p.stock, 0).toFixed(2),
      totalRetailValue: +products.reduce((s, p) => s + p.price * p.stock, 0).toFixed(2),
    },
  };
}

// Generate dynamic AI insights from actual data
function generateAIInsights() {
  const perf = computePerformance();
  const alertsList = generateAlerts();

  const insights: { title: string; description: string; impact: string; category: string }[] = [];

  // Critical restocks
  const critical = perf.filter(p => p.daysOfSupply < 3 && p.salesVelocity > 0).sort((a, b) => a.daysOfSupply - b.daysOfSupply);
  critical.forEach(p => {
    insights.push({
      title: `Restock ${p.name} Immediately`,
      impact: "Critical",
      category: "Stock Alert",
      description: `Only ${p.stock} units left with ${p.salesVelocity} units/day velocity. Will stockout in ~${p.daysOfSupply} days. Suggested restock: ${Math.ceil(p.salesVelocity * 14)} units.`,
    });
  });

  // Best sellers
  const bestSellers = [...perf].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 2);
  bestSellers.forEach(p => {
    insights.push({
      title: `Top Performer: ${p.name}`,
      impact: "High",
      category: "Sales Insight",
      description: `Generated $${p.totalRevenue} revenue with ${p.totalUnitsSold} units sold. Profit margin: ${p.profitMargin}%. Consider increasing stock allocation.`,
    });
  });

  // Slow movers
  const slowMovers = perf.filter(p => p.salesVelocity < 0.5 && p.stock > 10);
  slowMovers.forEach(p => {
    insights.push({
      title: `Slow-Moving: ${p.name}`,
      impact: "Medium",
      category: "Inventory",
      description: `${p.stock} units in stock but only ${p.salesVelocity} units/day velocity. ${p.daysOfSupply}+ days of supply. Consider promotional pricing.`,
    });
  });

  // High margin opportunities
  const highMargin = perf.filter(p => p.profitMargin > 40 && p.salesVelocity < 2).sort((a, b) => b.profitMargin - a.profitMargin);
  highMargin.slice(0, 1).forEach(p => {
    insights.push({
      title: `High-Margin Opportunity: ${p.name}`,
      impact: "Medium",
      category: "Pricing",
      description: `${p.profitMargin}% margin but low velocity (${p.salesVelocity}/day). Increase marketing spend — each sale is highly profitable.`,
    });
  });

  // Demand spike warnings
  const spikes = alertsList.filter(a => a.type === "demand_spike");
  spikes.forEach(a => {
    insights.push({
      title: a.title,
      impact: "High",
      category: "Demand Forecasting",
      description: a.message,
    });
  });

  return insights.length > 0 ? insights : [
    { title: "All Systems Nominal", description: "Inventory levels and sales velocity are within normal ranges. No immediate actions required.", impact: "Low", category: "Status" },
  ];
}

// Mock users store
const mockUsers = [
  { id: "u1", name: "Admin User", email: "admin@retailpulse.com", password: "password123", role: "admin" as const },
  { id: "u2", name: "Staff User", email: "staff@retailpulse.com", password: "password123", role: "staff" as const },
];

export const api = {
  // Auth
  // async login(email: string, password: string) {
  //   await delay(300);
  //   if (USE_MOCK) {
  //     const user = mockUsers.find(u => u.email === email && u.password === password);
  //     if (!user) throw new Error("Invalid email or password");
  //     const token = btoa(JSON.stringify({ id: user.id }));
  //     return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  //   }
  //   const res = await fetch(`${BASE_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  //   if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Login failed"); }
  //   return res.json();
  // },
  async login(email: string, password: string) {
    await delay(300);

    if (USE_MOCK) {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (!user) throw new Error("Invalid email or password");

      const token = btoa(JSON.stringify({ id: user.id }));

      // ⭐ SAVE TOKEN
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.message || "Login failed");
    }

    const data = await res.json();

    // ⭐ IMPORTANT PART
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  async register(name: string, email: string, password: string, role = "staff") {
    await delay(300);
    if (USE_MOCK) {
      if (mockUsers.find(u => u.email === email)) throw new Error("Email already registered");
      const user = { id: `u${Date.now()}`, name, email, password, role: role as "admin" | "staff" };
      mockUsers.push(user);
      const token = btoa(JSON.stringify({ id: user.id }));
      return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }
    const res = await fetch(`${BASE_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password, role }) });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Registration failed"); }
    // return res.json();
    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  async getMe(token: string) {
    await delay(200);
    if (USE_MOCK) {
      try {
        const { id } = JSON.parse(atob(token));
        const user = mockUsers.find(u => u.id === id);
        if (!user) throw new Error("User not found");
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      } catch { throw new Error("Invalid token"); }
    }
    const res = await fetch(`${BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Not authorized");
    const data = await res.json();
    return data.user;
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${BASE_URL}/products`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch products");
    // return res.json();
    const data = await res.json();

    return data.map((p: any) => ({
      id: p._id,              // ⭐ FIX
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      cost: p.cost,
      stock: p.stock,
      minStock: p.minStock,
      lastRestocked: p.lastRestocked,
    }));
  },

  async addProduct(product: Omit<Product, "id">): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to add product");
    }

    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updates),
    });

    return res.json();
  },

  async deleteProduct(id: string) {
    await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  },

  // Sales
  async getSales(): Promise<SaleEntry[]> {
    const res = await fetch(`${BASE_URL}/sales`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch sales");

    const data = await res.json();

    // normalize backend format → frontend format
    return data.map((s: any) => ({
      id: s._id,
      date: new Date(s.date).toISOString().split("T")[0],
      productId: s.product?._id,
      productName: s.productName,
      quantity: s.quantity,
      revenue: s.revenue,
    }));
  },

  async addSale(sale: {
    productId: string;
    quantity: number;
    date: string;
  }): Promise<SaleEntry> {

    const res = await fetch(`${BASE_URL}/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        product: sale.productId, // ⚠️ backend expects "product"
        quantity: sale.quantity,
        date: sale.date,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to record sale");
    }

    const s = await res.json();

    return {
      id: s._id,
      date: new Date(s.date).toISOString().split("T")[0],
      productId: s.product?._id || s.product,
      productName: s.productName,
      quantity: s.quantity,
      revenue: s.revenue,
    };
  },

  async getDailySales(): Promise<DailySales[]> {
    await delay(200);
    return [...mockSalesHistory];
  },

  // Dashboard
  async getDashboardStats() {
    await delay(200);
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock <= p.minStock);
    const totalRevenue = mockSalesHistory.reduce((s, d) => s + d.revenue, 0);
    const totalOrders = mockSalesHistory.reduce((s, d) => s + d.orders, 0);
    const inventoryValue = products.reduce((s, p) => s + p.cost * p.stock, 0);

    return {
      totalProducts,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      totalRevenue,
      totalOrders,
      inventoryValue,
      avgOrderValue: totalRevenue / totalOrders,
    };
  },

  // Smart Alerts
  async getAlerts(): Promise<SmartAlert[]> {
  const res = await fetch(`${BASE_URL}/alerts`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch alerts");

  const data = await res.json();

  return data.alerts.map((a: any) => ({
    id: a._id,
    type: a.type,
    severity: a.severity,
    title: a.title,
    message: a.message,
    productName: a.product?.name || "",
    productId: a.product?._id || "",
    read: a.read,
    createdAt: a.createdAt,
  }));
},

  async getUnreadAlertCount(): Promise<number> {
  const res = await fetch(`${BASE_URL}/alerts`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch alerts");
  }

  const data = await res.json();

  return data.unreadCount;
},

  // Product Performance
async getProductPerformance(): Promise<ProductPerformance[]> {
  const res = await fetch(`${BASE_URL}/analytics/product-performance`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  return data.map((p: any) => {
    const profitMargin =
      p.price > 0 ? ((p.price - p.cost) / p.price) * 100 : 0;

    const salesVelocity = p.totalUnitsSold / 7;

    const inventoryTurnover =
      p.stock > 0 ? (p.totalUnitsSold / p.stock) * 4.3 : 0;

    const daysOfSupply =
      salesVelocity > 0 ? Math.round(p.stock / salesVelocity) : 999;

    return {
      id: p._id,
      name: p.productName,
      sku: p.sku,
      category: p.category,
      price: p.price,
      cost: p.cost,
      stock: p.stock,
      profitMargin: +profitMargin.toFixed(1),
      salesVelocity: +salesVelocity.toFixed(1),
      inventoryTurnover: +inventoryTurnover.toFixed(1),
      totalUnitsSold: p.totalUnitsSold,
      totalRevenue: p.totalRevenue,
      daysOfSupply,
    };
  });
},

  // Demand Forecasting
 async getForecast(): Promise<ForecastEntry[]> {
  const res = await fetch(`${BASE_URL}/forecast`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch forecast");

  const data = await res.json();

  // ⭐ TRANSFORM BACKEND STRUCTURE
  const flattened: ForecastEntry[] = [];

  data.forEach((f: any) => {
    f.predictions.forEach((p: any) => {
      flattened.push({
        date: p.date,
        productName: f.productName,
        productId: f.product?._id || f.product,
        predictedDemand: p.predictedQuantity,
        confidence: Math.round(f.confidence * 100),
      });
    });
  });

  return flattened;
},
async generateForecast() {
  const res = await fetch(`${BASE_URL}/forecast/generate`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const d = await res.json();
    throw new Error(d.message || "Forecast generation failed");
  }

  return res.json();
},

  // Advanced Analytics
  async getAdvancedAnalytics(): Promise<AdvancedAnalytics> {
    await delay(300);
    return computeAdvancedAnalytics();
  },

  // AI Insights (dynamic)
  async getAIInsights() {
    await delay(400);
    return generateAIInsights();
  },

async getReorderRecommendations(): Promise<ReorderRecommendation[]> {
  const res = await fetch(`${BASE_URL}/reorder`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) throw new Error("Failed to load reorder data");

  return res.json();
},
  // Price Optimization
  // async getPriceSuggestions(): Promise<PriceSuggestion[]> {
  //   await delay(300);
  //   const perf = computePerformance();
  //   const suggestions: PriceSuggestion[] = [];

  //   perf.forEach(p => {
  //     if (p.salesVelocity < 0.5 && p.stock > 10) {
  //       const discount = Math.round(5 + Math.random() * 10);
  //       const expectedSalesLift = Math.round(discount * 2.2 + Math.random() * 5);
  //       suggestions.push({
  //         productId: p.id, productName: p.name, category: p.category,
  //         currentPrice: p.price, suggestedPrice: +(p.price * (1 - discount / 100)).toFixed(2),
  //         changePercent: discount, action: "decrease",
  //         expectedImpact: `Sales expected to increase by +${expectedSalesLift}%`,
  //         reason: `Slow-moving item (${p.salesVelocity} units/day) with ${p.stock} units in stock. Price reduction will accelerate turnover.`,
  //       });
  //     } else if (p.salesVelocity > 1.5 && p.profitMargin < 40) {
  //       const increase = Math.round(3 + Math.random() * 8);
  //       suggestions.push({
  //         productId: p.id, productName: p.name, category: p.category,
  //         currentPrice: p.price, suggestedPrice: +(p.price * (1 + increase / 100)).toFixed(2),
  //         changePercent: increase, action: "increase",
  //         expectedImpact: `Revenue per unit increases by $${(p.price * increase / 100).toFixed(2)} with minimal demand drop`,
  //         reason: `High-demand item (${p.salesVelocity} units/day) with room for margin improvement (current: ${p.profitMargin}%).`,
  //       });
  //     }
  //   });
  //   return suggestions;
  // },
  async getPriceSuggestions(): Promise<PriceSuggestion[]> {
  const res = await fetch(`${BASE_URL}/pricing`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) throw new Error("Failed to fetch suggestions");

  return res.json();
},
async applyPrice(productId: string, price: number) {
  const res = await fetch(`${BASE_URL}/pricing/apply`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({
      productId,
      newPrice: price
    })
  });

  if (!res.ok) throw new Error("Failed to update price");

  return res.json();
},
  async placeReorder(productId: string, quantity: number) {
  const res = await fetch(`${BASE_URL}/reorder/place`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({
      productId,
      quantity
    })
  });

  if (!res.ok) {
    throw new Error("Failed to place reorder");
  }

  return res.json();
},

  // Buying Patterns
  async getBuyingPatterns(): Promise<BuyingPattern[]> {
  const res = await fetch(`${BASE_URL}/buying-patterns`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) throw new Error("Failed to load patterns");

  return res.json();
},
async applySeasonalOptimization(productId: string) {
  const res = await fetch(`${BASE_URL}/seasonal/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ productId })
  });

  if (!res.ok) {
    throw new Error("Failed to apply optimization");
  }

  return res.json();
},

  // Seasonal Trends
  async getSeasonalTrends(): Promise<SeasonalTrend[]> {
  await delay(350);

  const trends = [
    {
      productName: "Sparkling Water 6-pack",
      patternType: "weekly",
      description: "Higher weekend demand",
      peakPeriod: "Saturday",
      upliftPercent: 45,
      data: [
        { label: "Mon", value: 20 },
        { label: "Tue", value: 18 },
        { label: "Wed", value: 22 },
        { label: "Thu", value: 25 },
        { label: "Fri", value: 30 },
        { label: "Sat", value: 42 },
        { label: "Sun", value: 38 }
      ]
    },
    {
      productName: "Organic Milk",
      patternType: "weekly",
      description: "Consistent weekday purchases",
      peakPeriod: "Monday",
      upliftPercent: 20,
      data: [
        { label: "Mon", value: 40 },
        { label: "Tue", value: 35 },
        { label: "Wed", value: 32 },
        { label: "Thu", value: 30 },
        { label: "Fri", value: 28 },
        { label: "Sat", value: 22 },
        { label: "Sun", value: 18 }
      ]
    }
  ];

  return trends.map(t => {
    const product = products.find(p => p.name === t.productName);

    return {
      ...t,
      productId: product?.id || ""
    };
  });
}
};
