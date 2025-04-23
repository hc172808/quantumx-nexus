
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Coins } from "lucide-react";
import { getCreatedTokens, TokenData } from "@/lib/wallet/wallet-storage";
import { Card, CardContent } from "@/components/ui/card";

interface Token extends TokenData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  totalSupply: string;
  marketCap: number;
  logo?: string;
}

const Index = () => {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    // Load tokens from storage
    const createdTokens = getCreatedTokens() as unknown as Token[];
    const storedTokenMetrics = localStorage.getItem('tokenMetrics');
    
    if (storedTokenMetrics) {
      try {
        const tokenMetrics = JSON.parse(storedTokenMetrics);
        setTokens([...createdTokens, ...tokenMetrics]);
      } catch (error) {
        console.error("Error parsing token metrics:", error);
        setTokens(createdTokens);
      }
    } else {
      setTokens(createdTokens);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gradient-quantum">Quantum-Protected</span> Blockchain Ecosystem
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                The world's first blockchain platform with post-quantum cryptographic protection.
                Create, trade, and securely store digital assets with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/wallet">
                  <Button size="lg" className="bg-quantum hover:bg-quantum-dark text-white">
                    <Shield className="mr-2 h-5 w-5" /> Create Wallet
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button size="lg" variant="outline">
                    Explore Marketplace
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-quantum to-blockchain-primary rounded-2xl quantum-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tokens Section */}
      {tokens.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Featured Tokens</h2>
              <Link to="/marketplace">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tokens.slice(0, 8).map((token) => (
                <Link to={`/token/${token.id}`} key={token.id}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-quantum/20 flex items-center justify-center mr-3">
                          {token.logo ? (
                            <img src={token.logo} alt={token.name} className="w-8 h-8 rounded-full" />
                          ) : (
                            <Coins className="h-5 w-5 text-quantum" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{token.name}</h3>
                          <p className="text-sm text-muted-foreground">{token.symbol}</p>
                        </div>
                      </div>
                      
                      <div className="w-full h-[1px] bg-border my-2"></div>
                      
                      <div>
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          <p className="text-muted-foreground">Price:</p>
                          <p className="text-right font-medium">${token.price?.toFixed(4) || "0.0000"}</p>
                          
                          <p className="text-muted-foreground">Market Cap:</p>
                          <p className="text-right font-medium">${token.marketCap?.toLocaleString() || "0"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 mb-4 rounded-full bg-quantum/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-quantum" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quantum Protection</h3>
              <p className="text-muted-foreground">
                Future-proof your assets with post-quantum cryptography, ensuring security against quantum computing threats.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 mb-4 rounded-full bg-quantum/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-quantum" />
              </div>
              <h3 className="text-xl font-bold mb-2">Token Creation</h3>
              <p className="text-muted-foreground">
                Create your own tokens with customizable properties and advanced security features.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 mb-4 rounded-full bg-quantum/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-quantum" />
              </div>
              <h3 className="text-xl font-bold mb-2">Private Marketplace</h3>
              <p className="text-muted-foreground">
                Trade tokens in a secure, private marketplace with advanced verification for high-value assets.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our quantum-safe blockchain ecosystem today and experience the next generation of digital asset security.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-quantum hover:bg-quantum-dark text-white">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
