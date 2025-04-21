
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { KeyRound, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"request" | "reset">("request");
  const { toast } = useToast();
  const { requestPasswordReset, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!email) {
        throw new Error("Please enter your email");
      }
      
      const success = await requestPasswordReset(email);
      
      if (success) {
        toast({
          title: "Reset Code Sent",
          description: "Please check your WhatsApp for the verification code",
        });
        setStep("reset");
      } else {
        throw new Error("Failed to send reset code");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!newPassword || !confirmPassword) {
        throw new Error("Please fill in all password fields");
      }
      
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords don't match");
      }
      
      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      if (!verificationCode) {
        throw new Error("Please enter the verification code");
      }
      
      const success = await resetPassword(email, newPassword, verificationCode);
      
      if (success) {
        toast({
          title: "Password Reset",
          description: "Your password has been reset successfully",
        });
        navigate("/login");
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
            <KeyRound className="h-8 w-8 text-quantum" />
          </div>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {step === "request" 
              ? "Request a password reset via WhatsApp" 
              : "Enter the verification code and new password"}
          </CardDescription>
        </CardHeader>
        
        {step === "request" ? (
          <form onSubmit={handleRequestReset}>
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
              <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-quantum" />
                <p className="text-sm text-muted-foreground">
                  A verification code will be sent to your WhatsApp
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit"
                className="w-full bg-quantum hover:bg-quantum-dark"
                disabled={isLoading}
              >
                {isLoading ? "Sending Code..." : "Send Reset Code"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <Button type="button" variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>
                  Back to Login
                </Button>
              </div>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">WhatsApp Verification Code</Label>
                <div className="flex justify-center py-2">
                  <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Create a strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit"
                className="w-full bg-quantum hover:bg-quantum-dark"
                disabled={isLoading}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={() => setStep("request")}
                >
                  Request a new code
                </Button>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
