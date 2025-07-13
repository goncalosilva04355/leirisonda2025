/**
 * Firebase config without getImmediate() calls for better stability
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

// Safe Firebase initialization
let firebaseApp = null;

try {
  const existingApps = getApps();
  if (existingApps.length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized successfully (no getImmediate mode)");
  } else {
    firebaseApp = existingApps[0];
    console.log("✅ Using existing Firebase app");
  }
} catch (error) {
  console.warn("⚠️ Firebase initialization failed, using local mode:", error);
  firebaseApp = null;
}

export { firebaseApp as app };
export default firebaseApp;
