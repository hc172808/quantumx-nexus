
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNodeConfigs, updateNodeStatus, NodeConfig } from '@/lib/node/node-config';
import { Settings, Shield, Server, Download } from 'lucide-react';
import { useNavigate } from "react-router-dom";

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

  const [pendingTokens, setPendingTokens] = useState([
    { id: 1, name: 'Token A', symbol: 'TKA' },
    { id: 2, name: 'Token B', symbol: 'TKB' },
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
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
          
          <Card>
            <CardHeader>
              <CardTitle>Node Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Manage node configuration settings and setup scripts.</p>
              <Button onClick={() => navigate('/node-config')}>
                <Server className="mr-2 h-4 w-4" />
                View Node Config
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="token-approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTokens.map(token => (
                  <div key={token.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h3 className="font-medium">{token.name}</h3>
                      <p className="text-sm text-gray-500">Symbol: {token.symbol}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => handleApproveToken(token.id)}>Approve</Button>
                      <Button variant="destructive" onClick={() => handleRejectToken(token.id)}>Reject</Button>
                    </div>
                  </div>
                ))}
                {pendingTokens.length === 0 && <p>No pending tokens.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Manage pricing for token features and services.</p>
              <Button onClick={() => navigate('/token-price-config')}>
                <Settings className="mr-2 h-4 w-4" />
                Configure Token Pricing
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
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Admin Miner Dashboard
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
