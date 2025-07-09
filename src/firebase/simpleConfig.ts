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

// Mutex to prevent concurrent service access
let serviceAccessMutex = false;

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

      // Test network connectivity first
      try {
        console.log("🌐 Testing network connectivity...");
        const connectivityTest = await fetch(
          "https://www.google.com/favicon.ico",
          {
            method: "HEAD",
            mode: "no-cors",
          },
        );
        console.log("✅ Network connectivity OK");
      } catch (networkError) {
        console.warn("⚠️ Network connectivity issues:", networkError);
      }

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

      // Initialize Firestore with proper timing
      try {
        console.log("🔄 Initializing Firestore...");

        // Add extra delay to ensure app is fully ready
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Verify app is still valid before proceeding
        if (!app || !app.options || !app.name) {
          throw new Error("Firebase app became invalid during initialization");
        }

        // Double-check app is in getApps() list
        const { getApps } = await import("firebase/app");
        const currentApps = getApps();
        const appExists = currentApps.find(
          (existingApp) => existingApp.name === app.name,
        );

        if (!appExists) {
          throw new Error("Firebase app no longer exists in apps list");
        }

        console.log("🔍 App verification passed, initializing Firestore...");
        db = getFirestore(app);
        console.log("✅ Firestore initialized successfully");
        console.log("📋 Firestore instance:", !!db);
      } catch (error) {
        console.error("❌ Firestore failed:", error);
        console.error("📋 Error details:", error);

        // If it's the getImmediate error, try alternative approach
        if (error instanceof Error && error.message.includes("getImmediate")) {
          console.log("🔧 Detected getImmediate error, trying recovery...");

          try {
            // Wait longer and try again
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Try to get a fresh app instance
            const { getApps } = await import("firebase/app");
            const apps = getApps();

            if (apps.length > 0) {
              const freshApp = apps[0];
              console.log("🔄 Trying with fresh app instance...");
              db = getFirestore(freshApp);
              console.log("✅ Firestore initialized with recovery method");
            } else {
              console.log("❌ No Firebase apps available for recovery");
              db = null;
            }
          } catch (recoveryError) {
            console.error("❌ Recovery attempt failed:", recoveryError);
            db = null;
          }
        } else {
          db = null;
        }
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
  // Prevent concurrent access that can cause getImmediate errors
  if (serviceAccessMutex) {
    console.log("🔒 Waiting for service access mutex...");
    await new Promise((resolve) => {
      const checkMutex = () => {
        if (!serviceAccessMutex) {
          resolve(undefined);
        } else {
          setTimeout(checkMutex, 100);
        }
      };
      checkMutex();
    });
  }

  serviceAccessMutex = true;

  try {
    if (!db) {
      await initializeFirebase();
    }
    return db;
  } finally {
    serviceAccessMutex = false;
  }
}

/**
 * Get Auth instance
 */
export async function getFirebaseAuth(): Promise<Auth | null> {
  // Prevent concurrent access that can cause getImmediate errors
  if (serviceAccessMutex) {
    console.log("🔒 Waiting for auth access mutex...");
    await new Promise((resolve) => {
      const checkMutex = () => {
        if (!serviceAccessMutex) {
          resolve(undefined);
        } else {
          setTimeout(checkMutex, 100);
        }
      };
      checkMutex();
    });
  }

  serviceAccessMutex = true;

  try {
    if (!auth) {
      await initializeFirebase();
    }
    return auth;
  } finally {
    serviceAccessMutex = false;
  }
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
  // Use a retry mechanism for initialization
  let initRetries = 0;
  const maxRetries = 3;

  const tryInitialize = async () => {
    initRetries++;
    console.log(
      `🔄 Firebase initialization attempt ${initRetries}/${maxRetries}`,
    );

    const success = await initializeFirebase();

    if (success) {
      console.log("🔥 Firebase ready");
    } else if (initRetries < maxRetries) {
      console.log(`⚠️ Attempt ${initRetries} failed, retrying in 2 seconds...`);
      setTimeout(tryInitialize, 2000);
    } else {
      console.log("📱 Running in local mode after all retries failed");
    }
  };

  // Start initialization with small delay to avoid race conditions
  setTimeout(tryInitialize, 1000);
}
