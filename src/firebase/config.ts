// Centralized Firebase Configuration
// Uses environment variables with secure fallbacks

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Environment variable validation
function isValidEnvValue(value: string | undefined): boolean {
  return Boolean(
    value &&
      value.length > 5 &&
      !value.includes("your_") &&
      !value.includes("_here"),
  );
}

// Secure Firebase configuration
const getFirebaseConfig = () => {
  // Primary configuration from environment variables
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  // Fallback configuration (only used when environment variables are not properly set)
  const fallbackConfig = {
    apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
    authDomain: "leiria-1cfc9.firebaseapp.com",
    databaseURL:
      "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "leiria-1cfc9",
    storageBucket: "leiria-1cfc9.firebasestorage.app",
    messagingSenderId: "632599887141",
    appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
    measurementId: "G-Q2QWQVH60L",
  };

  // Use environment variables if they exist and are valid, otherwise use fallback
  const config = {
    apiKey: isValidEnvValue(envConfig.apiKey)
      ? envConfig.apiKey!
      : fallbackConfig.apiKey,
    authDomain: isValidEnvValue(envConfig.authDomain)
      ? envConfig.authDomain!
      : fallbackConfig.authDomain,
    databaseURL: envConfig.databaseURL || fallbackConfig.databaseURL,
    projectId: isValidEnvValue(envConfig.projectId)
      ? envConfig.projectId!
      : fallbackConfig.projectId,
    storageBucket: isValidEnvValue(envConfig.storageBucket)
      ? envConfig.storageBucket!
      : fallbackConfig.storageBucket,
    messagingSenderId: isValidEnvValue(envConfig.messagingSenderId)
      ? envConfig.messagingSenderId!
      : fallbackConfig.messagingSenderId,
    appId: isValidEnvValue(envConfig.appId)
      ? envConfig.appId!
      : fallbackConfig.appId,
    measurementId: envConfig.measurementId || fallbackConfig.measurementId,
  };

  // Log configuration source for debugging
  const usingEnvVars = isValidEnvValue(envConfig.apiKey);
  console.log(
    `🔥 Firebase Config: ${usingEnvVars ? "Environment Variables" : "Fallback"}`,
  );
  console.log(`📱 Project: ${config.projectId}`);

  return config;
};

// Initialize Firebase App
let firebaseApp: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let auth: Auth | null = null;

function initializeFirebase(): FirebaseApp {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    const config = getFirebaseConfig();

    if (getApps().length === 0) {
      firebaseApp = initializeApp(config);
      console.log("✅ Firebase initialized successfully");
    } else {
      firebaseApp = getApp();
      console.log("✅ Firebase app already exists");
    }

    return firebaseApp;
  } catch (error: any) {
    console.error("❌ Firebase initialization failed:", error.message);
    throw error;
  }
}

// Get Firebase App instance
export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp = initializeFirebase();
  }
  return firebaseApp;
}

// Get Firestore instance
export function getFirestoreInstance(): Firestore {
  if (!firestore) {
    try {
      const app = getFirebaseApp();
      firestore = getFirestore(app);
      console.log("✅ Firestore initialized");
    } catch (error: any) {
      console.error("❌ Firestore initialization failed:", error.message);
      throw error;
    }
  }
  return firestore;
}

// Get Auth instance
export function getAuthInstance(): Auth {
  if (!auth) {
    const app = getFirebaseApp();
    auth = getAuth(app);
    console.log("✅ Auth initialized");
  }
  return auth;
}

// Check if Firebase is ready
export function isFirebaseReady(): boolean {
  try {
    const app = getFirebaseApp();
    return app !== null && app !== undefined;
  } catch {
    return false;
  }
}

// Check Firebase status
export function getFirebaseStatus() {
  return {
    isReady: isFirebaseReady(),
    app: firebaseApp,
    projectId: firebaseApp?.options?.projectId,
  };
}

// Wait for Firebase initialization (compatibility)
export async function waitForFirebaseInit(): Promise<boolean> {
  try {
    const app = getFirebaseApp();
    return app !== null;
  } catch {
    return false;
  }
}

// Quota management
let quotaExceeded = false;
let quotaExceededTime = 0;

export function markQuotaExceeded(): void {
  quotaExceeded = true;
  quotaExceededTime = Date.now();
  console.warn("⚠️ Firebase quota exceeded, cooling down...");
}

export function isQuotaExceeded(): boolean {
  // Reset after 1 hour
  if (quotaExceeded && Date.now() - quotaExceededTime > 3600000) {
    quotaExceeded = false;
    quotaExceededTime = 0;
  }
  return quotaExceeded;
}

// Reinitialize Firebase
export async function reinitializeFirebase(): Promise<boolean> {
  try {
    console.log("🔄 Reinitializing Firebase...");
    firebaseApp = null;
    firestore = null;
    auth = null;

    // Get new instances
    const app = getFirebaseApp();
    const db = getFirestoreInstance();
    const authInstance = getAuthInstance();

    const success = app !== null && db !== null && authInstance !== null;
    console.log(
      success
        ? "✅ Firebase reinitialized successfully"
        : "❌ Firebase reinitialization failed",
    );
    return success;
  } catch (error: any) {
    console.error("❌ Error reinitializing Firebase:", error.message);
    return false;
  }
}

// Async helpers for backward compatibility
export async function getCorrectFirestore(): Promise<Firestore> {
  return getFirestoreInstance();
}

export async function getAuthService(): Auth {
  return getAuthInstance();
}

// Legacy getDB function for compatibility
export async function getDB(): Promise<Firestore | null> {
  try {
    return getFirestoreInstance();
  } catch (error: any) {
    console.error("❌ getDB failed:", error.message);
    return null;
  }
}

// Legacy exports for compatibility - lazy getters to avoid getImmediate errors
export const app = {
  get: () => getFirebaseApp(),
};
export const db = {
  get: () => getFirestoreInstance(),
};
export const auth = {
  get: () => getAuthInstance(),
};

// REST API Configuration
export function getFirebaseRestConfig() {
  const config = getFirebaseConfig();
  return {
    projectId: config.projectId,
    apiKey: config.apiKey,
    baseUrl: `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`,
  };
}

// REST API Helper Functions
export function getProjectId(): string {
  return getFirebaseConfig().projectId;
}

export function getApiKey(): string {
  return getFirebaseConfig().apiKey;
}

// Default export with lazy initialization
export default {
  get app() {
    return getFirebaseApp();
  },
  get db() {
    return getFirestoreInstance();
  },
  get auth() {
    return getAuthInstance();
  },
  getFirebaseApp,
  getFirestoreInstance,
  getAuthInstance,
  getCorrectFirestore,
  getAuthService,
  getDB,
  getFirebaseRestConfig,
  getProjectId,
  getApiKey,
  isFirebaseReady,
  getFirebaseStatus,
  waitForFirebaseInit,
  markQuotaExceeded,
  isQuotaExceeded,
  reinitializeFirebase,
};
