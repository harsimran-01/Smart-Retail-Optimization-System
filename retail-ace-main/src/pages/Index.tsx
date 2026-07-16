import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BrainCircuit, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "Demand forecasting",
    description: "Predict sales patterns with clear, useful insights for smarter stock decisions.",
    icon: TrendingUp,
  },
  {
    title: "AI recommendations",
    description: "Surface buying patterns, pricing ideas, and reorder suggestions instantly.",
    icon: BrainCircuit,
  },
  {
    title: "Live retail visibility",
    description: "Monitor inventory, sales, and alerts from one elegant control center.",
    icon: BarChart3,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,88,220,0.14),_transparent_34%),linear-gradient(135deg,_hsl(var(--background))_0%,_hsl(220_20%_97%)_100%)]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary shadow-lg">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">RetailPulse</p>
            <p className="text-sm text-muted-foreground">AI-powered smart retail management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild className="gradient-primary">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-4 lg:px-8 lg:pt-8">
        <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Smarter retail decisions, faster
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                RetailPulse helps teams run retail operations with clarity.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Bring forecasting, inventory intelligence, sales monitoring, and AI-driven recommendations together in one polished workspace designed for modern retail brands.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gradient-primary">
                <Link to="/signup">
                  Start free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Explore dashboard</Link>
              </Button>
            </div>
          </div>

          <Card className="glass-card-elevated border-primary/10 bg-card/90 p-2">
            <CardContent className="space-y-4 p-5">
              <div className="rounded-2xl border border-border/70 bg-muted/70 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Live overview</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background/90 p-3">
                    <p className="text-sm text-muted-foreground">Revenue trend</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">+$24.8k</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/90 p-3">
                    <p className="text-sm text-muted-foreground">Stock health</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">94%</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
                <p className="text-sm font-semibold text-foreground">What you can expect</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• AI forecasts that adapt to real retail signals</li>
                  <li>• Quick alerts for stock, pricing, and sales shifts</li>
                  <li>• A calm, executive-friendly overview for every team</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="glass-card-elevated border-border/70 bg-card/80">
                <CardContent className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default Index;
