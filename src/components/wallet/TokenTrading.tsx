
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useWallet, Token } from "@/hooks/use-wallet";
import { ArrowRightLeft, Send, Wallet, Coins } from "lucide-react";

export function TokenTrading() {
  const { tokens, sendToken, receiveToken, swapTokens, buyToken, tradeToken, cashOut, canCashOut } = useWallet();
  const { toast } = useToast();
  
  // Send form state
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [sendToken1, setSendToken1] = useState('');
  
  // Receive state
  const [receiveAddress, setReceiveAddress] = useState('');
  
  // Swap form state
  const [swapFromToken, setSwapFromToken] = useState('');
  const [swapToToken, setSwapToToken] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  
  // Buy form state
  const [buyToken1, setBuyToken1] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  
  // Trade form state
  const [tradeToken1, setTradeToken1] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradePrice, setTradePrice] = useState('');
  
  // Cash out form state
  const [cashOutAmount, setCashOutAmount] = useState('');
  const [activeTab, setActiveTab] = useState('send');
  
  // Initialize receive address
  useEffect(() => {
    const address = receiveToken();
    setReceiveAddress(address);
  }, [receiveToken]);
  
  // Handle send token
  const handleSend = () => {
    if (!sendToken1 || !sendAmount || !sendAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const success = sendToken(sendAddress, sendAmount, sendToken1);
    if (success) {
      toast({
        title: "Success",
        description: `${sendAmount} ${sendToken1} sent to ${sendAddress}`,
      });
      setSendAmount('');
      setSendAddress('');
    } else {
      toast({
        title: "Failed",
        description: "Failed to send tokens. Check your balance and try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle swap tokens
  const handleSwap = () => {
    if (!swapFromToken || !swapToToken || !swapAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const success = swapTokens(swapFromToken, swapToToken, swapAmount);
    if (success) {
      toast({
        title: "Success",
        description: `Swapped ${swapAmount} ${swapFromToken} to ${swapToToken}`,
      });
      setSwapAmount('');
    } else {
      toast({
        title: "Failed",
        description: "Failed to swap tokens. Check your balance and try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle buy token
  const handleBuy = () => {
    if (!buyToken1 || !buyAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const success = buyToken(buyToken1, buyAmount);
    if (success) {
      toast({
        title: "Success",
        description: `Bought ${buyAmount} ${buyToken1}`,
      });
      setBuyAmount('');
    } else {
      toast({
        title: "Failed",
        description: "Failed to buy tokens. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle trade token
  const handleTrade = () => {
    if (!tradeToken1 || !tradeAmount || !tradePrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const success = tradeToken(
      tradeToken1, 
      tradeType, 
      tradeAmount, 
      parseFloat(tradePrice)
    );
    
    if (success) {
      toast({
        title: "Success",
        description: `${tradeType === 'buy' ? 'Bought' : 'Sold'} ${tradeAmount} ${tradeToken1} at $${tradePrice} each`,
      });
      setTradeAmount('');
      setTradePrice('');
    } else {
      toast({
        title: "Failed",
        description: `Failed to ${tradeType} tokens. ${tradeType === 'sell' ? 'Check your balance.' : ''} Please try again.`,
        variant: "destructive"
      });
    }
  };
  
  // Handle cash out
  const handleCashOut = () => {
    if (!cashOutAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter an amount",
        variant: "destructive"
      });
      return;
    }
    
    const success = cashOut(cashOutAmount);
    if (success) {
      toast({
        title: "Success",
        description: `Cashed out ${cashOutAmount} NETZ`,
      });
      setCashOutAmount('');
    } else {
      toast({
        title: "Failed",
        description: "Failed to cash out. Check your balance and try again.",
        variant: "destructive"
      });
    }
  };
  
  // Get selected token
  const getSelectedToken = (symbol: string): Token | undefined => {
    return tokens.find(t => t.symbol === symbol);
  };
  
  return (
    <Card className="w-full border-2 border-quantum/30">
      <CardHeader>
        <CardTitle>Token Trading</CardTitle>
        <CardDescription>Send, receive, swap, buy, and trade tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="send" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="send">Send</TabsTrigger>
            <TabsTrigger value="receive">Receive</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
          </TabsList>
          
          {/* Send Tab */}
          <TabsContent value="send">
            <div className="space-y-4">
              <div>
                <Label htmlFor="send-token">Token</Label>
                <Select value={sendToken1} onValueChange={setSendToken1}>
                  <SelectTrigger id="send-token">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="send-amount">Amount</Label>
                <Input
                  id="send-amount"
                  type="number"
                  placeholder="0.00"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
                {sendToken1 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {getSelectedToken(sendToken1)?.balance || '0'} {sendToken1}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="send-address">Recipient Address</Label>
                <Input
                  id="send-address"
                  placeholder="Enter wallet address"
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full bg-quantum hover:bg-quantum-dark" 
                onClick={handleSend}
                disabled={!sendToken1 || !sendAmount || !sendAddress}
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </TabsContent>
          
          {/* Receive Tab */}
          <TabsContent value="receive">
            <div className="space-y-4">
              <div>
                <Label htmlFor="receive-address">Your Wallet Address</Label>
                <div className="flex space-x-2">
                  <Input
                    id="receive-address"
                    value={receiveAddress}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(receiveAddress);
                      toast({
                        title: "Address Copied",
                        description: "Wallet address copied to clipboard",
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-muted/30 text-center">
                <Wallet className="h-16 w-16 mx-auto mb-2 text-quantum" />
                <p className="text-sm">
                  Share this address to receive tokens from other users
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Swap Tab */}
          <TabsContent value="swap">
            <div className="space-y-4">
              <div>
                <Label htmlFor="swap-from-token">From Token</Label>
                <Select value={swapFromToken} onValueChange={setSwapFromToken}>
                  <SelectTrigger id="swap-from-token">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {swapFromToken && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {getSelectedToken(swapFromToken)?.balance || '0'} {swapFromToken}
                  </p>
                )}
              </div>
              
              <div className="relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-background rounded-full p-2 border">
                  <ArrowRightLeft className="h-5 w-5" />
                </div>
                <div className="w-full h-[1px] bg-border" />
              </div>
              
              <div>
                <Label htmlFor="swap-to-token">To Token</Label>
                <Select value={swapToToken} onValueChange={setSwapToToken}>
                  <SelectTrigger id="swap-to-token">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="swap-amount">Amount</Label>
                <Input
                  id="swap-amount"
                  type="number"
                  placeholder="0.00"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                />
              </div>
              
              {swapFromToken && swapToToken && swapAmount && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    Estimated: 
                    {' '}
                    {getSelectedToken(swapFromToken) && getSelectedToken(swapToToken) ? (
                      <>
                        {(parseFloat(swapAmount) * (getSelectedToken(swapFromToken)!.value / getSelectedToken(swapToToken)!.value)).toFixed(4)}
                        {' '}
                        {swapToToken}
                      </>
                    ) : '...'}
                  </p>
                </div>
              )}
              
              <Button 
                className="w-full bg-quantum hover:bg-quantum-dark" 
                onClick={handleSwap}
                disabled={!swapFromToken || !swapToToken || !swapAmount}
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Swap
              </Button>
            </div>
          </TabsContent>
          
          {/* Buy Tab */}
          <TabsContent value="buy">
            <div className="space-y-4">
              <div>
                <Label htmlFor="buy-token">Token</Label>
                <Select value={buyToken1} onValueChange={setBuyToken1}>
                  <SelectTrigger id="buy-token">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="buy-amount">Amount</Label>
                <Input
                  id="buy-amount"
                  type="number"
                  placeholder="0.00"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                />
              </div>
              
              {buyToken1 && buyAmount && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    Total Cost: ${(parseFloat(buyAmount) * (getSelectedToken(buyToken1)?.value || 0)).toFixed(2)}
                  </p>
                </div>
              )}
              
              <Button 
                className="w-full bg-quantum hover:bg-quantum-dark" 
                onClick={handleBuy}
                disabled={!buyToken1 || !buyAmount}
              >
                Buy {buyToken1 || 'Token'}
              </Button>
            </div>
          </TabsContent>
          
          {/* Trade Tab */}
          <TabsContent value="trade">
            <div className="space-y-4">
              <div>
                <Label htmlFor="trade-type">Action</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tradeType === 'buy' ? 'default' : 'outline'}
                    className={tradeType === 'buy' ? 'bg-quantum hover:bg-quantum-dark' : ''}
                    onClick={() => setTradeType('buy')}
                  >
                    Buy
                  </Button>
                  <Button
                    variant={tradeType === 'sell' ? 'default' : 'outline'}
                    className={tradeType === 'sell' ? 'bg-quantum hover:bg-quantum-dark' : ''}
                    onClick={() => setTradeType('sell')}
                  >
                    Sell
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="trade-token">Token</Label>
                <Select value={tradeToken1} onValueChange={setTradeToken1}>
                  <SelectTrigger id="trade-token">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {tradeToken1 && tradeType === 'sell' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {getSelectedToken(tradeToken1)?.balance || '0'} {tradeToken1}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="trade-amount">Amount</Label>
                <Input
                  id="trade-amount"
                  type="number"
                  placeholder="0.00"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="trade-price">Price per Token ($)</Label>
                <Input
                  id="trade-price"
                  type="number"
                  placeholder="0.00"
                  value={tradePrice}
                  onChange={(e) => setTradePrice(e.target.value)}
                />
              </div>
              
              {tradeToken1 && tradeAmount && tradePrice && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    Total: ${(parseFloat(tradeAmount) * parseFloat(tradePrice)).toFixed(2)}
                  </p>
                </div>
              )}
              
              <Button 
                className="w-full bg-quantum hover:bg-quantum-dark" 
                onClick={handleTrade}
                disabled={!tradeToken1 || !tradeAmount || !tradePrice}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {tradeToken1 || 'Token'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Cash Out section */}
        <div className="mt-4 border-t pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Cash Out</h4>
                <p className="text-xs text-muted-foreground">
                  Convert NETZ coins to real money (requires at least 100 NETZ)
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={cashOutAmount}
                  onChange={(e) => setCashOutAmount(e.target.value)}
                  className="w-32"
                  disabled={!canCashOut()}
                />
                <Button 
                  className={canCashOut() ? "bg-quantum hover:bg-quantum-dark" : "bg-muted text-muted-foreground cursor-not-allowed"}
                  disabled={!canCashOut() || !cashOutAmount}
                  onClick={handleCashOut}
                >
                  <Coins className="mr-2 h-4 w-4" />
                  Cash Out
                </Button>
              </div>
            </div>
            
            {!canCashOut() && (
              <div className="bg-muted p-3 rounded-md text-sm text-center">
                You need at least 100 NETZ coins to cash out
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
