/**
 * Simplified Firebase Configuration
 * Fixes getImmediate errors by providing a single, clean initialization path
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

// Global instances
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Initialization state
let isInitializing = false;
let initializationPromise: Promise<boolean> | null = null;

/**
 * Initialize Firebase safely
 */
async function initializeFirebase(): Promise<boolean> {
  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }

  if (app && db && auth) {
    return true;
  }

  isInitializing = true;

  initializationPromise = (async () => {
    try {
      console.log("🔥 Initializing Firebase...");
      console.log("📋 Project ID:", firebaseConfig.projectId);
      console.log("📋 Auth Domain:", firebaseConfig.authDomain);

      // Check if an app already exists
      const existingApps = getApps();
      if (existingApps.length > 0) {
        app = existingApps[0];
        console.log("✅ Using existing Firebase app:", app.name);
        console.log("📋 App options:", app.options);
      } else {
        console.log("🚀 Creating new Firebase app...");
        app = initializeApp(firebaseConfig);
        console.log("✅ Created new Firebase app:", app.name);
        console.log("📋 App options:", app.options);
      }

      // Wait a moment for the app to be fully ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Initialize Auth
      try {
        console.log("🔐 Initializing Firebase Auth...");
        auth = getAuth(app);
        console.log("✅ Firebase Auth initialized successfully");
        console.log("📋 Auth instance:", !!auth);
      } catch (error) {
        console.error("❌ Firebase Auth failed:", error);
        console.error("📋 Error details:", error);
        auth = null;
      }

      // Initialize Firestore
      try {
        console.log("🔄 Initializing Firestore...");
        db = getFirestore(app);
        console.log("✅ Firestore initialized successfully");
        console.log("📋 Firestore instance:", !!db);
      } catch (error) {
        console.error("❌ Firestore failed:", error);
        console.error("📋 Error details:", error);
        db = null;
      }

      const success = !!(app && (auth || db));
      isInitializing = false;

      if (success) {
        console.log("🎉 Firebase initialized successfully");

        // Notify components that Firebase is ready
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("firebaseSimpleReady", {
              detail: { app, auth, db },
            }),
          );
        }
      }

      return success;
    } catch (error) {
      console.error("❌ Firebase initialization failed:", error);
      isInitializing = false;
      return false;
    }
  })();

  return initializationPromise;
}

/**
 * Get Firebase app instance
 */
export async function getFirebaseApp(): Promise<FirebaseApp | null> {
  if (!app) {
    await initializeFirebase();
  }
  return app;
}

/**
 * Get Firestore instance
 */
export async function getFirebaseDB(): Promise<Firestore | null> {
  if (!db) {
    await initializeFirebase();
  }
  return db;
}

/**
 * Get Auth instance
 */
export async function getFirebaseAuth(): Promise<Auth | null> {
  if (!auth) {
    await initializeFirebase();
  }
  return auth;
}

/**
 * Check if Firebase is ready
 */
export function isFirebaseInitialized(): boolean {
  return !!(app && (auth || db));
}

/**
 * Get Firebase status
 */
export function getFirebaseStatus() {
  return {
    app: !!app,
    auth: !!auth,
    db: !!db,
    ready: isFirebaseInitialized(),
    initializing: isInitializing,
  };
}

// Initialize Firebase when module is imported (in browser environment)
if (typeof window !== "undefined") {
  initializeFirebase().then((success) => {
    if (success) {
      console.log("🔥 Firebase ready");
    } else {
      console.log("📱 Running in local mode");
    }
  });
}
