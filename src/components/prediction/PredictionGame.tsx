import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";
import { createPrediction, PredictionDirection } from "@/lib/prediction/prediction-game";
import { getAdminSettings } from "@/lib/admin/admin-settings";
import { useAuth } from "@/hooks/use-auth";
import { TokenInfo } from "@/lib/wallet/wallet-context";

interface PredictionGameProps {
  token: TokenInfo;
  currentPrice: number;
}

export const PredictionGame = ({ token, currentPrice }: PredictionGameProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [direction, setDirection] = useState<PredictionDirection>('up');
  const [amount, setAmount] = useState<number>(50);
  const [timeframeId, setTimeframeId] = useState<string>('1m');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const adminSettings = getAdminSettings();
  const { predictionGame, antiBot } = adminSettings;
  
  if (!predictionGame.enabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground">
              The prediction game is currently disabled.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get available timeframes
  const availableTimeframes = predictionGame.timeframes.filter(t => t.enabled);
  
  const handleDirectionChange = (newDirection: PredictionDirection) => {
    setDirection(newDirection);
  };
  
  const handlePredictionSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to make predictions.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Check for anti-bot cooldown
    if (antiBot.enabled) {
      // In a real app, we'd check the user's last prediction time and enforce cooldown
      // For demo purposes, we'll just simulate a cooldown check
      const hasRecentPrediction = false; // Replace with actual check
      
      if (hasRecentPrediction) {
        toast({
          title: "Action Cooldown",
          description: `Please wait ${antiBot.cooldownPeriod} seconds between predictions.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // In a real app, we might show a captcha here if required
    }
    
    // Create the prediction
    const prediction = createPrediction(
      user.id,
      user.displayName || user.email || 'Anonymous',
      token,
      direction,
      amount,
      timeframeId
    );
    
    setIsSubmitting(false);
    
    if (prediction) {
      // Reset the form or keep the values, depending on preference
      setAmount(50);
    }
  };
  
  // Format the selected timeframe for display
  const selectedTimeframe = availableTimeframes.find(t => t.id === timeframeId);
  const timeframeLabel = selectedTimeframe?.label || '1 minute';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Price Prediction</span>
          <span className="text-sm font-normal text-muted-foreground">
            {token.symbol} @ ${currentPrice.toFixed(2)}
          </span>
        </CardTitle>
        <CardDescription>
          Predict whether the price will go up or down
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label>I predict {token.symbol} will go:</Label>
            <div className="flex space-x-4 mt-2">
              <Button 
                variant={direction === 'up' ? "default" : "outline"} 
                className={direction === 'up' ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => handleDirectionChange('up')}
                size="lg"
              >
                <ArrowUpCircle className="mr-2 h-5 w-5" />
                UP
              </Button>
              <Button 
                variant={direction === 'down' ? "default" : "outline"}
                className={direction === 'down' ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => handleDirectionChange('down')}
                size="lg"
              >
                <ArrowDownCircle className="mr-2 h-5 w-5" />
                DOWN
              </Button>
            </div>
          </div>
          
          <div>
            <Label>Timeframe</Label>
            <Select 
              value={timeframeId}
              onValueChange={setTimeframeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeframes.map(timeframe => (
                  <SelectItem key={timeframe.id} value={timeframe.id}>
                    {timeframe.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Prediction Amount</Label>
              <span>{amount} NETZ</span>
            </div>
            <Slider
              value={[amount]}
              min={predictionGame.minBetAmount}
              max={predictionGame.maxBetAmount}
              step={10}
              onValueChange={(values) => setAmount(values[0])}
              className="my-4"
            />
          </div>
          
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between text-sm">
              <span>Potential Reward:</span>
              <span className="font-medium">
                {(amount * predictionGame.rewardMultiplier).toFixed(2)} NETZ
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Prediction Window:</span>
              <span className="font-medium flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {timeframeLabel}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button 
          className="w-full" 
          onClick={handlePredictionSubmit}
          disabled={isSubmitting}
        >
          Confirm Prediction
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Your prediction will be evaluated after {timeframeLabel}.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PredictionGame;
