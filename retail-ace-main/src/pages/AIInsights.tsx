import { useEffect, useState } from "react";
import { api } from "@/services/api";
import {
  Sparkles,
  TrendingUp,
  Package,
  ShoppingCart,
  Lightbulb,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryIcons: Record<string, typeof TrendingUp> = {
  "Stock Alert": Package,
  "Sales Insight": ShoppingCart,
  "Inventory": Package,
  "Pricing": Lightbulb,
  "Demand Forecasting": TrendingUp,
  "Status": Sparkles,
};

const impactColor: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive",
  High: "bg-warning/10 text-warning",
  Medium: "bg-primary/10 text-primary",
  Low: "bg-muted text-muted-foreground",
};

interface Insight {
  title: string;
  description: string;
  impact: string;
  category: string;
}

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getAIInsights().then(data => {
      setInsights(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);
//   useEffect(() => {
//   load();

//   const interval = setInterval(() => {
//     load(); // refresh every 30 sec
//   }, 30000);

//   return () => clearInterval(interval);
// }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Smart recommendations from your live data</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card-elevated p-5 h-24 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, i) => {
            const Icon = categoryIcons[insight.category] || Sparkles;
            return (
              <div key={i} className="glass-card-elevated p-5 flex gap-4">
                <div className="mt-0.5 p-2.5 rounded-lg bg-muted shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${impactColor[insight.impact] || impactColor.Low}`}>
                      {insight.impact}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {insight.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                  <Button variant="link" className="h-auto p-0 mt-2 text-primary text-xs gap-1">
                    Take action <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
