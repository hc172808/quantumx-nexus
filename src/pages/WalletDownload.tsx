
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Smartphone, Computer, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WalletDownload = () => {
  const { toast } = useToast();
  const [downloadStarted, setDownloadStarted] = useState<{[key: string]: boolean}>({
    windows: false,
    mac: false,
    linux: false,
    android: false,
    ios: false
  });
  
  const handleDownload = (platform: string) => {
    setDownloadStarted(prev => ({ ...prev, [platform]: true }));
    
    toast({
      title: "Download Started",
      description: `The ${platform.charAt(0).toUpperCase() + platform.slice(1)} wallet is downloading.`,
    });
    
    // Simulate download
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = '#';
      a.download = `quantum-wallet-${platform}.zip`;
      a.click();
      
      // Reset the button state after download
      setTimeout(() => {
        setDownloadStarted(prev => ({ ...prev, [platform]: false }));
      }, 1000);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Wallet Downloads</h1>
      
      <Tabs defaultValue="desktop" className="mb-6">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="desktop">
            <Computer className="mr-2 h-4 w-4" />
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="mr-2 h-4 w-4" />
            Mobile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Windows Wallet</CardTitle>
                <CardDescription>For Windows 10/11</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Full node capability</li>
                  <li>Mining functionality</li>
                  <li>Hardware wallet support</li>
                  <li>Automatic updates</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleDownload('windows')}
                  disabled={downloadStarted.windows}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadStarted.windows ? "Downloading..." : "Download for Windows"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>macOS Wallet</CardTitle>
                <CardDescription>For macOS 11+</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Apple Silicon native</li>
                  <li>iCloud backup option</li>
                  <li>Touch ID support</li>
                  <li>Mining functionality</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleDownload('mac')}
                  disabled={downloadStarted.mac}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadStarted.mac ? "Downloading..." : "Download for macOS"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Linux Wallet</CardTitle>
                <CardDescription>Ubuntu, Fedora, Debian</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Command line interface</li>
                  <li>Full validator support</li>
                  <li>Advanced mining options</li>
                  <li>Headless operation</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleDownload('linux')}
                  disabled={downloadStarted.linux}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadStarted.linux ? "Downloading..." : "Download for Linux"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="mobile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Android Wallet</CardTitle>
                <CardDescription>For Android 8.0+</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Fingerprint authentication</li>
                  <li>QR code payments</li>
                  <li>Background mining</li>
                  <li>Offline transaction signing</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleDownload('android')}
                  disabled={downloadStarted.android}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadStarted.android ? "Downloading..." : "Download for Android"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>iOS Wallet</CardTitle>
                <CardDescription>For iOS 15+</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Face ID/Touch ID support</li>
                  <li>iCloud backup</li>
                  <li>Apple Watch companion</li>
                  <li>Simplified mining mode</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleDownload('ios')}
                  disabled={downloadStarted.ios}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadStarted.ios ? "Downloading..." : "Download for iOS"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 mt-0.5 text-green-500" />
            <div>
              <h3 className="font-medium">Verified Downloads</h3>
              <p className="text-sm text-muted-foreground">All wallet downloads are cryptographically signed and verified.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 mt-0.5 text-green-500" />
            <div>
              <h3 className="font-medium">Private Keys</h3>
              <p className="text-sm text-muted-foreground">Your private keys never leave your device. All transactions are signed locally.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 mt-0.5 text-green-500" />
            <div>
              <h3 className="font-medium">Open Source</h3>
              <p className="text-sm text-muted-foreground">Our wallet software is open source and available for review on GitHub.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletDownload;
