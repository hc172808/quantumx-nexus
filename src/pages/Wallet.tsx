
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/use-wallet";
import { Shield, Send, Wallet as WalletIcon, Swap, Cash } from "lucide-react";
import { TokenTrading } from "@/components/wallet/TokenTrading";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Wallet = () => {
  const {
    isLoading,
    hasWallet,
    isUnlocked,
    wallet,
    tokens,
    seedPhrase,
    seedPhraseShown,
    banInfo,
    createWallet,
    unlockWallet,
    restoreWallet,
    showSeedPhrase,
    hideSeedPhrase,
    canCashOut,
  } = useWallet();

  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"default" | "create" | "restore" | "show_phrase" | "verify_phrase">("default");
  const [verifyIndex1, setVerifyIndex1] = useState(Math.floor(Math.random() * 6));
  const [verifyIndex2, setVerifyIndex2] = useState(6 + Math.floor(Math.random() * 6));
  const [verifyWord1, setVerifyWord1] = useState("");
  const [verifyWord2, setVerifyWord2] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "trading" | "history">("overview");

  // Handle wallet creation
  const handleCreateWallet = async () => {
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const success = await createWallet(password);
    if (success) {
      setStep("show_phrase");
    } else {
      setError("Failed to create wallet");
    }
  };

  // Handle wallet unlock
  const handleUnlockWallet = async () => {
    setError(null);
    
    if (password.length < 1) {
      setError("Password required");
      return;
    }

    const success = await unlockWallet(password);
    if (!success) {
      setError("Invalid password or wallet locked due to too many attempts");
    }
  };

  // Handle wallet restore
  const handleRestoreWallet = async () => {
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const success = await restoreWallet(mnemonic, password);
    if (!success) {
      setError("Failed to restore wallet. Check that your recovery phrase is correct.");
    }
  };

  // Handle verify seed phrase
  const handleVerifySeedPhrase = () => {
    if (!seedPhrase) return;
    
    const words = seedPhrase.split(' ');
    if (words[verifyIndex1] === verifyWord1 && words[verifyIndex2] === verifyWord2) {
      hideSeedPhrase();
      setStep("default");
    } else {
      setError("Words don't match. Please try again.");
    }
  };

  // Show wallet creation screen
  if (step === "create") {
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card className="border-2 border-quantum/30">
          <CardHeader>
            <CardTitle className="text-center">Create New Wallet</CardTitle>
            <CardDescription className="text-center">
              Create a new quantum-protected HD wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="bg-muted rounded-md p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Important:</strong> We do not store your password or recovery phrase.
                You are fully responsible for keeping them safe.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("default")}>Back</Button>
            <Button 
              className="bg-quantum hover:bg-quantum-dark"
              disabled={isLoading || !password || !confirmPassword}
              onClick={handleCreateWallet}
            >
              {isLoading ? "Creating..." : "Create Wallet"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show wallet restore screen
  if (step === "restore") {
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card className="border-2 border-quantum/30">
          <CardHeader>
            <CardTitle className="text-center">Restore Wallet</CardTitle>
            <CardDescription className="text-center">
              Enter your recovery phrase to restore your wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recovery Phrase</label>
              <Input
                type="text"
                placeholder="Enter 12 or 24 word phrase separated by spaces"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <Input
                type="password"
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("default")}>Back</Button>
            <Button 
              className="bg-quantum hover:bg-quantum-dark"
              disabled={isLoading || !mnemonic || !password || !confirmPassword}
              onClick={handleRestoreWallet}
            >
              {isLoading ? "Restoring..." : "Restore Wallet"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show seed phrase screen
  if (step === "show_phrase" && seedPhrase && seedPhraseShown) {
    const words = seedPhrase.split(' ');
    
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card className="border-2 border-quantum/30">
          <CardHeader>
            <CardTitle className="text-center">Your Recovery Phrase</CardTitle>
            <CardDescription className="text-center text-red-500 font-bold">
              This is your recovery phrase. If you lose it, you lose access to your wallet. We cannot recover it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2 p-4 bg-muted rounded-lg" style={{ userSelect: "none" }}>
              {words.map((word, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-muted-foreground mr-1">{index + 1}.</span>
                  <span className="font-mono">{word}</span>
                </div>
              ))}
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">
                <strong>IMPORTANT!</strong> Write down this phrase in the correct order and keep it secure. 
                Screenshots are not secure. Anyone with access to this phrase can access your funds.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-quantum hover:bg-quantum-dark"
              onClick={() => setStep("verify_phrase")}
            >
              I've Stored it Securely
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Verify seed phrase screen
  if (step === "verify_phrase" && seedPhrase) {
    const words = seedPhrase.split(' ');
    
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card className="border-2 border-quantum/30">
          <CardHeader>
            <CardTitle className="text-center">Verify Recovery Phrase</CardTitle>
            <CardDescription className="text-center">
              Please verify words from your recovery phrase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Word #{verifyIndex1 + 1}</label>
              <Input
                type="text"
                placeholder={`Enter word #${verifyIndex1 + 1}`}
                value={verifyWord1}
                onChange={(e) => setVerifyWord1(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Word #{verifyIndex2 + 1}</label>
              <Input
                type="text"
                placeholder={`Enter word #${verifyIndex2 + 1}`}
                value={verifyWord2}
                onChange={(e) => setVerifyWord2(e.target.value)}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-quantum hover:bg-quantum-dark"
              onClick={handleVerifySeedPhrase}
            >
              Verify & Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Wallet is unlocked - show wallet dashboard
  if (isUnlocked && wallet) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Wallet Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Wallet Overview</CardTitle>
                  <CardDescription>Manage your digital assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Your Address</p>
                    <div className="bg-muted p-3 rounded-md font-mono text-xs break-all">
                      {wallet.address}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Your Assets</h3>
                    {tokens.length > 0 ? (
                      <div className="space-y-3">
                        {tokens.map((token, index) => (
                          <div key={index} className="flex justify-between items-center bg-card p-3 rounded-lg border">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-muted rounded-full mr-3"></div>
                              <div>
                                <p className="font-medium">{token.name}</p>
                                <p className="text-xs text-muted-foreground">{token.symbol}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{token.balance}</p>
                              <p className="text-xs text-muted-foreground">
                                ${(parseFloat(token.balance) * token.value).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No assets yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Action Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      setActiveTab("trading");
                      document.querySelector('[value="trading"]')?.dispatchEvent(
                        new MouseEvent('click', { bubbles: true })
                      );
                    }}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      setActiveTab("trading");
                      document.querySelector('[value="trading"]')?.dispatchEvent(
                        new MouseEvent('click', { bubbles: true })
                      );
                      toast({
                        title: "Receive Tokens",
                        description: "Switch to the Receive tab to get your wallet address",
                      });
                    }}
                  >
                    <WalletIcon className="mr-2 h-4 w-4" />
                    Receive
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      setActiveTab("trading");
                      document.querySelector('[value="trading"]')?.dispatchEvent(
                        new MouseEvent('click', { bubbles: true })
                      );
                    }}
                  >
                    <Swap className="mr-2 h-4 w-4" />
                    Swap
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      setActiveTab("trading");
                      document.querySelector('[value="trading"]')?.dispatchEvent(
                        new MouseEvent('click', { bubbles: true })
                      );
                    }}
                  >
                    Buy
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      setActiveTab("trading");
                      document.querySelector('[value="trading"]')?.dispatchEvent(
                        new MouseEvent('click', { bubbles: true })
                      );
                    }}
                  >
                    Trade
                  </Button>
                  <div className="pt-4 border-t">
                    <Button 
                      className="w-full bg-quantum hover:bg-quantum-dark" 
                      onClick={showSeedPhrase}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Backup Wallet
                    </Button>
                  </div>
                  <div>
                    <Button 
                      className="w-full" 
                      variant={canCashOut() ? "default" : "outline"}
                      disabled={!canCashOut()}
                      onClick={() => {
                        if (canCashOut()) {
                          setActiveTab("trading");
                          document.querySelector('[value="trading"]')?.dispatchEvent(
                            new MouseEvent('click', { bubbles: true })
                          );
                          toast({
                            title: "Cash Out",
                            description: "Use the Cash Out section at the bottom of the trading panel",
                          });
                        } else {
                          toast({
                            title: "Cash Out Unavailable",
                            description: "You need at least 100 NETZ to cash out",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <Cash className="mr-2 h-4 w-4" />
                      Cash Out {!canCashOut() && "(Need 100 NETZ)"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Trading Tab */}
          <TabsContent value="trading">
            <TokenTrading />
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent wallet activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No transaction history yet
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Wallet exists but locked - show unlock screen
  if (hasWallet && !isUnlocked) {
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card className="border-2 border-quantum/30">
          <CardHeader>
            <CardTitle className="text-center">Unlock Your Wallet</CardTitle>
            <CardDescription className="text-center">
              Enter your password to access your wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            {banInfo && (
              <div className="bg-destructive/10 p-3 rounded-md">
                <p className="text-sm text-destructive">
                  Too many failed attempts. Please try again in {Math.ceil(banInfo.remainingSeconds / 60)} minutes.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-quantum hover:bg-quantum-dark"
              disabled={isLoading || !password || !!banInfo}
              onClick={handleUnlockWallet}
            >
              {isLoading ? "Unlocking..." : "Unlock Wallet"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Default: No wallet - show options
  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <Card className="border-2 border-quantum/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-quantum/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-quantum" />
          </div>
          <CardTitle>Quantum-Protected Wallet</CardTitle>
          <CardDescription>
            Create or restore a wallet with quantum-safe cryptography
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full bg-quantum hover:bg-quantum-dark" 
            size="lg"
            onClick={() => setStep("create")}
          >
            Create New Wallet
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            size="lg"
            onClick={() => setStep("restore")}
          >
            Restore Existing Wallet
          </Button>
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              All wallet keys are created and stored locally with client-side encryption.
              We never have access to your keys or funds.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
