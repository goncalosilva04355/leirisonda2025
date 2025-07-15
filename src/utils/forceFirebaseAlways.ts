/**
 * Force Firebase/Firestore to always be active
 * Overrides any dev/prod environment conditions
 */

import { SystemConfig } from "../config/systemConfig";

// Force environment variables to be true
if (SystemConfig.FORCE_FIREBASE_ALWAYS) {
  console.log("🔥 FORCING Firebase ALWAYS ACTIVE");

  // Override environment detection
  (window as any).__FIREBASE_FORCE_ALWAYS__ = true;

  // Override environment variables
  Object.defineProperty(import.meta.env, "VITE_FORCE_FIREBASE", {
    value: "true",
    writable: false,
    configurable: false,
  });

  Object.defineProperty(import.meta.env, "NETLIFY", {
    value: "true",
    writable: false,
    configurable: false,
  });

  Object.defineProperty(import.meta.env, "VITE_IS_NETLIFY", {
    value: "true",
    writable: false,
    configurable: false,
  });

  console.log("✅ Firebase environment variables forced to active");
  console.log("🔥 Firebase will be active in development AND production");
}

export function isFirebaseForced(): boolean {
  return SystemConfig.FORCE_FIREBASE_ALWAYS;
}

export function shouldAlwaysUseFirebase(): boolean {
  return (
    SystemConfig.FORCE_FIREBASE_ALWAYS ||
    (window as any).__FIREBASE_FORCE_ALWAYS__
  );
}
