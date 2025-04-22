
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useWallet } from "@/hooks/use-wallet";
import { Shield } from "lucide-react";

const TokenCreation = () => {
  const { isUnlocked, wallet } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [network, setNetwork] = useState("Quantum Network");
  const [totalSupply, setTotalSupply] = useState("");
  const [price, setPrice] = useState("");
  const [mintable, setMintable] = useState(false);
  const [mutableInfo, setMutableInfo] = useState(false);
  const [ownershipRenounced, setOwnershipRenounced] = useState(false);
  const [quantumProtection, setQuantumProtection] = useState(true);
  const [updateAuthority, setUpdateAuthority] = useState("");
  const [freezeAuthority, setFreezeAuthority] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Feature pricing
  const featurePricing = {
    mintable: 0.05,
    mutableInfo: 0.03,
    ownershipRenounced: -0.02, // Discount for renouncing ownership
    quantumProtection: 0.10
  };

  // Calculate total feature cost
  const calculateFeatureCost = () => {
    let featureCost = 0;
    if (mintable) featureCost += featurePricing.mintable;
    if (mutableInfo) featureCost += featurePricing.mutableInfo;
    if (ownershipRenounced) featureCost += featurePricing.ownershipRenounced;
    if (quantumProtection) featureCost += featurePricing.quantumProtection;
    return featureCost;
  };

  // Calculate total token cost
  const calculateTotalTokenCost = () => {
    const basePrice = parseFloat(price) || 0;
    const featureCost = calculateFeatureCost();
    return basePrice + featureCost;
  };

  // Redirect to wallet if not unlocked
  if (!isUnlocked || !wallet) {
    navigate("/wallet");
    return null;
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|png)/)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG or PNG file",
          variant: "destructive",
        });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!logoFile) {
        throw new Error("Logo image is required");
      }
      
      if (!tokenName || !tokenSymbol || !totalSupply || !price) {
        throw new Error("All fields are required");
      }
      
      if (!quantumProtection) {
        throw new Error("Quantum Protection must be enabled for token creation");
      }
      
      // Mock token creation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tokenAddress = "qv" + Math.random().toString(36).substring(2, 12) + tokenSymbol.toLowerCase();
      
      toast({
        title: "Token Created Successfully",
        description: `Your ${tokenName} token has been created on the Quantum Network`,
      });
      
      // Add token to wallet
      navigate(`/token/${tokenAddress}`);
    } catch (error) {
      toast({
        title: "Token Creation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <Card className="border-2 border-quantum/30">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-quantum" />
            Create New Token
          </CardTitle>
          <CardDescription>
            Create your own quantum-protected token on the NETZ blockchain
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Token Logo (256x256 JPG/PNG)</Label>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Token Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-muted-foreground text-xs text-center">Upload Logo</span>
                  )}
                </div>
                <Input
                  ref={fileInputRef}
                  id="logo"
                  type="file"
                  className="hidden"
                  accept="image/jpeg, image/png"
                  onChange={handleLogoChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoFile ? "Change Logo" : "Upload Logo"}
                </Button>
              </div>
              {logoFile && (
                <p className="text-xs text-muted-foreground">{logoFile.name}</p>
              )}
            </div>
            
            {/* Token Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tokenName">Token Name</Label>
                <Input
                  id="tokenName"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="e.g. Quantum Token"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokenSymbol">Symbol</Label>
                <Input
                  id="tokenSymbol"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g. QTM"
                  maxLength={5}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Select 
                  value={network}
                  onValueChange={setNetwork}
                >
                  <SelectTrigger id="network">
                    <SelectValue placeholder="Select Network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quantum Network">Quantum Network</SelectItem>
                    <SelectItem value="NETZ Mainnet">NETZ Mainnet</SelectItem>
                    <SelectItem value="NETZ Testnet">NETZ Testnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalSupply">Total Supply</Label>
                <Input
                  id="totalSupply"
                  type="number"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(e.target.value)}
                  placeholder="e.g. 1000000"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Initial Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.0000001"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="block mb-2">Market Cap</Label>
                <div className="h-10 px-3 py-2 bg-muted/50 rounded-md border flex items-center">
                  ${totalSupply && price ? (Number(totalSupply) * Number(price)).toLocaleString() : "0.00"}
                </div>
              </div>
            </div>
            
            {/* Token Options with Pricing */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mintable" className="cursor-pointer flex items-center">
                    <span>Mintable</span>
                    <span className="ml-2 text-xs text-muted-foreground">(Can create more tokens later)</span>
                  </Label>
                  <p className="text-xs text-quantum mt-1">+${featurePricing.mintable.toFixed(2)} per token</p>
                </div>
                <Switch
                  id="mintable"
                  checked={mintable}
                  onCheckedChange={setMintable}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mutableInfo" className="cursor-pointer flex items-center">
                    <span>Mutable Info</span>
                    <span className="ml-2 text-xs text-muted-foreground">(Can change token info later)</span>
                  </Label>
                  <p className="text-xs text-quantum mt-1">+${featurePricing.mutableInfo.toFixed(2)} per token</p>
                </div>
                <Switch
                  id="mutableInfo"
                  checked={mutableInfo}
                  onCheckedChange={setMutableInfo}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ownershipRenounced" className="cursor-pointer flex items-center">
                    <span>Renounce Ownership</span>
                    <span className="ml-2 text-xs text-muted-foreground">(Irreversibly give up control)</span>
                  </Label>
                  <p className="text-xs text-green-500 mt-1">-${Math.abs(featurePricing.ownershipRenounced).toFixed(2)} discount per token</p>
                </div>
                <Switch
                  id="ownershipRenounced"
                  checked={ownershipRenounced}
                  onCheckedChange={setOwnershipRenounced}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="quantumProtection" className="cursor-pointer flex items-center">
                    <span>Quantum Protection</span>
                    <span className="ml-2 text-xs text-muted-foreground">(Required for token security)</span>
                  </Label>
                  <p className="text-xs text-quantum mt-1">+${featurePricing.quantumProtection.toFixed(2)} per token</p>
                </div>
                <Switch
                  id="quantumProtection"
                  checked={quantumProtection}
                  onCheckedChange={setQuantumProtection}
                />
              </div>
            </div>
            
            {/* Authorities */}
            {!ownershipRenounced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="updateAuthority">Update Authority</Label>
                  <Input
                    id="updateAuthority"
                    value={updateAuthority}
                    onChange={(e) => setUpdateAuthority(e.target.value)}
                    placeholder="Enter wallet address or leave empty"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freezeAuthority">Freeze Authority</Label>
                  <Input
                    id="freezeAuthority"
                    value={freezeAuthority}
                    onChange={(e) => setFreezeAuthority(e.target.value)}
                    placeholder="Enter wallet address or leave empty"
                  />
                </div>
              </div>
            )}
            
            {/* Price Summary */}
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Base token price:</span>
                <span className="font-medium">${price || "0.00"}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Feature additions:</span>
                <span className="font-medium">${calculateFeatureCost().toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2 flex justify-between items-center">
                <span className="font-medium">Final token price:</span>
                <span className="font-bold text-quantum">${calculateTotalTokenCost().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Your token needs to reach a market cap of at least $100,000 to become publicly tradable and visible in other wallets.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-quantum hover:bg-quantum-dark"
              disabled={isLoading}
            >
              {isLoading ? "Creating Token..." : "Create Token"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default TokenCreation;
