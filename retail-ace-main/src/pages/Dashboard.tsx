import { useEffect, useState } from "react";
import { api, type DailySales, type Product } from "@/services/api";
import {
  Package,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface Stats {
  totalProducts: number;
  lowStockCount: number;
  lowStockItems: Product[];
  totalRevenue: number;
  totalOrders: number;
  inventoryValue: number;
  avgOrderValue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [salesData, setSalesData] = useState<DailySales[]>([]);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
    api.getDailySales().then(setSalesData);
  }, []);

  if (!stats) return <DashboardSkeleton />;

  const statCards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, change: "+12.5%", icon: DollarSign, accent: "text-primary" },
    { label: "Total Orders", value: stats.totalOrders.toString(), change: "+8.2%", icon: ShoppingCart, accent: "text-chart-3" },
    { label: "Products", value: stats.totalProducts.toString(), change: "", icon: Package, accent: "text-chart-2" },
    { label: "Low Stock Alerts", value: stats.lowStockCount.toString(), change: "", icon: AlertTriangle, accent: "text-destructive" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your retail performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{card.value}</p>
                {card.change && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <ArrowUpRight className="w-3 h-3 text-success" />
                    <span className="text-xs font-medium text-success">{card.change}</span>
                    <span className="text-xs text-muted-foreground">vs last week</span>
                  </div>
                )}
              </div>
              <div className={`p-2.5 rounded-lg bg-muted ${card.accent}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card-elevated p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Revenue Trend</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" /> Last 7 days
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(220 70% 50%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(220 70% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)", fontSize: "13px" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(220 70% 50%)" fill="url(#revenueGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card-elevated p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Orders by Day</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(220 10% 50%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220 10% 50%)" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)", fontSize: "13px" }} />
              <Bar dataKey="orders" fill="hsl(35 95% 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats.lowStockItems.length > 0 && (
        <div className="glass-card-elevated p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-semibold text-foreground">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {stats.lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sku} · {item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-destructive">{item.stock} left</p>
                  <p className="text-xs text-muted-foreground">Min: {item.minStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="h-80 bg-muted rounded-lg" />
    </div>
  );
}
