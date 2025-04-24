
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Documentation = () => {
  return (
    <div className="container py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>
      
      <Tabs defaultValue="wallet" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="tokens">Token Creation</TabsTrigger>
          <TabsTrigger value="quantum">Quantum Security</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Getting Started</h2>
              <p>
                QuantumVault provides a secure blockchain wallet with quantum-resistant cryptography.
                This documentation will help you understand how to use the wallet effectively.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Creating a Wallet</h3>
              <p>
                To create a new wallet, navigate to the Wallet section and follow the guided setup
                process. Your wallet will be protected with quantum-safe encryption.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Securing Your Wallet</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Always back up your seed phrase</li>
                <li>Enable multi-factor authentication</li>
                <li>Set up time-based transaction locks for enhanced security</li>
                <li>Consider using hardware security modules for key storage</li>
              </ul>
              
              <Alert className="mt-6">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Remember</AlertTitle>
                <AlertDescription>
                  Never share your private keys or seed phrase with anyone. QuantumVault staff will never ask for these.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Token Creation Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Creating Custom Tokens</h2>
              <p>
                QuantumVault allows you to create and manage custom tokens with quantum-resistant features.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Token Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Mintable:</strong> Create additional tokens after initial deployment</li>
                <li><strong>Mutable Info:</strong> Ability to update token metadata</li>
                <li><strong>Renounce Ownership:</strong> Permanently remove creator privileges</li>
                <li><strong>Quantum Protection:</strong> Advanced cryptographic security against quantum computing threats</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quantum">
          <Card>
            <CardHeader>
              <CardTitle>Quantum Security Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Quantum-Resistant Cryptography</h2>
              <p>
                QuantumVault implements advanced post-quantum cryptographic algorithms to protect your assets
                against threats from quantum computing advancements.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Key Technologies</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Lattice-based cryptography</strong> for key exchanges</li>
                <li><strong>Hash-based signatures</strong> for transaction verification</li>
                <li><strong>Multivariate polynomial cryptosystems</strong> for enhanced security</li>
                <li><strong>Quantum key distribution</strong> for secure communication channels</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">API Documentation</h2>
              <p>
                QuantumVault provides a comprehensive API for integrating with our blockchain ecosystem.
                The API is secured with quantum-resistant encryption and advanced authentication protocols.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Getting Started with the API</h3>
              <p>
                To use the API, you'll need to register for API keys in the developer portal.
                All API endpoints use HTTPS and require authentication.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Rate Limits</h3>
              <p>
                Standard accounts are limited to 100 requests per minute.
                Enterprise accounts have customizable rate limits based on needs.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
