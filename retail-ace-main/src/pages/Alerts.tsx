import { useEffect, useState } from "react";
import { api, type SmartAlert } from "@/services/api";
import {
  AlertTriangle,
  PackageX,
  TrendingDown,
  TrendingUp,
  Archive,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const typeConfig: Record<SmartAlert["type"], { icon: typeof AlertTriangle; label: string; color: string }> = {
  low_stock: { icon: AlertTriangle, label: "Low Stock", color: "text-destructive" },
  overstock: { icon: Archive, label: "Overstock", color: "text-warning" },
  slow_moving: { icon: TrendingDown, label: "Slow Moving", color: "text-muted-foreground" },
  demand_spike: { icon: TrendingUp, label: "Demand Spike", color: "text-chart-3" },
};

const severityBadge: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-warning/10 text-warning",
  medium: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    api.getAlerts().then(setAlerts);
  }, []);

  const filtered = filter === "all" ? alerts : alerts.filter(a => a.type === filter);

  const counts = {
    all: alerts.length,
    low_stock: alerts.filter(a => a.type === "low_stock").length,
    overstock: alerts.filter(a => a.type === "overstock").length,
    slow_moving: alerts.filter(a => a.type === "slow_moving").length,
    demand_spike: alerts.filter(a => a.type === "demand_spike").length,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Smart Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Auto-generated alerts based on inventory and sales analysis
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "low_stock", "overstock", "slow_moving", "demand_spike"] as const).map(key => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key)}
            className="gap-1.5"
          >
            {key === "all" ? "All" : typeConfig[key as SmartAlert["type"]].label}
            <span className="text-xs opacity-70">({counts[key]})</span>
          </Button>
        ))}
      </div>

      {/* Alert List */}
      {filtered.length === 0 ? (
        <div className="glass-card-elevated p-10 text-center">
          <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No alerts in this category</p>
          <p className="text-xs text-muted-foreground mt-1">Everything looks good!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => {
            const config = typeConfig[alert.type];
            const Icon = config.icon;
            return (
              <div key={alert.id} className="glass-card-elevated p-4 flex gap-4">
                <div className={`mt-0.5 p-2.5 rounded-lg bg-muted shrink-0 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">{alert.title}</h3>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${severityBadge[alert.severity]}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
