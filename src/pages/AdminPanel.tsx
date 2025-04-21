import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

interface PendingToken {
  id: string;
  name: string;
  symbol: string;
  network: string;
  totalSupply: string;
  initialPrice: number;
  marketCap: number;
  creator: string;
  createdAt: string;
  logo: string;
}

interface TokenMetrics {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  holders: number;
  transactions: number;
  volume24h: number;
}

interface BannedAddress {
  address: string;
  reason: string;
  bannedAt: string;
  expiresAt: string | null;
}

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [pendingTokens, setPendingTokens] = useState<PendingToken[]>([]);
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetrics[]>([]);
  const [bannedAddresses, setBannedAddresses] = useState<BannedAddress[]>([]);
  const [mintPrice, setMintPrice] = useState("0.001");
  const [tokenCreationFee, setTokenCreationFee] = useState("100");
  const [isLoading, setIsLoading] = useState(true);
  
  // Add NETZ-specific states
  const [initialPrice, setInitialPrice] = useState("0.001");
  const [mintAmount, setMintAmount] = useState("1000");
  const [totalMinted, setTotalMinted] = useState("0");
  const maxSupply = "9000000000";

  // Check if user is admin, if not redirect
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/");
      return;
    }
    
    // Fetch admin data
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock pending tokens
        const mockPendingTokens: PendingToken[] = [
          {
            id: "pt1",
            name: "Super Token",
            symbol: "STKN",
            network: "NETZ Mainnet",
            totalSupply: "1,000,000",
            initialPrice: 0.05,
            marketCap: 50000,
            creator: "qv1a2b3c4d5e6f7g8h9i0j",
            createdAt: "2025-04-20",
            logo: "https://via.placeholder.com/64",
          },
          {
            id: "pt2",
            name: "Quantum Finance",
            symbol: "QFIN",
            network: "Quantum Network",
            totalSupply: "500,000",
            initialPrice: 0.25,
            marketCap: 125000,
            creator: "qv2b3c4d5e6f7g8h9i0j1k",
            createdAt: "2025-04-19",
            logo: "https://via.placeholder.com/64",
          },
        ];
        
        // Mock token metrics
        const mockTokenMetrics: TokenMetrics[] = [
          {
            id: "tm1",
            name: "NETZ",
            symbol: "NETZ",
            price: 1.25,
            marketCap: 11250000000,
            holders: 15420,
            transactions: 124589,
            volume24h: 12500000,
          },
          {
            id: "tm2",
            name: "Quantum Token",
            symbol: "QTM",
            price: 0.125,
            marketCap: 125000,
            holders: 42,
            transactions: 156,
            volume24h: 350000,
          },
        ];
        
        // Mock banned addresses
        const mockBannedAddresses: BannedAddress[] = [
          {
            address: "qv9x8c7v6b5n4m3l2k1j",
            reason: "Fraudulent activity",
            bannedAt: "2025-04-15",
            expiresAt: "2025-05-15",
          },
          {
            address: "qv8w7v6u5t4s3r2q1p",
            reason: "Attempted exploit",
            bannedAt: "2025-04-10",
            expiresAt: null,
          },
        ];
        
        setPendingTokens(mockPendingTokens);
        setTokenMetrics(mockTokenMetrics);
        setBannedAddresses(mockBannedAddresses);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, [user, isAdmin, navigate]);
  
  const handleApproveToken = (tokenId: string) => {
    // Mock approve token
    setPendingTokens(prev => prev.filter(token => token.id !== tokenId));
  };
  
  const handleRejectToken = (tokenId: string) => {
    // Mock reject token
    setPendingTokens(prev => prev.filter(token => token.id !== tokenId));
  };
  
  const handleSaveSettings = () => {
    // Mock save settings
    console.log("Settings saved:", {
      mintPrice,
      tokenCreationFee,
    });
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
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Badge className="bg-quantum">Admin</Badge>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="pending" className="flex-1">Pending Tokens</TabsTrigger>
          <TabsTrigger value="metrics" className="flex-1">Token Metrics</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">System Settings</TabsTrigger>
          <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
        </TabsList>
        
        {/* Pending Tokens Tab */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Token Approvals</CardTitle>
              <CardDescription>
                Review and approve or reject token creation requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTokens.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending tokens to review
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingTokens.map((token) => (
                    <div key={token.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 mr-3 rounded-full overflow-hidden">
                            <img src={token.logo} alt={token.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-medium">{token.name} ({token.symbol})</h3>
                            <p className="text-sm text-muted-foreground">{token.network}</p>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <Badge variant="outline">Submitted: {token.createdAt}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Supply</p>
                          <p>{token.totalSupply}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Initial Price</p>
                          <p>${token.initialPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Market Cap</p>
                          <p>${token.marketCap.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-4">
                        <Button 
                          variant="outline" 
                          onClick={() => handleRejectToken(token.id)}
                        >
                          Reject
                        </Button>
                        <Button 
                          className="bg-quantum hover:bg-quantum-dark"
                          onClick={() => handleApproveToken(token.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Token Metrics Tab */}
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Token Metrics</CardTitle>
              <CardDescription>
                Monitor and manage token performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium">Token</th>
                    <th className="text-right p-4 font-medium">Price</th>
                    <th className="text-right p-4 font-medium">Market Cap</th>
                    <th className="text-right p-4 font-medium hidden md:table-cell">Holders</th>
                    <th className="text-right p-4 font-medium hidden md:table-cell">Transactions</th>
                    <th className="text-right p-4 font-medium hidden md:table-cell">Volume (24h)</th>
                    <th className="text-center p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tokenMetrics.map((token) => (
                    <tr key={token.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div className="font-medium">{token.name}</div>
                        <div className="text-sm text-muted-foreground">{token.symbol}</div>
                      </td>
                      <td className="p-4 text-right font-medium">${token.price.toFixed(4)}</td>
                      <td className="p-4 text-right">${token.marketCap.toLocaleString()}</td>
                      <td className="p-4 text-right hidden md:table-cell">{token.holders.toLocaleString()}</td>
                      <td className="p-4 text-right hidden md:table-cell">{token.transactions.toLocaleString()}</td>
                      <td className="p-4 text-right hidden md:table-cell">${token.volume24h.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex space-x-2 justify-center">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="bg-red-500/10 hover:bg-red-500/20 text-red-500">
                            Freeze
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>NETZ Coin Settings</CardTitle>
                <CardDescription>
                  Configure the native NETZ coin parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mintPrice">Mint Price (USD)</Label>
                  <Input
                    id="mintPrice"
                    type="number"
                    step="0.001"
                    value={mintPrice}
                    onChange={(e) => setMintPrice(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Price to mint new NETZ coins
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalSupply">Total Supply</Label>
                  <div className="h-10 px-3 py-2 bg-muted/50 rounded-md border flex items-center">
                    9,000,000,000 NETZ
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum supply of NETZ coins (fixed)
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="adminMintOnly">Admin Only Minting</Label>
                    <p className="text-sm text-muted-foreground">
                      Only allow admins to mint new coins
                    </p>
                  </div>
                  <Switch
                    id="adminMintOnly"
                    checked={true}
                    disabled
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="webMinerEnabled">Web Miner Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to mine coins with web miner
                    </p>
                  </div>
                  <Switch
                    id="webMinerEnabled"
                    checked={true}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Token Creation Settings</CardTitle>
                <CardDescription>
                  Configure parameters for user-created tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenCreationFee">Token Creation Fee (NETZ)</Label>
                  <Input
                    id="tokenCreationFee"
                    type="number"
                    value={tokenCreationFee}
                    onChange={(e) => setTokenCreationFee(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Fee in NETZ to create a new token
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tokenVisibilityThreshold">Token Visibility Threshold</Label>
                  <div className="h-10 px-3 py-2 bg-muted/50 rounded-md border flex items-center">
                    $100,000
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Minimum market cap for public visibility
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nativePair">Native Liquidity Pair</Label>
                  <Select defaultValue="NETZ">
                    <SelectTrigger id="nativePair">
                      <SelectValue placeholder="Select coin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NETZ">NETZ</SelectItem>
                      <SelectItem value="QTM">QTM</SelectItem>
                      <SelectItem value="QUSD">QUSD</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Native coin for token liquidity pairs
                  </p>
                </div>
                <div className="pt-4">
                  <Button 
                    className="w-full bg-quantum hover:bg-quantum-dark"
                    onClick={handleSaveSettings}
                  >
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Mining Configuration</CardTitle>
                <CardDescription>
                  Configure the web-based mining system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="miningDifficulty">Mining Difficulty</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="miningDifficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="miningReward">Mining Reward (NETZ/block)</Label>
                    <Input
                      id="miningReward"
                      type="number"
                      defaultValue="0.05"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="miningAlgorithm">Mining Algorithm</Label>
                    <Select defaultValue="quantum-proof">
                      <SelectTrigger id="miningAlgorithm">
                        <SelectValue placeholder="Select algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quantum-proof">Quantum-Proof</SelectItem>
                        <SelectItem value="sha-256">SHA-256</SelectItem>
                        <SelectItem value="ethash">Ethash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <Label htmlFor="preventExternalMining">Prevent External Mining</Label>
                    <p className="text-sm text-muted-foreground">
                      Block all mining attempts outside the web interface
                    </p>
                  </div>
                  <Switch
                    id="preventExternalMining"
                    checked={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Banned Addresses</CardTitle>
                <CardDescription>
                  Manage banned wallet addresses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bannedAddresses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No banned addresses
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bannedAddresses.map((banned) => (
                      <div key={banned.address} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-mono text-sm">{banned.address}</div>
                          <Badge variant="outline" className="ml-2">
                            {banned.expiresAt ? `Until ${banned.expiresAt}` : "Permanent"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <strong>Reason:</strong> {banned.reason}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Banned on {banned.bannedAt}
                        </div>
                        <div className="mt-2">
                          <Button size="sm" variant="outline">
                            Remove Ban
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Add New Ban
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fail2Ban Configuration</CardTitle>
                <CardDescription>
                  Configure security protection settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Login Attempts</h3>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="text-sm">3 attempts</div>
                    <div className="text-sm text-right">1 minute ban</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="text-sm">4 attempts</div>
                    <div className="text-sm text-right">5 minutes ban</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="text-sm">5 attempts</div>
                    <div className="text-sm text-right">1 hour ban</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">&gt;5 attempts</div>
                    <div className="text-sm text-right">1 day ban</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="loginProtection" className="cursor-pointer">
                      Login Protection
                    </Label>
                    <Switch
                      id="loginProtection"
                      checked={true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="walletProtection" className="cursor-pointer">
                      Wallet Recovery Protection
                    </Label>
                    <Switch
                      id="walletProtection"
                      checked={true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tokenFormProtection" className="cursor-pointer">
                      Token Creation Form Protection
                    </Label>
                    <Switch
                      id="tokenFormProtection"
                      checked={true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="screenshotBlocking" className="cursor-pointer">
                      Seed Phrase Screenshot Blocking
                    </Label>
                    <Switch
                      id="screenshotBlocking"
                      checked={true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="botProtection" className="cursor-pointer">
                      Bot Protection
                    </Label>
                    <Switch
                      id="botProtection"
                      checked={true}
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full bg-quantum hover:bg-quantum-dark"
                  >
                    Update Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      {/* Add NETZ Coin Management Card before the token metrics */}
      <Card className="lg:col-span-2 mb-6">
        <CardHeader>
          <CardTitle>NETZ Coin Management</CardTitle>
          <CardDescription>Manage the native NETZ coin settings and distribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Initial Price (USD)</Label>
              <Input
                type="number"
                min="0.0001"
                step="0.0001"
                value={initialPrice}
                onChange={(e) => setInitialPrice(e.target.value)}
              />
            </div>
            <div>
              <Label>Mint Amount</Label>
              <Input
                type="number"
                min="1"
                max={maxSupply}
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Supply</p>
              <p className="font-medium">{maxSupply} NETZ</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Minted</p>
              <p className="font-medium">{totalMinted} NETZ</p>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              className="w-full bg-quantum hover:bg-quantum-dark"
              onClick={() => console.log('Minting NETZ')}
            >
              Mint NETZ Coins
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fix the incorrect > symbol in the metrics section */}
      
    </div>
  );
};

export default AdminPanel;
