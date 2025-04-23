
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  WalletKeys,
  generateWallet,
  restoreWalletFromMnemonic,
  validateMnemonic
} from '@/lib/wallet/crypto-utils';
import {
  WalletData,
  saveWalletToStorage,
  getWalletFromStorage,
  walletExists,
  getWalletMeta,
  setWalletBackupStatus,
  removeWallet,
  isUserBanned,
  getBanInfo,
  setCustomLockoutTime
} from '@/lib/wallet/wallet-storage';

// Convert WalletKeys to WalletData for storage
const convertWalletKeysToWalletData = (wallet: WalletKeys): WalletData => {
  return {
    address: wallet.address,
    privateKey: wallet.keyPair.privateKey,
    balance: "0", // Initial balance
    mnemonic: wallet.mnemonic,
    seed: wallet.seed,
    keyPair: wallet.keyPair,
    path: wallet.path
  };
};

// Convert WalletData back to WalletKeys structure for use in the app
const convertWalletDataToWalletKeys = (wallet: WalletData): WalletKeys => {
  return {
    address: wallet.address,
    mnemonic: wallet.mnemonic,
    seed: wallet.seed,
    keyPair: wallet.keyPair,
    path: wallet.path
  };
};

// Types
export interface Token {
  name: string;
  symbol: string;
  network: string;
  balance: string;
  value: number;
  address: string;
  logo?: string;
}

export interface Trade {
  tokenSymbol: string;
  type: 'buy' | 'sell';
  amount: string;
  price: number;
  total: number;
  timestamp: number;
}

export interface WalletContextType {
  // Wallet state
  wallet: WalletKeys | null;
  isLoading: boolean;
  isUnlocked: boolean;
  hasWallet: boolean;
  isCreating: boolean;
  isRestoring: boolean;
  seedPhrase: string | null;
  seedPhraseShown: boolean;
  tokens: Token[];
  banInfo: { attempts: number; remainingSeconds: number } | null;
  tradeHistory: Trade[];
  
  // Actions
  createWallet: (password: string) => Promise<boolean>;
  unlockWallet: (password: string) => Promise<boolean>;
  restoreWallet: (mnemonic: string, password: string) => Promise<boolean>;
  lockWallet: () => void;
  deleteWallet: () => boolean;
  confirmSeedPhraseSaved: () => void;
  checkSeedPhraseWord: (index: number, word: string) => boolean;
  addToken: (token: Omit<Token, 'balance' | 'value'>) => void;
  showSeedPhrase: () => void;
  hideSeedPhrase: () => void;
  setLockoutTime: (seconds: number) => boolean;
  
  // New action functions
  sendToken: (to: string, amount: string, tokenSymbol: string) => boolean;
  receiveToken: () => string;
  swapTokens: (fromToken: string, toToken: string, amount: string) => boolean;
  buyToken: (tokenSymbol: string, amount: string) => boolean;
  tradeToken: (tokenSymbol: string, type: 'buy' | 'sell', amount: string, price: number) => boolean;
  cashOut: (amount: string) => boolean;
  canCashOut: () => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Wallet state
  const [wallet, setWallet] = useState<WalletKeys | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);
  const [seedPhraseShown, setSeedPhraseShown] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [banInfo, setBanInfo] = useState<{ attempts: number; remainingSeconds: number } | null>(null);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  
  // Check wallet existence on load
  useEffect(() => {
    const exists = walletExists();
    setHasWallet(exists);
    setIsLoading(false);
    
    // Check ban status
    const banStatus = getBanInfo();
    if (banStatus) {
      setBanInfo(banStatus);
      
      // Set up timer to update remaining ban time
      const interval = setInterval(() => {
        const updatedBan = getBanInfo();
        setBanInfo(updatedBan);
        if (!updatedBan) clearInterval(interval);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  // Create new wallet
  const createWallet = useCallback(async (password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setIsCreating(true);
      
      // Generate new wallet with quantum protection
      const newWallet = generateWallet(128); // 12 words
      
      // Convert WalletKeys to WalletData before saving
      const walletData = convertWalletKeysToWalletData(newWallet);
      
      // Save to storage encrypted with password
      const saved = saveWalletToStorage(walletData, password);
      
      if (saved) {
        setWallet(newWallet);
        setHasWallet(true);
        setIsUnlocked(true);
        setSeedPhrase(newWallet.mnemonic);
        setTokens([
          {
            name: "Quantum Token",
            symbol: "QTM",
            network: "Quantum Network",
            balance: "1000",
            value: 1.25,
            address: "qv000000000000quantumtoken0000000000000"
          }
        ]);
      }
      
      return saved;
    } catch (error) {
      console.error("Failed to create wallet:", error);
      return false;
    } finally {
      setIsLoading(false);
      setIsCreating(false);
    }
  }, []);
  
  // Unlock existing wallet
  const unlockWallet = useCallback(async (password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if user is banned
      if (isUserBanned()) {
        const banStatus = getBanInfo();
        if (banStatus) {
          setBanInfo(banStatus);
          return false;
        }
      }
      
      // Get wallet from storage
      const retrievedWalletData = getWalletFromStorage(password);
      
      if (retrievedWalletData) {
        // Convert WalletData to WalletKeys
        const walletKeys = convertWalletDataToWalletKeys(retrievedWalletData);
        setWallet(walletKeys);
        setIsUnlocked(true);
        setBanInfo(null);
        
        // Load tokens (mock implementation)
        setTokens([
          {
            name: "Quantum Token",
            symbol: "QTM",
            network: "Quantum Network",
            balance: "1000",
            value: 1.25,
            address: "qv000000000000quantumtoken0000000000000"
          }
        ]);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Failed to unlock wallet:", error);
      
      // Check if ban status has changed
      const banStatus = getBanInfo();
      if (banStatus) {
        setBanInfo(banStatus);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Restore wallet from seed phrase
  const restoreWallet = useCallback(async (mnemonic: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setIsRestoring(true);
      
      // Validate mnemonic
      if (!validateMnemonic(mnemonic)) {
        throw new Error("Invalid recovery phrase");
      }
      
      // Restore wallet from mnemonic
      const restoredWallet = restoreWalletFromMnemonic(mnemonic);
      
      // Convert WalletKeys to WalletData before saving
      const walletData = convertWalletKeysToWalletData(restoredWallet);
      
      // Save to storage
      const saved = saveWalletToStorage(walletData, password);
      
      if (saved) {
        setWallet(restoredWallet);
        setHasWallet(true);
        setIsUnlocked(true);
        setSeedPhrase(null); // No need to show seed again
        
        // Set backup status to true since user already knows the seed
        setWalletBackupStatus(true);
        
        // Load tokens (mock implementation)
        setTokens([
          {
            name: "Quantum Token",
            symbol: "QTM",
            network: "Quantum Network",
            balance: "1000",
            value: 1.25,
            address: "qv000000000000quantumtoken0000000000000"
          }
        ]);
      }
      
      return saved;
    } catch (error) {
      console.error("Failed to restore wallet:", error);
      return false;
    } finally {
      setIsLoading(false);
      setIsRestoring(false);
    }
  }, []);
  
  // Lock wallet
  const lockWallet = useCallback(() => {
    setWallet(null);
    setIsUnlocked(false);
    setSeedPhrase(null);
    setSeedPhraseShown(false);
  }, []);
  
  // Delete wallet
  const deleteWallet = useCallback((): boolean => {
    try {
      const removed = removeWallet();
      
      if (removed) {
        setWallet(null);
        setIsUnlocked(false);
        setHasWallet(false);
        setSeedPhrase(null);
        setSeedPhraseShown(false);
        setTokens([]);
      }
      
      return removed;
    } catch (error) {
      console.error("Failed to delete wallet:", error);
      return false;
    }
  }, []);
  
  // Confirm seed phrase was saved
  const confirmSeedPhraseSaved = useCallback(() => {
    if (!wallet) return;
    setWalletBackupStatus(true);
    setSeedPhrase(null);
  }, [wallet]);
  
  // Check seed phrase word (for verification)
  const checkSeedPhraseWord = useCallback((index: number, word: string): boolean => {
    if (!seedPhrase) return false;
    const words = seedPhrase.split(" ");
    if (index < 0 || index >= words.length) return false;
    return words[index] === word;
  }, [seedPhrase]);
  
  // Add token
  const addToken = useCallback((token: Omit<Token, 'balance' | 'value'>) => {
    setTokens(prev => [
      ...prev,
      {
        ...token,
        balance: "0",
        value: 0
      }
    ]);
  }, []);
  
  // Show seed phrase (with security check)
  const showSeedPhrase = useCallback(() => {
    if (wallet) {
      setSeedPhrase(wallet.mnemonic);
      setSeedPhraseShown(true);
    }
  }, [wallet]);
  
  // Hide seed phrase
  const hideSeedPhrase = useCallback(() => {
    setSeedPhraseShown(false);
    setSeedPhrase(null);
  }, []);
  
  // Set custom lockout time
  const setLockoutTime = useCallback((seconds: number): boolean => {
    try {
      // Set lockout time in storage
      setCustomLockoutTime(seconds);
      return true;
    } catch (error) {
      console.error("Failed to set lockout time:", error);
      return false;
    }
  }, []);
  
  // Send token to another address
  const sendToken = useCallback((to: string, amount: string, tokenSymbol: string): boolean => {
    try {
      // Find the token
      const tokenIndex = tokens.findIndex(t => t.symbol === tokenSymbol);
      if (tokenIndex === -1) return false;
      
      const token = tokens[tokenIndex];
      const tokenBalance = parseFloat(token.balance);
      const sendAmount = parseFloat(amount);
      
      // Check if user has enough balance
      if (isNaN(sendAmount) || sendAmount <= 0 || tokenBalance < sendAmount) {
        return false;
      }
      
      // Update token balance
      const updatedTokens = [...tokens];
      updatedTokens[tokenIndex] = {
        ...token,
        balance: (tokenBalance - sendAmount).toString()
      };
      
      setTokens(updatedTokens);
      return true;
    } catch (error) {
      console.error("Failed to send token:", error);
      return false;
    }
  }, [tokens]);
  
  // Get receive address
  const receiveToken = useCallback((): string => {
    return wallet ? wallet.address : '';
  }, [wallet]);
  
  // Swap tokens
  const swapTokens = useCallback((fromToken: string, toToken: string, amount: string): boolean => {
    try {
      // Find the tokens
      const fromTokenIndex = tokens.findIndex(t => t.symbol === fromToken);
      const toTokenIndex = tokens.findIndex(t => t.symbol === toToken);
      
      if (fromTokenIndex === -1 || toTokenIndex === -1) return false;
      
      const fromTokenObj = tokens[fromTokenIndex];
      const toTokenObj = tokens[toTokenIndex];
      
      const swapAmount = parseFloat(amount);
      const fromTokenBalance = parseFloat(fromTokenObj.balance);
      
      // Check if user has enough balance
      if (isNaN(swapAmount) || swapAmount <= 0 || fromTokenBalance < swapAmount) {
        return false;
      }
      
      // Calculate exchange rate (simplified for demo)
      const exchangeRate = fromTokenObj.value / toTokenObj.value;
      const receivedAmount = swapAmount * exchangeRate;
      
      // Update token balances
      const updatedTokens = [...tokens];
      updatedTokens[fromTokenIndex] = {
        ...fromTokenObj,
        balance: (fromTokenBalance - swapAmount).toString()
      };
      
      updatedTokens[toTokenIndex] = {
        ...toTokenObj,
        balance: (parseFloat(toTokenObj.balance) + receivedAmount).toString()
      };
      
      setTokens(updatedTokens);
      return true;
    } catch (error) {
      console.error("Failed to swap tokens:", error);
      return false;
    }
  }, [tokens]);
  
  // Buy token
  const buyToken = useCallback((tokenSymbol: string, amount: string): boolean => {
    try {
      // Find the token
      const tokenIndex = tokens.findIndex(t => t.symbol === tokenSymbol);
      if (tokenIndex === -1) return false;
      
      const token = tokens[tokenIndex];
      const buyAmount = parseFloat(amount);
      
      // Check if amount is valid
      if (isNaN(buyAmount) || buyAmount <= 0) {
        return false;
      }
      
      // Update token balance (simplified for demo)
      const updatedTokens = [...tokens];
      updatedTokens[tokenIndex] = {
        ...token,
        balance: (parseFloat(token.balance) + buyAmount).toString()
      };
      
      setTokens(updatedTokens);
      
      // Add to trade history
      const newTrade: Trade = {
        tokenSymbol,
        type: 'buy',
        amount: buyAmount.toString(),
        price: token.value,
        total: buyAmount * token.value,
        timestamp: Date.now()
      };
      
      setTradeHistory(prev => [newTrade, ...prev]);
      return true;
    } catch (error) {
      console.error("Failed to buy token:", error);
      return false;
    }
  }, [tokens]);
  
  // Trade token
  const tradeToken = useCallback((tokenSymbol: string, type: 'buy' | 'sell', amount: string, price: number): boolean => {
    try {
      // Find the token
      const tokenIndex = tokens.findIndex(t => t.symbol === tokenSymbol);
      if (tokenIndex === -1) return false;
      
      const token = tokens[tokenIndex];
      const tradeAmount = parseFloat(amount);
      
      // Check if amount is valid
      if (isNaN(tradeAmount) || tradeAmount <= 0) {
        return false;
      }
      
      // Check if user has enough balance for selling
      if (type === 'sell' && parseFloat(token.balance) < tradeAmount) {
        return false;
      }
      
      // Update token balance
      const updatedTokens = [...tokens];
      updatedTokens[tokenIndex] = {
        ...token,
        balance: (parseFloat(token.balance) + (type === 'buy' ? tradeAmount : -tradeAmount)).toString()
      };
      
      setTokens(updatedTokens);
      
      // Add to trade history
      const newTrade: Trade = {
        tokenSymbol,
        type,
        amount: tradeAmount.toString(),
        price,
        total: tradeAmount * price,
        timestamp: Date.now()
      };
      
      setTradeHistory(prev => [newTrade, ...prev]);
      return true;
    } catch (error) {
      console.error("Failed to trade token:", error);
      return false;
    }
  }, [tokens]);
  
  // Cash out
  const cashOut = useCallback((amount: string): boolean => {
    try {
      // Find NETZ token
      const netzIndex = tokens.findIndex(t => t.symbol === "NETZ");
      if (netzIndex === -1) return false;
      
      const netzToken = tokens[netzIndex];
      const netzBalance = parseFloat(netzToken.balance);
      const cashOutAmount = parseFloat(amount);
      
      // Check if user has enough balance
      if (isNaN(cashOutAmount) || cashOutAmount <= 0 || netzBalance < cashOutAmount) {
        return false;
      }
      
      // Update NETZ balance
      const updatedTokens = [...tokens];
      updatedTokens[netzIndex] = {
        ...netzToken,
        balance: (netzBalance - cashOutAmount).toString()
      };
      
      setTokens(updatedTokens);
      return true;
    } catch (error) {
      console.error("Failed to cash out:", error);
      return false;
    }
  }, [tokens]);
  
  // Check if user can cash out (has at least 100 NETZ)
  const canCashOut = useCallback((): boolean => {
    const netzToken = tokens.find(t => t.symbol === "NETZ");
    if (!netzToken) return false;
    
    const netzBalance = parseFloat(netzToken.balance);
    return netzBalance >= 100;
  }, [tokens]);
  
  const value = {
    wallet,
    isLoading,
    isUnlocked,
    hasWallet,
    isCreating,
    isRestoring,
    seedPhrase,
    seedPhraseShown,
    tokens,
    banInfo,
    tradeHistory,
    
    createWallet,
    unlockWallet,
    restoreWallet,
    lockWallet,
    deleteWallet,
    confirmSeedPhraseSaved,
    checkSeedPhraseWord,
    addToken,
    showSeedPhrase,
    hideSeedPhrase,
    setLockoutTime,
    
    // New actions
    sendToken,
    receiveToken,
    swapTokens,
    buyToken,
    tradeToken,
    cashOut,
    canCashOut
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
