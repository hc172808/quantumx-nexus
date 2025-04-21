
import { WalletKeys, encryptData, decryptData } from './crypto-utils';

/**
 * Storage keys in localStorage
 */
const STORAGE_KEYS = {
  WALLET_DATA: 'qv_wallet_data',
  WALLET_META: 'qv_wallet_meta',
  LOGIN_ATTEMPTS: 'qv_login_attempts',
  BANNED_UNTIL: 'qv_banned_until',
  CUSTOM_LOCKOUT: 'qv_custom_lockout'
};

/**
 * Max number of failed login attempts before banning
 */
const MAX_ATTEMPTS = 5;

/**
 * Ban duration in milliseconds based on attempt count
 */
const BAN_DURATIONS = {
  3: 15 * 1000, // 15 seconds (reduced from 1 minute for testing)
  4: 30 * 1000, // 30 seconds (reduced from 5 minutes)
  5: 60 * 1000, // 1 minute (reduced from 1 hour)
  default: 120 * 1000 // 2 minutes (reduced from 1 day)
};

/**
 * Check if a wallet exists in localStorage
 */
export function walletExists(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.WALLET_DATA);
}

/**
 * Save wallet to localStorage
 * @param wallet The wallet to save
 * @param password The password to encrypt with
 * @returns true if successful, false otherwise
 */
export function saveWalletToStorage(wallet: WalletKeys, password: string): boolean {
  try {
    // Encrypt wallet data
    const encryptedData = encryptData(JSON.stringify(wallet), password);
    
    // Save wallet data
    localStorage.setItem(STORAGE_KEYS.WALLET_DATA, encryptedData);
    
    // Save metadata (non-sensitive info)
    const meta = {
      created: Date.now(),
      lastAccess: Date.now(),
      address: wallet.address,
      backupConfirmed: false
    };
    
    localStorage.setItem(STORAGE_KEYS.WALLET_META, JSON.stringify(meta));
    return true;
  } catch (error) {
    console.error('Failed to save wallet:', error);
    return false;
  }
}

/**
 * Get wallet from localStorage
 * @param password The password to decrypt with
 * @returns The wallet or null if not found or invalid password
 */
export function getWalletFromStorage(password: string): WalletKeys | null {
  try {
    // Check if user is banned
    if (isUserBanned()) {
      return null;
    }
    
    const encryptedData = localStorage.getItem(STORAGE_KEYS.WALLET_DATA);
    if (!encryptedData) {
      return null;
    }
    
    // Decrypt wallet data
    const walletJson = decryptData(encryptedData, password);
    if (!walletJson) {
      recordLoginAttempt();
      return null;
    }
    
    const wallet = JSON.parse(walletJson) as WalletKeys;
    
    // Update metadata
    const meta = getWalletMeta();
    if (meta) {
      localStorage.setItem(STORAGE_KEYS.WALLET_META, JSON.stringify({
        ...meta,
        lastAccess: Date.now()
      }));
    }
    
    // Clear login attempts on successful login
    localStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    
    return wallet;
  } catch (error) {
    console.error('Failed to get wallet:', error);
    recordLoginAttempt();
    return null;
  }
}

/**
 * Get wallet metadata
 * @returns The wallet metadata or null if not found
 */
export function getWalletMeta(): any | null {
  try {
    const meta = localStorage.getItem(STORAGE_KEYS.WALLET_META);
    if (!meta) {
      return null;
    }
    return JSON.parse(meta);
  } catch (error) {
    console.error('Failed to get wallet metadata:', error);
    return null;
  }
}

/**
 * Set wallet backup status
 * @param confirmed Whether the backup is confirmed
 */
export function setWalletBackupStatus(confirmed: boolean): void {
  try {
    const meta = getWalletMeta();
    if (meta) {
      localStorage.setItem(STORAGE_KEYS.WALLET_META, JSON.stringify({
        ...meta,
        backupConfirmed: confirmed
      }));
    }
  } catch (error) {
    console.error('Failed to set wallet backup status:', error);
  }
}

/**
 * Remove wallet from localStorage
 * @returns true if successful, false otherwise
 */
export function removeWallet(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEYS.WALLET_DATA);
    localStorage.removeItem(STORAGE_KEYS.WALLET_META);
    localStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.BANNED_UNTIL);
    return true;
  } catch (error) {
    console.error('Failed to remove wallet:', error);
    return false;
  }
}

/**
 * Record a failed login attempt
 */
function recordLoginAttempt(): void {
  try {
    // Get current attempts
    const attemptsJson = localStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    const attempts = attemptsJson ? parseInt(attemptsJson, 10) : 0;
    
    // Increment attempts
    const newAttempts = attempts + 1;
    localStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, newAttempts.toString());
    
    // Check if we should ban the user
    if (newAttempts >= MAX_ATTEMPTS) {
      banUser(newAttempts);
    }
  } catch (error) {
    console.error('Failed to record login attempt:', error);
  }
}

/**
 * Ban the user for a period of time
 * @param attempts The number of failed attempts
 */
function banUser(attempts: number): void {
  // Get custom lockout time if available
  const customLockoutSeconds = localStorage.getItem(STORAGE_KEYS.CUSTOM_LOCKOUT);
  let banDuration = 0;
  
  if (customLockoutSeconds && parseInt(customLockoutSeconds, 10) > 0) {
    // Use custom lockout time (in milliseconds)
    banDuration = parseInt(customLockoutSeconds, 10) * 1000;
  } else {
    // Use default ban duration based on number of attempts
    banDuration = BAN_DURATIONS[attempts as keyof typeof BAN_DURATIONS] || BAN_DURATIONS.default;
  }
  
  const bannedUntil = Date.now() + banDuration;
  localStorage.setItem(STORAGE_KEYS.BANNED_UNTIL, bannedUntil.toString());
}

/**
 * Check if the user is banned
 * @returns true if the user is banned, false otherwise
 */
export function isUserBanned(): boolean {
  try {
    const bannedUntil = localStorage.getItem(STORAGE_KEYS.BANNED_UNTIL);
    if (bannedUntil) {
      const now = Date.now();
      if (now < parseInt(bannedUntil, 10)) {
        return true;
      } else {
        // Ban has expired, clear it
        localStorage.removeItem(STORAGE_KEYS.BANNED_UNTIL);
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error('Failed to check if user is banned:', error);
    return false;
  }
}

/**
 * Get ban information
 * @returns Ban information or null if not banned
 */
export function getBanInfo(): { attempts: number; remainingSeconds: number } | null {
  try {
    const bannedUntil = localStorage.getItem(STORAGE_KEYS.BANNED_UNTIL);
    const attemptsJson = localStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    
    if (bannedUntil) {
      const now = Date.now();
      const banEndTime = parseInt(bannedUntil, 10);
      
      if (now < banEndTime) {
        const remainingSeconds = Math.ceil((banEndTime - now) / 1000);
        const attempts = attemptsJson ? parseInt(attemptsJson, 10) : 0;
        
        return {
          attempts,
          remainingSeconds
        };
      } else {
        // Ban has expired, clear it
        localStorage.removeItem(STORAGE_KEYS.BANNED_UNTIL);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get ban info:', error);
    return null;
  }
}

/**
 * Set custom lockout time
 * @param seconds Lockout time in seconds (0 to use default)
 */
export function setCustomLockoutTime(seconds: number): void {
  try {
    if (seconds > 0) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LOCKOUT, seconds.toString());
    } else {
      // Remove custom lockout time to use default
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_LOCKOUT);
    }
  } catch (error) {
    console.error('Failed to set custom lockout time:', error);
  }
}
