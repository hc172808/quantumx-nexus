
export const saveTokenFeaturePricing = (pricing: any) => {
  localStorage.setItem('tokenFeaturePricing', JSON.stringify(pricing));
};

export const getTokenFeaturePricing = () => {
  const pricing = localStorage.getItem('tokenFeaturePricing');
  return pricing ? JSON.parse(pricing) : null;
};

export const getWalletLockTimeout = (): number => {
  const timeout = localStorage.getItem('walletLockTimeout');
  return timeout ? parseInt(timeout, 10) : 60000; // Default 1 minute (60000 ms)
};

export const setWalletLockTimeout = (timeoutMs: number): void => {
  localStorage.setItem('walletLockTimeout', timeoutMs.toString());
};

// Update WalletData to match the structure expected by use-wallet.tsx
export interface WalletData {
  address: string;
  privateKey: string;
  balance: string;
  mnemonic: string;
  seed: string;
  keyPair: {
    privateKey: string;
    publicKey: string;
  };
  path: string;
}

// Update TokenData to match the structure expected by other components
export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  price?: number;
  totalSupply?: string;
  marketCap?: number;
  network?: string;
  features?: {
    mintable: boolean;
    mutableInfo: boolean;
    renounceOwnership: boolean;
    quantumProtection: boolean;
  };
  createdAt?: string;
  creator?: string;
  value?: number;
  address?: string;
}

export interface WalletMeta {
  backupComplete: boolean;
}

export const saveWalletToStorage = (wallet: WalletData, password: string): boolean => {
  try {
    // In a real implementation, the wallet would be encrypted with the password
    localStorage.setItem('wallet', JSON.stringify(wallet));
    return true;
  } catch (error) {
    console.error("Failed to save wallet:", error);
    return false;
  }
};

export const getWalletFromStorage = (password: string): WalletData | null => {
  try {
    const walletData = localStorage.getItem('wallet');
    if (!walletData) return null;
    
    const storedWallet = JSON.parse(walletData);
    return storedWallet;
  } catch (error) {
    incrementFailedAttempt();
    return null;
  }
};

export const walletExists = (): boolean => {
  return localStorage.getItem('wallet') !== null;
};

export const getWalletMeta = (): WalletMeta => {
  const metaData = localStorage.getItem('walletMeta');
  return metaData ? JSON.parse(metaData) : { backupComplete: false };
};

export const setWalletBackupStatus = (status: boolean): void => {
  const meta = getWalletMeta();
  meta.backupComplete = status;
  localStorage.setItem('walletMeta', JSON.stringify(meta));
};

export const removeWallet = (): boolean => {
  try {
    localStorage.removeItem('wallet');
    localStorage.removeItem('walletMeta');
    return true;
  } catch (error) {
    console.error("Failed to remove wallet:", error);
    return false;
  }
};

// Mining pool settings
export interface MiningPoolConfig {
  url: string;
  port: number;
  enabled: boolean;
  algorithm: string;
  threads: number;
}

export const saveMiningPoolConfig = (config: MiningPoolConfig): void => {
  localStorage.setItem('miningPoolConfig', JSON.stringify(config));
};

export const getMiningPoolConfig = (): MiningPoolConfig => {
  const config = localStorage.getItem('miningPoolConfig');
  return config ? JSON.parse(config) : {
    url: 'pool.quantum.network',
    port: 3333,
    enabled: false,
    algorithm: 'quantum',
    threads: navigator.hardwareConcurrency || 4
  };
};

// Ban related functions
let failedAttempts = 0;
const MAX_ATTEMPTS = 5;
const BAN_DURATION = 300; // 5 minutes in seconds
let banEndTime = 0;

const incrementFailedAttempt = (): void => {
  failedAttempts++;
  if (failedAttempts >= MAX_ATTEMPTS) {
    banEndTime = Math.floor(Date.now() / 1000) + BAN_DURATION;
    localStorage.setItem('banEndTime', banEndTime.toString());
  }
};

export const isUserBanned = (): boolean => {
  const storedBanEndTime = localStorage.getItem('banEndTime');
  if (!storedBanEndTime) return false;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime < parseInt(storedBanEndTime);
};

export const getBanInfo = (): { attempts: number; remainingSeconds: number } | null => {
  if (!isUserBanned()) {
    failedAttempts = 0;
    localStorage.removeItem('banEndTime');
    return null;
  }
  
  const storedBanEndTime = localStorage.getItem('banEndTime');
  if (!storedBanEndTime) return null;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const endTime = parseInt(storedBanEndTime);
  const remaining = Math.max(0, endTime - currentTime);
  
  return {
    attempts: failedAttempts,
    remainingSeconds: remaining
  };
};

export const setCustomLockoutTime = (seconds: number): void => {
  localStorage.setItem('customLockoutTime', seconds.toString());
};

// Token-related functions
export const saveCreatedToken = (token: TokenData): void => {
  const tokens = getCreatedTokens();
  tokens.push(token);
  localStorage.setItem('createdTokens', JSON.stringify(tokens));
};

export const getCreatedTokens = (): TokenData[] => {
  const tokens = localStorage.getItem('createdTokens');
  return tokens ? JSON.parse(tokens) : [];
};
