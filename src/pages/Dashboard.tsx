import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Lock, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { isUnlocked, tokens, setLockoutTime } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLockout, setSelectedLockout] = useState<string>("default");
  
  // Redirect to wallet page if not unlocked
  useEffect(() => {
    if (!isUnlocked) {
      navigate("/wallet");
    }
  }, [isUnlocked, navigate]);

  // Calculate total portfolio value
  const totalValue = tokens.reduce(
    (total, token) => total + parseFloat(token.balance) * token.value,
    0
  );

  const handleLockoutChange = (value: string) => {
    setSelectedLockout(value);
    
    // Convert string to seconds
    let lockoutSeconds = 0;
    
    switch(value) {
      case "15s":
        lockoutSeconds = 15;
        break;
      case "30s":
        lockoutSeconds = 30;
        break;
      case "1m":
        lockoutSeconds = 60;
        break;
      case "5m":
        lockoutSeconds = 300;
        break;
      case "default":
        lockoutSeconds = 0; // Use system default
        break;
    }
    
    if (setLockoutTime(lockoutSeconds)) {
      toast({
        title: "Lockout Time Updated",
        description: value === "default" 
          ? "Using system default lockout periods" 
          : `Account lockout time set to ${value}`,
      });
    }
  };

  if (!isUnlocked) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Value</CardDescription>
                <CardTitle className="text-2xl">${totalValue.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Assets</CardDescription>
                <CardTitle className="text-2xl">{tokens.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Security Status</CardDescription>
                <CardTitle className="text-2xl text-blockchain-success">Protected</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Network</CardDescription>
                <CardTitle className="text-2xl">Quantum Net</CardTitle>
              </CardHeader>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest transactions and operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity to display
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline" onClick={() => navigate("/wallet")}>
                    View Wallet
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => navigate("/marketplace")}>
                    Trade Assets
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => navigate("/token-creation")}>
                    Create Token
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure your security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="lockout-time">Account Lockout Time</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Set how long your account is locked out after multiple failed password attempts
                  </p>
                  
                  <Select
                    value={selectedLockout}
                    onValueChange={handleLockoutChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select lockout duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">System Default</SelectItem>
                      <SelectItem value="15s">15 seconds</SelectItem>
                      <SelectItem value="30s">30 seconds</SelectItem>
                      <SelectItem value="1m">1 minute</SelectItem>
                      <SelectItem value="5m">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Security Level</Label>
                  <div className="bg-muted p-4 rounded-md flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Quantum Protection</h4>
                      <p className="text-sm text-muted-foreground">Your account is protected with quantum encryption</p>
                    </div>
                    <Shield className="h-6 w-6 text-quantum" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Security Options</Label>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/change-password")}
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SlidersHorizontal className="mr-2 h-5 w-5" />
                  Account Preferences
                </CardTitle>
                <CardDescription>
                  Manage your account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="notification-settings">Notification Settings</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose when you receive notifications
                  </p>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notify-transactions" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="notify-transactions">Transaction alerts</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notify-price" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="notify-price">Price movements</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notify-security" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="notify-security">Security alerts</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
