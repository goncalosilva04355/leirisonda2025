/**
 * Ultra-safe Firebase configuration with maximum error handling
 * Uses environment variables for security
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";

// Secure configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "leiria-1cfc9",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

let ultraSafeApp: FirebaseApp | null = null;

export function initUltraSafeFirebase(): FirebaseApp | null {
  try {
    // Check if already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      ultraSafeApp = existingApps[0];
      console.log("🛡️ Using existing Firebase app (ultra-safe mode)");
      return ultraSafeApp;
    }

    // Initialize new app
    ultraSafeApp = initializeApp(firebaseConfig);
    console.log("🛡️ Firebase initialized successfully (ultra-safe mode)");
    return ultraSafeApp;
  } catch (error) {
    console.warn(
      "🛡️ Ultra-safe Firebase failed, system will work in local mode:",
      error,
    );
    ultraSafeApp = null;
    return null;
  }
}

export function getUltraSafeApp(): FirebaseApp | null {
  return ultraSafeApp || initUltraSafeFirebase();
}

export function isUltraSafeReady(): boolean {
  return ultraSafeApp !== null;
}

// Initialize on module load
initUltraSafeFirebase();

export { ultraSafeApp as app };
export default ultraSafeApp;
