
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Network, Globe, ServerCrash } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DomainSettings = () => {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [domains, setDomains] = useState<{id: number, name: string, status: string}[]>([
    { id: 1, name: 'quantum-network.com', status: 'active' },
  ]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Domain Settings</h1>
      
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
    </div>
  );
};

export default DomainSettings;
