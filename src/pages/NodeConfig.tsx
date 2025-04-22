
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, Server, Shield, Clock } from "lucide-react";
import { generateLinuxSetupScript } from '@/lib/node/node-config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NodeForm {
  id: string;
  type: 'validator' | 'full' | 'light';
  port: number;
  rpcEnabled: boolean;
  webInterface: boolean;
}

const NodeConfig = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<NodeForm>({
    id: 'node1',
    type: 'validator',
    port: 8545,
    rpcEnabled: true,
    webInterface: true,
  });
  
  const [autoTimeSync, setAutoTimeSync] = useState(true);
  const [timeSyncInterval, setTimeSyncInterval] = useState(60); // minutes
  
  const handleConfigChange = (field: keyof NodeForm, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };
  
  const handleDownloadConfig = (os: 'linux' | 'windows' | 'mac') => {
    // Generate script based on configuration
    let scriptContent = '';
    
    if (os === 'linux') {
      scriptContent = generateLinuxSetupScript({
        ...config,
        status: 'enabled'
      });
    } else {
      // Mock scripts for other OSes
      scriptContent = `# ${os.toUpperCase()} Setup Script\n# Configuration for ${config.id}\n`;
    }
    
    // Create downloadable link
    const element = document.createElement('a');
    const file = new Blob([scriptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `quantum-node-setup-${os}.sh`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Configuration Downloaded",
      description: `${os.charAt(0).toUpperCase() + os.slice(1)} configuration has been downloaded.`,
    });
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Node Configuration</h1>
      
      <Tabs defaultValue="main-node" className="mb-6">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="main-node">
            <Server className="mr-2 h-4 w-4" />
            Main Node
          </TabsTrigger>
          <TabsTrigger value="slave-node">
            <Server className="mr-2 h-4 w-4" />
            Slave Node
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="main-node">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Main Node Configuration</CardTitle>
              <CardDescription>Configure your primary validator node</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="node-id">Node ID</Label>
                <Input
                  id="node-id"
                  value={config.id}
                  onChange={(e) => handleConfigChange('id', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="node-type">Node Type</Label>
                <Select 
                  value={config.type} 
                  onValueChange={(value: 'validator' | 'full' | 'light') => handleConfigChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select node type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="validator">Validator</SelectItem>
                    <SelectItem value="full">Full Node</SelectItem>
                    <SelectItem value="light">Light Node</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="node-port">Port</Label>
                <Input
                  id="node-port"
                  type="number"
                  min="1024"
                  max="65535"
                  value={config.port}
                  onChange={(e) => handleConfigChange('port', parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="rpc-enabled">Enable RPC Interface</Label>
                <Switch 
                  id="rpc-enabled" 
                  checked={config.rpcEnabled}
                  onCheckedChange={(checked) => handleConfigChange('rpcEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="web-interface">Enable Web Interface</Label>
                <Switch 
                  id="web-interface" 
                  checked={config.webInterface}
                  onCheckedChange={(checked) => handleConfigChange('webInterface', checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" onClick={() => handleDownloadConfig('linux')}>
                <Download className="mr-2 h-4 w-4" />
                Download Linux Setup Script
              </Button>
              <Button className="w-full" onClick={() => handleDownloadConfig('windows')}>
                <Download className="mr-2 h-4 w-4" />
                Download Windows Setup Script
              </Button>
              <Button className="w-full" onClick={() => handleDownloadConfig('mac')}>
                <Download className="mr-2 h-4 w-4" />
                Download MacOS Setup Script
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Time Synchronization</CardTitle>
              <CardDescription>Configure automatic time synchronization for your node</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-time-sync">Auto Time Sync</Label>
                <Switch 
                  id="auto-time-sync" 
                  checked={autoTimeSync}
                  onCheckedChange={setAutoTimeSync}
                />
              </div>
              
              {autoTimeSync && (
                <div className="space-y-2">
                  <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                  <Input
                    id="sync-interval"
                    type="number"
                    min="1"
                    max="1440"
                    value={timeSyncInterval}
                    onChange={(e) => setTimeSyncInterval(parseInt(e.target.value))}
                  />
                </div>
              )}
              
              <div className="flex items-center bg-muted p-3 rounded">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Time synchronization ensures consensus accuracy across the network
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="slave-node">
          <Card>
            <CardHeader>
              <CardTitle>Slave Node Configuration</CardTitle>
              <CardDescription>Configure secondary nodes that connect to your main node</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-node-url">Primary Node URL</Label>
                <Input
                  id="primary-node-url"
                  placeholder="https://your-main-node.com:8545"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slave-node-id">Slave Node ID</Label>
                <Input
                  id="slave-node-id"
                  placeholder="slave-node-1"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-only">Sync Only Mode</Label>
                <Switch id="sync-only" defaultChecked={true} />
              </div>
              
              <div className="flex items-center bg-muted p-3 rounded">
                <Shield className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Slave nodes help distribute the network load and improve resilience
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Slave Node Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NodeConfig;
