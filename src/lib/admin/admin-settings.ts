
import { toast } from "@/hooks/use-toast";

// Admin settings interfaces
export interface NetworkAccessSettings {
  allowExternalBlockchain: boolean;
  allowedExternalAddresses: string[];
  accessLogs: AccessLog[];
}

export interface AccessLog {
  timestamp: number;
  address: string;
  action: string;
  success: boolean;
}

export interface PredictionGameSettings {
  enabled: boolean;
  timeframes: PredictionTimeframe[];
  minBetAmount: number;
  maxBetAmount: number;
  rewardMultiplier: number;
}

export interface PredictionTimeframe {
  id: string;
  duration: number; // In seconds
  label: string;
  enabled: boolean;
}

export interface LeaderboardSettings {
  enabled: boolean;
  types: string[]; // daily, weekly, all-time
  visibleMetrics: string[]; // correctPredictions, rewards, accuracy
}

export interface AntiBotSettings {
  enabled: boolean;
  cooldownPeriod: number; // In seconds
  rateLimit: number; // Max actions per minute
  requireCaptcha: boolean;
}

export interface UIThemeSettings {
  availableThemes: UITheme[];
  defaultTheme: string;
  allowUserSelection: boolean;
}

export interface UITheme {
  id: string;
  name: string;
  colors: Record<string, string>;
  backgroundUrl?: string;
}

export interface AnalyticsSettings {
  enabled: boolean;
  refreshRate: number; // In seconds
  trackPredictions: boolean;
  trackTrades: boolean;
  autoFlagSuspiciousActivity: boolean;
}

export interface AdminSettings {
  networkAccess: NetworkAccessSettings;
  predictionGame: PredictionGameSettings;
  leaderboard: LeaderboardSettings;
  antiBot: AntiBotSettings;
  uiThemes: UIThemeSettings;
  analytics: AnalyticsSettings;
}

// Default settings
const defaultSettings: AdminSettings = {
  networkAccess: {
    allowExternalBlockchain: false,
    allowedExternalAddresses: [],
    accessLogs: []
  },
  predictionGame: {
    enabled: true,
    timeframes: [
      { id: '30s', duration: 30, label: '30 seconds', enabled: true },
      { id: '1m', duration: 60, label: '1 minute', enabled: true },
      { id: '5m', duration: 300, label: '5 minutes', enabled: true },
      { id: '30m', duration: 1800, label: '30 minutes', enabled: true }
    ],
    minBetAmount: 10,
    maxBetAmount: 1000,
    rewardMultiplier: 1.8
  },
  leaderboard: {
    enabled: true,
    types: ['daily', 'weekly', 'all-time'],
    visibleMetrics: ['correctPredictions', 'rewards', 'accuracy']
  },
  antiBot: {
    enabled: true,
    cooldownPeriod: 10,
    rateLimit: 30,
    requireCaptcha: true
  },
  uiThemes: {
    availableThemes: [
      { id: 'light', name: 'Light', colors: { background: '#ffffff', text: '#333333', primary: '#3498db' } },
      { id: 'dark', name: 'Dark', colors: { background: '#1a1a1a', text: '#ffffff', primary: '#3498db' } },
      { id: 'neon', name: 'Neon', colors: { background: '#0d0221', text: '#00ff99', primary: '#ff00ff' } },
      { id: 'retro', name: 'Retro', colors: { background: '#fff5e6', text: '#8b4513', primary: '#ff6347' } }
    ],
    defaultTheme: 'dark',
    allowUserSelection: true
  },
  analytics: {
    enabled: true,
    refreshRate: 60,
    trackPredictions: true,
    trackTrades: true,
    autoFlagSuspiciousActivity: true
  }
};

// Local storage key
const ADMIN_SETTINGS_KEY = 'quantum_admin_settings';

// Get admin settings
export const getAdminSettings = (): AdminSettings => {
  try {
    const storedSettings = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    return defaultSettings;
  } catch (error) {
    console.error("Error loading admin settings:", error);
    return defaultSettings;
  }
};

// Save admin settings
export const saveAdminSettings = (settings: AdminSettings): void => {
  try {
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Admin settings have been updated."
    });
  } catch (error) {
    console.error("Error saving admin settings:", error);
    toast({
      title: "Error Saving Settings",
      description: "There was a problem saving your settings.",
      variant: "destructive"
    });
  }
};

// Toggle feature helpers
export const toggleNetworkAccess = (allow: boolean): void => {
  const settings = getAdminSettings();
  settings.networkAccess.allowExternalBlockchain = allow;
  saveAdminSettings(settings);
};

export const togglePredictionGame = (enable: boolean): void => {
  const settings = getAdminSettings();
  settings.predictionGame.enabled = enable;
  saveAdminSettings(settings);
};

export const toggleLeaderboard = (enable: boolean): void => {
  const settings = getAdminSettings();
  settings.leaderboard.enabled = enable;
  saveAdminSettings(settings);
};

export const toggleAntiBot = (enable: boolean): void => {
  const settings = getAdminSettings();
  settings.antiBot.enabled = enable;
  saveAdminSettings(settings);
};

export const toggleAnalytics = (enable: boolean): void => {
  const settings = getAdminSettings();
  settings.analytics.enabled = enable;
  saveAdminSettings(settings);
};

export const setDefaultTheme = (themeId: string): void => {
  const settings = getAdminSettings();
  settings.uiThemes.defaultTheme = themeId;
  saveAdminSettings(settings);
};

export const toggleUserThemeSelection = (allow: boolean): void => {
  const settings = getAdminSettings();
  settings.uiThemes.allowUserSelection = allow;
  saveAdminSettings(settings);
};
