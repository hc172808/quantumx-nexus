import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNodeConfigs, updateNodeStatus, NodeConfig } from '@/lib/node/node-config';
import { Settings, Shield, Server, Download, Globe, Clock, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { getTokenFeaturePricing, saveTokenFeaturePricing } from '@/lib/wallet/wallet-storage';

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
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="node-management">
            <Server className="mr-2 h-4 w-4" />
            Node Management
          </TabsTrigger>
          <TabsTrigger value="token-approval">
            <Shield className="mr-2 h-4 w-4" />
            Token Approval
          </TabsTrigger>
          <TabsTrigger value="system-settings">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="node-management" className="space-y-4">
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
        
        <TabsContent value="token-approval" className="space-y-4">
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
        
        <TabsContent value="system-settings" className="space-y-4">
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
