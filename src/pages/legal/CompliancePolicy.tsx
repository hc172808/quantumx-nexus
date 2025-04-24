
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CompliancePolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Compliance Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Regulatory Compliance</h2>
          <p>Quantum Network is committed to complying with applicable laws and regulations in the jurisdictions where we operate.</p>
          
          <h2>2. Know Your Customer (KYC)</h2>
          <p>We may require identity verification for certain platform features in accordance with regulatory requirements.</p>
          
          <h2>3. Anti-Money Laundering (AML)</h2>
          <p>We implement measures to prevent money laundering activities on our platform, including transaction monitoring and reporting suspicious activities.</p>
          
          <h2>4. Token Creation Compliance</h2>
          <p>All tokens created on the platform must comply with applicable securities laws and regulations.</p>
          <p>Users are responsible for ensuring their token creations meet regulatory requirements in their jurisdictions.</p>
          
          <h2>5. Tax Compliance</h2>
          <p>Users are responsible for reporting and paying taxes on their digital asset transactions according to their local tax laws.</p>
          
          <h2>6. Data Protection</h2>
          <p>We comply with applicable data protection and privacy laws in the collection, storage, and processing of user data.</p>
          
          <h2>7. Sanctions Compliance</h2>
          <p>We prohibit the use of our platform by individuals or entities subject to economic sanctions.</p>
          
          <h2>8. Updates to Compliance Policies</h2>
          <p>Our compliance policies may be updated to reflect changes in regulations or best practices.</p>
          
          <h2>9. Reporting Violations</h2>
          <p>If you suspect violations of our compliance policies, please report them to compliance@quantumnetwork.example.</p>
          
          <p className="text-sm text-muted-foreground mt-10">Last updated: April 24, 2025</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompliancePolicy;
