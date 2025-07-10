// Firebase configuration WITHOUT Firestore to eliminate errors

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase config with Firestore DISABLED
const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:6027bf35a9d908b264eecc",
  measurementId: "G-51GLBMB6JQ",
};

// Initialize Firebase App (without Firestore)
let app: any = null;
let auth: any = null;
let storage: any = null;

try {
  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
    console.log("✅ Firebase App already initialized:", app.name);
  } else {
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase App initialized successfully:", app.name);
  }

  // Initialize only Auth and Storage (NO FIRESTORE)
  if (app) {
    try {
      auth = getAuth(app);
      console.log("✅ Firebase Auth initialized");
    } catch (authError) {
      console.warn("⚠️ Auth initialization warning:", authError);
    }

    try {
      storage = getStorage(app);
      console.log("✅ Firebase Storage initialized");
    } catch (storageError) {
      console.warn("⚠️ Storage initialization warning:", storageError);
    }
  }
} catch (error) {
  console.error("❌ Error initializing Firebase App:", error);
  app = null;
}

// Export safe functions (WITHOUT FIRESTORE)
export const getFirebaseApp = () => {
  try {
    const apps = getApps();
    return apps.length > 0 ? apps[0] : null;
  } catch (error) {
    console.error("Error getting Firebase App:", error);
    return null;
  }
};

export const getAuthSafe = async () => {
  try {
    if (auth) {
      return auth;
    }

    const app = getFirebaseApp();
    if (!app) return null;

    const newAuth = getAuth(app);
    auth = newAuth;
    return newAuth;
  } catch (error) {
    console.warn("Auth not available:", error);
    return null;
  }
};

export const getStorageSafe = async () => {
  try {
    if (storage) {
      return storage;
    }

    const app = getFirebaseApp();
    if (!app) return null;

    const newStorage = getStorage(app);
    storage = newStorage;
    return newStorage;
  } catch (error) {
    console.warn("Storage not available:", error);
    return null;
  }
};

// FIRESTORE DISABLED - Always return null
export const getFirestoreSafe = async () => {
  console.log("🚫 Firestore disabled to prevent errors");
  return null;
};

// Check if Firebase is ready (WITHOUT FIRESTORE)
export const isFirebaseReady = () => {
  try {
    const app = getFirebaseApp();
    return !!app;
  } catch (error) {
    return false;
  }
};

console.log("🎯 Firebase initialized WITHOUT Firestore - No more errors!");
