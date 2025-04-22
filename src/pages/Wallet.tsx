
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Send, Plus, ArrowDownUp, Clock, Shield, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WebMiner } from "@/components/wallet/WebMiner";

const Wallet = () => {
  const { isAuthenticated, user } = useAuth();
  const { 
    wallet, 
    tokens,
    isUnlocked, 
    createWallet, 
    lockWallet, 
    sendToken,
    restoreWallet, // Changed from importWallet to restoreWallet to match the hook
    isLoading 
  } = useWallet();
  
  const { toast } = useToast();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'receive', amount: '50', from: '0x1234...5678', timestamp: Date.now() - 86400000 },
    { id: 2, type: 'send', amount: '10', to: '0x8765...4321', timestamp: Date.now() - 43200000 },
    { id: 3, type: 'receive', amount: '25', from: '0x9876...3456', timestamp: Date.now() - 3600000 },
  ]);

  const getBalance = () => {
    if (!tokens || tokens.length === 0) return "0";
    const qtmToken = tokens.find(t => t.symbol === "QTM");
    return qtmToken ? qtmToken.balance : "0";
  };

  const handleCopyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleSend = async () => {
    if (!recipient || !amount) {
      toast({
        title: "Error",
        description: "Please enter recipient address and amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = sendToken(recipient, amount, "QTM");
      
      if (success) {
        toast({
          title: "Transaction Sent",
          description: `Successfully sent ${amount} NETZ to ${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}`,
        });
        setRecipient("");
        setAmount("");
        
        setTransactions([
          {
            id: Date.now(),
            type: 'send',
            amount,
            to: recipient,
            timestamp: Date.now()
          },
          ...transactions
        ]);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!privateKey) {
      toast({
        title: "Error",
        description: "Please enter a private key",
        variant: "destructive",
      });
      return;
    }

    try {
      // Changed from importWalletFn to restoreWallet to match the hook
      const success = await restoreWallet(privateKey, "");
      
      if (success) {
        toast({
          title: "Wallet Imported",
          description: "Successfully imported wallet",
        });
        setPrivateKey("");
      } else {
        throw new Error("Import failed");
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Invalid private key",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access your wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You need to be logged in to view and manage your wallet.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>
      
      {!wallet ? (
        <Card>
          <CardHeader>
            <CardTitle>Create or Import Wallet</CardTitle>
            <CardDescription>Get started with your Quantum wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => createWallet("")} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create New Wallet
            </Button>
            
            <div className="space-y-2">
              <Label htmlFor="privateKey">Import Existing Wallet</Label>
              <div className="flex space-x-2">
                <Input
                  id="privateKey"
                  placeholder="Enter private key"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  type="password"
                />
                <Button onClick={handleImport} disabled={isLoading}>
                  <Key className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
              <CardDescription>Your current balance and wallet address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="text-4xl font-bold">{getBalance()} NETZ</span>
              </div>
              
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Wallet Address</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-muted p-2 rounded text-xs md:text-sm w-full overflow-x-auto">
                    {wallet.address}
                  </code>
                  <Button variant="outline" size="icon" onClick={handleCopyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="send" className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="send">
                <Send className="mr-2 h-4 w-4" />
                Send
              </TabsTrigger>
              <TabsTrigger value="transactions">
                <ArrowDownUp className="mr-2 h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="send">
              <Card>
                <CardHeader>
                  <CardTitle>Send NETZ</CardTitle>
                  <CardDescription>Transfer tokens to another wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (NETZ)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleSend} 
                    disabled={isLoading || !recipient || !amount}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Transaction
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Recent transactions from your wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.length > 0 ? (
                      transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-3 ${tx.type === 'receive' ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
                              {tx.type === 'receive' ? (
                                <ArrowDownUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.amount} NETZ
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tx.type === 'receive' ? `From: ${tx.from}` : `To: ${tx.to}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No transactions yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Security</CardTitle>
                  <CardDescription>Manage your wallet security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Auto-lock Timeout (minutes)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      defaultValue="5"
                      min="1"
                      max="60"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Key className="mr-2 h-4 w-4" />
                      Export Private Key
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      Backup Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Mining</h2>
        <WebMiner isLoggedIn={isAuthenticated} />
      </div>
    </div>
  );
};

export default Wallet;
