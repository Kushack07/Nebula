import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Journal from "./pages/Journal";
import Finance from "./pages/Finance";
import Habits from "./pages/Habits";
import Dashboard from "./pages/Dashboard";
import Identity from "./pages/Identity";
import Echo from "./pages/Echo";
import DataDAO from "./pages/DataDAO";
import Pulse from "./pages/Pulse";
import NotFound from "./pages/NotFound";
import WalletPage from "./pages/WalletPage";
import { Footer } from "./components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const queryClient = new QueryClient();


import { ErrorBoundary } from "@/components/debug/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wallet" element={<WalletPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/journal" element={<Journal />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/identity" element={<Identity />} />
            <Route path="/echo" element={<Echo />} />
            <Route path="/dao" element={<DataDAO />} />
            <Route path="/pulse" element={<Pulse />} />
            <Route path="/pulse" element={<Pulse />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <Link to="/wallet" className="fixed top-4 left-4 z-50">
            <Button variant="outline" size="icon" className="w-12 h-12 shadow-md bg-background/80 backdrop-blur-md">
              <Wallet className="w-8 h-8 text-primary" />
            </Button>
          </Link>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

