import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCreatedTokens, TokenData } from "@/lib/wallet/wallet-storage";
import { Shield, Coins } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@/lib/wallet/wallet-context";
import { Label, Input } from "@/components/ui/input";

interface Token extends TokenData {
  id: string;
  name: string;
  symbol: string;
  decimals?: number;
  totalSupply?: string;
  price?: number;
  marketCap?: number;
  description?: string;
  network?: string;
  features?: {
    mintable: boolean;
    mutableInfo: boolean;
    renounceOwnership: boolean;
    quantumProtection: boolean;
  };
  createdAt?: string;
  creator?: string;
  holders?: number;
  transactions?: number;
  volume24h?: number;
  logo?: string;
}

const TokenInfo = () => {
  const { address } = useParams<{ address: string }>();
  const [token, setToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const { toast } = useToast();
  const { tradeToken } = useWallet();

  useEffect(() => {
    const fetchToken = async () => {
      setIsLoading(true);
      try {
        // Check created tokens
        const createdTokens = getCreatedTokens() as unknown as Token[];
        
        // Find token by address or id
        let foundToken = createdTokens.find((t) => 
          t.id === address || 
          t.address === address ||
          (typeof t.id === 'string' && t.id.toLowerCase() === address?.toLowerCase()) ||
          (typeof t.address === 'string' && t.address.toLowerCase() === address?.toLowerCase())
        );
        
        // Check token metrics if not found
        if (!foundToken) {
          const storedTokenMetrics = localStorage.getItem('tokenMetrics');
          if (storedTokenMetrics) {
            const tokenMetrics = JSON.parse(storedTokenMetrics);
            foundToken = tokenMetrics.find((t: Token) => 
              t.id === address || 
              t.address === address
            );
          }
        }
        
        // Check built-in tokens
        if (!foundToken && address === "qv000000000000quantumtoken0000000000000") {
          foundToken = {
            id: "qv000000000000quantumtoken0000000000000",
            address: "qv000000000000quantumtoken0000000000000",
            name: "Quantum Token",
            symbol: "QTM",
            balance: "1000",
            value: 1.25,
            price: 1.25,
            totalSupply: "1000000",
            marketCap: 1250000,
            description: "The native token of the Quantum Network blockchain",
            network: "netz-mainnet",
            features: {
              mintable: true,
              mutableInfo: false,
              renounceOwnership: false,
              quantumProtection: true
            },
            createdAt: new Date().toISOString(),
            creator: "Quantum Network",
            holders: 10000,
            transactions: 250000,
            volume24h: 50000,
            logo: "/src/assets/tokens/qtm.svg"
          };
        }
        
        if (foundToken) {
          setToken(foundToken);
        } else {
          toast({
            title: "Token Not Found",
            description: "The requested token could not be found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        toast({
          title: "Error",
          description: "Failed to load token information",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchToken();
    }
  }, [address, toast]);

  const handleTrade = (type: 'buy' | 'sell') => {
    const amount = type === 'buy' ? buyAmount : sellAmount;
    if (!token || !amount) {
      toast({
        title: "Invalid Trade",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const success = tradeToken(token.symbol, type, amount, token.price || 0);
    if (success) {
      toast({
        title: "Trade Successful",
        description: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${amount} ${token.symbol}`,
      });
      if (type === 'buy') {
        setBuyAmount("");
      } else {
        setSellAmount("");
      }
    } else {
      toast({
        title: "Trade Failed",
        description: `Failed to ${type} tokens. Please check your balance and try again.`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-4xl">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Token Not Found</CardTitle>
            <CardDescription>
              The token you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-quantum/20 rounded-full flex items-center justify-center mr-4">
                    {token.logo ? (
                      <img src={token.logo} alt={token.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <Coins className="h-6 w-6 text-quantum" />
                    )}
                  </div>
                  <div>
                    <CardTitle>{token.name} ({token.symbol})</CardTitle>
                    <CardDescription>
                      {token.network === "netz-mainnet" ? "NETZ Mainnet" :
                        token.network === "netz-testnet" ? "NETZ Testnet" : 
                        token.network || "Quantum Network"}
                    </CardDescription>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  {token.features?.quantumProtection && (
                    <Badge className="bg-quantum text-white">
                      <Shield className="mr-1 h-3 w-3" /> Quantum Protected
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="transactions" className="flex-1">Transactions</TabsTrigger>
                  <TabsTrigger value="holders" className="flex-1">Holders</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="py-4">
                        <div className="text-sm text-muted-foreground">Price</div>
                        <div className="text-2xl font-bold">${token.price?.toFixed(6) || "0.000000"}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="py-4">
                        <div className="text-sm text-muted-foreground">Market Cap</div>
                        <div className="text-2xl font-bold">${token.marketCap?.toLocaleString() || "0"}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="py-4">
                        <div className="text-sm text-muted-foreground">Total Supply</div>
                        <div className="text-2xl font-bold">{parseInt(token.totalSupply || "0").toLocaleString()}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">About {token.name}</h3>
                    <p className="text-muted-foreground">
                      {token.description || `${token.name} (${token.symbol}) is a token on the NETZ blockchain.`}
                    </p>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Token Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contract Address</span>
                            <span className="font-mono text-sm">{address?.substring(0, 8)}...{address?.substring(address.length - 4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Decimals</span>
                            <span>{token.decimals || 18}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created</span>
                            <span>{token.createdAt ? new Date(token.createdAt).toLocaleDateString() : "Unknown"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Token Features</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mintable</span>
                            <Badge variant={token.features?.mintable ? "default" : "outline"}>
                              {token.features?.mintable ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mutable Info</span>
                            <Badge variant={token.features?.mutableInfo ? "default" : "outline"}>
                              {token.features?.mutableInfo ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Renounce Ownership</span>
                            <Badge variant={token.features?.renounceOwnership ? "default" : "outline"}>
                              {token.features?.renounceOwnership ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Quantum Protection</span>
                            <Badge variant={token.features?.quantumProtection ? "default" : "outline"} className={token.features?.quantumProtection ? "bg-quantum" : ""}>
                              {token.features?.quantumProtection ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="transactions">
                  <Card className="border-none">
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                        <p className="text-muted-foreground">
                          This token has no transaction history yet.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="holders">
                  <Card className="border-none">
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">No holders data available</h3>
                        <p className="text-muted-foreground">
                          Holder information will be available once the token is fully approved.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade {token.symbol}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between space-x-2">
                <div className="w-1/2 space-y-2">
                  <Label htmlFor="buy-amount">Buy Amount</Label>
                  <Input
                    id="buy-amount"
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleTrade('buy')}
                    disabled={!buyAmount}
                  >
                    Buy
                  </Button>
                </div>
                <div className="w-1/2 space-y-2">
                  <Label htmlFor="sell-amount">Sell Amount</Label>
                  <Input
                    id="sell-amount"
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => handleTrade('sell')}
                    disabled={!sellAmount}
                  >
                    Sell
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-xl font-bold">${token.price?.toFixed(6) || "0.000000"}</p>
                <p className="text-sm text-green-500">+0.00% (24h)</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Token Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Holders</span>
                  <span>{token.holders || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transactions</span>
                  <span>{token.transactions || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span>${token.volume24h?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token Rank</span>
                  <span>TBD</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
