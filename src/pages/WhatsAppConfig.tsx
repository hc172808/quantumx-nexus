
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WhatsAppConfig = () => {
  const [apiKey, setApiKey] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!apiKey || !templateId || !businessPhone) {
        throw new Error("Please fill in all required fields");
      }
      
      // In a real app, this would save the WhatsApp configuration
      setTimeout(() => {
        toast({
          title: "Configuration Saved",
          description: "WhatsApp configuration has been updated",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleTestMessage = async () => {
    setTestSending(true);
    
    try {
      if (!testPhone) {
        throw new Error("Please enter a test phone number");
      }
      
      // In a real app, this would send a test WhatsApp message
      setTimeout(() => {
        toast({
          title: "Test Message Sent",
          description: `A test verification message was sent to ${testPhone}`,
        });
        setTestSending(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setTestSending(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-16">
        <Card className="border-2 border-destructive/30">
          <CardHeader className="text-center">
            <ShieldCheck className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Admin Access Required</CardTitle>
            <CardDescription>
              You don't have permission to access this area.
              Please contact an administrator for assistance.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <Card className="border-2 border-quantum/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-quantum/10 rounded-full flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-quantum" />
          </div>
          <CardTitle>WhatsApp Configuration</CardTitle>
          <CardDescription>
            Set up WhatsApp integration for verification codes and password resets
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveConfig}>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                This integration uses the WhatsApp Business API to send verification codes for enhanced security.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">WhatsApp API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your WhatsApp Business API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can find this in your WhatsApp Business Platform dashboard
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateId">Message Template ID</Label>
              <Input
                id="templateId"
                placeholder="Enter verification template ID"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The ID of the pre-approved template for verification codes
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Business Phone Number</Label>
              <Input
                id="businessPhone"
                placeholder="Enter WhatsApp business phone (with country code)"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The phone number associated with your WhatsApp Business account
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="messageTemplate">Message Template Preview</Label>
              <Textarea
                id="messageTemplate"
                placeholder="Your verification code is: {{code}}. This code will expire in 10 minutes."
                className="h-24"
                defaultValue="Your NETZ Quantum Vault verification code is: {{code}}. This code will expire in 10 minutes."
              />
            </div>
            
            <div className="border border-border p-4 rounded-md">
              <h3 className="font-medium mb-3">Test WhatsApp Integration</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter test phone number"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleTestMessage}
                  disabled={testSending}
                >
                  {testSending ? "Sending..." : "Send Test"}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              type="submit"
              className="bg-quantum hover:bg-quantum-dark"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default WhatsAppConfig;
