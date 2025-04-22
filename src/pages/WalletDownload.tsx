
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, Laptop, Smartphone, Terminal, Shield, Zap, Clock, Settings, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logoQtm from "@/assets/tokens/qtm.svg";

const WalletDownload = () => {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  
  const handleDownload = (platform: string) => {
    setDownloading(true);
    
    toast({
      title: `Downloading Quantum Wallet for ${platform}`,
      description: "Your download will start in a moment."
    });
    
    // Simulate download
    setTimeout(() => {
      setDownloading(false);
      
      toast({
        title: "Download Complete",
        description: "Please check your downloads folder and follow the installation instructions."
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 text-center">
        <div className="mx-auto w-16 h-16 mb-4">
          <img src={logoQtm} alt="Quantum Logo" className="w-full h-full" />
        </div>
        <h1 className="text-3xl font-bold">Quantum Vault Nexus</h1>
        <p className="text-muted-foreground mt-2">
          Complete crypto solution for mining and secure wallet management
        </p>
      </div>
      
      <Tabs defaultValue="desktop" className="mb-6">
        <TabsList className="grid grid-cols-2 mb-4 w-full md:w-[400px] mx-auto">
          <TabsTrigger value="desktop">
            <Laptop className="mr-2 h-4 w-4" />
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="mr-2 h-4 w-4" />
            Mobile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Windows</CardTitle>
                <CardDescription>For Windows 10/11 (64-bit)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Version: 1.0.0</p>
                <p className="text-sm">Size: 86.4 MB</p>
                <p className="text-sm">Last Updated: April 20, 2025</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleDownload("Windows")}
                  disabled={downloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download for Windows
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>macOS</CardTitle>
                <CardDescription>For macOS 12+ (Intel/Apple Silicon)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Version: 1.0.0</p>
                <p className="text-sm">Size: 92.7 MB</p>
                <p className="text-sm">Last Updated: April 20, 2025</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleDownload("macOS")}
                  disabled={downloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download for macOS
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Linux</CardTitle>
                <CardDescription>For Ubuntu, Debian, Fedora, CentOS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Version: 1.0.0</p>
                <p className="text-sm">Size: 78.2 MB</p>
                <p className="text-sm">Last Updated: April 20, 2025</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleDownload("Linux")}
                  disabled={downloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download for Linux
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Desktop Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    <CardTitle>Mining Engine</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>XMRig-powered mining with optimized performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>CPU thread control with auto-configuration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Real-time hash rate monitoring with charts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Auto-resume mining on app restart</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle>Secure Wallet</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>BIP-39 mnemonic phrase generation and import</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>OS-native secure encryption for key storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>QR code generation for easy receiving</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Complete transaction history with status tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mobile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Android App</CardTitle>
                <CardDescription>For Android 8.0+</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Version: 1.0.0</p>
                <p className="text-sm">Size: 42.8 MB</p>
                <p className="text-sm">Last Updated: April 20, 2025</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleDownload("Android")}
                  disabled={downloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download APK
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>iOS App</CardTitle>
                <CardDescription>For iOS 14+</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Version: 1.0.0</p>
                <p className="text-sm">Size: 38.5 MB</p>
                <p className="text-sm">Last Updated: April 20, 2025</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleDownload("iOS")}
                  disabled={downloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download IPA
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Mobile Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    <CardTitle>Efficient Mining</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Battery-aware mining profiles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Thermal throttling protection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Background mining capability</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle>Mobile Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Biometric authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Platform secure storage (Keychain/Keystore)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Auto-lock on app background</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <CardTitle>Sync & Backup</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Encrypted cloud backup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Cross-device settings sync</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>QR code wallet sharing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Windows</h3>
              <ul className="space-y-1 text-sm">
                <li>Windows 10/11 (64-bit)</li>
                <li>4GB RAM minimum</li>
                <li>Intel or AMD multi-core CPU</li>
                <li>500MB disk space</li>
                <li>Internet connection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">macOS</h3>
              <ul className="space-y-1 text-sm">
                <li>macOS 12 Monterey or later</li>
                <li>4GB RAM minimum</li>
                <li>Intel or Apple Silicon CPU</li>
                <li>500MB disk space</li>
                <li>Internet connection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Mobile</h3>
              <ul className="space-y-1 text-sm">
                <li>Android 8.0+ / iOS 14+</li>
                <li>2GB RAM minimum</li>
                <li>ARMv8 64-bit CPU</li>
                <li>200MB storage space</li>
                <li>Internet connection</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Alert className="mb-6">
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Mining performance depends on your hardware capabilities. Higher-end CPUs will produce better hash rates.
          Battery life on mobile devices will be reduced while mining.
        </AlertDescription>
      </Alert>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
        <p className="text-muted-foreground mb-4">Download the app for your platform and start mining today!</p>
        <Button size="lg" onClick={() => handleDownload("Windows")}>
          <Download className="mr-2 h-5 w-5" />
          Download Now
        </Button>
      </div>
    </div>
  );
};

export default WalletDownload;
