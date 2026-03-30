import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, type SeasonalTrend } from "@/services/api";
import { Sun, Calendar, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
// import { api } from "@/services/api";

const COLORS = [
  "hsl(220, 70%, 50%)",
  "hsl(35, 95%, 55%)",
  "hsl(150, 60%, 40%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 72%, 55%)",
  "hsl(190, 70%, 45%)",
  "hsl(60, 80%, 45%)",
];

export default function SeasonalTrends() {
  const [trends, setTrends] = useState<SeasonalTrend[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // const load = () => {
  //   setLoading(true);
  //   api.getSeasonalTrends().then(setTrends).finally(() => setLoading(false));
  // };
  // const load = () => {
  // setLoading(true);

  // api.getSeasonalTrends().then(setTrends);
  const load = () => {
    setLoading(true);

    api
      .getSeasonalTrends()
      .then(setTrends)
      .finally(() => setLoading(false));
  };


  useEffect(() => { load(); }, []);
  const handleApplyOptimization = async (productId: string) => {
    try {
      await api.applySeasonalOptimization(productId);

      alert("✅ Optimization applied successfully");

      load(); // refresh trends
    } catch (err) {
      console.error(err);
      alert("❌ Failed to apply optimization");
    }
  };

  const typeIcon = (t: string) => {
    switch (t) {
      case "weekly": return <Calendar className="w-4 h-4" />;
      case "monthly": return <TrendingUp className="w-4 h-4" />;
      case "seasonal": return <Sun className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const typeBadge = (t: string) => {
    switch (t) {
      case "weekly": return "bg-primary/10 text-primary";
      case "monthly": return "bg-accent/10 text-accent-foreground";
      case "seasonal": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Seasonal Trend Detection</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-detected weekly, monthly & seasonal demand patterns</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trends.map((t, idx) => (
            <Card key={idx} className="glass-card-elevated">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{t.productName}</CardTitle>
                  <Badge className={typeBadge(t.patternType)}>
                    {typeIcon(t.patternType)}
                    <span className="ml-1 capitalize">{t.patternType}</span>
                  </Badge>
                </div>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={t.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {t.data.map((_, i) => (
                          <Cell key={i} fill={COLORS[idx % COLORS.length]} opacity={0.7 + (i / t.data.length) * 0.3} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
                  {/* ✅ ADMIN ONLY CONTROL
                  {user.role === "admin" && (
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => console.log("Apply seasonal optimization")}
                    >
                      Apply Optimization
                    </Button>
                  )} */}
                  {user.role === "admin" && (
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleApplyOptimization(t.productId)}
                    >
                      Apply Optimization
                    </Button>
                  )}
                  <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">Peak:</span> {t.peakPeriod} &bull; <span className="font-semibold">Avg uplift:</span> +{t.upliftPercent}%
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
