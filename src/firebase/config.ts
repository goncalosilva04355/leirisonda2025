import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Default Firebase config
const defaultFirebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  databaseURL:
    "https://leirisonda-16f8b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

// Function to get Firebase config from localStorage or use default
const getFirebaseConfig = () => {
  try {
    const storedConfig = localStorage.getItem("firebase-config");
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      console.log("🔧 Firebase: Using configuration from localStorage");
      return parsedConfig;
    }
  } catch (error) {
    console.warn(
      "🔧 Firebase: Error loading config from localStorage, using default:",
      error,
    );
  }

  // Store default config to localStorage for future use
  localStorage.setItem(
    "firebase-config",
    JSON.stringify(defaultFirebaseConfig),
  );
  console.log("🔧 Firebase: Stored default configuration to localStorage");
  return defaultFirebaseConfig;
};

// Function to save Firebase config to localStorage
export const saveFirebaseConfig = (config: any) => {
  try {
    localStorage.setItem("firebase-config", JSON.stringify(config));
    console.log("🔧 Firebase: Configuration saved to localStorage");
    return true;
  } catch (error) {
    console.error("�� Firebase: Error saving config to localStorage:", error);
    return false;
  }
};

// Get current Firebase config (from localStorage or default)
const firebaseConfig = getFirebaseConfig();

// Function to get or create Firebase app
const getFirebaseApp = () => {
  try {
    // Check if app already exists
    const existingApps = getApps();
    if (existingApps.length > 0) {
      console.log("Using existing Firebase app");
      return existingApps[0];
    }

    // Initialize new app only if none exists
    const app = initializeApp(firebaseConfig);
    console.log("Fresh Firebase app initialized");
    return app;
  } catch (error) {
    console.error("Firebase app initialization failed:", error);
    // Try to get existing app if initialization fails
    const existingApps = getApps();
    if (existingApps.length > 0) {
      console.log("Using existing Firebase app after error");
      return existingApps[0];
    }
    return null;
  }
};

// Initialize Firebase services with error handling and quota control
console.log("🔥 Firebase initialization enabled - controlled sync mode");
let app: any = null;
let db: any = null;
let auth: any = null;

// Check if quota was previously exceeded
const isQuotaExceeded = () => {
  const quotaFlag = localStorage.getItem("firebase-quota-exceeded");
  if (quotaFlag) {
    const quotaTime = parseInt(quotaFlag);
    const cooldownPeriod = 30 * 60 * 1000; // 30 minutes cooldown
    return Date.now() - quotaTime < cooldownPeriod;
  }
  return false;
};

// Initialize Firebase services with quota protection
try {
  if (isQuotaExceeded()) {
    console.log(
      "⏸️ Firebase temporarily disabled due to quota exceeded - will retry automatically",
    );
    app = null;
    db = null;
    auth = null;
  } else {
    app = getFirebaseApp();
    if (app) {
      try {
        db = getFirestore(app);
        console.log("✅ Firestore initialized successfully");
      } catch (error) {
        console.warn("⚠️ Firestore initialization failed:", error);
        db = null;
      }

      try {
        auth = getAuth(app);
        // Firebase Auth persistence is automatic by default (indexedDB/localStorage handled internally)
        if (auth) {
          console.log(
            "🔐 Firebase Auth automatic persistence enabled for cross-device login",
          );
        }
        console.log("✅ Firebase Auth initialized successfully");
      } catch (error) {
        console.warn("⚠️ Firebase Auth initialization failed:", error);
        auth = null;
      }

      console.log("✅ Firebase services initialized successfully");
    } else {
      console.warn(
        "⚠️ Firebase app not available, services will use fallback mode",
      );
    }
  }
} catch (error) {
  console.warn(
    "⚠️ Firebase services initialization failed, using fallback mode:",
    error,
  );
  app = null;
  db = null;
  auth = null;
}

// Function to check if Firebase is properly initialized and ready
export const isFirebaseReady = () => {
  try {
    return !!(app && auth && db);
  } catch (error) {
    console.warn("Firebase health check failed:", error);
    return false;
  }
};

// Function to get Firebase connection status
export const getFirebaseStatus = () => {
  return {
    app: !!app,
    auth: !!auth,
    db: !!db,
    ready: isFirebaseReady(),
    quotaExceeded: isQuotaExceeded(),
  };
};

// Function to mark quota exceeded
export const markQuotaExceeded = () => {
  localStorage.setItem("firebase-quota-exceeded", Date.now().toString());
  console.warn("🚨 Firebase quota exceeded - marking for cooldown period");
};

// Function to clear quota exceeded flag
export const clearQuotaExceeded = () => {
  localStorage.removeItem("firebase-quota-exceeded");
  console.log("✅ Firebase quota flag cleared - services can be reinitialized");
};

// Function to attempt Firebase reinitialization
export const reinitializeFirebase = async (): Promise<boolean> => {
  try {
    if (isQuotaExceeded()) {
      console.log("⏳ Firebase still in cooldown period");
      return false;
    }

    // Clear previous quota flag
    clearQuotaExceeded();

    // Attempt to reinitialize
    const newApp = getFirebaseApp();
    if (newApp) {
      const { getFirestore, getAuth } = await import("firebase/firestore");

      try {
        db = getFirestore(newApp);
        auth = getAuth(newApp);
        app = newApp;

        console.log("✅ Firebase successfully reinitialized");
        return true;
      } catch (error) {
        console.warn("⚠️ Firebase reinitialization failed:", error);
        return false;
      }
    }

    return false;
  } catch (error) {
    console.warn("⚠️ Firebase reinitialization error:", error);
    return false;
  }
};

export { app, db, auth };
export default app;
