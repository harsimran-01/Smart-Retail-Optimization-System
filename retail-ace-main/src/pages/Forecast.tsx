import { useEffect, useState, useMemo } from "react";
import { api, type ForecastEntry } from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar, TrendingUp } from "lucide-react";

const COLORS = [
  "hsl(220 70% 50%)", "hsl(35 95% 55%)", "hsl(150 60% 40%)",
  "hsl(280 60% 55%)", "hsl(0 72% 55%)", "hsl(180 60% 45%)",
  "hsl(320 70% 50%)", "hsl(60 90% 45%)",
];

export default function Forecast() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ⭐ ROLE CHECK
  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Admin Access Required</h2>
          <p className="text-muted-foreground mt-2">
            Demand forecasting is available only for administrators.
          </p>
        </div>
      </div>
    );
  }

  const [forecasts, setForecasts] = useState<ForecastEntry[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("all");

  useEffect(() => {
    const loadForecast = async () => {
      try {
        // ✅ STEP 1 — generate fresh forecast in backend
        await api.generateForecast();

        // ✅ STEP 2 — fetch generated forecasts
        const data = await api.getForecast();
        setForecasts(data);
      } catch (err) {
        console.error("Forecast load error:", err);
      }
    };

    loadForecast();
  }, []);

  const productNames = useMemo(() => {
    const names = new Set(forecasts.map(f => f.productName));
    return Array.from(names);
  }, [forecasts]);

  // Aggregated daily totals
  const dailyTotals = useMemo(() => {
    const byDate: Record<string, number> = {};
    const data = selectedProduct === "all" ? forecasts : forecasts.filter(f => f.productName === selectedProduct);
    data.forEach(f => {
      byDate[f.date] = (byDate[f.date] || 0) + f.predictedDemand;
    });
    return Object.entries(byDate)
      .map(([date, demand]) => ({ date: date.slice(5), demand }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [forecasts, selectedProduct]);

  // Per-product summary (total predicted)
  const productSummary = useMemo(() => {
    const byProduct: Record<string, { demand: number; avgConf: number; count: number }> = {};
    forecasts.forEach(f => {
      if (!byProduct[f.productName]) byProduct[f.productName] = { demand: 0, avgConf: 0, count: 0 };
      byProduct[f.productName].demand += f.predictedDemand;
      byProduct[f.productName].avgConf += +f.confidence;
      byProduct[f.productName].count += 1;
    });
    return Object.entries(byProduct)
      .map(([name, d]) => ({
        name: name.split(" ").slice(0, 2).join(" "),
        fullName: name,
        demand: d.demand,
        confidence: Math.round(d.avgConf / d.count),
      }))
      .sort((a, b) => b.demand - a.demand);
  }, [forecasts]);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demand Forecast</h1>
          <p className="text-sm text-muted-foreground mt-1">7-day predicted demand based on sales history</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Next 7 Days</span>
        </div>
      </div>

      {/* Filter */}
      <div className="max-w-xs">
        <Label className="text-xs text-muted-foreground">Filter by Product</Label>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {productNames.map(name => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Demand Trend */}
        <div className="lg:col-span-2 glass-card-elevated p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Predicted Daily Demand {selectedProduct !== "all" ? `— ${selectedProduct}` : ""}
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTotals}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)" }} />
              <Line type="monotone" dataKey="demand" stroke="hsl(220 70% 50%)" strokeWidth={2} dot={{ fill: "hsl(220 70% 50%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Summary */}
        <div className="glass-card-elevated p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">7-Day Demand by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productSummary} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(220 10% 50%)" />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} stroke="hsl(220 10% 50%)" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)" }} />
              <Bar dataKey="demand" fill="hsl(35 95% 55%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confidence Table */}
      <div className="glass-card-elevated p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Forecast Confidence</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {productSummary.map((p, i) => (
            <div key={p.fullName} className="p-3 rounded-lg border border-border bg-muted/30">
              <p className="text-xs text-muted-foreground truncate">{p.fullName}</p>
              <p className="text-lg font-bold text-foreground mt-1">{p.demand} units</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.confidence}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{p.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
