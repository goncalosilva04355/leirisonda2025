// Stub Firebase config - Firebase removed, provides empty implementations for compatibility

// Stub exports to satisfy imports
export const app = null;
export const db = null;
export const auth = null;

// Stub functions
export const isFirebaseReady = () => false;
export const getFirebaseStatus = () => ({
  app: false,
  auth: false,
  db: false,
  ready: false,
  quotaExceeded: false,
});

export const waitForFirebaseInit = async () => false;
export const reinitializeFirebase = async () => false;
export const saveFirebaseConfig = () => false;
export const getDB = async () => null;
export const getAuthService = async () => null;
export const markQuotaExceeded = () => {};
export const clearQuotaExceeded = () => {};

// Default export
export default app;
