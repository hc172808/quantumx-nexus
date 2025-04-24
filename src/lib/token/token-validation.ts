
import { getTokenFeaturePricing } from "@/lib/wallet/wallet-storage";

// Store for existing token names and symbols
export interface TokenRegistry {
  names: Set<string>;
  symbols: Set<string>;
}

// Initialize with some example tokens
const tokenRegistry: TokenRegistry = {
  names: new Set(["Bitcoin", "Ethereum", "Quantum", "NetZ"]),
  symbols: new Set(["BTC", "ETH", "QTM", "NETZ"])
};

export const isTokenNameUnique = (name: string): boolean => {
  return !tokenRegistry.names.has(name);
};

export const isTokenSymbolUnique = (symbol: string): boolean => {
  return !tokenRegistry.symbols.has(symbol);
};

export const registerToken = (name: string, symbol: string): void => {
  tokenRegistry.names.add(name);
  tokenRegistry.symbols.add(symbol);
};

export const validateTokenLiquidity = (
  liquidityToken: string, 
  liquidityAmount: number
): { isValid: boolean; message?: string } => {
  if (!liquidityToken) {
    return { isValid: false, message: "Liquidity token must be selected" };
  }
  
  if (liquidityAmount <= 0) {
    return { isValid: false, message: "Liquidity amount must be greater than 0" };
  }
  
  return { isValid: true };
};

// Common mapping of feature names to prices
export const getFeaturePrices = () => {
  try {
    const prices = getTokenFeaturePricing();
    return prices || {
      mintable: "50",
      mutableInfo: "75",
      renounceOwnership: "25",
      quantumProtection: "200",
      burnable: "30",
      pausable: "60",
      upgradeable: "150",
      snapshot: "80",
      voting: "120"
    };
  } catch (error) {
    console.error("Error loading token pricing:", error);
    return {
      mintable: "50",
      mutableInfo: "75",
      renounceOwnership: "25",
      quantumProtection: "200",
      burnable: "30",
      pausable: "60",
      upgradeable: "150",
      snapshot: "80",
      voting: "120"
    };
  }
};
