import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, type PriceSuggestion } from "@/services/api";
import { ArrowDown, ArrowUp, DollarSign, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PriceOptimization() {
  const [suggestions, setSuggestions] = useState<PriceSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const load = () => {
    setLoading(true);
    api.getPriceSuggestions().then(setSuggestions).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const handleApply = async (s: PriceSuggestion) => {
    try {
      await api.applyPrice(s.productId, s.suggestedPrice);

      alert("✅ Price updated successfully");
      load(); // refresh list
    } catch (err) {
      alert("❌ Failed to apply price");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Price Optimization AI</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-driven pricing suggestions to maximize revenue and clear slow inventory</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((s) => {
            const isDecrease = s.action === "decrease";
            return (
              <Card key={s.productId} className="glass-card-elevated">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{s.productName}</CardTitle>
                    <Badge variant={isDecrease ? "destructive" : "default"} className={!isDecrease ? "bg-success text-success-foreground" : ""}>
                      {isDecrease ? <ArrowDown className="w-3 h-3 mr-1" /> : <ArrowUp className="w-3 h-3 mr-1" />}
                      {s.changePercent}%
                    </Badge>
                  </div>
                  <CardDescription>{s.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="text-lg font-semibold text-foreground">${s.currentPrice.toFixed(2)}</p>
                    </div>
                    <ArrowDown className={`w-5 h-5 ${isDecrease ? "text-destructive" : "text-success rotate-180"}`} />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Suggested</p>
                      <p className="text-lg font-bold text-primary">${s.suggestedPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-accent-foreground" />
                      <span className="text-xs font-semibold text-accent-foreground">Expected Impact</span>
                    </div>
                    <p className="text-sm text-foreground">{s.expectedImpact}</p>
                  </div>

                  <p className="text-xs text-muted-foreground">{s.reason}</p>

                  {/* <Button size="sm" variant="outline" className="w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Apply Suggestion
                  </Button> */}
                  {/* <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleApply(s)}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Apply Suggestion
                  </Button> */}
                  {user.role === "admin" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleApply(s)}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Apply Suggestion
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
