
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Branding */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-7 w-7 text-quantum" />
              <span className="text-xl font-bold">
                <span className="text-gradient-quantum">Quantum</span>Vault
              </span>
            </div>
            <p className="text-muted-foreground">
              Secure blockchain ecosystem with quantum-safe encryption for the future of digital assets.
            </p>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} QuantumVault. All rights reserved.
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/wallet" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wallet
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/token-creation" className="text-muted-foreground hover:text-foreground transition-colors">
                  Token Creation
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-muted-foreground hover:text-foreground transition-colors">
                  Quantum Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/blockchain-info" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blockchain Info
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-muted-foreground hover:text-foreground transition-colors">
                  Compliance
                </Link>
              </li>
              <li>
                <Link to="/security-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Security Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Secured with quantum-safe encryption technology
          </p>
          <div className="mt-4 md:mt-0">
            <button className="quantum-glow bg-quantum text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center">
              <Shield className="h-4 w-4 mr-2" /> Quantum Protected
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
