
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Send, Plus, ArrowDownUp, Clock, Shield, Key, Lock, X, Check, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WebMiner } from "@/components/wallet/WebMiner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const Wallet = () => {
  const { isAuthenticated, user } = useAuth();
  const { 
    wallet, 
    tokens,
    isUnlocked,
    seedPhrase,
    seedPhraseShown,
    isLoading,
    createWallet, 
    lockWallet, 
    sendToken,
    showSeedPhrase,
    hideSeedPhrase,
    restoreWallet,
    confirmSeedPhraseSaved
  } = useWallet();
  
  const { toast } = useToast();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showSeedDialog, setShowSeedDialog] = useState(false);
  const [backupConfirmed, setBackupConfirmed] = useState(false);
  const [autoLockTimeout, setAutoLockTimeout] = useState(5);
  const [exportPrivateKeyDialog, setExportPrivateKeyDialog] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    enableAutoLock: true,
    requirePasswordForSend: true
  });
  
  // Load security settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('securitySettings');
    if (savedSettings) {
      setSecuritySettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Save security settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
  }, [securitySettings]);
  
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
        description: "Please enter a private key or recovery phrase",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use restoreWallet function to import wallet
      const success = await restoreWallet(privateKey, "password");
      
      if (success) {
        toast({
          title: "Wallet Restored",
          description: "Successfully imported wallet",
        });
        setPrivateKey("");
      } else {
        throw new Error("Import failed");
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Invalid private key or recovery phrase",
        variant: "destructive",
      });
    }
  };

  const handleViewSeedPhrase = () => {
    showSeedPhrase();
    setShowSeedDialog(true);
  };

  const handleCloseSeedDialog = () => {
    hideSeedPhrase();
    setShowSeedDialog(false);
  };

  const handleBackupConfirmed = () => {
    setBackupConfirmed(true);
    confirmSeedPhraseSaved();
    handleCloseSeedDialog();
    toast({
      title: "Backup Confirmed",
      description: "Thank you for backing up your recovery phrase",
    });
  };

  const handleToggleAutoLock = (checked: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      enableAutoLock: checked
    }));
    
    toast({
      title: checked ? "Auto Lock Enabled" : "Auto Lock Disabled",
      description: checked 
        ? `Your wallet will lock automatically after ${autoLockTimeout} minutes of inactivity` 
        : "Your wallet will stay unlocked until you manually lock it",
    });
  };
  
  const handleTogglePasswordForSend = (checked: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      requirePasswordForSend: checked
    }));
    
    toast({
      title: checked ? "Password Required" : "Password Not Required",
      description: checked 
        ? "You will need to enter your password for every transaction" 
        : "Transactions can be sent without password confirmation",
    });
  };

  const handleExportPrivateKey = () => {
    setExportPrivateKeyDialog(true);
  };

  const handleCreateWallet = async () => {
    try {
      const success = await createWallet("password");
      
      if (success) {
        // Automatically show recovery phrase dialog after wallet creation
        setTimeout(() => {
          showSeedPhrase();
          setShowSeedDialog(true);
        }, 500);
      }
    } catch (error) {
      toast({
        title: "Wallet Creation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const downloadBackup = () => {
    if (!wallet) return;
    
    const backupData = {
      walletAddress: wallet.address,
      recoveryPhrase: seedPhrase,
      createdAt: new Date().toISOString()
    };
    
    const jsonData = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `quantum-wallet-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Backup Downloaded",
      description: "Keep this file in a secure location",
    });
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
            <Button 
              onClick={handleCreateWallet} 
              className="w-full"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Wallet
            </Button>
            
            <div className="space-y-2 mt-6">
              <div className="flex justify-between items-center">
                <Label htmlFor="privateKey">Import Existing Wallet</Label>
                <div className="text-xs text-muted-foreground">
                  Enter private key or recovery phrase
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Input
                  id="privateKey"
                  placeholder="Enter private key or recovery phrase"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  type="password"
                  className="mb-2"
                />
                <Button 
                  onClick={handleImport} 
                  disabled={isLoading || !privateKey}
                  className="w-full"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Import Wallet
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
            <CardFooter>
              <Button 
                onClick={lockWallet} 
                variant="outline" 
                className="w-full"
              >
                <Lock className="mr-2 h-4 w-4" />
                Lock Wallet
              </Button>
            </CardFooter>
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
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Auto-lock Wallet</h4>
                        <p className="text-sm text-muted-foreground">
                          Lock your wallet after a period of inactivity
                        </p>
                      </div>
                      <Switch 
                        checked={securitySettings.enableAutoLock}
                        onCheckedChange={handleToggleAutoLock}
                      />
                    </div>
                    
                    {securitySettings.enableAutoLock && (
                      <div className="pl-4 border-l-2 border-muted">
                        <Label htmlFor="timeout">Auto-lock Timeout (minutes)</Label>
                        <Input
                          id="timeout"
                          type="number"
                          value={autoLockTimeout}
                          onChange={(e) => setAutoLockTimeout(parseInt(e.target.value) || 1)}
                          min="1"
                          max="60"
                          className="w-full md:w-1/2 mt-1"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Require Password for Transactions</h4>
                        <p className="text-sm text-muted-foreground">
                          Ask for password confirmation before sending transactions
                        </p>
                      </div>
                      <Switch 
                        checked={securitySettings.requirePasswordForSend}
                        onCheckedChange={handleTogglePasswordForSend}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-3">Recovery Options</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full" onClick={handleViewSeedPhrase}>
                        <Key className="mr-2 h-4 w-4" />
                        View Recovery Phrase
                      </Button>
                      
                      <Button variant="outline" className="w-full" onClick={handleExportPrivateKey}>
                        <Shield className="mr-2 h-4 w-4" />
                        Export Private Key
                      </Button>

                      <Button variant="outline" className="w-full" onClick={downloadBackup}>
                        <Download className="mr-2 h-4 w-4" />
                        Backup Wallet
                      </Button>
                    </div>
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
      
      {/* Seed Phrase Dialog */}
      <Dialog open={showSeedDialog} onOpenChange={setShowSeedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Recovery Phrase</DialogTitle>
            <DialogDescription>
              These 12 words are the only way to recover your wallet if you lose access.
              Write them down and store them in a safe place.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-md my-4">
            <div className="font-mono text-center break-all">
              {seedPhrase || "Loading..."}
            </div>
            {seedPhrase && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {seedPhrase.split(" ").map((word, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-muted-foreground text-xs mr-1">{index + 1}.</span>
                    <span className="font-mono text-sm">{word}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 rounded-md">
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              <strong>Warning:</strong> Never share your recovery phrase with anyone. Anyone with these words can take your funds.
            </p>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline"
              onClick={handleCloseSeedDialog}
            >
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            
            <Button 
              onClick={handleBackupConfirmed}
            >
              <Check className="mr-2 h-4 w-4" />
              I've Backed It Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Private Key Dialog */}
      <Dialog open={exportPrivateKeyDialog} onOpenChange={setExportPrivateKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Private Key</DialogTitle>
            <DialogDescription>
              Your private key gives complete control over your wallet. Never share it with anyone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-md my-4">
            <div className="font-mono text-center break-all">
              {wallet?.keyPair?.privateKey || "****************"}
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 rounded-md">
            <p className="text-red-800 dark:text-red-300 text-sm">
              <strong>Danger:</strong> Anyone with access to your private key has complete control over your wallet.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setExportPrivateKeyDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wallet;
