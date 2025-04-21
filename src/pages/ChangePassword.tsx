
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LockKeyhole, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const { toast } = useToast();
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();

  const handleRequestCode = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would trigger a WhatsApp message with the verification code
      toast({
        title: "Verification Code Sent",
        description: "Please check your WhatsApp for the verification code",
      });
      setCodeRequested(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Please fill in all password fields");
      }
      
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords don't match");
      }
      
      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      if (!verificationCode) {
        throw new Error("Please enter the verification code");
      }
      
      const success = await changePassword(currentPassword, newPassword, verificationCode);
      
      if (success) {
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully",
        });
        navigate("/dashboard");
      } else {
        throw new Error("Failed to change password");
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
            <LockKeyhole className="h-8 w-8 text-quantum" />
          </div>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your account password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
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
            
            <div className="p-3 bg-muted rounded-md flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-quantum" />
              <p className="text-sm text-muted-foreground">
                Verification via WhatsApp ensures your account security
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="verificationCode">WhatsApp Verification Code</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={handleRequestCode}
                  disabled={isLoading || codeRequested}
                >
                  {codeRequested ? "Code Sent" : "Get Code"}
                </Button>
              </div>
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit"
              className="w-full bg-quantum hover:bg-quantum-dark"
              disabled={isLoading}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <Button type="button" variant="link" className="p-0 h-auto" onClick={() => navigate("/dashboard")}>
                Cancel and go back
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
