
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Network, Globe, ServerCrash, Info, Copy, Check, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DomainSettings = () => {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [domains, setDomains] = useState<{id: number, name: string, status: string}[]>([
    { id: 1, name: 'quantum-network.com', status: 'active' },
  ]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAddDomain = () => {
    if (!domain || domain.trim() === '') {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newDomain = {
        id: domains.length + 1,
        name: domain,
        status: 'pending',
      };
      
      setDomains([...domains, newDomain]);
      setDomain('');
      
      toast({
        title: "Domain Added",
        description: `Domain ${domain} has been added and is pending verification`,
      });
      
      setLoading(false);
    }, 1000);
  };

  const handleRemoveDomain = (id: number) => {
    setDomains(domains.filter(d => d.id !== id));
    
    toast({
      title: "Domain Removed",
      description: "Domain has been removed successfully",
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    toast({
      title: "Copied",
      description: "DNS record copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Domain Settings</h1>
      
      <Tabs defaultValue="manage" className="mb-6">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="manage">
            <Globe className="mr-2 h-4 w-4" />
            Manage Domains
          </TabsTrigger>
          <TabsTrigger value="guide">
            <Info className="mr-2 h-4 w-4" />
            Setup Guide
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Domain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <div className="flex space-x-2">
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                  <Button onClick={handleAddDomain} disabled={loading}>
                    {loading ? "Adding..." : "Add Domain"}
                  </Button>
                </div>
              </div>
              
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  Add your custom domain to make your Quantum Network accessible via your own domain name.
                  You will need to update your DNS settings to point to our servers.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Registered Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domains.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${d.status === 'active' ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                        {d.status === 'active' ? (
                          <Network className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ServerCrash className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{d.status}</p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveDomain(d.id)}>
                      Remove
                    </Button>
                  </div>
                ))}
                {domains.length === 0 && <p>No domains registered.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Domain Setup Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 1: Register a Domain</h3>
                <p className="text-sm text-muted-foreground">
                  If you don't already own a domain, register one with a domain registrar like Namecheap, GoDaddy, or Google Domains.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 2: Add Your Domain</h3>
                <p className="text-sm text-muted-foreground">
                  Add your domain in the "Manage Domains" tab. This reserves your domain in our system.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 3: Configure DNS Records</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add the following DNS records to your domain's DNS settings through your domain registrar:
                </p>
                
                <div className="bg-muted p-4 rounded-md space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">A Record:</h4>
                    <div className="flex items-center justify-between bg-background p-2 rounded">
                      <div>
                        <p className="text-sm"><strong>Type:</strong> A</p>
                        <p className="text-sm"><strong>Name:</strong> @</p>
                        <p className="text-sm"><strong>Value:</strong> 123.456.789.0</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleCopy("Type: A\nName: @\nValue: 123.456.789.0")}>
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">CNAME Record:</h4>
                    <div className="flex items-center justify-between bg-background p-2 rounded">
                      <div>
                        <p className="text-sm"><strong>Type:</strong> CNAME</p>
                        <p className="text-sm"><strong>Name:</strong> www</p>
                        <p className="text-sm"><strong>Value:</strong> quantum-network.com</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleCopy("Type: CNAME\nName: www\nValue: quantum-network.com")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">TXT Record:</h4>
                    <div className="flex items-center justify-between bg-background p-2 rounded">
                      <div>
                        <p className="text-sm"><strong>Type:</strong> TXT</p>
                        <p className="text-sm"><strong>Name:</strong> _quantum-verification</p>
                        <p className="text-sm"><strong>Value:</strong> quantum-verify=123456789</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleCopy("Type: TXT\nName: _quantum-verification\nValue: quantum-verify=123456789")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 4: Wait for DNS Propagation</h3>
                <p className="text-sm text-muted-foreground">
                  DNS changes can take up to 48 hours to propagate globally. Usually, it takes 15-30 minutes.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 5: Verify Your Domain</h3>
                <p className="text-sm text-muted-foreground">
                  Once DNS propagation is complete, our system will automatically verify your domain. You'll see the status change from "pending" to "active".
                </p>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Having trouble? Make sure your DNS records are correctly configured. You can check your DNS propagation 
                  using tools like <a href="https://www.whatsmydns.net/" target="_blank" rel="noopener noreferrer" className="underline">whatsmydns.net</a>.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainSettings;
