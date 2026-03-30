import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Store,
  Bell,
  BarChart3,
  Activity,
  RefreshCw,
  DollarSign,
  ShoppingBasket,
  Sun,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Sales", url: "/sales", icon: ShoppingCart },
];

const analyticsNav = [
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
  { title: "Product Performance", url: "/performance", icon: Activity },
  { title: "Demand Forecast", url: "/forecast", icon: BarChart3 },
];

const insightsNav = [
  { title: "AI Insights", url: "/ai-insights", icon: Sparkles },
  { title: "Smart Alerts", url: "/alerts", icon: Bell },
];

const aiNav = [
  { title: "Reorder Optimization", url: "/reorder", icon: RefreshCw },
  { title: "Price Optimization", url: "/pricing", icon: DollarSign },
  { title: "Buying Patterns", url: "/patterns", icon: ShoppingBasket },
  { title: "Seasonal Trends", url: "/trends", icon: Sun },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">RetailPulse</h2>
            <p className="text-xs text-sidebar-muted">AI-Powered Retail</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <NavGroup label="Core" items={mainNav} />
        <NavGroup label="Analytics" items={analyticsNav} />
        <NavGroup label="Intelligence" items={insightsNav} />
        <NavGroup label="AI Engine" items={aiNav} />
      </SidebarContent>
    </Sidebar>
  );
}

function NavGroup({ label, items }: { label: string; items: typeof mainNav }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-muted text-[11px] font-semibold uppercase tracking-wider px-5 mb-1">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="h-10 px-5">
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  <span className="text-sm">{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
