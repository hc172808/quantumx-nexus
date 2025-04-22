
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Download, Cpu, Shield } from "lucide-react";

interface WebMinerProps {
  isLoggedIn: boolean;
}

export const WebMiner: React.FC<WebMinerProps> = ({ isLoggedIn }) => {
  const { toast } = useToast();
  const [autoStart, setAutoStart] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [hashRate, setHashRate] = useState<number | null>(null);
  
  const handleDownload = () => {
    // In a real app, this would trigger a download of the miner software
    toast({
      title: "Download Started",
      description: "The Web Miner is downloading. Please follow installation instructions.",
    });
    
    // Simulate download
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = '#';
      a.download = 'quantum-web-miner.zip';
      a.click();
    }, 1000);
  };
  
  const toggleMining = () => {
    const newState = !isMining;
    setIsMining(newState);
    
    if (newState) {
      toast({
        title: "Mining Started",
        description: "Web Miner has started mining. You'll earn rewards while mining.",
      });
      // Simulate increasing hash rate
      let rate = 0;
      const interval = setInterval(() => {
        rate += Math.random() * 5;
        setHashRate(parseFloat(rate.toFixed(2)));
        if (rate > 25) clearInterval(interval);
      }, 1000);
    } else {
      toast({
        title: "Mining Stopped",
        description: "Web Miner has stopped mining.",
      });
      setHashRate(null);
    }
  };
  
  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Web Miner</CardTitle>
          <CardDescription>Login to access the Web Miner</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You need to be logged in to use the Web Miner.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantum Web Miner</CardTitle>
        <CardDescription>Mine tokens while browsing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Cpu className="mr-2 h-4 w-4" />
            Mining Status
          </span>
          <Button 
            variant={isMining ? "destructive" : "default"}
            onClick={toggleMining}
          >
            {isMining ? "Stop Mining" : "Start Mining"}
          </Button>
        </div>
        
        {hashRate !== null && (
          <div className="flex flex-col space-y-2 bg-muted p-3 rounded-md">
            <div className="flex justify-between">
              <span>Current Hash Rate:</span>
              <span className="font-bold">{hashRate} H/s</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Earnings:</span>
              <span className="font-bold">{(hashRate * 0.001).toFixed(5)} NETZ/hour</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Auto-start mining
          </span>
          <Switch 
            checked={autoStart}
            onCheckedChange={setAutoStart}
          />
        </div>
        
        <div className="bg-muted p-3 rounded-md">
          <h4 className="font-medium mb-2">Benefits of Web Mining:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Earn NETZ tokens passively</li>
            <li>Support the Quantum network</li>
            <li>No specialized hardware required</li>
            <li>Automatic resource management</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Desktop Miner
        </Button>
      </CardFooter>
    </Card>
  );
};
