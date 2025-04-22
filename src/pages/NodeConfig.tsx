
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Server, 
  Network, 
  Clock, 
  RefreshCw, 
  Download, 
  ArrowRight, 
  Shield,
  Settings,
  Link
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NodeConfig = () => {
  const { toast } = useToast();
  const [nodeType, setNodeType] = useState('main');
  const [nodeUrl, setNodeUrl] = useState('');
  const [nodePort, setNodePort] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  const [downloading, setDownloading] = useState(false);
  
  const [mainNodes, setMainNodes] = useState([
    { id: 1, name: 'Main Node 1', url: 'node1.quantum-network.com', port: '8545', status: 'online' },
    { id: 2, name: 'Main Node 2', url: 'node2.quantum-network.com', port: '8545', status: 'online' }
  ]);
  
  const [slaveNodes, setSlaveNodes] = useState([
    { id: 1, name: 'Slave Node 1', url: 'slave1.quantum-network.com', port: '8545', status: 'online' },
    { id: 2, name: 'Slave Node 2', url: 'slave2.quantum-network.com', port: '8545', status: 'offline' }
  ]);
  
  const handleAddNode = () => {
    if (!nodeUrl || !nodePort) {
      toast({
        title: "Invalid Node Configuration",
        description: "Please enter a valid node URL and port",
        variant: "destructive",
      });
      return;
    }
    
    const newNode = {
      id: nodeType === 'main' ? mainNodes.length + 1 : slaveNodes.length + 1,
      name: `${nodeType === 'main' ? 'Main' : 'Slave'} Node ${nodeType === 'main' ? mainNodes.length + 1 : slaveNodes.length + 1}`,
      url: nodeUrl,
      port: nodePort,
      status: 'pending'
    };
    
    if (nodeType === 'main') {
      setMainNodes([...mainNodes, newNode]);
    } else {
      setSlaveNodes([...slaveNodes, newNode]);
    }
    
    setNodeUrl('');
    setNodePort('');
    
    toast({
      title: "Node Added",
      description: `${nodeType === 'main' ? 'Main' : 'Slave'} node has been added successfully.`,
    });
  };
  
  const handleRemoveNode = (id: number, type: 'main' | 'slave') => {
    if (type === 'main') {
      setMainNodes(mainNodes.filter(node => node.id !== id));
    } else {
      setSlaveNodes(slaveNodes.filter(node => node.id !== id));
    }
    
    toast({
      title: "Node Removed",
      description: `${type === 'main' ? 'Main' : 'Slave'} node has been removed.`,
    });
  };
  
  const handleSyncTime = () => {
    toast({
      title: "Time Synchronization",
      description: "Synchronizing time with network nodes...",
    });
    
    setTimeout(() => {
      toast({
        title: "Time Synchronized",
        description: "Node time has been synchronized with the network.",
      });
    }, 1500);
  };
  
  const handleDownload = (nodeType: string) => {
    setDownloading(true);
    
    toast({
      title: `Downloading ${nodeType} Node Software`,
      description: "Your download will start in a moment.",
    });
    
    setTimeout(() => {
      setDownloading(false);
      
      toast({
        title: "Download Complete",
        description: "Please check your downloads folder and follow the installation instructions.",
      });
    }, 2000);
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Node Configuration</h1>
      
      <Tabs defaultValue="nodes" className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="nodes">
            <Server className="mr-2 h-4 w-4" />
            Node Management
          </TabsTrigger>
          <TabsTrigger value="time">
            <Clock className="mr-2 h-4 w-4" />
            Time Synchronization
          </TabsTrigger>
          <TabsTrigger value="download">
            <Download className="mr-2 h-4 w-4" />
            Node Software
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="nodes">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Node</CardTitle>
              <CardDescription>Configure and add new nodes to your network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="nodeType">Node Type</Label>
                  <Select 
                    value={nodeType} 
                    onValueChange={setNodeType}
                  >
                    <SelectTrigger id="nodeType">
                      <SelectValue placeholder="Select node type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Node</SelectItem>
                      <SelectItem value="slave">Slave Node</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="nodeUrl">Node URL</Label>
                  <Input
                    id="nodeUrl"
                    placeholder="node.example.com"
                    value={nodeUrl}
                    onChange={(e) => setNodeUrl(e.target.value)}
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="nodePort">Port</Label>
                  <Input
                    id="nodePort"
                    placeholder="8545"
                    value={nodePort}
                    onChange={(e) => setNodePort(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={handleAddNode}>
                Add Node
              </Button>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Main Nodes</CardTitle>
                <CardDescription>Primary nodes that manage the network</CardDescription>
              </CardHeader>
              <CardContent>
                {mainNodes.length > 0 ? (
                  <div className="space-y-4">
                    {mainNodes.map(node => (
                      <div key={node.id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${node.status === 'online' ? 'bg-green-100 dark:bg-green-900' : node.status === 'offline' ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                            <Server className={`h-4 w-4 ${node.status === 'online' ? 'text-green-600 dark:text-green-400' : node.status === 'offline' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                          </div>
                          <div>
                            <p className="font-medium">{node.name}</p>
                            <p className="text-xs text-muted-foreground">{node.url}:{node.port}</p>
                            <p className="text-xs capitalize font-medium mt-1 text-muted-foreground">{node.status}</p>
                          </div>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveNode(node.id, 'main')}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No main nodes configured.</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Slave Nodes</CardTitle>
                <CardDescription>Secondary nodes that follow main nodes</CardDescription>
              </CardHeader>
              <CardContent>
                {slaveNodes.length > 0 ? (
                  <div className="space-y-4">
                    {slaveNodes.map(node => (
                      <div key={node.id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${node.status === 'online' ? 'bg-green-100 dark:bg-green-900' : node.status === 'offline' ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                            <Server className={`h-4 w-4 ${node.status === 'online' ? 'text-green-600 dark:text-green-400' : node.status === 'offline' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                          </div>
                          <div>
                            <p className="font-medium">{node.name}</p>
                            <p className="text-xs text-muted-foreground">{node.url}:{node.port}</p>
                            <p className="text-xs capitalize font-medium mt-1 text-muted-foreground">{node.status}</p>
                          </div>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveNode(node.id, 'slave')}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No slave nodes configured.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Time Synchronization</CardTitle>
              <CardDescription>Keep your nodes' time synchronized with the network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-Synchronization</h3>
                  <p className="text-sm text-muted-foreground">Automatically sync time with network nodes</p>
                </div>
                <Switch 
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Current Node Time</h3>
                  <p>{new Date().toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Network Time</h3>
                  <p>{new Date().toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <h3 className="font-medium">Sync Interval</h3>
                <Select defaultValue="hour">
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">Every 15 minutes</SelectItem>
                    <SelectItem value="30min">Every 30 minutes</SelectItem>
                    <SelectItem value="hour">Every hour</SelectItem>
                    <SelectItem value="day">Once per day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Accurate time synchronization is crucial for proper node operation and transaction validation.
                </AlertDescription>
              </Alert>
              
              <Button className="w-full" onClick={handleSyncTime}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Time Now
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="download">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Main Node Software</CardTitle>
                <CardDescription>Primary node implementation for the Quantum Network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Version:</span>
                    <span className="text-sm font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Release Date:</span>
                    <span className="text-sm font-medium">April 20, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Size:</span>
                    <span className="text-sm font-medium">124.5 MB</span>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <h4 className="font-medium">Features:</h4>
                  <ul className="space-y-1 pl-5 list-disc text-sm">
                    <li>Full Quantum blockchain validator</li>
                    <li>Transaction processing and mining</li>
                    <li>Block proposal and validation</li>
                    <li>Network consensus participation</li>
                    <li>Automatic peering with other nodes</li>
                  </ul>
                </div>
                
                <Alert>
                  <Network className="h-4 w-4" />
                  <AlertDescription>
                    Running a main node requires dedicated hardware and a stable internet connection. 
                    Recommended: 8+ CPU cores, 16GB RAM, 1TB SSD storage.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleDownload('Main')}
                  disabled={downloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Main Node
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Slave Node Software</CardTitle>
                <CardDescription>Secondary node implementation with reduced requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Version:</span>
                    <span className="text-sm font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Release Date:</span>
                    <span className="text-sm font-medium">April 20, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Size:</span>
                    <span className="text-sm font-medium">86.2 MB</span>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <h4 className="font-medium">Features:</h4>
                  <ul className="space-y-1 pl-5 list-disc text-sm">
                    <li>Quantum blockchain replication</li>
                    <li>Transaction relaying</li>
                    <li>Network participation</li>
                    <li>Block validation</li>
                    <li>API access for applications</li>
                  </ul>
                </div>
                
                <Alert>
                  <Network className="h-4 w-4" />
                  <AlertDescription>
                    Running a slave node has lower hardware requirements. 
                    Recommended: 4+ CPU cores, 8GB RAM, 500GB SSD storage.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleDownload('Slave')}
                  disabled={downloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Slave Node
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Installation Instructions</h2>
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Step 1: Download & Extract</h3>
                  <p className="text-sm">Download the node software for your platform and extract it to your preferred location.</p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Step 2: Configure Settings</h3>
                  <p className="text-sm">Edit the config.json file to specify your node's name, network address, and connection details.</p>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs overflow-auto">
{`{
  "node_name": "YourNodeName",
  "network": "mainnet",
  "listen_addr": "0.0.0.0",
  "listen_port": 8545,
  "peers": [
    "node1.quantum-network.com:8545",
    "node2.quantum-network.com:8545"
  ]
}`}
                    </pre>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Step 3: Run the Node</h3>
                  <p className="text-sm">Start the node using the provided script:</p>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs font-mono">Linux/macOS: <span className="text-green-500">./start-node.sh</span></p>
                    <p className="text-xs font-mono">Windows: <span className="text-green-500">start-node.bat</span></p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Step 4: Register Your Node</h3>
                  <p className="text-sm">Register your node in the admin interface by adding its details in the Node Management tab.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NodeConfig;
