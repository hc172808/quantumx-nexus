
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";

interface Holder {
  address: string;
  balance: string;
  percentage: number;
}

interface TokenDetails {
  name: string;
  symbol: string;
  network: string;
  logo: string;
  mintAddress: string;
  circulatingSupply: string;
  price: number;
  marketCap: number;
  totalHolders: number;
  topHolders: Holder[];
  mintable: boolean;
  mutableInfo: boolean;
  ownershipRenounced: boolean;
  updateAuthority: string;
  freezeAuthority: string;
  quantumProtected: boolean;
  verified: boolean;
}

const TokenInfo = () => {
  const { address } = useParams<{ address: string }>();
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockToken: TokenDetails = {
          name: "Quantum Token",
          symbol: "QTM",
          network: "Quantum Network",
          logo: "https://via.placeholder.com/256",
          mintAddress: address || "qv000000000000quantumtoken0000000000000",
          circulatingSupply: "1,000,000",
          price: 0.125,
          marketCap: 125000,
          totalHolders: 42,
          topHolders: [
            { address: "qv1a2b3c4d5e6f7g8h9i0j", balance: "250,000", percentage: 25 },
            { address: "qv2b3c4d5e6f7g8h9i0j1k", balance: "150,000", percentage: 15 },
            { address: "qv3c4d5e6f7g8h9i0j1k2l", balance: "100,000", percentage: 10 },
            { address: "qv4d5e6f7g8h9i0j1k2l3m", balance: "75,000", percentage: 7.5 },
            { address: "qv5e6f7g8h9i0j1k2l3m4n", balance: "50,000", percentage: 5 },
          ],
          mintable: false,
          mutableInfo: true,
          ownershipRenounced: false,
          updateAuthority: "qv1a2b3c4d5e6f7g8h9i0j",
          freezeAuthority: "qv1a2b3c4d5e6f7g8h9i0j",
          quantumProtected: true,
          verified: true,
        };
        
        setTokenDetails(mockToken);
      } catch (error) {
        console.error("Failed to fetch token info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokenInfo();
  }, [address]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-muted rounded-full mb-4"></div>
          <div className="h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="h-6 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!tokenDetails) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Token Not Found</CardTitle>
            <CardDescription>
              The token you're looking for could not be found or doesn't exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col md:flex-row items-center md:items-start">
        <div className="w-32 h-32 rounded-full overflow-hidden mr-0 md:mr-6 mb-4 md:mb-0">
          <img 
            src={tokenDetails.logo} 
            alt={`${tokenDetails.name} logo`} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row items-center mb-2">
            <h1 className="text-3xl font-bold mr-2">{tokenDetails.name}</h1>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <Badge variant="outline" className="text-sm">
                {tokenDetails.symbol}
              </Badge>
              {tokenDetails.verified && (
                <Badge className="bg-quantum text-white">Verified</Badge>
              )}
              {tokenDetails.quantumProtected && (
                <Badge className="bg-quantum-dark text-white flex items-center">
                  <Shield className="mr-1 h-3 w-3" />
                  Quantum Protected
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">{tokenDetails.network}</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Price</p>
              <p className="text-xl font-semibold">${tokenDetails.price.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Market Cap</p>
              <p className="text-xl font-semibold">${tokenDetails.marketCap.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Circulating Supply</p>
              <p className="text-xl font-semibold">{tokenDetails.circulatingSupply}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Holders</p>
              <p className="text-xl font-semibold">{tokenDetails.totalHolders}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-auto flex flex-col space-y-2">
          <Button className="bg-quantum hover:bg-quantum-dark">Buy</Button>
          <Button variant="outline">Trade</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="holders" className="flex-1">Holders</TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Token Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mint Address</span>
                  <span className="font-mono text-sm truncate max-w-[200px]">{tokenDetails.mintAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mintable</span>
                  <span>{tokenDetails.mintable ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mutable Info</span>
                  <span>{tokenDetails.mutableInfo ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ownership Renounced</span>
                  <span>{tokenDetails.ownershipRenounced ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Update Authority</span>
                  <span className="font-mono text-sm truncate max-w-[200px]">
                    {tokenDetails.updateAuthority || "None"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Freeze Authority</span>
                  <span className="font-mono text-sm truncate max-w-[200px]">
                    {tokenDetails.freezeAuthority || "None"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantum Protected</span>
                  <span>{tokenDetails.quantumProtected ? "Yes ✅" : "No ❌"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="holders">
          <Card>
            <CardHeader>
              <CardTitle>Top Holders</CardTitle>
              <CardDescription>
                Showing top {tokenDetails.topHolders.length} holders out of {tokenDetails.totalHolders} total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-2 font-medium">Rank</th>
                      <th className="text-left px-4 py-2 font-medium">Address</th>
                      <th className="text-right px-4 py-2 font-medium">Balance</th>
                      <th className="text-right px-4 py-2 font-medium">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenDetails.topHolders.map((holder, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 font-mono text-sm truncate max-w-[200px]">
                          {holder.address}
                        </td>
                        <td className="px-4 py-3 text-right">{holder.balance}</td>
                        <td className="px-4 py-3 text-right">{holder.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No recent transactions to display
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TokenInfo;
