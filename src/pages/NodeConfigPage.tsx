
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NodeConfig, getNodeConfigs, saveNodeConfig, generateLinuxSetupScript } from '@/lib/node/node-config';
import { Download } from 'lucide-react';

const NodeConfigPage = () => {
  const { toast } = useToast();
  const [nodes] = useState<NodeConfig[]>(getNodeConfigs());

  const handleDownload = (node: NodeConfig) => {
    const script = generateLinuxSetupScript(node);
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `setup-node-${node.id}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Setup Script Downloaded",
      description: "Follow the instructions in the script to set up your node.",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Node Configuration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <Card key={node.id}>
            <CardHeader>
              <CardTitle>{node.type.toUpperCase()} Node</CardTitle>
              <CardDescription>ID: {node.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Port: {node.port}</p>
                <p>RPC: {node.rpcEnabled ? 'Enabled' : 'Disabled'}</p>
                <p>Web Interface: {node.webInterface ? 'Enabled' : 'Disabled'}</p>
                <Button 
                  className="w-full mt-4"
                  onClick={() => handleDownload(node)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Setup Script
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NodeConfigPage;
