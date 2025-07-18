/**
 * Unified safe Firebase configuration
 * Uses environment variables for security
 */

import { initializeApp, getApps } from "firebase/app";

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

let app = null;

export function initUnifiedFirebase() {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log("🔥 Unified Firebase initialized");
    } else {
      app = getApps()[0];
      console.log("🔥 Using existing Firebase app");
    }
    return app;
  } catch (error) {
    console.warn("⚠️ Unified Firebase failed, continuing with local mode");
    return null;
  }
}

export function getUnifiedApp() {
  return app || initUnifiedFirebase();
}

export { app };
export default app;
