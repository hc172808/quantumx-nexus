
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  WalletKeys,
  generateWallet,
  restoreWalletFromMnemonic,
  validateMnemonic
} from '@/lib/wallet/crypto-utils';
import {
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
      
      // Save to storage encrypted with password
      const saved = saveWalletToStorage(newWallet, password);
      
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
      const retrievedWallet = getWalletFromStorage(password);
      
      if (retrievedWallet) {
        setWallet(retrievedWallet);
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
      
      // Save to storage
      const saved = saveWalletToStorage(restoredWallet, password);
      
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
    setLockoutTime
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
