
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

// Import all the page components
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
import NodeConfig from "./pages/NodeConfig";
import DomainSettings from "./pages/DomainSettings";
import WalletDownload from "./pages/WalletDownload";
import MiningPoolConfig from "./pages/MiningPoolConfig";
import Documentation from "./pages/Documentation";

// Import new pages
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import SecurityPolicy from "./pages/legal/SecurityPolicy";
import CompliancePolicy from "./pages/legal/CompliancePolicy";
import ThemeEditor from "./pages/admin/ThemeEditor";
import GameSettings from "./pages/admin/GameSettings";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import SecuritySettings from "./pages/admin/SecuritySettings";

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
                <Route path="/node-configuration" element={<Layout><NodeConfig /></Layout>} />
                <Route path="/domain-settings" element={<Layout><DomainSettings /></Layout>} />
                <Route path="/wallet-download" element={<Layout><WalletDownload /></Layout>} />
                <Route path="/mining-pool-config" element={<Layout><MiningPoolConfig /></Layout>} />
                <Route path="/docs" element={<Layout><Documentation /></Layout>} />
                
                {/* New routes for legal pages and support */}
                <Route path="/support" element={<Layout><Support /></Layout>} />
                <Route path="/faq" element={<Layout><FAQ /></Layout>} />
                <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
                <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
                <Route path="/security-policy" element={<Layout><SecurityPolicy /></Layout>} />
                <Route path="/compliance" element={<Layout><CompliancePolicy /></Layout>} />
                
                {/* Admin tool pages */}
                <Route path="/admin/theme-editor" element={<Layout><ThemeEditor /></Layout>} />
                <Route path="/admin/game-settings" element={<Layout><GameSettings /></Layout>} />
                <Route path="/admin/analytics" element={<Layout><AnalyticsDashboard /></Layout>} />
                <Route path="/admin/security" element={<Layout><SecuritySettings /></Layout>} />
                
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
