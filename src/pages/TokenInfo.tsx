
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useWalletContext, TokenInfo as WalletTokenInfo } from '@/lib/wallet/wallet-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, Send, Coins, Clock, User, Award, Info } from "lucide-react";
import PredictionGame from '@/components/prediction/PredictionGame';
import Leaderboard from '@/components/prediction/Leaderboard';
import { getAdminSettings } from '@/lib/admin/admin-settings';

const TokenInfoPage = () => {
  const { address } = useParams<{ address: string }>();
  const { toast } = useToast();
  const { tokens, buyToken, sellToken, sendTokens } = useWalletContext();
  
  const [token, setToken] = useState<WalletTokenInfo | null>(null);
  const [amount, setAmount] = useState("0");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Load admin settings to check if prediction game is enabled
  const adminSettings = getAdminSettings();
  
  useEffect(() => {
    // Find the token in the wallet
    const foundToken = tokens.find(t => t.id === address);
    if (foundToken) {
      setToken(foundToken);
    }
  }, [address, tokens]);
  
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-6">
          <Button variant="outline" asChild className="mr-4">
            <Link to="/wallet">
              Back to Wallet
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Token Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <Info className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Token Not Found</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                The token you're looking for doesn't exist or is not in your wallet.
              </p>
              <Button asChild>
                <Link to="/wallet">
                  Return to Wallet
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    const success = await buyToken(token.id, parseFloat(amount));
    setIsProcessing(false);
    
    if (success) {
      toast({
        title: "Purchase Successful",
        description: `You have purchased ${amount} ${token.symbol}.`,
      });
      setAmount("0");
    } else {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase.",
        variant: "destructive",
      });
    }
  };

  const handleSell = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }
    
    if (parseFloat(amount) > token.balance) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${token.balance} ${token.symbol}.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    const success = await sellToken(token.id, parseFloat(amount));
    setIsProcessing(false);
    
    if (success) {
      toast({
        title: "Sale Successful",
        description: `You have sold ${amount} ${token.symbol}.`,
      });
      setAmount("0");
    } else {
      toast({
        title: "Sale Failed",
        description: "There was an error processing your sale.",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }
    
    if (parseFloat(amount) > token.balance) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${token.balance} ${token.symbol}.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!recipientAddress) {
      toast({
        title: "Invalid recipient",
        description: "Please enter a recipient address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    const success = await sendTokens(recipientAddress, parseFloat(amount), token.id);
    setIsProcessing(false);
    setShowSendDialog(false);
    
    if (success) {
      toast({
        title: "Transfer Successful",
        description: `You have sent ${amount} ${token.symbol} to ${recipientAddress.substring(0, 8)}...`,
      });
      setAmount("0");
      setRecipientAddress("");
    } else {
      toast({
        title: "Transfer Failed",
        description: "There was an error processing your transfer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild className="mr-4">
          <Link to="/wallet">
            Back to Wallet
          </Link>
        </Button>
        <div className="flex items-center">
          {token.logoUrl && (
            <img 
              src={token.logoUrl} 
              alt={token.name} 
              className="w-10 h-10 mr-3 rounded-full" 
            />
          )}
          <h1 className="text-3xl font-bold">{token.name}</h1>
          <Badge className="ml-3 bg-primary/20 text-primary hover:bg-primary/30">
            {token.symbol}
          </Badge>
        </div>
      </div>
      
      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trade">Trade</TabsTrigger>
          {adminSettings.predictionGame.enabled && (
            <TabsTrigger value="predict">Predict</TabsTrigger>
          )}
          {adminSettings.leaderboard.enabled && (
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <div className="text-lg font-medium">{token.name}</div>
                </div>
                <div>
                  <Label>Symbol</Label>
                  <div className="text-lg font-medium">{token.symbol}</div>
                </div>
                <div>
                  <Label>Price</Label>
                  <div className="text-lg font-medium">${token.price.toFixed(6)}</div>
                </div>
                <div>
                  <Label>24h Change</Label>
                  <div className={`text-lg font-medium ${
                    token.change24h > 0 ? 'text-green-500' : token.change24h < 0 ? 'text-red-500' : ''
                  }`}>
                    {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                  </div>
                </div>
                {token.creator && (
                  <div>
                    <Label>Created By</Label>
                    <div className="text-md truncate">{token.creator}</div>
                  </div>
                )}
                {token.timestamp && (
                  <div>
                    <Label>Created On</Label>
                    <div className="text-md">{new Date(token.timestamp).toLocaleDateString()}</div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Amount</Label>
                  <div className="text-2xl font-bold">{token.balance.toFixed(6)} {token.symbol}</div>
                </div>
                <div>
                  <Label>Value</Label>
                  <div className="text-xl">${(token.balance * token.price).toFixed(2)} USD</div>
                </div>
                <div className="pt-4">
                  <Button onClick={() => setShowSendDialog(true)} className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send {token.symbol}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Token Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Total Supply</Label>
                  <div className="text-lg font-medium">
                    {token.totalSupply?.toLocaleString() || "Unknown"}
                  </div>
                </div>
                {token.liquidity && (
                  <div>
                    <Label>Liquidity</Label>
                    <div className="text-lg font-medium">
                      {token.liquidity.amount} {token.liquidity.token}
                    </div>
                  </div>
                )}
                {token.description && (
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {token.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trade" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Buy {token.symbol}</CardTitle>
                <CardDescription>Purchase tokens with NETZ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Amount to Buy</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                    <span className="font-medium">{token.symbol}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between">
                      <span>Rate</span>
                      <span>1 {token.symbol} = ${token.price.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>Total</span>
                      <span>${(parseFloat(amount || "0") * token.price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleBuy} 
                  disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                >
                  <Coins className="mr-2 h-4 w-4" />
                  Buy {token.symbol}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sell {token.symbol}</CardTitle>
                <CardDescription>Sell tokens for NETZ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Amount to Sell</Label>
                    <span className="text-sm text-muted-foreground">
                      Balance: {token.balance} {token.symbol}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                    <span className="font-medium">{token.symbol}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between">
                      <span>Rate</span>
                      <span>1 {token.symbol} = ${token.price.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>Total</span>
                      <span>${(parseFloat(amount || "0") * token.price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleSell} 
                  disabled={
                    isProcessing || 
                    !amount || 
                    parseFloat(amount) <= 0 || 
                    parseFloat(amount) > token.balance
                  }
                >
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  Sell {token.symbol}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {adminSettings.predictionGame.enabled && (
          <TabsContent value="predict" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
                      {/* In a real app, this would be a chart component */}
                      <p className="text-muted-foreground">Price chart would be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <PredictionGame token={token} currentPrice={token.price} />
              </div>
            </div>
          </TabsContent>
        )}
        
        {adminSettings.leaderboard.enabled && (
          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>
        )}
      </Tabs>
      
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send {token.symbol}</DialogTitle>
            <DialogDescription>
              Transfer {token.symbol} tokens to another wallet address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Recipient Address</Label>
              <Input
                placeholder="Enter wallet address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Amount</Label>
                <span className="text-sm text-muted-foreground">
                  Balance: {token.balance} {token.symbol}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
                <span className="font-medium">{token.symbol}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendDialog(false)}>Cancel</Button>
            <Button onClick={handleSend} disabled={isProcessing}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TokenInfoPage;
