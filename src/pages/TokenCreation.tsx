import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveCreatedToken, getTokenFeaturePricing } from "@/lib/wallet/wallet-storage";
import { Coins, Shield } from "lucide-react";

const TokenCreation = () => {
  const { user } = useAuth();
  const { isUnlocked } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("18");
  const [supply, setSupply] = useState("1000000");
  const [initialPrice, setInitialPrice] = useState("0.001");
  const [description, setDescription] = useState("");
  const [network, setNetwork] = useState("netz-mainnet");

  const [mintable, setMintable] = useState(false);
  const [mutableInfo, setMutableInfo] = useState(false);
  const [renounceOwnership, setRenounceOwnership] = useState(false);
  const [quantumProtection, setQuantumProtection] = useState(true);

  // Initialize with default values to prevent null
  const [featurePricing, setFeaturePricing] = useState({
    mintable: "50",
    mutableInfo: "75",
    renounceOwnership: "25",
    quantumProtection: "200"
  });
  const [totalPrice, setTotalPrice] = useState("100");

  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1);
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [liquidityToken, setLiquidityToken] = useState("");
  const [liquidityAmount, setLiquidityAmount] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    // Get pricing and ensure it's not null by using the default values from getTokenFeaturePricing
    const pricing = getTokenFeaturePricing();
    if (pricing) {
      setFeaturePricing(pricing);
    }
  }, [user, navigate]);

  useEffect(() => {
    let price = 100;
    
    // Ensure featurePricing is not null before accessing properties
    if (featurePricing) {
      if (mintable) price += parseFloat(featurePricing.mintable || "50");
      if (mutableInfo) price += parseFloat(featurePricing.mutableInfo || "75");
      if (renounceOwnership) price += parseFloat(featurePricing.renounceOwnership || "25");
      if (quantumProtection) price += parseFloat(featurePricing.quantumProtection || "200");
    }
    
    setTotalPrice(price.toString());
  }, [mintable, mutableInfo, renounceOwnership, quantumProtection, featurePricing]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Logo file must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setLogoFile(file);
    }
  };

  const handleCreateToken = async () => {
    if (!name || !symbol || !supply || !logoFile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including logo",
        variant: "destructive",
      });
      return;
    }

    if (!liquidityToken || !liquidityAmount) {
      toast({
        title: "Liquidity Required",
        description: "Please select a liquidity pair and amount",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tokenId = "tk" + Math.random().toString(36).substring(2, 12);
      
      // Convert logo to base64 for storage
      const reader = new FileReader();
      const logoPromise = new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(logoFile);
      });
      
      const logoData = await logoPromise;
      
      const token = {
        id: tokenId,
        name,
        symbol,
        decimals: parseInt(decimals),
        totalSupply: supply,
        price: parseFloat(initialPrice),
        marketCap: parseFloat(initialPrice) * parseFloat(supply),
        description,
        network,
        features: {
          mintable,
          mutableInfo,
          renounceOwnership,
          quantumProtection,
        },
        logo: logoData,
        liquidityPair: {
          token: liquidityToken,
          amount: liquidityAmount
        },
        createdAt: new Date().toISOString(),
        creator: user?.id || "unknown",
        balance: "0"
      };
      
      saveCreatedToken(token);
      
      const pendingTokens = localStorage.getItem('pendingTokens');
      if (pendingTokens) {
        const tokens = JSON.parse(pendingTokens);
        tokens.push({
          ...token,
          logo: logoPreview,
          network: network === "netz-mainnet" ? "NETZ Mainnet" : network,
        });
        localStorage.setItem('pendingTokens', JSON.stringify(tokens));
      }
      
      toast({
        title: "Token Created",
        description: "Your token has been submitted for approval",
      });
      
      setTimeout(() => {
        navigate(`/token/${tokenId}`);
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create token. Please try again.",
        variant: "destructive",
      });
      console.error("Token creation error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!name || !symbol || !supply) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (!isUnlocked) {
    return (
      <div className="container max-w-xl mx-auto px-4 py-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Connection Required</CardTitle>
            <CardDescription>
              Please connect your wallet before creating a token
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/wallet")} className="bg-quantum hover:bg-quantum-dark">
              Connect Wallet
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <Card className="border-2 border-quantum/30">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Token</CardTitle>
          <CardDescription>
            Create your own custom token on the NETZ blockchain
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={`step${step}`} className="mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="step1" className="flex-1" disabled={step !== 1}>
                1. Basic Info
              </TabsTrigger>
              <TabsTrigger value="step2" className="flex-1" disabled={step !== 2}>
                2. Features
              </TabsTrigger>
              <TabsTrigger value="step3" className="flex-1" disabled={step !== 3}>
                3. Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="step1" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Token Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      placeholder="e.g. My Awesome Token"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Token Symbol <span className="text-red-500">*</span></Label>
                    <Input
                      id="symbol"
                      placeholder="e.g. MAT"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      maxLength={8}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="decimals">Decimals</Label>
                    <Select defaultValue="18" onValueChange={(value) => setDecimals(value)}>
                      <SelectTrigger id="decimals">
                        <SelectValue placeholder="Select decimals" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (Whole numbers only)</SelectItem>
                        <SelectItem value="2">2 (Cents precision)</SelectItem>
                        <SelectItem value="6">6 (Micro precision)</SelectItem>
                        <SelectItem value="8">8 (Satoshi precision)</SelectItem>
                        <SelectItem value="18">18 (Standard precision)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="network">Network</Label>
                    <Select defaultValue="netz-mainnet" onValueChange={(value) => setNetwork(value)}>
                      <SelectTrigger id="network">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="netz-mainnet">NETZ Mainnet</SelectItem>
                        <SelectItem value="netz-testnet">NETZ Testnet</SelectItem>
                        <SelectItem value="quantum-network">Quantum Network</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supply">Total Supply <span className="text-red-500">*</span></Label>
                    <Input
                      id="supply"
                      type="number"
                      min="1"
                      placeholder="Enter total supply"
                      value={supply}
                      onChange={(e) => setSupply(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initialPrice">Initial Price (USD)</Label>
                    <Input
                      id="initialPrice"
                      type="number"
                      min="0.0000001"
                      step="0.0001"
                      placeholder="Enter initial price"
                      value={initialPrice}
                      onChange={(e) => setInitialPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your token (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={nextStep} 
                    className="bg-quantum hover:bg-quantum-dark"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step2" className="space-y-6 mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Mintable</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow creating more tokens after initial creation
                    </p>
                    <p className="text-sm font-medium text-quantum">
                      Price: {featurePricing.mintable} NETZ
                    </p>
                  </div>
                  <Switch
                    checked={mintable}
                    onCheckedChange={setMintable}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Mutable Info</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow changing token information after creation
                    </p>
                    <p className="text-sm font-medium text-quantum">
                      Price: {featurePricing.mutableInfo} NETZ
                    </p>
                  </div>
                  <Switch
                    checked={mutableInfo}
                    onCheckedChange={setMutableInfo}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Renounce Ownership</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow renouncing token ownership permanently
                    </p>
                    <p className="text-sm font-medium text-quantum">
                      Price: {featurePricing.renounceOwnership} NETZ
                    </p>
                  </div>
                  <Switch
                    checked={renounceOwnership}
                    onCheckedChange={setRenounceOwnership}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Quantum Protection</h3>
                    <p className="text-sm text-muted-foreground">
                      Add post-quantum cryptography for enhanced security
                    </p>
                    <p className="text-sm font-medium text-quantum">
                      Price: {featurePricing.quantumProtection} NETZ
                    </p>
                  </div>
                  <Switch
                    checked={quantumProtection}
                    onCheckedChange={setQuantumProtection}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                  >
                    Previous Step
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="bg-quantum hover:bg-quantum-dark"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step3" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Token Logo <span className="text-red-500">*</span></Label>
                    <div className="flex items-center space-x-4">
                      {logoPreview && (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-quantum/30">
                          <img 
                            src={logoPreview} 
                            alt="Token logo preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload a logo for your token (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="liquidity-token">Liquidity Pair <span className="text-red-500">*</span></Label>
                    <Select value={liquidityToken} onValueChange={setLiquidityToken}>
                      <SelectTrigger id="liquidity-token">
                        <SelectValue placeholder="Select token for liquidity pair" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QTM">Quantum Token (QTM)</SelectItem>
                        <SelectItem value="NETZ">NETZ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="liquidity-amount">Initial Liquidity Amount <span className="text-red-500">*</span></Label>
                    <Input
                      id="liquidity-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={liquidityAmount}
                      onChange={(e) => setLiquidityAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Token Name:</p>
                    <p className="font-medium">{name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Symbol:</p>
                    <p className="font-medium">{symbol}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Decimals:</p>
                    <p className="font-medium">{decimals}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Network:</p>
                    <p className="font-medium">
                      {network === "netz-mainnet" ? "NETZ Mainnet" :
                        network === "netz-testnet" ? "NETZ Testnet" : "Quantum Network"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Supply:</p>
                    <p className="font-medium">{parseInt(supply).toLocaleString()} {symbol}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Initial Price:</p>
                    <p className="font-medium">${parseFloat(initialPrice).toFixed(6)} USD</p>
                  </div>
                </div>

                <Separator />

                <h3 className="font-medium">Selected Features:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${mintable ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span>Mintable</span>
                  </li>
                  <li className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${mutableInfo ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span>Mutable Info</span>
                  </li>
                  <li className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${renounceOwnership ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span>Renounce Ownership</span>
                  </li>
                  <li className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${quantumProtection ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span>Quantum Protection</span>
                  </li>
                </ul>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Base Creation Fee:</span>
                    <span>100 NETZ</span>
                  </div>
                  {mintable && (
                    <div className="flex items-center justify-between mb-2">
                      <span>Mintable Feature:</span>
                      <span>{featurePricing.mintable} NETZ</span>
                    </div>
                  )}
                  {mutableInfo && (
                    <div className="flex items-center justify-between mb-2">
                      <span>Mutable Info Feature:</span>
                      <span>{featurePricing.mutableInfo} NETZ</span>
                    </div>
                  )}
                  {renounceOwnership && (
                    <div className="flex items-center justify-between mb-2">
                      <span>Renounce Ownership Feature:</span>
                      <span>{featurePricing.renounceOwnership} NETZ</span>
                    </div>
                  )}
                  {quantumProtection && (
                    <div className="flex items-center justify-between mb-2">
                      <span>Quantum Protection Feature:</span>
                      <span>{featurePricing.quantumProtection} NETZ</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between font-medium">
                    <span>Total Cost:</span>
                    <span className="text-quantum">{totalPrice} NETZ</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                  >
                    Previous Step
                  </Button>
                  <Button
                    onClick={handleCreateToken}
                    className="bg-quantum hover:bg-quantum-dark"
                    disabled={isCreating}
                  >
                    {isCreating ? 
                      "Creating..." : 
                      <>
                        <Coins className="mr-2 h-5 w-5" />
                        Create Token
                      </>
                    }
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenCreation;
