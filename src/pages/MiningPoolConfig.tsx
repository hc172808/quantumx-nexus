
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Server, Cpu } from "lucide-react";
import { type MiningPoolConfig as MiningPoolConfigType, saveMiningPoolConfig, getMiningPoolConfig } from '@/lib/wallet/wallet-storage';

const MiningPoolConfig = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<MiningPoolConfigType>(getMiningPoolConfig());

  const handleSave = () => {
    saveMiningPoolConfig(config);
    toast({
      title: "Settings Saved",
      description: "Mining pool configuration has been updated."
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mining Pool Configuration</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Pool Settings</CardTitle>
          <CardDescription>Configure your mining pool connection settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Server className="mr-2 h-4 w-4" />
              Pool Status
            </span>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="poolUrl">Pool URL</Label>
            <Input
              id="poolUrl"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              placeholder="pool.example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="poolPort">Port</Label>
            <Input
              id="poolPort"
              type="number"
              value={config.port}
              onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
              placeholder="3333"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="algorithm">Mining Algorithm</Label>
            <Input
              id="algorithm"
              value={config.algorithm}
              onChange={(e) => setConfig({ ...config, algorithm: e.target.value })}
              placeholder="quantum"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="threads" className="flex items-center">
              <Cpu className="mr-2 h-4 w-4" />
              Mining Threads
            </Label>
            <Input
              id="threads"
              type="number"
              min={1}
              max={navigator.hardwareConcurrency || 8}
              value={config.threads}
              onChange={(e) => setConfig({ ...config, threads: parseInt(e.target.value) })}
            />
            <p className="text-sm text-muted-foreground">
              Maximum available threads: {navigator.hardwareConcurrency || 'Unknown'}
            </p>
          </div>
          
          <Button onClick={handleSave} className="w-full">
            Save Pool Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiningPoolConfig;
