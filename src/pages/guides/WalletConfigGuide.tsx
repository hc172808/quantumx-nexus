
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const WalletConfigGuide = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-quantum/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-quantum" />
          </div>
          <CardTitle className="text-center">Wallet Configuration Guide</CardTitle>
          <CardDescription className="text-center">
            Learn how to configure and manage your quantum wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <section className="space-y-2">
              <h3 className="text-lg font-medium">Security Settings</h3>
              <p className="text-muted-foreground">
                Configure your wallet's security features including lockout times, backup options,
                and quantum protection settings.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-medium">Network Configuration</h3>
              <p className="text-muted-foreground">
                Set up your preferred networks, manage gas fees, and configure transaction settings.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-medium">Token Management</h3>
              <p className="text-muted-foreground">
                Learn how to add custom tokens, manage visibility, and organize your assets.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConfigGuide;
