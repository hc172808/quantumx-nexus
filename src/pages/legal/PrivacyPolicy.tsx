
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Information Collection</h2>
          <p>We collect information you provide directly to us when you create an account, use our platform features, or communicate with us.</p>
          
          <h2>2. Wallet Information</h2>
          <p>Your wallet address is publicly visible on the blockchain. We do not store private keys on our servers.</p>
          <p>Recovery phrases are encrypted locally and never transmitted to our servers in an unencrypted form.</p>
          
          <h2>3. Transaction Data</h2>
          <p>All blockchain transactions are publicly visible. We may collect and analyze transaction data for platform improvement and security purposes.</p>
          
          <h2>4. Data Usage</h2>
          <p>We use collected information to provide, maintain, and improve the platform, to process transactions, and to communicate with you.</p>
          
          <h2>5. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with service providers who assist in our operations, or if required by law.</p>
          
          <h2>6. Data Security</h2>
          <p>We implement security measures to protect your information. However, no method of transmission over the internet is completely secure.</p>
          
          <h2>7. User Rights</h2>
          <p>You can access, update, or delete your account information through your account settings.</p>
          
          <h2>8. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to enhance your experience and collect information about how you use our platform.</p>
          
          <h2>9. Changes to Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          
          <h2>10. Contact Information</h2>
          <p>For questions about this Privacy Policy, please contact us at privacy@quantumnetwork.example.</p>
          
          <p className="text-sm text-muted-foreground mt-10">Last updated: April 24, 2025</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
