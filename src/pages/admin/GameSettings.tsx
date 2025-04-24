
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAdminSettings } from "@/lib/admin/admin-settings";

const GameSettings = () => {
  const { toast } = useToast();
  const adminSettings = getAdminSettings();
  
  // Prediction Game Settings
  const [predictionGameEnabled, setPredictionGameEnabled] = useState(adminSettings.predictionGame.enabled);
  const [minBetAmount, setMinBetAmount] = useState(adminSettings.predictionGame.minBetAmount);
  const [maxBetAmount, setMaxBetAmount] = useState(adminSettings.predictionGame.maxBetAmount);
  const [rewardMultiplier, setRewardMultiplier] = useState(adminSettings.predictionGame.rewardMultiplier);
  
  // Timeframe Settings
  const [timeframes, setTimeframes] = useState(adminSettings.predictionGame.timeframes);
  
  // Leaderboard Settings
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(adminSettings.leaderboard.enabled);
  const [leaderboardResetPeriod, setLeaderboardResetPeriod] = useState("weekly");
  
  // Anti-Bot Settings
  const [antiBotEnabled, setAntiBotEnabled] = useState(adminSettings.antiBot.enabled);
  const [cooldownPeriod, setCooldownPeriod] = useState(adminSettings.antiBot.cooldownPeriod);
  const [captchaEnabled, setCaptchaEnabled] = useState(adminSettings.antiBot.requireCaptcha);
  
  const handleSaveGameSettings = () => {
    // In a real implementation, this would save to storage or backend
    toast({
      title: "Game Settings Saved",
      description: "Your changes have been applied.",
    });
  };
  
  const handleSaveLeaderboardSettings = () => {
    // In a real implementation, this would save to storage or backend
    toast({
      title: "Leaderboard Settings Saved",
      description: "Your changes have been applied.",
    });
  };
  
  const handleSaveAntiBotSettings = () => {
    // In a real implementation, this would save to storage or backend
    toast({
      title: "Anti-Bot Settings Saved",
      description: "Your changes have been applied.",
    });
  };
  
  const toggleTimeframe = (id: string) => {
    setTimeframes(timeframes.map(tf => 
      tf.id === id ? {...tf, enabled: !tf.enabled} : tf
    ));
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Game Settings</h1>
      
      <Tabs defaultValue="prediction">
        <TabsList className="mb-8">
          <TabsTrigger value="prediction">Prediction Game</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="antibot">Anti-Bot Protection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prediction">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Game Settings</CardTitle>
              <CardDescription>
                Configure how the prediction game works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable Prediction Game</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to predict token price movements
                  </p>
                </div>
                <Switch 
                  checked={predictionGameEnabled} 
                  onCheckedChange={setPredictionGameEnabled} 
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Minimum Bet Amount</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[minBetAmount]}
                      min={1}
                      max={1000}
                      step={1}
                      onValueChange={(value) => setMinBetAmount(value[0])}
                      disabled={!predictionGameEnabled}
                      className="flex-grow"
                    />
                    <div className="w-16 text-right">
                      <Input 
                        type="number"
                        value={minBetAmount}
                        onChange={(e) => setMinBetAmount(Number(e.target.value))}
                        disabled={!predictionGameEnabled}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label>Maximum Bet Amount</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[maxBetAmount]}
                      min={10}
                      max={10000}
                      step={10}
                      onValueChange={(value) => setMaxBetAmount(value[0])}
                      disabled={!predictionGameEnabled}
                      className="flex-grow"
                    />
                    <div className="w-16 text-right">
                      <Input 
                        type="number"
                        value={maxBetAmount}
                        onChange={(e) => setMaxBetAmount(Number(e.target.value))}
                        disabled={!predictionGameEnabled}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label>Reward Multiplier</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[rewardMultiplier * 100]}
                      min={100}
                      max={500}
                      step={10}
                      onValueChange={(value) => setRewardMultiplier(value[0] / 100)}
                      disabled={!predictionGameEnabled}
                      className="flex-grow"
                    />
                    <div className="w-16 text-right">
                      <Input 
                        type="text"
                        value={`${rewardMultiplier.toFixed(2)}x`}
                        readOnly
                        disabled={!predictionGameEnabled}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Timeframe Options</h3>
                <div className="space-y-2">
                  {timeframes.map((tf) => (
                    <div key={tf.id} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{tf.label}</span>
                      <Switch 
                        checked={tf.enabled} 
                        onCheckedChange={() => toggleTimeframe(tf.id)} 
                        disabled={!predictionGameEnabled}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGameSettings} disabled={!predictionGameEnabled} className="ml-auto">
                Save Game Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard Settings</CardTitle>
              <CardDescription>
                Configure how the prediction game leaderboard works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable Leaderboard</Label>
                  <p className="text-sm text-muted-foreground">
                    Display rankings of top predictors
                  </p>
                </div>
                <Switch 
                  checked={leaderboardEnabled} 
                  onCheckedChange={setLeaderboardEnabled} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Leaderboard Reset Period</Label>
                <select 
                  value={leaderboardResetPeriod}
                  onChange={(e) => setLeaderboardResetPeriod(e.target.value)}
                  disabled={!leaderboardEnabled}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never (All-time)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Display Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Show Total Winnings</Label>
                    <Switch disabled={!leaderboardEnabled} defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Win Percentage</Label>
                    <Switch disabled={!leaderboardEnabled} defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show User Avatars</Label>
                    <Switch disabled={!leaderboardEnabled} defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" disabled={!leaderboardEnabled} className="w-full mb-2">
                  Reset Leaderboard
                </Button>
                <Button variant="outline" disabled={!leaderboardEnabled} className="w-full">
                  Export Leaderboard Data
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveLeaderboardSettings} disabled={!leaderboardEnabled} className="ml-auto">
                Save Leaderboard Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="antibot">
          <Card>
            <CardHeader>
              <CardTitle>Anti-Bot Protection</CardTitle>
              <CardDescription>
                Configure protections against automated trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable Anti-Bot Measures</Label>
                  <p className="text-sm text-muted-foreground">
                    Protect against automated trading and prediction
                  </p>
                </div>
                <Switch 
                  checked={antiBotEnabled} 
                  onCheckedChange={setAntiBotEnabled} 
                />
              </div>
              
              <div className="space-y-1">
                <Label>Cooldown Period (seconds)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[cooldownPeriod]}
                    min={0}
                    max={120}
                    step={5}
                    onValueChange={(value) => setCooldownPeriod(value[0])}
                    disabled={!antiBotEnabled}
                    className="flex-grow"
                  />
                  <div className="w-16 text-right">
                    <Input 
                      type="number"
                      value={cooldownPeriod}
                      onChange={(e) => setCooldownPeriod(Number(e.target.value))}
                      disabled={!antiBotEnabled}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Require CAPTCHA</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must solve a CAPTCHA before predictions
                  </p>
                </div>
                <Switch 
                  checked={captchaEnabled} 
                  onCheckedChange={setCaptchaEnabled} 
                  disabled={!antiBotEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Additional Protections</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>IP Rate Limiting</Label>
                    <Switch disabled={!antiBotEnabled} defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Behavioral Analysis</Label>
                    <Switch disabled={!antiBotEnabled} defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Device Fingerprinting</Label>
                    <Switch disabled={!antiBotEnabled} />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" disabled={!antiBotEnabled} className="w-full">
                  View Flagged Activity Log
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAntiBotSettings} disabled={!antiBotEnabled} className="ml-auto">
                Save Anti-Bot Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameSettings;
