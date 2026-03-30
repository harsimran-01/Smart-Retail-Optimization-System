import { useEffect, useState } from "react";
import { api, type DailySales, type Product, type AdvancedAnalytics } from "@/services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from "recharts";
import { TrendingUp, Award, Layers, Heart } from "lucide-react";

const COLORS = [
  "hsl(220 70% 50%)", "hsl(35 95% 55%)", "hsl(150 60% 40%)",
  "hsl(280 60% 55%)", "hsl(0 72% 55%)", "hsl(180 60% 45%)",
];

export default function Analytics() {
  const [salesData, setSalesData] = useState<DailySales[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [advanced, setAdvanced] = useState<AdvancedAnalytics | null>(null);

  useEffect(() => {
    api.getDailySales().then(setSalesData);
    api.getProducts().then(setProducts);
    api.getAdvancedAnalytics().then(setAdvanced);
  }, []);

  // Category breakdown
  const categoryMap = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.stock * p.cost;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value: +value.toFixed(2) }));

  // Margin data
  const marginData = products.map(p => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    margin: +((p.price - p.cost) / p.price * 100).toFixed(1),
  })).sort((a, b) => b.margin - a.margin);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep dive into sales, categories & profitability</p>
      </div>

      {/* Inventory Health Summary */}
      {advanced && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Healthy Stock", value: advanced.inventoryHealth.healthyStock, icon: Heart, accent: "text-chart-3" },
            { label: "Warning", value: advanced.inventoryHealth.warningStock, icon: Layers, accent: "text-warning" },
            { label: "Critical", value: advanced.inventoryHealth.criticalStock, icon: TrendingUp, accent: "text-destructive" },
            { label: "Out of Stock", value: advanced.inventoryHealth.outOfStock, icon: Award, accent: "text-muted-foreground" },
          ].map(c => (
            <div key={c.label} className="stat-card">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{c.label}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
                <c.icon className={`w-5 h-5 ${c.accent}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <div className="glass-card-elevated p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Daily Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)" }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(220 70% 50%)" strokeWidth={2} dot={{ fill: "hsl(220 70% 50%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory by Category */}
        <div className="glass-card-elevated p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Inventory Value by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Trend */}
        {advanced && (
          <div className="glass-card-elevated p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Profit Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={advanced.profitTrend}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(150 60% 40%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(150 60% 40%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)" }} />
                <Area type="monotone" dataKey="profit" stroke="hsl(150 60% 40%)" fill="url(#profitGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Performance */}
        {advanced && (
          <div className="glass-card-elevated p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Category Performance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={advanced.categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="hsl(220 10% 50%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220 10% 50%)" />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)" }} />
                <Bar dataKey="totalRevenue" name="Revenue" fill="hsl(220 70% 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="hsl(150 60% 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Products */}
        {advanced && (
          <div className="glass-card-elevated p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">Top Products by Revenue</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={advanced.topProducts.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
                <YAxis dataKey="productName" type="category" width={130} tick={{ fontSize: 11 }} stroke="hsl(220 10% 50%)" />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)" }} />
                <Bar dataKey="totalRevenue" fill="hsl(35 95% 55%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Profit Margins */}
        <div className="glass-card-elevated p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Profit Margins by Product</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={marginData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" unit="%" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)" }} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="margin" fill="hsl(150 60% 40%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
