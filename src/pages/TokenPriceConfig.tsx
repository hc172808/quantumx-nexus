
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Coins, Settings } from "lucide-react";
import { saveTokenFeaturePricing } from "@/lib/wallet/wallet-storage";

const TokenPriceConfig = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Token feature pricing
  const [mintablePrice, setMintablePrice] = useState("50");
  const [mutableInfoPrice, setMutableInfoPrice] = useState("75");
  const [renounceOwnershipPrice, setRenounceOwnershipPrice] = useState("25");
  const [quantumProtectionPrice, setQuantumProtectionPrice] = useState("200");
  
  // Additional feature pricing
  const [burnablePrice, setBurnablePrice] = useState("30");
  const [pausablePrice, setPausablePrice] = useState("60");
  const [upgradeablePrice, setUpgradeablePrice] = useState("150");
  const [snapshotPrice, setSnapshotPrice] = useState("80");
  const [votingPrice, setVotingPrice] = useState("120");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/admin");
      return;
    }
    
    const loadPricing = () => {
      setIsLoading(true);
      try {
        // Load stored token feature pricing if available
        const storedPrices = localStorage.getItem('tokenFeaturePricing');
        if (storedPrices) {
          const prices = JSON.parse(storedPrices);
          setMintablePrice(prices.mintable || "50");
          setMutableInfoPrice(prices.mutableInfo || "75");
          setRenounceOwnershipPrice(prices.renounceOwnership || "25");
          setQuantumProtectionPrice(prices.quantumProtection || "200");
          setBurnablePrice(prices.burnable || "30");
          setPausablePrice(prices.pausable || "60");
          setUpgradeablePrice(prices.upgradeable || "150");
          setSnapshotPrice(prices.snapshot || "80");
          setVotingPrice(prices.voting || "120");
        }
      } catch (error) {
        console.error("Error loading token pricing:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPricing();
  }, [user, isAdmin, navigate]);
  
  const handleSaveTokenPricing = () => {
    // Save token feature pricing
    const pricing = {
      mintable: mintablePrice,
      mutableInfo: mutableInfoPrice,
      renounceOwnership: renounceOwnershipPrice,
      quantumProtection: quantumProtectionPrice,
      burnable: burnablePrice,
      pausable: pausablePrice,
      upgradeable: upgradeablePrice,
      snapshot: snapshotPrice,
      voting: votingPrice
    };
    
    saveTokenFeaturePricing(pricing);
    
    toast({
      title: "Pricing Saved",
      description: "Token feature pricing has been updated.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-3xl">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Token Feature Pricing Configuration</h1>
        <Button variant="outline" onClick={() => navigate("/admin")}>
          <Settings className="mr-2 h-4 w-4" /> Back to Admin
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Core Feature Pricing</CardTitle>
          <CardDescription>
            Configure prices for main token features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mintablePrice">Mintable Feature (NETZ)</Label>
                <Input
                  id="mintablePrice"
                  type="number"
                  value={mintablePrice}
                  onChange={(e) => setMintablePrice(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Price to enable minting additional tokens after creation
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mutableInfoPrice">Mutable Info Feature (NETZ)</Label>
                <Input
                  id="mutableInfoPrice"
                  type="number"
                  value={mutableInfoPrice}
                  onChange={(e) => setMutableInfoPrice(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Price to allow changing token metadata after creation
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="renounceOwnershipPrice">Renounce Ownership Feature (NETZ)</Label>
                <Input
                  id="renounceOwnershipPrice"
                  type="number"
                  value={renounceOwnershipPrice}
                  onChange={(e) => setRenounceOwnershipPrice(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Price to enable ownership renunciation
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantumProtectionPrice">Quantum Protection Feature (NETZ)</Label>
                <Input
                  id="quantumProtectionPrice"
                  type="number"
                  value={quantumProtectionPrice}
                  onChange={(e) => setQuantumProtectionPrice(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Price for quantum-proof security features
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Extended Feature Pricing</CardTitle>
          <CardDescription>
            Configure prices for additional token features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="burnablePrice">Burnable Feature (NETZ)</Label>
              <Input
                id="burnablePrice"
                type="number"
                value={burnablePrice}
                onChange={(e) => setBurnablePrice(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Price to enable token burning functionality
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pausablePrice">Pausable Feature (NETZ)</Label>
              <Input
                id="pausablePrice"
                type="number"
                value={pausablePrice}
                onChange={(e) => setPausablePrice(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Price to enable pausing token transfers
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upgradeablePrice">Upgradeable Feature (NETZ)</Label>
              <Input
                id="upgradeablePrice"
                type="number"
                value={upgradeablePrice}
                onChange={(e) => setUpgradeablePrice(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Price to enable contract upgradeability
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="snapshotPrice">Snapshot Feature (NETZ)</Label>
              <Input
                id="snapshotPrice"
                type="number"
                value={snapshotPrice}
                onChange={(e) => setSnapshotPrice(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Price to enable balance snapshot functionality
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="votingPrice">Voting Feature (NETZ)</Label>
              <Input
                id="votingPrice"
                type="number"
                value={votingPrice}
                onChange={(e) => setVotingPrice(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Price to enable governance voting capabilities
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            className="bg-quantum hover:bg-quantum-dark"
            onClick={handleSaveTokenPricing}
          >
            <Coins className="mr-2 h-5 w-5" /> Save All Pricing
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Pricing Policy</CardTitle>
          <CardDescription>
            Configure how pricing is applied
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Discount for Multiple Features</Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  min="0"
                  max="50"
                  defaultValue="10"
                  className="max-w-[100px]"
                />
                <span className="ml-2">%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Percentage discount when multiple features are selected
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Premium User Discount</Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  min="0"
                  max="50"
                  defaultValue="15"
                  className="max-w-[100px]"
                />
                <span className="ml-2">%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Discount for users with premium status
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenPriceConfig;
