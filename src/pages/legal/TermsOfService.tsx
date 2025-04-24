
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the Quantum Network platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          
          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily use the Quantum Network platform for personal, non-commercial transitory viewing and token management only.</p>
          
          <h2>3. Token Creation and Trading</h2>
          <p>Users are responsible for complying with all applicable laws when creating, trading, or transferring tokens on the platform.</p>
          <p>All tokens must have unique names and symbols. The platform prevents creation of tokens with duplicate identifiers.</p>
          
          <h2>4. Node Operation</h2>
          <p>When operating nodes on the Quantum Network, users must ensure their nodes maintain synchronization with the network.</p>
          <p>Operation of malicious nodes may result in account termination.</p>
          
          <h2>5. User Account Responsibilities</h2>
          <p>You are responsible for safeguarding your account credentials and recovery phrases.</p>
          <p>Quantum Network cannot recover lost access credentials or recovery phrases.</p>
          
          <h2>6. Disclaimer</h2>
          <p>The platform is provided "as is". Quantum Network makes no warranties about the completeness, reliability, or accuracy of the platform.</p>
          
          <h2>7. Limitation of Liability</h2>
          <p>Quantum Network shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use or inability to use the platform.</p>
          
          <h2>8. Changes to Terms</h2>
          <p>Quantum Network reserves the right to modify these terms at any time. Users will be notified of significant changes.</p>
          
          <h2>9. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Quantum Network operates.</p>
          
          <p className="text-sm text-muted-foreground mt-10">Last updated: April 24, 2025</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;
