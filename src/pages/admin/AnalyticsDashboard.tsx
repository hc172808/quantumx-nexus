
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data for the dashboard
const mockData = {
  userStats: {
    totalUsers: 2456,
    activeToday: 843,
    newToday: 156,
    averageSessionTime: "18m 32s",
  },
  predictionStats: {
    totalPredictions: 12849,
    upPredictions: 7322,
    downPredictions: 5527,
    averageBetAmount: 125.32,
    mostPredictedToken: "QTM",
  },
  winRateStats: {
    overall: 0.52,
    byTimeframe: {
      "30s": 0.48,
      "1m": 0.51,
      "5m": 0.54,
      "30m": 0.56,
    },
  },
  tokenStats: [
    { symbol: "QTM", predictions: 4325, volume: 543210, winRate: 0.53 },
    { symbol: "NETZ", predictions: 3211, volume: 421500, winRate: 0.49 },
    { symbol: "BTC", predictions: 2819, volume: 982450, winRate: 0.52 },
    { symbol: "ETH", predictions: 2494, volume: 745230, winRate: 0.51 },
  ],
};

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("week");
  const [refreshRate, setRefreshRate] = useState("5m");
  
  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export is being prepared.",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 hours</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 365 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={refreshRate} onValueChange={setRefreshRate}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Refresh Rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportData}>
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockData.userStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ 12%</span> from last {timeRange}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockData.userStats.activeToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ 8%</span> from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockData.predictionStats.totalPredictions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ 18%</span> from last {timeRange}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(mockData.winRateStats.overall * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500">↓ 2%</span> from last {timeRange}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Distribution</CardTitle>
                <CardDescription>UP vs DOWN predictions over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
                  {/* In a real app, this would be a chart component */}
                  <p className="text-muted-foreground">Chart: UP vs DOWN predictions trend</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Win Rate by Timeframe</CardTitle>
                <CardDescription>Success rate for different prediction timeframes</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
                  {/* In a real app, this would be a chart component */}
                  <p className="text-muted-foreground">Chart: Win rate comparison by timeframe</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>Platform usage over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
                {/* In a real app, this would be a chart component */}
                <p className="text-muted-foreground">Chart: User activity and predictions over time</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Metrics</CardTitle>
              <CardDescription>Detailed prediction analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Total Predictions</p>
                    <p className="text-2xl font-bold">{mockData.predictionStats.totalPredictions.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">UP Predictions</p>
                    <p className="text-2xl font-bold">{mockData.predictionStats.upPredictions.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">DOWN Predictions</p>
                    <p className="text-2xl font-bold">{mockData.predictionStats.downPredictions.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Average Bet</p>
                    <p className="text-2xl font-bold">{mockData.predictionStats.averageBetAmount.toLocaleString()} NETZ</p>
                  </div>
                </div>
                
                <div className="h-80">
                  <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
                    {/* In a real app, this would be a chart component */}
                    <p className="text-muted-foreground">Chart: Prediction metrics over time</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-3 bg-muted">
                    <div className="font-medium">User</div>
                    <div className="font-medium">Token</div>
                    <div className="font-medium">Direction</div>
                    <div className="font-medium">Amount</div>
                    <div className="font-medium">Timeframe</div>
                    <div className="font-medium">Result</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-6 p-3">
                      <div className="truncate">user123</div>
                      <div>QTM</div>
                      <div className="text-green-500">UP</div>
                      <div>100</div>
                      <div>5m</div>
                      <div className="text-green-500">Win</div>
                    </div>
                    <div className="grid grid-cols-6 p-3">
                      <div className="truncate">trader92</div>
                      <div>ETH</div>
                      <div className="text-red-500">DOWN</div>
                      <div>250</div>
                      <div>1m</div>
                      <div className="text-red-500">Loss</div>
                    </div>
                    <div className="grid grid-cols-6 p-3">
                      <div className="truncate">crypto_guru</div>
                      <div>BTC</div>
                      <div className="text-green-500">UP</div>
                      <div>500</div>
                      <div>30m</div>
                      <div className="text-green-500">Win</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Suspicious Activity</CardTitle>
                <CardDescription>Potential bot or automated trading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="font-medium">Rapid Predictions</p>
                    <p className="text-sm text-muted-foreground">
                      User: rapid_trader
                    </p>
                    <p className="text-sm text-muted-foreground">
                      15 predictions in 45 seconds
                    </p>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                    <p className="font-medium">Pattern Detected</p>
                    <p className="text-sm text-muted-foreground">
                      User: system_trader
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Identical bet amounts and timing
                    </p>
                  </div>
                  <Button className="w-full" variant="outline">
                    View All Flagged Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tokens" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Performance</CardTitle>
              <CardDescription>Prediction statistics by token</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-3 bg-muted">
                  <div className="font-medium">Token</div>
                  <div className="font-medium">Total Predictions</div>
                  <div className="font-medium">Trading Volume</div>
                  <div className="font-medium">Win Rate</div>
                  <div className="font-medium">Most Predicted</div>
                </div>
                <div className="divide-y">
                  {mockData.tokenStats.map((token) => (
                    <div key={token.symbol} className="grid grid-cols-5 p-3">
                      <div>{token.symbol}</div>
                      <div>{token.predictions.toLocaleString()}</div>
                      <div>{token.volume.toLocaleString()} NETZ</div>
                      <div>{(token.winRate * 100).toFixed(1)}%</div>
                      <div>{token.predictions > 3000 ? "UP" : "DOWN"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Prediction Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
                  {/* In a real app, this would be a chart component */}
                  <p className="text-muted-foreground">Chart: Token prediction distribution</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Token Win Rate Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
                  {/* In a real app, this would be a chart component */}
                  <p className="text-muted-foreground">Chart: Token win rate comparison</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{mockData.userStats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <p className="text-2xl font-bold">{mockData.userStats.activeToday.toLocaleString()}</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">New Today</p>
                  <p className="text-2xl font-bold">{mockData.userStats.newToday.toLocaleString()}</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Avg. Session</p>
                  <p className="text-2xl font-bold">{mockData.userStats.averageSessionTime}</p>
                </div>
              </div>
              
              <div className="h-80">
                <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
                  {/* In a real app, this would be a chart component */}
                  <p className="text-muted-foreground">Chart: User growth and activity over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Predictors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-3 bg-muted">
                    <div className="font-medium">User</div>
                    <div className="font-medium">Predictions</div>
                    <div className="font-medium">Win Rate</div>
                    <div className="font-medium">Total Won</div>
                    <div className="font-medium">Favorite Token</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-5 p-3">
                      <div>crypto_guru</div>
                      <div>428</div>
                      <div>62.1%</div>
                      <div>24,320 NETZ</div>
                      <div>BTC</div>
                    </div>
                    <div className="grid grid-cols-5 p-3">
                      <div>trading_pro</div>
                      <div>356</div>
                      <div>58.4%</div>
                      <div>18,640 NETZ</div>
                      <div>ETH</div>
                    </div>
                    <div className="grid grid-cols-5 p-3">
                      <div>quantum_trader</div>
                      <div>312</div>
                      <div>54.2%</div>
                      <div>15,840 NETZ</div>
                      <div>QTM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
                  {/* In a real app, this would be a chart component */}
                  <p className="text-muted-foreground">Chart: User retention rates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
