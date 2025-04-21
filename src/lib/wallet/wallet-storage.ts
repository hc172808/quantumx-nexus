import { WalletKeys, encryptData, decryptData } from './crypto-utils';

/**
 * Storage keys for the wallet data
 */
const STORAGE_KEYS = {
  ENCRYPTED_WALLET: 'quantum-vault-wallet-data',
  WALLET_META: 'quantum-vault-wallet-meta',
  FAIL_ATTEMPTS: 'quantum-vault-fail-attempts',
  LAST_FAIL: 'quantum-vault-last-fail'
};

/**
 * Meta information about the wallet (non-sensitive data)
 */
export interface WalletMeta {
  address: string;
  createdAt: number;
  lastAccess: number;
  hasBackup: boolean;
}

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
 * Saves a wallet to encrypted local storage
 * @param wallet The wallet to save
 * @param password User's password for encryption
 * @returns Whether the save was successful
 */
export function saveWalletToStorage(wallet: WalletKeys, password: string): boolean {
  try {
    if (!wallet || !password) {
      throw new Error('Missing wallet or password');
    }
    
    // Only store sensitive data encrypted
    const sensitiveData = JSON.stringify({
      mnemonic: wallet.mnemonic,
      seed: wallet.seed,
      keyPair: wallet.keyPair,
    });
    
    // Encrypt the sensitive data
    const encryptedData = encryptData(sensitiveData, password);
    
    // Store encrypted data
    localStorage.setItem(STORAGE_KEYS.ENCRYPTED_WALLET, encryptedData);
    
    // Store non-sensitive metadata separately
    const meta: WalletMeta = {
      address: wallet.address,
      createdAt: Date.now(),
      lastAccess: Date.now(),
      hasBackup: false
    };
    
    localStorage.setItem(STORAGE_KEYS.WALLET_META, JSON.stringify(meta));
    
    return true;
  } catch (error) {
    console.error('Failed to save wallet:', error);
    return false;
  }
}

/**
 * Retrieves a wallet from encrypted local storage
 * @param password User's password for decryption
 * @returns The wallet if successful, null if not
 */
export function getWalletFromStorage(password: string): WalletKeys | null {
  try {
    // Check for ban before attempting
    if (isUserBanned()) {
      throw new Error('Too many failed attempts. Please try again later.');
    }
    
    const encryptedData = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_WALLET);
    const metaString = localStorage.getItem(STORAGE_KEYS.WALLET_META);
    
    if (!encryptedData || !metaString) {
      return null;
    }
    
    try {
      // Decrypt the sensitive data
      const decryptedData = decryptData(encryptedData, password);
      const sensitiveData = JSON.parse(decryptedData);
      
      // Parse the meta data
      const meta: WalletMeta = JSON.parse(metaString);
      
      // Update last access time
      meta.lastAccess = Date.now();
      localStorage.setItem(STORAGE_KEYS.WALLET_META, JSON.stringify(meta));
      
      // Reset failed attempts
      resetFailedAttempts();
      
      // Reconstruct the full wallet object
      return {
        mnemonic: sensitiveData.mnemonic,
        seed: sensitiveData.seed,
        keyPair: sensitiveData.keyPair,
        address: meta.address,
        path: sensitiveData.path || "m/84'/0'/0'/0/0" // Default path if not stored
      };
    } catch (error) {
      // Decryption failed - wrong password
      recordFailedAttempt();
      throw new Error('Invalid password');
    }
  } catch (error) {
    console.error('Failed to get wallet:', error);
    return null;
  }
}

/**
 * Checks if a wallet exists in local storage
 * @returns True if wallet exists, false if not
 */
export function walletExists(): boolean {
  const encryptedData = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_WALLET);
  return !!encryptedData;
}

/**
 * Gets wallet metadata (non-sensitive info only)
 * @returns Wallet metadata or null if no wallet
 */
export function getWalletMeta(): WalletMeta | null {
  try {
    const metaString = localStorage.getItem(STORAGE_KEYS.WALLET_META);
    if (!metaString) return null;
    return JSON.parse(metaString);
  } catch {
    return null;
  }
}

/**
 * Updates wallet metadata
 * @param updates Partial metadata updates
 * @returns Success status
 */
export function updateWalletMeta(updates: Partial<WalletMeta>): boolean {
  try {
    const meta = getWalletMeta();
    if (!meta) return false;
    
    const updatedMeta = { ...meta, ...updates };
    localStorage.setItem(STORAGE_KEYS.WALLET_META, JSON.stringify(updatedMeta));
    return true;
  } catch {
    return false;
  }
}

/**
 * Records a failed login/access attempt
 */
export function recordFailedAttempt(): void {
  const currentAttempts = localStorage.getItem(STORAGE_KEYS.FAIL_ATTEMPTS);
  const attempts = currentAttempts ? parseInt(currentAttempts, 10) + 1 : 1;
  
  localStorage.setItem(STORAGE_KEYS.FAIL_ATTEMPTS, attempts.toString());
  localStorage.setItem(STORAGE_KEYS.LAST_FAIL, Date.now().toString());
  
  console.warn(`Failed attempt recorded. Attempt ${attempts}`);
}

/**
 * Resets failed login/access attempts
 */
export function resetFailedAttempts(): void {
  localStorage.removeItem(STORAGE_KEYS.FAIL_ATTEMPTS);
  localStorage.removeItem(STORAGE_KEYS.LAST_FAIL);
}

/**
 * Checks if the user is banned due to too many failed attempts
 * @returns True if banned, false if not
 */
export function isUserBanned(): boolean {
  try {
    const attemptString = localStorage.getItem(STORAGE_KEYS.FAIL_ATTEMPTS);
    const lastFailString = localStorage.getItem(STORAGE_KEYS.LAST_FAIL);
    
    if (!attemptString || !lastFailString) return false;
    
    const attempts = parseInt(attemptString, 10);
    const lastFail = parseInt(lastFailString, 10);
    const now = Date.now();
    
    // If fewer than 3 attempts, not banned
    if (attempts < 3) return false;
    
    // Determine ban duration based on attempts
    let banDuration;
    if (attempts in BAN_DURATIONS) {
      banDuration = BAN_DURATIONS[attempts as keyof typeof BAN_DURATIONS];
    } else if (attempts > 5) {
      banDuration = BAN_DURATIONS.default;
    } else {
      return false; // Shouldn't get here, but just in case
    }
    
    // Check if ban has expired
    const banExpires = lastFail + banDuration;
    if (now < banExpires) {
      // Still banned
      const remainingSeconds = Math.ceil((banExpires - now) / 1000);
      console.warn(`User is banned for ${remainingSeconds} more seconds`);
      return true;
    }
    
    // Ban has expired
    return false;
  } catch {
    return false;
  }
}

/**
 * Gets information about the current ban status
 * @returns Ban info object or null if not banned
 */
export function getBanInfo(): { attempts: number, remainingSeconds: number } | null {
  try {
    const attemptString = localStorage.getItem(STORAGE_KEYS.FAIL_ATTEMPTS);
    const lastFailString = localStorage.getItem(STORAGE_KEYS.LAST_FAIL);
    
    if (!attemptString || !lastFailString) return null;
    
    const attempts = parseInt(attemptString, 10);
    const lastFail = parseInt(lastFailString, 10);
    const now = Date.now();
    
    // If fewer than 3 attempts, not banned
    if (attempts < 3) return null;
    
    // Determine ban duration based on attempts
    let banDuration;
    if (attempts in BAN_DURATIONS) {
      banDuration = BAN_DURATIONS[attempts as keyof typeof BAN_DURATIONS];
    } else if (attempts > 5) {
      banDuration = BAN_DURATIONS.default;
    } else {
      return null; // Shouldn't get here, but just in case
    }
    
    // Check if ban has expired
    const banExpires = lastFail + banDuration;
    if (now < banExpires) {
      // Still banned
      const remainingSeconds = Math.ceil((banExpires - now) / 1000);
      return { attempts, remainingSeconds };
    }
    
    // Ban has expired
    return null;
  } catch {
    return null;
  }
}

/**
 * Removes wallet from storage
 * @returns Success status
 */
export function removeWallet(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_WALLET);
    localStorage.removeItem(STORAGE_KEYS.WALLET_META);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sets the backup status for the wallet
 * @param hasBackup Whether the user has backed up the wallet
 * @returns Success status
 */
export function setWalletBackupStatus(hasBackup: boolean): boolean {
  return updateWalletMeta({ hasBackup });
}
