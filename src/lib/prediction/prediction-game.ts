
import { toast } from "@/hooks/use-toast";
import { getAdminSettings } from "@/lib/admin/admin-settings";
import { TokenInfo } from "@/lib/wallet/wallet-context";

export type PredictionDirection = 'up' | 'down';

export interface Prediction {
  id: string;
  userId: string;
  userName: string;
  tokenId: string;
  tokenSymbol: string;
  direction: PredictionDirection;
  amount: number;
  timeframeId: string;
  startTime: number;
  endTime: number;
  startPrice: number;
  endPrice?: number;
  isCompleted: boolean;
  isCorrect?: boolean;
  reward?: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  correctPredictions: number;
  totalPredictions: number;
  accuracy: number;
  totalRewards: number;
}

// Local storage keys
const PREDICTIONS_KEY = 'quantum_predictions';
const LEADERBOARD_KEY = 'quantum_leaderboard';

// Helpers to get and save predictions
export const getPredictions = (): Prediction[] => {
  try {
    const storedPredictions = localStorage.getItem(PREDICTIONS_KEY);
    return storedPredictions ? JSON.parse(storedPredictions) : [];
  } catch (error) {
    console.error("Error loading predictions:", error);
    return [];
  }
};

export const savePredictions = (predictions: Prediction[]): void => {
  try {
    localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions));
  } catch (error) {
    console.error("Error saving predictions:", error);
  }
};

// Helpers to get and save leaderboard
export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
    return storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    return [];
  }
};

export const saveLeaderboard = (leaderboard: LeaderboardEntry[]): void => {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch (error) {
    console.error("Error saving leaderboard:", error);
  }
};

// Create a new prediction
export const createPrediction = (
  userId: string,
  userName: string,
  token: TokenInfo,
  direction: PredictionDirection,
  amount: number,
  timeframeId: string
): Prediction | null => {
  const settings = getAdminSettings();
  
  if (!settings.predictionGame.enabled) {
    toast({
      title: "Prediction Game Disabled",
      description: "The prediction game is currently disabled by admin.",
      variant: "destructive"
    });
    return null;
  }
  
  const timeframe = settings.predictionGame.timeframes.find(t => t.id === timeframeId);
  if (!timeframe || !timeframe.enabled) {
    toast({
      title: "Invalid Timeframe",
      description: "The selected timeframe is not available.",
      variant: "destructive"
    });
    return null;
  }
  
  if (amount < settings.predictionGame.minBetAmount || amount > settings.predictionGame.maxBetAmount) {
    toast({
      title: "Invalid Amount",
      description: `Bet amount must be between ${settings.predictionGame.minBetAmount} and ${settings.predictionGame.maxBetAmount}.`,
      variant: "destructive"
    });
    return null;
  }
  
  const startTime = Date.now();
  const endTime = startTime + (timeframe.duration * 1000);
  
  const prediction: Prediction = {
    id: `pred_${startTime}_${Math.floor(Math.random() * 10000)}`,
    userId,
    userName,
    tokenId: token.id,
    tokenSymbol: token.symbol,
    direction,
    amount,
    timeframeId,
    startTime,
    endTime,
    startPrice: token.price,
    isCompleted: false
  };
  
  const predictions = getPredictions();
  predictions.push(prediction);
  savePredictions(predictions);
  
  toast({
    title: "Prediction Placed",
    description: `You predicted ${token.symbol} will go ${direction.toUpperCase()} in ${timeframe.label}.`,
  });
  
  // Schedule evaluation
  setTimeout(() => evaluatePrediction(prediction.id), timeframe.duration * 1000 + 1000);
  
  return prediction;
};

// Evaluate a prediction
export const evaluatePrediction = (predictionId: string): void => {
  const predictions = getPredictions();
  const predictionIndex = predictions.findIndex(p => p.id === predictionId);
  
  if (predictionIndex === -1) {
    console.error("Prediction not found:", predictionId);
    return;
  }
  
  const prediction = predictions[predictionIndex];
  if (prediction.isCompleted) {
    return; // Already evaluated
  }
  
  // In a real app, we would fetch the current price from an API
  // For demo purposes, we'll generate a random price
  const priceChange = (Math.random() * 10) - 5; // Random change between -5% and +5%
  const endPrice = prediction.startPrice * (1 + (priceChange / 100));
  
  const isCorrect = (prediction.direction === 'up' && endPrice > prediction.startPrice) ||
                   (prediction.direction === 'down' && endPrice < prediction.startPrice);
  
  const settings = getAdminSettings();
  const reward = isCorrect ? prediction.amount * settings.predictionGame.rewardMultiplier : 0;
  
  // Update the prediction
  predictions[predictionIndex] = {
    ...prediction,
    endPrice,
    isCompleted: true,
    isCorrect,
    reward
  };
  
  savePredictions(predictions);
  
  // Update the leaderboard
  updateLeaderboard(prediction.userId, prediction.userName, isCorrect, reward);
  
  // Notify the user
  toast({
    title: isCorrect ? "Prediction Correct!" : "Prediction Incorrect",
    description: isCorrect
      ? `You earned ${reward.toFixed(2)} tokens.`
      : `Better luck next time!`,
    variant: isCorrect ? "default" : "destructive"
  });
};

// Update the leaderboard
export const updateLeaderboard = (
  userId: string,
  userName: string,
  isCorrect: boolean,
  reward: number
): void => {
  const leaderboard = getLeaderboard();
  const existingEntryIndex = leaderboard.findIndex(entry => entry.userId === userId);
  
  if (existingEntryIndex !== -1) {
    const entry = leaderboard[existingEntryIndex];
    leaderboard[existingEntryIndex] = {
      ...entry,
      correctPredictions: entry.correctPredictions + (isCorrect ? 1 : 0),
      totalPredictions: entry.totalPredictions + 1,
      accuracy: (entry.correctPredictions + (isCorrect ? 1 : 0)) / (entry.totalPredictions + 1),
      totalRewards: entry.totalRewards + reward
    };
  } else {
    leaderboard.push({
      userId,
      userName,
      correctPredictions: isCorrect ? 1 : 0,
      totalPredictions: 1,
      accuracy: isCorrect ? 1 : 0,
      totalRewards: reward
    });
  }
  
  saveLeaderboard(leaderboard);
};

// Reset the leaderboard
export const resetLeaderboard = (): void => {
  saveLeaderboard([]);
  toast({
    title: "Leaderboard Reset",
    description: "The prediction game leaderboard has been reset."
  });
};

// Export leaderboard data
export const exportLeaderboardData = (format: 'csv' | 'json'): string => {
  const leaderboard = getLeaderboard();
  
  if (format === 'json') {
    return JSON.stringify(leaderboard, null, 2);
  } else {
    // CSV format
    const headers = "User ID,User Name,Correct Predictions,Total Predictions,Accuracy,Total Rewards\n";
    const rows = leaderboard.map(entry => 
      `${entry.userId},${entry.userName},${entry.correctPredictions},${entry.totalPredictions},${entry.accuracy.toFixed(2)},${entry.totalRewards}`
    ).join('\n');
    return headers + rows;
  }
};
