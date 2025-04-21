
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Checkbox } from "@/components/ui/checkbox";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { toast } = useToast();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simple validation
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }
      
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      if (!termsAccepted) {
        throw new Error("You must accept the terms and conditions");
      }
      
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      const success = await signup(email, password);
      
      if (success) {
        toast({
          title: "Account Created",
          description: "Your account has been successfully created",
        });
        navigate("/wallet");
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <Card className="border-2 border-quantum/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-quantum/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-quantum" />
          </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Join the quantum-protected blockchain network
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the terms and conditions
              </label>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                Your account will let you create a quantum-protected wallet,
                mine NETZ coins, and access the blockchain ecosystem.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit"
              className="w-full bg-quantum hover:bg-quantum-dark"
              disabled={isLoading || !termsAccepted}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button type="button" variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
