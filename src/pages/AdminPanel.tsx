import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNodeConfigs, updateNodeStatus, NodeConfig } from '@/lib/node/node-config';
import { 
  Settings, Shield, Server, Download, Globe, Clock, User,
  ChartLine, Users, Filter, Eye, PaintBucket, Database, BarChart
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { getTokenFeaturePricing, saveTokenFeaturePricing } from '@/lib/wallet/wallet-storage';
import { 
  getAdminSettings, saveAdminSettings, 
  toggleNetworkAccess, togglePredictionGame, toggleLeaderboard, 
  toggleAntiBot, toggleAnalytics, setDefaultTheme
} from '@/lib/admin/admin-settings';
import { resetLeaderboard, exportLeaderboardData } from '@/lib/prediction/prediction-game';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TokenApprovalItem {
  id: number;
  name: string;
  symbol: string;
  creator: string;
  timestamp: number;
  details?: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<NodeConfig[]>(getNodeConfigs());
  const [activeTab, setActiveTab] = useState("node-management");

  const [adminSettings, setAdminSettings] = useState(getAdminSettings());
  
  useEffect(() => {
    setAdminSettings(getAdminSettings());
  }, []);

  const handleNodeToggle = (node: NodeConfig) => {
    const newStatus = node.status === 'enabled' ? 'disabled' : 'enabled';
    updateNodeStatus(node.id, newStatus);
    setNodes(getNodeConfigs());
    
    toast({
      title: `Node ${newStatus}`,
      description: `Node ${node.id} has been ${newStatus}`,
    });
  };

  const [pendingTokens, setPendingTokens] = useState<TokenApprovalItem[]>([
    { 
      id: 1, 
      name: 'Green Energy Token', 
      symbol: 'GET', 
      creator: '0x8726...91ab',
      timestamp: Date.now() - 86400000,
      details: 'Token for renewable energy tracking'
    },
    { 
      id: 2, 
      name: 'DefiYield', 
      symbol: 'DFY', 
      creator: '0x1234...5678',
      timestamp: Date.now() - 43200000,
      details: 'Yield farming governance token'
    },
  ]);

  const handleApproveToken = (id: number) => {
    setPendingTokens(pendingTokens.filter(token => token.id !== id));
    toast({
      title: "Token Approved",
      description: `Token with ID ${id} has been approved.`,
    });
  };

  const handleRejectToken = (id: number) => {
    setPendingTokens(pendingTokens.filter(token => token.id !== id));
    toast({
      title: "Token Rejected",
      description: `Token with ID ${id} has been rejected.`,
    });
  };
  
  const handleViewDetails = (id: number) => {
    const token = pendingTokens.find(t => t.id === id);
    if (token) {
      toast({
        title: `${token.name} (${token.symbol})`,
        description: token.details || 'No additional details available',
      });
    }
  };

  const handleExternalNetworkToggle = () => {
    const newValue = !adminSettings.networkAccess.allowExternalBlockchain;
    toggleNetworkAccess(newValue);
    setAdminSettings({...adminSettings, networkAccess: {...adminSettings.networkAccess, allowExternalBlockchain: newValue}});
    
    toast({
      title: newValue ? "External Access Enabled" : "External Access Disabled",
      description: newValue 
        ? "Users can now access external blockchain networks." 
        : "Access to external blockchain networks has been restricted.",
    });
  };

  const handlePredictionGameToggle = () => {
    const newValue = !adminSettings.predictionGame.enabled;
    togglePredictionGame(newValue);
    setAdminSettings({...adminSettings, predictionGame: {...adminSettings.predictionGame, enabled: newValue}});
    
    toast({
      title: newValue ? "Prediction Game Enabled" : "Prediction Game Disabled",
      description: newValue 
        ? "Users can now play the trading prediction game." 
        : "The trading prediction game has been disabled.",
    });
  };

  const handleLeaderboardToggle = () => {
    const newValue = !adminSettings.leaderboard.enabled;
    toggleLeaderboard(newValue);
    setAdminSettings({...adminSettings, leaderboard: {...adminSettings.leaderboard, enabled: newValue}});
    
    toast({
      title: newValue ? "Leaderboard Enabled" : "Leaderboard Disabled",
      description: newValue 
        ? "The prediction game leaderboard is now visible to users." 
        : "The prediction game leaderboard has been hidden.",
    });
  };

  const handleAntiBotToggle = () => {
    const newValue = !adminSettings.antiBot.enabled;
    toggleAntiBot(newValue);
    setAdminSettings({...adminSettings, antiBot: {...adminSettings.antiBot, enabled: newValue}});
    
    toast({
      title: newValue ? "Anti-Bot Measures Enabled" : "Anti-Bot Measures Disabled",
      description: newValue 
        ? "Anti-bot protection measures are now active." 
        : "Anti-bot protection measures have been disabled.",
    });
  };

  const handleAnalyticsToggle = () => {
    const newValue = !adminSettings.analytics.enabled;
    toggleAnalytics(newValue);
    setAdminSettings({...adminSettings, analytics: {...adminSettings.analytics, enabled: newValue}});
    
    toast({
      title: newValue ? "Analytics Enabled" : "Analytics Disabled",
      description: newValue 
        ? "Trading and prediction analytics are now being tracked." 
        : "Analytics tracking has been disabled.",
    });
  };

  const handleThemeChange = (themeId: string) => {
    setDefaultTheme(themeId);
    setAdminSettings({...adminSettings, uiThemes: {...adminSettings.uiThemes, defaultTheme: themeId}});
    
    toast({
      title: "Default Theme Updated",
      description: `The default UI theme has been updated.`,
    });
  };

  const handleResetLeaderboard = () => {
    resetLeaderboard();
  };

  const handleExportLeaderboard = (format: 'csv' | 'json') => {
    const data = exportLeaderboardData(format);
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaderboard.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Leaderboard Exported",
      description: `The leaderboard data has been exported as ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link to="/domain-settings">
              <Globe className="mr-2 h-4 w-4" />
              Domain Settings
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/wallet-download">
              <Download className="mr-2 h-4 w-4" />
              Wallet Downloads
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="node-management">
            <Server className="mr-2 h-4 w-4" />
            Node Management
          </TabsTrigger>
          <TabsTrigger value="token-approval">
            <Shield className="mr-2 h-4 w-4" />
            Token Approval
          </TabsTrigger>
          <TabsTrigger value="feature-toggles">
            <Settings className="mr-2 h-4 w-4" />
            Feature Toggles
          </TabsTrigger>
          <TabsTrigger value="prediction-game">
            <ChartLine className="mr-2 h-4 w-4" />
            Prediction Game
          </TabsTrigger>
          <TabsTrigger value="system-settings">
            <Database className="mr-2 h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="node-management">
          <Card>
            <CardHeader>
              <CardTitle>Node Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h3 className="font-medium">{node.type.toUpperCase()} Node</h3>
                      <p className="text-sm text-gray-500">ID: {node.id}</p>
                    </div>
                    <Switch
                      checked={node.status === 'enabled'}
                      onCheckedChange={() => handleNodeToggle(node)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Node Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Manage node configuration settings and setup scripts.</p>
                <Button asChild>
                  <Link to="/node-config">
                    <Server className="mr-2 h-4 w-4" />
                    View Node Config
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Domain Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Manage custom domains for your Quantum Network.</p>
                <Button asChild>
                  <Link to="/domain-settings">
                    <Globe className="mr-2 h-4 w-4" />
                    Domain Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="token-approval">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tokens</CardTitle>
              <CardDescription>Approve or reject token submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTokens.map(token => (
                  <div key={token.id} className="flex flex-col space-y-2 p-4 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{token.name}</h3>
                        <p className="text-sm text-gray-500">Symbol: {token.symbol}</p>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(token.id)}>Details</Button>
                        <Button variant="outline" size="sm" onClick={() => handleApproveToken(token.id)}>Approve</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRejectToken(token.id)}>Reject</Button>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span>Created by: {token.creator}</span>
                      <Clock className="h-3 w-3 mx-1 ml-3" />
                      <span>{new Date(token.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {pendingTokens.length === 0 && <p>No pending tokens.</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/token-price-config">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Token Features & Pricing
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="feature-toggles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Token Uniqueness Validation</CardTitle>
                <CardDescription>Prevent duplicate token names and symbols</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Validate Token Names</h3>
                    <p className="text-sm text-gray-500">Ensure all token names are unique</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Validate Token Symbols</h3>
                    <p className="text-sm text-gray-500">Ensure all token symbols are unique</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>External Network Access</CardTitle>
                <CardDescription>Control access to external blockchain networks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Allow External Blockchain Access</h3>
                    <p className="text-sm text-gray-500">Enable bridges, oracles, external wallets</p>
                  </div>
                  <Switch 
                    checked={adminSettings.networkAccess.allowExternalBlockchain}
                    onCheckedChange={handleExternalNetworkToggle}
                  />
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!adminSettings.networkAccess.allowExternalBlockchain}
                  >
                    View Access Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trading Prediction Game</CardTitle>
                <CardDescription>Enable or disable the UP/DOWN prediction game</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Enable Prediction Game</h3>
                    <p className="text-sm text-gray-500">Let users predict price movements</p>
                  </div>
                  <Switch 
                    checked={adminSettings.predictionGame.enabled}
                    onCheckedChange={handlePredictionGameToggle}
                  />
                </div>
                {adminSettings.predictionGame.enabled && (
                  <div className="mt-4">
                    <Link to="/prediction-config">
                      <Button variant="outline" size="sm">
                        Configure Game Settings
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard Visibility</CardTitle>
                <CardDescription>Control the token reward leaderboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Show Leaderboard</h3>
                    <p className="text-sm text-gray-500">Display rankings to users</p>
                  </div>
                  <Switch 
                    checked={adminSettings.leaderboard.enabled}
                    onCheckedChange={handleLeaderboardToggle}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleResetLeaderboard}
                    >
                      Reset Leaderboard
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportLeaderboard('csv')}
                    >
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Anti-Bot Protection</CardTitle>
                <CardDescription>Prevent automated trading bots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Enable Anti-Bot Measures</h3>
                    <p className="text-sm text-gray-500">Cooldown periods, rate limiting, captcha</p>
                  </div>
                  <Switch 
                    checked={adminSettings.antiBot.enabled}
                    onCheckedChange={handleAntiBotToggle}
                  />
                </div>
                {adminSettings.antiBot.enabled && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Cooldown Period (seconds)</Label>
                      <Input 
                        type="number" 
                        defaultValue={adminSettings.antiBot.cooldownPeriod.toString()} 
                        min="1" 
                        max="600" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Require Captcha</Label>
                      <Switch defaultChecked={adminSettings.antiBot.requireCaptcha} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>UI Theme Customization</CardTitle>
                <CardDescription>Manage interface appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Allow User Theme Selection</h3>
                    <p className="text-sm text-gray-500">Let users choose their preferred theme</p>
                  </div>
                  <Switch defaultChecked={adminSettings.uiThemes.allowUserSelection} />
                </div>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Default Theme</Label>
                    <Select 
                      defaultValue={adminSettings.uiThemes.defaultTheme}
                      onValueChange={handleThemeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {adminSettings.uiThemes.availableThemes.map(theme => (
                          <SelectItem key={theme.id} value={theme.id}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/theme-editor">
                      <PaintBucket className="mr-2 h-4 w-4" />
                      Customize Themes
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Analytics Panel</CardTitle>
                <CardDescription>Track trading and prediction statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Enable Analytics</h3>
                    <p className="text-sm text-gray-500">Track user activity and game statistics</p>
                  </div>
                  <Switch 
                    checked={adminSettings.analytics.enabled}
                    onCheckedChange={handleAnalyticsToggle}
                  />
                </div>
                {adminSettings.analytics.enabled && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Refresh Rate (seconds)</Label>
                      <Input 
                        type="number" 
                        defaultValue={adminSettings.analytics.refreshRate.toString()} 
                        min="10" 
                        max="3600" 
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <BarChart className="mr-2 h-4 w-4" />
                        View Analytics Dashboard
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="prediction-game">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Game Settings</CardTitle>
                <CardDescription>Configure game parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Minimum Bet Amount</Label>
                    <Input 
                      type="number" 
                      defaultValue={adminSettings.predictionGame.minBetAmount.toString()} 
                      min="1" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Bet Amount</Label>
                    <Input 
                      type="number" 
                      defaultValue={adminSettings.predictionGame.maxBetAmount.toString()} 
                      min="1" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reward Multiplier</Label>
                    <Input 
                      type="number" 
                      defaultValue={adminSettings.predictionGame.rewardMultiplier.toString()} 
                      min="1" 
                      step="0.1" 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Timeframes</CardTitle>
                <CardDescription>Configure available prediction timeframes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminSettings.predictionGame.timeframes.map(timeframe => (
                    <div key={timeframe.id} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{timeframe.label}</h3>
                        <p className="text-sm text-gray-500">{timeframe.duration} seconds</p>
                      </div>
                      <Switch defaultChecked={timeframe.enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Add New Timeframe</Button>
              </CardFooter>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>Current top performers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 font-medium p-4 bg-muted/50">
                      <div>Rank</div>
                      <div className="col-span-2">User</div>
                      <div>Correct</div>
                      <div>Accuracy</div>
                      <div>Rewards</div>
                    </div>
                    <div className="divide-y">
                      {[1, 2, 3].map((rank) => (
                        <div key={rank} className="grid grid-cols-6 p-4">
                          <div>#{rank}</div>
                          <div className="col-span-2">User{rank}</div>
                          <div>{Math.floor(Math.random() * 100)}</div>
                          <div>{(Math.random() * 100).toFixed(1)}%</div>
                          <div>{(Math.random() * 10000).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleResetLeaderboard}>
                  Reset Leaderboard
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => handleExportLeaderboard('csv')}>
                    Export CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExportLeaderboard('json')}>
                    Export JSON
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="system-settings">
          <Card>
            <CardHeader>
              <CardTitle>Token Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Manage pricing for token features and services.</p>
              <Button asChild>
                <Link to="/token-price-config">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Token Pricing
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mining Pool Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Configure mining pool settings and connection parameters.</p>
              <Button asChild>
                <Link to="/mining-pool-config">
                  <Server className="mr-2 h-4 w-4" />
                  Mining Pool Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Web Miner Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Configure and manage the web miner for users.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Enable Web Miner for Users</span>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-start Mining</span>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Reward Program Active</span>
                  <Switch defaultChecked={true} />
                </div>
                <Button variant="outline" asChild>
                  <Link to="/wallet-download">
                    <Download className="mr-2 h-4 w-4" />
                    Manage Wallet Downloads
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>DNS Configuration</CardTitle>
              <CardDescription>Connect with No-IP service for domain management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="noip-username">No-IP Username</Label>
                  <Input id="noip-username" placeholder="Enter your No-IP username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noip-password">No-IP Password</Label>
                  <Input id="noip-password" type="password" placeholder="Enter your No-IP password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noip-hostname">Hostname</Label>
                  <Input id="noip-hostname" placeholder="yourdomain.no-ip.org" />
                </div>
                <Button>
                  Connect to No-IP
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Auto-Time Synchronization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Configure network time synchronization settings.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto-sync Node Time</span>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Use NTP Protocol</span>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Sync Interval (minutes)</span>
                  <span className="font-medium">60</span>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/node-config">
                    <Clock className="mr-2 h-4 w-4" />
                    Advanced Time Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
