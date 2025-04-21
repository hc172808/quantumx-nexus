
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { isUnlocked, tokens } = useWallet();
  const navigate = useNavigate();
  
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

  if (!isUnlocked) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
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
    </div>
  );
};

export default Dashboard;
