
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { WalletProvider } from "@/hooks/use-wallet";
import Layout from "./components/layout/Layout";
import NodeConfigPage from "./pages/NodeConfigPage";

// Import all the page components that were missing
import Wallet from "./pages/Wallet";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TokenCreation from "./pages/TokenCreation";
import TokenInfo from "./pages/TokenInfo";
import Marketplace from "./pages/Marketplace";
import AdminPanel from "./pages/AdminPanel";
import TokenPriceConfig from "./pages/TokenPriceConfig";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import WhatsAppConfig from "./pages/WhatsAppConfig";
import WalletRecoveryGuide from "./pages/guides/WalletRecoveryGuide";
import WalletConfigGuide from "./pages/guides/WalletConfigGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <WalletProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/wallet" element={<Layout><Wallet /></Layout>} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/signup" element={<Layout><Signup /></Layout>} />
                <Route path="/token-creation" element={<Layout><TokenCreation /></Layout>} />
                <Route path="/token/:address" element={<Layout><TokenInfo /></Layout>} />
                <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
                <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
                <Route path="/token-price-config" element={<Layout><TokenPriceConfig /></Layout>} />
                <Route path="/change-password" element={<Layout><ChangePassword /></Layout>} />
                <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
                <Route path="/whatsapp-config" element={<Layout><WhatsAppConfig /></Layout>} />
                <Route path="/wallet-recovery-guide" element={<Layout><WalletRecoveryGuide /></Layout>} />
                <Route path="/wallet-config-guide" element={<Layout><WalletConfigGuide /></Layout>} />
                <Route path="/node-config" element={<Layout><NodeConfigPage /></Layout>} />
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
