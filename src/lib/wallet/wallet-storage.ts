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
