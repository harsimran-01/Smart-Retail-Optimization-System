import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Sales from "@/pages/Sales";
import Analytics from "@/pages/Analytics";
import AIInsights from "@/pages/AIInsights";
import Alerts from "@/pages/Alerts";
import ProductPerformance from "@/pages/ProductPerformance";
import Forecast from "@/pages/Forecast";
import ReorderOptimization from "@/pages/ReorderOptimization";
import PriceOptimization from "@/pages/PriceOptimization";
import BuyingPatterns from "@/pages/BuyingPatterns";
import SeasonalTrends from "@/pages/SeasonalTrends";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/performance" element={<ProductPerformance />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/reorder" element={<ReorderOptimization />} />
              <Route path="/pricing" element={<PriceOptimization />} />
              <Route path="/patterns" element={<BuyingPatterns />} />
              <Route path="/trends" element={<SeasonalTrends />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
