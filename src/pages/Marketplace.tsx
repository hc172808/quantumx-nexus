
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, TrendingDown } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { MarketChart } from "@/components/market/MarketChart";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  const { isUnlocked, buyToken, tradeToken, wallet } = useWallet();
  const { toast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [tokensPerPage] = useState(5);
  
  const [showTrading, setShowTrading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<MarketToken | null>(null);
  
  // New states for buy/sell functionality
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [buyTotal, setBuyTotal] = useState("");
  const [sellTotal, setSellTotal] = useState("");

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
          {
            id: "qv000000000000quantumtoken0000000000005",
            name: "Quantum Cash",
            symbol: "QCASH",
            network: "Quantum Network",
            price: 0.98,
            marketCap: 7000000 * 0.98,
            logo: "https://via.placeholder.com/64",
            change24h: 0.5,
            volume24h: 980000,
            quantumProtected: true,
            verified: true,
          },
          {
            id: "qv000000000000quantumtoken0000000000006",
            name: "Quantum Shares",
            symbol: "QSHR",
            network: "NETZ Mainnet",
            price: 3.75,
            marketCap: 2000000 * 3.75,
            logo: "https://via.placeholder.com/64",
            change24h: 8.2,
            volume24h: 450000,
            quantumProtected: true,
            verified: true,
          },
          {
            id: "qv000000000000quantumtoken0000000000007",
            name: "Quantum Pay",
            symbol: "QPAY",
            network: "Quantum Network",
            price: 0.45,
            marketCap: 4000000 * 0.45,
            logo: "https://via.placeholder.com/64",
            change24h: -2.3,
            volume24h: 320000,
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

  useEffect(() => {
    if (!searchQuery) {
      setFilteredTokens(tokens);
      setCurrentPage(1);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = tokens.filter(token => 
      token.name.toLowerCase().includes(query) || 
      token.symbol.toLowerCase().includes(query)
    );
    
    setFilteredTokens(filtered);
    setCurrentPage(1);
  }, [searchQuery, tokens]);

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

  // Calculate buy total when amount changes
  useEffect(() => {
    if (selectedToken && buyAmount) {
      const amount = parseFloat(buyAmount);
      if (!isNaN(amount)) {
        setBuyTotal((amount * selectedToken.price).toFixed(2));
      }
    }
  }, [buyAmount, selectedToken]);
  
  // Calculate sell total when amount changes
  useEffect(() => {
    if (selectedToken && sellAmount) {
      const amount = parseFloat(sellAmount);
      if (!isNaN(amount)) {
        setSellTotal((amount * selectedToken.price).toFixed(2));
      }
    }
  }, [sellAmount, selectedToken]);

  const handleBuy = (token: MarketToken) => {
    if (!isUnlocked) {
      toast({
        title: "Wallet Locked",
        description: "Please unlock your wallet first",
      });
      navigate("/wallet");
      return;
    }
    
    setSelectedToken(token);
    setShowTrading(true);
    setBuyAmount("");
    setSellAmount("");
    setBuyTotal("");
    setSellTotal("");
  };
  
  const handleTrade = (token: MarketToken) => {
    if (!isUnlocked) {
      toast({
        title: "Wallet Locked",
        description: "Please unlock your wallet first",
      });
      navigate("/wallet");
      return;
    }
    
    setSelectedToken(token);
    setShowTrading(true);
    setBuyAmount("");
    setSellAmount("");
    setBuyTotal("");
    setSellTotal("");
  };
  
  const executeBuy = () => {
    if (!selectedToken || !buyAmount || parseFloat(buyAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!wallet) {
      toast({
        title: "Wallet Error",
        description: "Wallet is not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = buyToken(selectedToken.symbol, buyAmount);
      
      if (success) {
        toast({
          title: "Purchase Successful",
          description: `You bought ${buyAmount} ${selectedToken.symbol}`,
        });
        setBuyAmount("");
        setBuyTotal("");
      } else {
        throw new Error("Purchase failed");
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const executeSell = () => {
    if (!selectedToken || !sellAmount || parseFloat(sellAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!wallet) {
      toast({
        title: "Wallet Error",
        description: "Wallet is not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = tradeToken(selectedToken.symbol, 'sell', sellAmount, selectedToken.price);
      
      if (success) {
        toast({
          title: "Sale Successful",
          description: `You sold ${sellAmount} ${selectedToken.symbol}`,
        });
        setSellAmount("");
        setSellTotal("");
      } else {
        throw new Error("Sale failed");
      }
    } catch (error) {
      toast({
        title: "Sale Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = filteredTokens.slice(indexOfFirstToken, indexOfLastToken);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const pageCount = Math.ceil(filteredTokens.length / tokensPerPage);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-muted-foreground">
          Buy, sell, and trade quantum-protected tokens
        </p>
      </div>
      
      {showTrading && selectedToken ? (
        <>
          <Button 
            variant="outline" 
            className="mb-6"
            onClick={() => {
              setShowTrading(false);
              setSelectedToken(null);
            }}
          >
            ← Back to Market
          </Button>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                    <img src={selectedToken.logo} alt={selectedToken.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center">
                      {selectedToken.name} ({selectedToken.symbol})
                      {selectedToken.quantumProtected && (
                        <Badge className="bg-quantum text-white ml-2 flex items-center py-0 h-5">
                          <Shield className="mr-1 h-3 w-3" />
                          Q
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{selectedToken.network}</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${selectedToken.price.toFixed(4)}</div>
                  <div className={`flex items-center ${selectedToken.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedToken.change24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {selectedToken.change24h >= 0 ? '+' : ''}{selectedToken.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MarketChart tokenId={selectedToken.id} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <h3 className="font-medium mb-2">Market Cap</h3>
                  <p className="text-lg">${selectedToken.marketCap.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Volume (24h)</h3>
                  <p className="text-lg">${selectedToken.volume24h.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Network</h3>
                  <p className="text-lg">{selectedToken.network}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Buy {selectedToken.symbol}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="buy-amount">Amount</Label>
                        <Input 
                          id="buy-amount" 
                          placeholder="0.00" 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="buy-total">Total (USD)</Label>
                        <Input 
                          id="buy-total" 
                          placeholder="0.00" 
                          type="number" 
                          min="0" 
                          step="0.01"
                          value={buyTotal}
                          onChange={(e) => {
                            setBuyTotal(e.target.value);
                            if (selectedToken.price > 0) {
                              const total = parseFloat(e.target.value);
                              if (!isNaN(total)) {
                                setBuyAmount((total / selectedToken.price).toFixed(4));
                              }
                            }
                          }}
                        />
                      </div>
                      <Button 
                        className="w-full bg-quantum hover:bg-quantum-dark"
                        onClick={executeBuy}
                        disabled={!buyAmount || parseFloat(buyAmount) <= 0}
                      >
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sell {selectedToken.symbol}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sell-amount">Amount</Label>
                        <Input 
                          id="sell-amount" 
                          placeholder="0.00" 
                          type="number" 
                          min="0" 
                          step="0.01"
                          value={sellAmount}
                          onChange={(e) => setSellAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sell-total">Total (USD)</Label>
                        <Input 
                          id="sell-total" 
                          placeholder="0.00" 
                          type="number" 
                          min="0" 
                          step="0.01"
                          value={sellTotal}
                          onChange={(e) => {
                            setSellTotal(e.target.value);
                            if (selectedToken.price > 0) {
                              const total = parseFloat(e.target.value);
                              if (!isNaN(total)) {
                                setSellAmount((total / selectedToken.price).toFixed(4));
                              }
                            }
                          }}
                        />
                      </div>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={executeSell}
                        disabled={!sellAmount || parseFloat(sellAmount) <= 0}
                      >
                        Sell
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
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
                  ) : currentTokens.length === 0 ? (
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
                          {currentTokens.map((token, index) => (
                            <tr 
                              key={token.id} 
                              className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                              onClick={() => navigate(`/token/${token.id}`)}
                            >
                              <td className="p-4">{indexOfFirstToken + index + 1}</td>
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
                                <div className="flex space-x-2 justify-end">
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTrade(token);
                                    }}
                                  >
                                    Trade
                                  </Button>
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
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center p-4 border-t border-border">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {[...Array(pageCount)].map((_, i) => {
                        if (
                          i === 0 || 
                          i === pageCount - 1 || 
                          (i >= currentPage - 2 && i <= currentPage + 2)
                        ) {
                          return (
                            <PaginationItem key={i}>
                              <PaginationLink 
                                isActive={currentPage === i + 1}
                                onClick={() => paginate(i + 1)}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        if (
                          (i === 1 && currentPage > 4) || 
                          (i === pageCount - 2 && currentPage < pageCount - 3)
                        ) {
                          return (
                            <PaginationItem key={i}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < pageCount && paginate(currentPage + 1)}
                          className={currentPage === pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="verified">
              <Card>
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="p-8 flex justify-center">
                      <div className="animate-pulse space-y-4 w-full">
                        {[...Array(3)].map((_, i) => (
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
                  ) : (
                    <div className="overflow-x-auto">
                      {filteredTokens.filter(t => t.verified).length > 0 ? (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left p-4 font-medium">#</th>
                              <th className="text-left p-4 font-medium">Token</th>
                              <th className="text-right p-4 font-medium">Price</th>
                              <th className="text-right p-4 font-medium hidden md:table-cell">24h Change</th>
                              <th className="text-right p-4 font-medium hidden md:table-cell">Market Cap</th>
                              <th className="text-center p-4 font-medium"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTokens.filter(t => t.verified).map((token, index) => (
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
                                        {token.quantumProtected && (
                                          <Badge 
                                            className="ml-2 bg-quantum text-white text-xs flex items-center py-0 h-5"
                                          >
                                            <Shield className="mr-1 h-3 w-3" />
                                            Q
                                          </Badge>
                                        )}
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
                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex space-x-2 justify-end">
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTrade(token);
                                      }}
                                    >
                                      Trade
                                    </Button>
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
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No verified tokens found matching your search.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quantum">
              <Card>
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="p-8 flex justify-center">
                      <div className="animate-pulse space-y-4 w-full">
                        {[...Array(3)].map((_, i) => (
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
                  ) : (
                    <div className="overflow-x-auto">
                      {filteredTokens.filter(t => t.quantumProtected).length > 0 ? (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left p-4 font-medium">#</th>
                              <th className="text-left p-4 font-medium">Token</th>
                              <th className="text-right p-4 font-medium">Price</th>
                              <th className="text-right p-4 font-medium hidden md:table-cell">24h Change</th>
                              <th className="text-right p-4 font-medium hidden md:table-cell">Market Cap</th>
                              <th className="text-center p-4 font-medium"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTokens.filter(t => t.quantumProtected).map((token, index) => (
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
                                        {token.verified && (
                                          <Badge variant="outline" className="ml-2 text-xs">Verified</Badge>
                                        )}
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
                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex space-x-2 justify-end">
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTrade(token);
                                      }}
                                    >
                                      Trade
                                    </Button>
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
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No quantum-protected tokens found matching your search.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Marketplace;
