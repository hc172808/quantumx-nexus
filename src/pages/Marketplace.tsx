
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";

interface MarketToken {
  id: string;
  name: string;
  symbol: string;
  network: string;
  price: number;
  marketCap: number;
  logo: string;
  change24h: number;
  volume24h: number;
  quantumProtected: boolean;
  verified: boolean;
}

const Marketplace = () => {
  const [tokens, setTokens] = useState<MarketToken[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<MarketToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("marketCap");
  const navigate = useNavigate();
  const { isUnlocked } = useWallet();

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockTokens: MarketToken[] = [
          {
            id: "qv000000000000quantumtoken0000000000000",
            name: "NETZ",
            symbol: "NETZ",
            network: "Quantum Network",
            price: 1.25,
            marketCap: 9000000000 * 1.25,
            logo: "https://via.placeholder.com/64",
            change24h: 5.2,
            volume24h: 12500000,
            quantumProtected: true,
            verified: true,
          },
          {
            id: "qv000000000000quantumtoken0000000000001",
            name: "Quantum Token",
            symbol: "QTM",
            network: "Quantum Network",
            price: 0.125,
            marketCap: 1000000 * 0.125,
            logo: "https://via.placeholder.com/64",
            change24h: 2.8,
            volume24h: 350000,
            quantumProtected: true,
            verified: true,
          },
          {
            id: "qv000000000000quantumtoken0000000000002",
            name: "Quantum Gold",
            symbol: "QGOLD",
            network: "NETZ Mainnet",
            price: 18.75,
            marketCap: 100000 * 18.75,
            logo: "https://via.placeholder.com/64",
            change24h: -1.2,
            volume24h: 250000,
            quantumProtected: true,
            verified: true,
          },
          {
            id: "qv000000000000quantumtoken0000000000003",
            name: "Quantum Stable",
            symbol: "QUSD",
            network: "NETZ Mainnet",
            price: 1.0,
            marketCap: 5000000,
            logo: "https://via.placeholder.com/64",
            change24h: 0.01,
            volume24h: 1250000,
            quantumProtected: true,
            verified: true,
          },
          {
            id: "qv000000000000quantumtoken0000000000004",
            name: "NetZ Community",
            symbol: "NEC",
            network: "NETZ Mainnet",
            price: 0.015,
            marketCap: 10000000 * 0.015,
            logo: "https://via.placeholder.com/64",
            change24h: 15.4,
            volume24h: 75000,
            quantumProtected: true,
            verified: false,
          },
        ];
        
        setTokens(mockTokens);
        setFilteredTokens(mockTokens);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokens();
  }, []);

  // Filter tokens based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTokens(tokens);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = tokens.filter(token => 
      token.name.toLowerCase().includes(query) || 
      token.symbol.toLowerCase().includes(query)
    );
    
    setFilteredTokens(filtered);
  }, [searchQuery, tokens]);

  // Sort tokens
  useEffect(() => {
    const sorted = [...filteredTokens].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return b.price - a.price;
        case "change":
          return b.change24h - a.change24h;
        case "volume":
          return b.volume24h - a.volume24h;
        case "name":
          return a.name.localeCompare(b.name);
        case "marketCap":
        default:
          return b.marketCap - a.marketCap;
      }
    });
    
    setFilteredTokens(sorted);
  }, [sortBy]);

  const handleBuy = (token: MarketToken) => {
    if (!isUnlocked) {
      navigate("/wallet");
      return;
    }
    
    // Redirect to token page with buy tab active
    navigate(`/token/${token.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-muted-foreground">
          Buy, sell, and trade quantum-protected tokens
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search tokens by name or symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="change">24h Change</SelectItem>
              <SelectItem value="volume">24h Volume</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="all" className="flex-1">All Tokens</TabsTrigger>
          <TabsTrigger value="verified" className="flex-1">Verified</TabsTrigger>
          <TabsTrigger value="quantum" className="flex-1">Quantum-Protected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-pulse space-y-4 w-full">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="h-8 bg-muted rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : filteredTokens.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No tokens found matching your search.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium">#</th>
                        <th className="text-left p-4 font-medium">Token</th>
                        <th className="text-right p-4 font-medium">Price</th>
                        <th className="text-right p-4 font-medium hidden md:table-cell">24h Change</th>
                        <th className="text-right p-4 font-medium hidden md:table-cell">Market Cap</th>
                        <th className="text-right p-4 font-medium hidden lg:table-cell">Volume (24h)</th>
                        <th className="text-center p-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTokens.map((token, index) => (
                        <tr 
                          key={token.id} 
                          className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                          onClick={() => navigate(`/token/${token.id}`)}
                        >
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                                <img src={token.logo} alt={token.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="font-medium flex items-center">
                                  {token.name}
                                  <div className="ml-2 flex space-x-1">
                                    {token.verified && (
                                      <Badge variant="outline" className="text-xs">Verified</Badge>
                                    )}
                                    {token.quantumProtected && (
                                      <Badge 
                                        className="bg-quantum text-white text-xs flex items-center py-0 h-5"
                                      >
                                        <Shield className="mr-1 h-3 w-3" />
                                        Q
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground">{token.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right font-medium">${token.price.toFixed(4)}</td>
                          <td className={`p-4 text-right hidden md:table-cell ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                          </td>
                          <td className="p-4 text-right hidden md:table-cell">
                            ${token.marketCap.toLocaleString()}
                          </td>
                          <td className="p-4 text-right hidden lg:table-cell">
                            ${token.volume24h.toLocaleString()}
                          </td>
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              size="sm"
                              className="bg-quantum hover:bg-quantum-dark"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuy(token);
                              }}
                            >
                              Buy
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verified">
          <Card>
            <CardContent className="p-4">
              <div className="text-center py-8">
                {filteredTokens.filter(t => t.verified).length > 0 ? (
                  <table className="w-full">
                    {/* Same table structure as above but filtered for verified tokens */}
                  </table>
                ) : (
                  <p className="text-muted-foreground">No verified tokens found matching your search.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quantum">
          <Card>
            <CardContent className="p-4">
              <div className="text-center py-8">
                {filteredTokens.filter(t => t.quantumProtected).length > 0 ? (
                  <table className="w-full">
                    {/* Same table structure as above but filtered for quantum-protected tokens */}
                  </table>
                ) : (
                  <p className="text-muted-foreground">No quantum-protected tokens found matching your search.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;
