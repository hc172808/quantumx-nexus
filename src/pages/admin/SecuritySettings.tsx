
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SecuritySettings = () => {
  const { toast } = useToast();
  const [externalNetworkEnabled, setExternalNetworkEnabled] = React.useState(false);
  const [quantumProtectionLevel, setQuantumProtectionLevel] = React.useState("standard");
  
  const handleSaveSettings = () => {
    toast({
      title: "Security Settings Saved",
      description: "Your changes have been applied.",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Security Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>External Network Access</CardTitle>
            <CardDescription>
              Control access to external blockchain networks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Allow External Blockchain Access</Label>
                <p className="text-sm text-muted-foreground">
                  Enable bridges, oracles, and external wallets
                </p>
              </div>
              <Switch 
                checked={externalNetworkEnabled} 
                onCheckedChange={setExternalNetworkEnabled} 
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">When Enabled:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Users can connect to external blockchains</li>
                <li>Bridge transactions can be initiated</li>
                <li>Oracle data feeds will be active</li>
                <li>External API calls will be permitted</li>
              </ul>
            </div>
            
            {externalNetworkEnabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Allowed Networks</Label>
                  <div className="flex items-center space-x-2">
                    <div className="bg-muted p-2 rounded-md flex-1">
                      <div className="flex items-center justify-between">
                        <span>Ethereum Mainnet</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-muted p-2 rounded-md flex-1">
                      <div className="flex items-center justify-between">
                        <span>Binance Smart Chain</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-muted p-2 rounded-md flex-1">
                      <div className="flex items-center justify-between">
                        <span>Polygon</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Access Log Retention</Label>
                  <select className="w-full border p-2 rounded-md">
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} className="ml-auto">
              Save Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quantum Protection</CardTitle>
            <CardDescription>
              Configure quantum-resistant security features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Protection Level</Label>
              <select 
                className="w-full border p-2 rounded-md"
                value={quantumProtectionLevel}
                onChange={(e) => setQuantumProtectionLevel(e.target.value)}
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="advanced">Advanced</option>
                <option value="maximum">Maximum</option>
              </select>
              <p className="text-sm text-muted-foreground">
                Higher protection levels provide stronger security but may impact performance.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Protection Features:</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Post-Quantum Key Generation</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Quantum-Resistant Signatures</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Lattice-Based Cryptography</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Hash-Based Signatures</Label>
                  <Switch defaultChecked={quantumProtectionLevel === "maximum"} />
                </div>
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Label>Security Audit Frequency</Label>
              <select className="w-full border p-2 rounded-md">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            
            <div className="pt-4">
              <Button variant="outline" className="w-full">
                Run Security Audit
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} className="ml-auto">
              Save Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>DNS Configuration</CardTitle>
            <CardDescription>
              Configure domain settings for the network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>NoIP.com Integration</Label>
              <div className="flex items-center space-x-2">
                <Input placeholder="NoIP Domain" />
                <Button>Verify</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Primary Domain</Label>
              <Input placeholder="example.com" />
            </div>
            
            <div className="space-y-2">
              <Label>DNS Records</Label>
              <div className="rounded-md border">
                <div className="grid grid-cols-3 p-3 bg-muted">
                  <div className="font-medium">Type</div>
                  <div className="font-medium">Name</div>
                  <div className="font-medium">Value</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-3 p-3">
                    <div>A</div>
                    <div>@</div>
                    <div>192.168.1.1</div>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <div>CNAME</div>
                    <div>www</div>
                    <div>@</div>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <div>TXT</div>
                    <div>_quantum</div>
                    <div>verification=abc123</div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Add DNS Record
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">DNSSEC</Label>
                <p className="text-sm text-muted-foreground">
                  Enable DNS Security Extensions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} className="ml-auto">
              Save DNS Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettings;
