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
    console.log("Firebase app initialized successfully");
    return app;
  } catch (error) {
    console.error("Firebase app initialization failed:", error);
    // Try to get existing app if initialization fails
    const existingApps = getApps();
    if (existingApps.length > 0) {
      console.log("Using existing Firebase app after error");
      return existingApps[0];
    }
    throw error;
  }
};

// Initialize Firebase services
console.log("🔥 Initializing Firebase services...");
let app: any = null;
let db: any = null;
let auth: any = null;

try {
  app = getFirebaseApp();

  if (app) {
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("✅ Firebase services initialized successfully");
  } else {
    throw new Error("Failed to initialize Firebase app");
  }
} catch (error) {
  console.error("❌ Firebase services initialization failed:", error);
  throw error;
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
  };
};

export { app, db, auth };
export default app;
