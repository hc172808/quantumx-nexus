import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { getNodeConfigs, updateNodeStatus, NodeConfig } from '@/lib/node/node-config';

const AdminPanel = () => {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<NodeConfig[]>(getNodeConfigs());

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
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      {/* Node Management Section */}
      <Card className="mb-6">
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

      {/* Pending Tokens Card */}
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
    </div>
  );
};

export default AdminPanel;
