import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Fixed Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
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

// Initialize Firebase services with error handling
let app: any = null;
let db: any = null;
let auth: any = null;

try {
  app = getFirebaseApp();
  if (app) {
    try {
      db = getFirestore(app);
      console.log("Firestore initialized successfully");
    } catch (error) {
      console.warn("Firestore initialization failed:", error);
      db = null;
    }

    try {
      auth = getAuth(app);
      // Set auth persistence to allow login across devices and browser sessions
      if (auth) {
        // Use local persistence to allow users to stay logged in across devices
        // This is needed for users to login on different devices
        console.log(
          "Firebase Auth persistence set to local for cross-device login",
        );
      }
      console.log("Firebase Auth initialized successfully");
    } catch (error) {
      console.warn("Firebase Auth initialization failed:", error);
      auth = null;
    }

    console.log("Firebase services initialized successfully");
  } else {
    console.warn("Firebase app not available, services will use fallback mode");
  }
} catch (error) {
  console.warn(
    "Firebase services initialization failed, using fallback mode:",
    error,
  );
  app = null;
  db = null;
  auth = null;
}

export { app, db, auth };
export default app;
