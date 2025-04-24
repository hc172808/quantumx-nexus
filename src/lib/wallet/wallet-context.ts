
import { createContext, useContext } from 'react';

export interface WalletContextType {
  connectWallet: () => void;
  disconnectWallet: () => void;
  walletAddress: string | null;
  walletBalance: number;
  tokens: TokenInfo[];
  isConnected: boolean;
  sendTokens: (to: string, amount: number, tokenId: string) => Promise<boolean>;
  buyToken: (tokenId: string, amount: number) => Promise<boolean>;
  sellToken: (tokenId: string, amount: number) => Promise<boolean>;
}

export interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  change24h: number;
  logoUrl?: string;
  creator?: string;
  timestamp?: number;
  totalSupply?: number;
  description?: string;
  liquidity?: {
    token: string;
    amount: number;
  };
}

export const WalletContext = createContext<WalletContextType>({
  connectWallet: () => {},
  disconnectWallet: () => {},
  walletAddress: null,
  walletBalance: 0,
  tokens: [],
  isConnected: false,
  sendTokens: async () => false,
  buyToken: async () => false,
  sellToken: async () => false
});

export const useWalletContext = () => useContext(WalletContext);
