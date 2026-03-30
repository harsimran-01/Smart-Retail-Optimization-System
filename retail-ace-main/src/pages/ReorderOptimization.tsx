import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, type ReorderRecommendation } from "@/services/api";
import { Package, TrendingUp, ShieldCheck, Truck, ArrowRight, RefreshCw } from "lucide-react";

export default function ReorderOptimization() {
  const [recommendations, setRecommendations] = useState<ReorderRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getReorderRecommendations().then(setRecommendations).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const handleReorder = async (r: ReorderRecommendation) => {
    try {
      await api.placeReorder(r.productId, r.recommendedQty);

      alert("✅ Reorder placed successfully");

      load(); // refresh recommendations
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place reorder");
    }
  };

  const urgencyColor = (u: string) => {
    switch (u) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-warning text-warning-foreground";
      case "medium": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reorder Optimization</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-calculated optimal reorder quantities based on demand, lead time & safety stock</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-52 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((r) => (
            <Card key={r.productId} className="glass-card-elevated overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{r.productName}</CardTitle>
                  <Badge className={urgencyColor(r.urgency)}>{r.urgency}</Badge>
                </div>
                <CardDescription>{r.sku}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Recommended Order</span>
                  </div>
                  <p className="text-3xl font-bold text-primary">{r.recommendedQty} <span className="text-sm font-normal text-muted-foreground">units</span></p>
                </div>

                <p className="text-sm text-muted-foreground">{r.reason}</p>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="space-y-1">
                    <TrendingUp className="w-4 h-4 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Forecast</p>
                    <p className="text-sm font-semibold text-foreground">{r.forecastDemand}/wk</p>
                  </div>
                  <div className="space-y-1">
                    <Truck className="w-4 h-4 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Lead Time</p>
                    <p className="text-sm font-semibold text-foreground">{r.leadTimeDays}d</p>
                  </div>
                  <div className="space-y-1">
                    <ShieldCheck className="w-4 h-4 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Safety Stock</p>
                    <p className="text-sm font-semibold text-foreground">{r.safetyStock}</p>
                  </div>
                </div>

                {/* <Button size="sm" className="w-full gradient-primary">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Place Reorder
                </Button> */}
                <Button
                  size="sm"
                  className="w-full gradient-primary"
                  onClick={() => handleReorder(r)}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Place Reorder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
