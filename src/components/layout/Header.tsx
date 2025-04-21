
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Shield } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-quantum" />
          <span className="text-2xl font-bold text-foreground">
            <span className="text-gradient-quantum">Quantum</span>Vault
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-primary transition duration-200">
            Home
          </Link>
          <Link to="/wallet" className="text-foreground hover:text-primary transition duration-200">
            Wallet
          </Link>
          <Link to="/marketplace" className="text-foreground hover:text-primary transition duration-200">
            Marketplace
          </Link>
          <Link to="/token-creation" className="text-foreground hover:text-primary transition duration-200">
            Create Token
          </Link>
          {isAuthenticated && user?.isAdmin && (
            <Link to="/admin" className="text-foreground hover:text-primary transition duration-200">
              Admin
            </Link>
          )}
        </nav>

        {/* Auth buttons and theme toggle */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-quantum hover:bg-quantum-dark text-white">Sign Up</Button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <Button className="bg-quantum hover:bg-quantum-dark text-white">Dashboard</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full p-4 bg-background/95 backdrop-blur-lg shadow-lg md:hidden border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-muted transition"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/wallet"
                className="text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-muted transition"
                onClick={() => setIsOpen(false)}
              >
                Wallet
              </Link>
              <Link
                to="/marketplace"
                className="text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-muted transition"
                onClick={() => setIsOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/token-creation"
                className="text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-muted transition"
                onClick={() => setIsOpen(false)}
              >
                Create Token
              </Link>
              {isAuthenticated && user?.isAdmin && (
                <Link
                  to="/admin"
                  className="text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-muted transition"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {!isAuthenticated ? (
                  <div className="space-x-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="bg-quantum hover:bg-quantum-dark text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="bg-quantum hover:bg-quantum-dark text-white">
                      Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
