// Firebase Config - Safe version without Firestore
// This file replaces the original config.ts to prevent Firestore initialization errors

import {
  getFirebaseApp,
  getAuthSafe,
  isFirebaseReady,
} from "./configWithoutFirestore";

// Export safe functions to maintain compatibility
export const getDB = async () => {
  console.log("🚫 getDB called - Firestore disabled to prevent errors");
  return null;
};

export const getAuthService = async () => {
  console.log("📱 getAuthService called - using safe auth");
  return await getAuthSafe();
};

export const waitForFirebaseInit = async () => {
  console.log("📱 waitForFirebaseInit called - using safe initialization");
  return isFirebaseReady();
};

export const reinitializeFirebase = async () => {
  console.log(
    "🔄 reinitializeFirebase called - Firebase already configured safely",
  );
  return true;
};

export const getFirebaseStatus = () => {
  console.log("📊 getFirebaseStatus called - returning safe status");
  return {
    ready: isFirebaseReady(),
    app: !!getFirebaseApp(),
    auth: true,
    db: false, // Firestore disabled
    storage: true,
  };
};

// Compatibility exports
export const app = getFirebaseApp();
export const auth = null; // Use getAuthSafe() instead
export const db = null; // Firestore disabled

// Export the same function from configWithoutFirestore
export { isFirebaseReady };

console.log("✅ Firebase config loaded safely (Firestore disabled)");
