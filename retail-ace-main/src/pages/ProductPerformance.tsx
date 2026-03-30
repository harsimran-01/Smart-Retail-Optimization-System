import { useEffect, useState } from "react";
import { api, type ProductPerformance as PerfData } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Gauge, RotateCw } from "lucide-react";

export default function ProductPerformance() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

if (user.role !== "admin") {
  return (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Admin Access Required</h2>
      <p className="text-muted-foreground mt-2">
        Product Performance is available only for administrators.
      </p>
    </div>
  </div>
);
}
  const [data, setData] = useState<PerfData[]>([]);

  useEffect(() => {
    api.getProductPerformance().then(setData);
  }, []);

  const sorted = [...data].sort((a, b) => b.totalRevenue - a.totalRevenue);

  const marginChart = sorted.map(p => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    margin: p.profitMargin,
    velocity: p.salesVelocity,
    turnover: p.inventoryTurnover,
  }));

  const summaryCards = [
    {
      label: "Avg Profit Margin",
      value: data.length ? (data.reduce((s, p) => s + p.profitMargin, 0) / data.length).toFixed(1) + "%" : "—",
      icon: TrendingUp,
      accent: "text-chart-3",
    },
    {
      label: "Avg Sales Velocity",
      value: data.length ? (data.reduce((s, p) => s + p.salesVelocity, 0) / data.length).toFixed(1) + " /day" : "—",
      icon: Gauge,
      accent: "text-primary",
    },
    {
      label: "Avg Inventory Turnover",
      value: data.length ? (data.reduce((s, p) => s + p.inventoryTurnover, 0) / data.length).toFixed(1) + "x /mo" : "—",
      icon: RotateCw,
      accent: "text-accent",
    },
  ];

  const supplyStatus = (days: number) => {
    if (days <= 3) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Critical</span>;
    if (days <= 7) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">Low</span>;
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">Healthy</span>;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Product Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">Profit margins, sales velocity & inventory turnover</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{card.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg bg-muted ${card.accent}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Margin Chart */}
      <div className="glass-card-elevated p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Profit Margin by Product</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={marginChart} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" unit="%" />
            <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} stroke="hsl(220 10% 50%)" />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220 15% 90%)" }} formatter={(v: number) => `${v}%`} />
            <Bar dataKey="margin" fill="hsl(150 60% 40%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail Table */}
      <div className="glass-card-elevated">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Detailed Metrics</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Units Sold</TableHead>
              <TableHead className="text-right">Margin</TableHead>
              <TableHead className="text-right">Velocity</TableHead>
              <TableHead className="text-right">Turnover</TableHead>
              <TableHead className="text-right">Days Supply</TableHead>
              <TableHead>Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sku}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">${p.totalRevenue.toFixed(2)}</TableCell>
                <TableCell className="text-right">{p.totalUnitsSold}</TableCell>
                <TableCell className="text-right">{p.profitMargin}%</TableCell>
                <TableCell className="text-right">{p.salesVelocity}/day</TableCell>
                <TableCell className="text-right">{p.inventoryTurnover}x</TableCell>
                <TableCell className="text-right">{p.daysOfSupply > 100 ? "99+" : p.daysOfSupply}</TableCell>
                <TableCell>{supplyStatus(p.daysOfSupply)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
