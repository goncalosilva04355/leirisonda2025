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
    const app = getFirebaseApp();
    firestore = getFirestore(app);
    console.log("✅ Firestore initialized");
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

// Async helpers for backward compatibility
export async function getCorrectFirestore(): Promise<Firestore> {
  return getFirestoreInstance();
}

export async function getAuthService(): Auth {
  return getAuthInstance();
}

// Legacy exports for compatibility
export const app = getFirebaseApp();
export const db = getFirestoreInstance();
export { auth };

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

// Default export
export default {
  app: getFirebaseApp(),
  db: getFirestoreInstance(),
  auth: getAuthInstance(),
  getFirebaseApp,
  getFirestoreInstance,
  getAuthInstance,
  getFirebaseRestConfig,
  getProjectId,
  getApiKey,
};
