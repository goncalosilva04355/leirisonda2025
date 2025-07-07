import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config - using only default configuration
const firebaseConfig = {
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
