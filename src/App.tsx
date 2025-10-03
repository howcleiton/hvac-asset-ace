import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Equipment from "./pages/Equipment";
import EquipmentForm from "./pages/EquipmentForm";
import NotFound from "./pages/NotFound";
import { EquipmentProvider } from "./contexts/EquipmentContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EquipmentProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Equipment />} />
            <Route path="/cadastro" element={<EquipmentForm />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EquipmentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
