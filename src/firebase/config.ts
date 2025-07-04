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
    // Delete any existing apps to prevent conflicts
    const existingApps = getApps();
    if (existingApps.length > 0) {
      console.log("Cleaning up existing Firebase apps...");
      for (const app of existingApps) {
        deleteApp(app);
      }
    }

    // Initialize fresh app
    const app = initializeApp(firebaseConfig);
    console.log("Fresh Firebase app initialized");
    return app;
  } catch (error) {
    console.error("Firebase app initialization failed:", error);
    return null;
  }
};

// Initialize Firebase services
let app: any = null;
let db: any = null;
let auth: any = null;

try {
  app = getFirebaseApp();
  if (app) {
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase services initialized successfully");
  }
} catch (error) {
  console.error("Firebase services initialization failed:", error);
  app = null;
  db = null;
  auth = null;
}

export { app, db, auth };
export default app;
