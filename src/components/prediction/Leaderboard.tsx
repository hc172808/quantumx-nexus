
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Trophy, Medal, User, Calendar } from "lucide-react";
import { getLeaderboard, LeaderboardEntry } from '@/lib/prediction/prediction-game';
import { getAdminSettings } from '@/lib/admin/admin-settings';

const LeaderboardTypeIcons = {
  daily: <Calendar className="h-4 w-4 mr-2" />,
  weekly: <Calendar className="h-4 w-4 mr-2" />,
  'all-time': <Trophy className="h-4 w-4 mr-2" />
};

const RankIcons = [
  <Trophy className="h-5 w-5 text-amber-500" key="1" />, // 1st place - gold
  <Medal className="h-5 w-5 text-gray-400" key="2" />,  // 2nd place - silver
  <Award className="h-5 w-5 text-amber-700" key="3" />  // 3rd place - bronze
];

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardType, setLeaderboardType] = useState('all-time');
  const [sortBy, setSortBy] = useState('totalRewards');
  const adminSettings = getAdminSettings();
  
  useEffect(() => {
    // Load leaderboard data
    const data = getLeaderboard();
    setLeaderboard(data);
  }, []);
  
  if (!adminSettings.leaderboard.enabled) {
    return null;
  }
  
  // Sort the leaderboard based on the selected criterion
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (sortBy === 'totalRewards') {
      return b.totalRewards - a.totalRewards;
    } else if (sortBy === 'correctPredictions') {
      return b.correctPredictions - a.correctPredictions;
    } else {
      return b.accuracy - a.accuracy;
    }
  });
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Prediction Leaders</CardTitle>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="totalRewards">Highest Rewards</SelectItem>
              <SelectItem value="correctPredictions">Most Correct</SelectItem>
              <SelectItem value="accuracy">Best Accuracy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>Top performers in the prediction game</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={leaderboardType} onValueChange={setLeaderboardType}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="daily">
              <Calendar className="h-4 w-4 mr-2" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly">
              <Calendar className="h-4 w-4 mr-2" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="all-time">
              <Trophy className="h-4 w-4 mr-2" />
              All Time
            </TabsTrigger>
          </TabsList>
          
          {['daily', 'weekly', 'all-time'].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              {sortedLeaderboard.length > 0 ? (
                <div className="space-y-2">
                  {sortedLeaderboard.slice(0, 10).map((entry, index) => (
                    <div 
                      key={entry.userId} 
                      className={`flex items-center justify-between p-3 rounded-md ${
                        index < 3 ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full mr-3">
                          {index < 3 ? RankIcons[index] : <span className="font-medium">{index+1}</span>}
                        </div>
                        <div>
                          <p className="font-medium">{entry.userName}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Badge variant="outline" className="mr-2">
                              {entry.correctPredictions}/{entry.totalPredictions}
                            </Badge>
                            <span>{(entry.accuracy * 100).toFixed(1)}% accuracy</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{entry.totalRewards.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">NETZ earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-medium">No data yet</p>
                  <p className="text-sm text-muted-foreground">
                    Make predictions to appear on the leaderboard
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <span>Updated in real time</span>
      </CardFooter>
    </Card>
  );
};

export default Leaderboard;
