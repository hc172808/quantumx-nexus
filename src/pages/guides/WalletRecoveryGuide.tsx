
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const WalletRecoveryGuide = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-quantum/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-quantum" />
          </div>
          <CardTitle className="text-center">Recovery Phrase Guide</CardTitle>
          <CardDescription className="text-center">
            Important information about your wallet recovery phrase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <section className="space-y-2">
              <h3 className="text-lg font-medium">What is a Recovery Phrase?</h3>
              <p className="text-muted-foreground">
                A recovery phrase is a series of 12 or 24 words that can restore access to your wallet.
                It's like a master key that should be kept extremely secure.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-medium">Best Practices</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Write down your recovery phrase on paper - never store it digitally</li>
                <li>Store it in a secure, dry, and fireproof location</li>
                <li>Never share your recovery phrase with anyone</li>
                <li>Be wary of any website or person asking for your recovery phrase</li>
              </ul>
            </section>

            <section className="bg-destructive/10 p-4 rounded-md">
              <h3 className="text-lg font-medium text-destructive">Important Warning</h3>
              <p className="text-destructive">
                If you lose your recovery phrase, you will permanently lose access to your wallet and all funds within it.
                There is no way to recover your phrase if lost.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletRecoveryGuide;
