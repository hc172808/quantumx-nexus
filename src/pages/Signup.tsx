
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Checkbox } from "@/components/ui/checkbox";
import { generateMnemonic } from "@/lib/wallet/crypto-utils";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<"form" | "recovery">("form");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [confirmationWords, setConfirmationWords] = useState<{ index: number, word: string }[]>([]);
  const [userConfirmation, setUserConfirmation] = useState<{[key: number]: string}>({});
  const [recoveryPhraseConfirmed, setRecoveryPhraseConfirmed] = useState(false);
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
      
      // Generate recovery phrase
      const mnemonic = generateMnemonic(128); // 12 words
      setRecoveryPhrase(mnemonic);
      
      // Generate confirmation test (3 random words to verify)
      const words = mnemonic.split(" ");
      const wordIndices = [];
      while (wordIndices.length < 3) {
        const randomIndex = Math.floor(Math.random() * words.length);
        if (!wordIndices.includes(randomIndex)) {
          wordIndices.push(randomIndex);
        }
      }
      
      setConfirmationWords(
        wordIndices.map(index => ({ index, word: words[index] }))
      );
      
      const success = await signup(email, password);
      
      if (success) {
        // Move to recovery phrase step
        setStep("recovery");
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An error occurred during signup",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleConfirmationWordChange = (index: number, value: string) => {
    setUserConfirmation(prev => ({ ...prev, [index]: value }));
  };

  const validateRecoveryPhraseConfirmation = () => {
    for (const { index, word } of confirmationWords) {
      if (userConfirmation[index]?.toLowerCase() !== word.toLowerCase()) {
        return false;
      }
    }
    return true;
  };

  const handleRecoveryPhraseConfirmed = () => {
    if (!recoveryPhraseConfirmed) {
      const isValid = validateRecoveryPhraseConfirmation();
      if (!isValid) {
        toast({
          title: "Verification Failed",
          description: "The words you entered do not match your recovery phrase.",
          variant: "destructive",
        });
        return;
      }
      setRecoveryPhraseConfirmed(true);
    } else {
      setIsLoading(false);
      toast({
        title: "Account Created",
        description: "Your account has been successfully created. Keep your recovery phrase safe!",
      });
      navigate("/wallet");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (step === "recovery") {
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card className="border-2 border-quantum/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle>Your Recovery Phrase</CardTitle>
            <CardDescription className="text-red-500 font-semibold">
              IMPORTANT: Save this phrase somewhere safe. It's the only way to recover your account!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-2">
                {recoveryPhrase.split(" ").map((word, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-muted-foreground text-xs mr-1">{index + 1}.</span>
                    <span className="font-mono text-sm">{word}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {!recoveryPhraseConfirmed ? (
              <div className="space-y-4">
                <div className="bg-red-100 p-3 rounded-md border border-red-300">
                  <p className="text-sm text-red-700">
                    <strong>Verification:</strong> Please enter the following words from your recovery phrase to confirm you have saved it.
                  </p>
                </div>
                
                <div className="grid gap-3">
                  {confirmationWords.map(({ index, word }) => (
                    <div key={index} className="space-y-1">
                      <Label htmlFor={`word-${index}`}>Word #{index + 1}</Label>
                      <Input 
                        id={`word-${index}`}
                        value={userConfirmation[index] || ""}
                        onChange={(e) => handleConfirmationWordChange(index, e.target.value)}
                        placeholder={`Enter word #${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-100 p-3 rounded-md border border-green-300">
                <p className="text-sm text-green-700">
                  <strong>Verified:</strong> You have successfully verified your recovery phrase. Make sure to keep it in a safe place.
                </p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="confirmed" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <label
                htmlFor="confirmed"
                className="text-sm font-medium leading-none"
              >
                I have saved my recovery phrase in a secure location
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleRecoveryPhraseConfirmed}
              className="w-full bg-quantum hover:bg-quantum-dark"
              disabled={!termsAccepted || (!recoveryPhraseConfirmed && !validateRecoveryPhraseConfirmation())}
            >
              {recoveryPhraseConfirmed ? "Continue to Wallet" : "Verify Recovery Phrase"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
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
