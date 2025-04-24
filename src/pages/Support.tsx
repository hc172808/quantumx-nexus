
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const { toast } = useToast();
  const [category, setCategory] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !subject || !message || !email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would submit to a backend
    toast({
      title: "Support Ticket Submitted",
      description: "We'll get back to you shortly.",
    });
    
    // Reset form
    setCategory("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Support Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Fill out this form and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wallet">Wallet Issues</SelectItem>
                      <SelectItem value="token">Token Creation</SelectItem>
                      <SelectItem value="node">Node Configuration</SelectItem>
                      <SelectItem value="trading">Trading Problems</SelectItem>
                      <SelectItem value="security">Security Concerns</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your issue in detail"
                    rows={6}
                  />
                </div>
                
                <Button type="submit" className="w-full">Submit Support Request</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Wallet Recovery</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Lost access to your wallet?
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/wallet-recovery-guide">Wallet Recovery Guide</a>
                </Button>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Node Setup</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Learn how to set up and configure nodes.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/node-config">Node Configuration</a>
                </Button>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">FAQ</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Browse our frequently asked questions.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/faq">View FAQ</a>
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Contact Information</h3>
                <p className="text-sm">
                  <strong>Email:</strong> support@quantumnetwork.example
                </p>
                <p className="text-sm">
                  <strong>Hours:</strong> 24/7 for urgent issues
                </p>
                <p className="text-sm">
                  <strong>Response Time:</strong> Within 24 hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
