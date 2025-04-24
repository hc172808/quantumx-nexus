
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
          <Tabs defaultValue="basics">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="recovery">Recovery Process</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="space-y-4 pt-4">
              <section className="space-y-2">
                <h3 className="text-lg font-medium">What is a Recovery Phrase?</h3>
                <p className="text-muted-foreground">
                  A recovery phrase (also called a seed phrase or mnemonic) is a series of 12 or 24 words that can restore access to your wallet.
                  It's like a master key that should be kept extremely secure.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-medium">When is it Created?</h3>
                <p className="text-muted-foreground">
                  Your recovery phrase is automatically generated when you:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Create a new wallet</li>
                  <li>Sign up for a new account (during onboarding)</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  After creation, you'll be asked to verify you've saved it by confirming specific words from the phrase.
                </p>
              </section>

              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Critical Information</AlertTitle>
                <AlertDescription>
                  If you lose your recovery phrase, you will permanently lose access to your wallet and all funds within it.
                  There is no way to recover your phrase if lost.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4 pt-4">
              <section className="space-y-2">
                <h3 className="text-lg font-medium">Best Security Practices</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Write it down</strong> - Always write down your recovery phrase on paper or engrave it on metal. Never store it digitally.</li>
                  <li><strong>Multiple copies</strong> - Consider having more than one copy stored in different secure locations.</li>
                  <li><strong>Secure storage</strong> - Keep it in a safe, fireproof, and waterproof location.</li>
                  <li><strong>Never share</strong> - Never share your recovery phrase with anyone, not even technical support.</li>
                  <li><strong>No photos</strong> - Never take a photo of your recovery phrase or store it in cloud storage.</li>
                  <li><strong>No digital copies</strong> - Don't store your recovery phrase in a password manager, email, or any digital format.</li>
                </ul>
              </section>
              
              <section className="space-y-2 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-md">
                <h3 className="text-lg font-medium text-amber-800 dark:text-amber-400">Warning Signs</h3>
                <p className="text-amber-700 dark:text-amber-500">Be aware of these red flags:</p>
                <ul className="list-disc pl-6 space-y-1 text-amber-700 dark:text-amber-500">
                  <li>Anyone asking for your recovery phrase</li>
                  <li>Websites prompting you to enter your recovery phrase</li>
                  <li>Support staff asking for your recovery phrase to "fix" issues</li>
                  <li>Email requests for your recovery phrase</li>
                </ul>
                <p className="text-amber-800 dark:text-amber-400 font-bold mt-2">
                  Remember: No legitimate service will ever ask for your full recovery phrase
                </p>
              </section>
            </TabsContent>
            
            <TabsContent value="recovery" className="space-y-4 pt-4">
              <section className="space-y-2">
                <h3 className="text-lg font-medium">How to Recover Your Wallet</h3>
                <p className="text-muted-foreground">
                  If you need to restore access to your wallet, you can use your recovery phrase by following these steps:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                  <li>Go to the login page and click "Import Existing Wallet"</li>
                  <li>Enter your recovery phrase in the input field</li>
                  <li>Set a new password for your wallet</li>
                  <li>Click "Import Wallet"</li>
                </ol>
                <p className="text-muted-foreground mt-2">
                  Your wallet will be restored with all assets and transaction history.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-medium">Common Recovery Issues</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Extra spaces</strong> - Make sure there are no extra spaces at the beginning, end, or between words
                  </li>
                  <li>
                    <strong>Misspelled words</strong> - Each word must be spelled exactly as it appears in the BIP-39 wordlist
                  </li>
                  <li>
                    <strong>Wrong order</strong> - The words must be in the exact order they were given to you
                  </li>
                </ul>
              </section>
              
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-md mt-4">
                <div className="flex items-center text-green-700 dark:text-green-400">
                  <Key className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium">Need Help?</h3>
                </div>
                <p className="text-green-600 dark:text-green-500 mt-2">
                  If you're having trouble recovering your wallet, you can visit our support center or contact customer support.
                  Remember, support staff will never ask for your recovery phrase.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletRecoveryGuide;
