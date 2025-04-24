
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SecurityPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Security Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Wallet Security</h2>
          <p>Private keys are stored locally and encrypted using industry-standard encryption algorithms.</p>
          <p>We strongly recommend enabling two-factor authentication for your account.</p>
          
          <h2>2. Quantum Protection</h2>
          <p>Our platform implements post-quantum cryptographic algorithms to protect against potential quantum computing attacks.</p>
          
          <h2>3. Node Security</h2>
          <p>All nodes on the network must pass security validation before joining.</p>
          <p>Synchronized consensus mechanisms ensure transaction validity across the network.</p>
          
          <h2>4. Transaction Security</h2>
          <p>All transactions require digital signatures using your private key.</p>
          <p>Multiple confirmations are required before a transaction is considered final.</p>
          
          <h2>5. Smart Contract Security</h2>
          <p>All smart contracts undergo rigorous security audits before deployment.</p>
          <p>Security vulnerabilities are addressed through transparent update processes.</p>
          
          <h2>6. Bug Bounty Program</h2>
          <p>We maintain an active bug bounty program to identify and address security vulnerabilities.</p>
          
          <h2>7. Security Incident Response</h2>
          <p>In the event of a security breach, we will promptly notify affected users and take necessary steps to mitigate damage.</p>
          
          <h2>8. Regular Security Audits</h2>
          <p>Our platform undergoes regular third-party security audits to ensure the highest level of security.</p>
          
          <h2>9. Security Best Practices for Users</h2>
          <ul>
            <li>Store your recovery phrase in a secure location.</li>
            <li>Never share your private keys or recovery phrase with anyone.</li>
            <li>Use strong, unique passwords for your account.</li>
            <li>Be vigilant against phishing attempts.</li>
          </ul>
          
          <p className="text-sm text-muted-foreground mt-10">Last updated: April 24, 2025</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPolicy;
