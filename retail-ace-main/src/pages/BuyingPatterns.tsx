import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, type BuyingPattern } from "@/services/api";
import { ShoppingBasket, ArrowRight, RefreshCw, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function BuyingPatterns() {
  const [patterns, setPatterns] = useState<BuyingPattern[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getBuyingPatterns().then(setPatterns).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const strengthColor = (s: number) => {
    if (s >= 70) return "text-success";
    if (s >= 50) return "text-primary";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Buying Patterns</h1>
          <p className="text-muted-foreground text-sm mt-1">Basket analysis & cross-sell opportunities powered by purchase data</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {patterns.map((p, idx) => (
            <Card key={idx} className="glass-card-elevated">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <ShoppingBasket className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{p.productA}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{p.productB}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[80px]">
                      <div className="flex items-center justify-center gap-1">
                        <Percent className="w-3 h-3 text-muted-foreground" />
                        <span className={`text-xl font-bold ${strengthColor(p.confidence)}`}>{p.confidence}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>

                    <div className="w-32 hidden md:block">
                      <Progress value={p.confidence} className="h-2" />
                    </div>

                    <div className="text-center min-w-[60px]">
                      <p className="text-sm font-semibold text-foreground">{p.occurrences}</p>
                      <p className="text-xs text-muted-foreground">Co-buys</p>
                    </div>

                    <Badge variant="outline" className="shrink-0">
                      {p.suggestion}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
