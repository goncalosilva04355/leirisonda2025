// Firebase Realtime Database configuration (instead of Firestore)

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:6027bf35a9d908b264eecc",
  measurementId: "G-51GLBMB6JQ",
  // Realtime Database URL (provided by user)
  databaseURL:
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
let app: any = null;
let auth: any = null;
let storage: any = null;
let database: any = null;

try {
  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
    console.log("✅ Firebase App already initialized");
  } else {
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase App initialized");
  }

  if (app) {
    // Initialize services
    auth = getAuth(app);
    storage = getStorage(app);
    database = getDatabase(app);

    console.log("✅ Firebase services initialized:");
    console.log("- Auth: ✅");
    console.log("- Storage: ✅");
    console.log("- Realtime Database: ✅");
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
}

// Export safe functions
export const getFirebaseApp = () => {
  const apps = getApps();
  return apps.length > 0 ? apps[0] : null;
};

export const getAuthSafe = async () => {
  if (auth) return auth;
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
};

export const getStorageSafe = async () => {
  if (storage) return storage;
  const app = getFirebaseApp();
  return app ? getStorage(app) : null;
};

export const getDatabaseSafe = async () => {
  if (database) return database;
  const app = getFirebaseApp();
  return app ? getDatabase(app) : null;
};

// Test Realtime Database connection
export const testRealtimeDatabase = async () => {
  try {
    const db = await getDatabaseSafe();
    if (!db) {
      return { success: false, error: "Database not initialized" };
    }

    const { ref, set, get } = await import("firebase/database");

    // Test write
    const testRef = ref(db, "connectivity_test/timestamp");
    await set(testRef, Date.now());

    // Test read
    const snapshot = await get(testRef);
    const value = snapshot.val();

    if (value) {
      return {
        success: true,
        message: "Realtime Database working!",
        testValue: value,
      };
    } else {
      return { success: false, error: "Could not read test data" };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      suggestion: "Realtime Database may not be enabled in Firebase Console",
    };
  }
};

// Create Realtime Database operations (instead of Firestore)
export const createDatabaseOperations = () => {
  return {
    // Save data to Realtime Database
    save: async (path: string, data: any) => {
      const db = await getDatabaseSafe();
      if (!db) throw new Error("Database not available");

      const { ref, push } = await import("firebase/database");
      const dataRef = ref(db, path);
      return await push(dataRef, { ...data, timestamp: Date.now() });
    },

    // Get data from Realtime Database
    get: async (path: string) => {
      const db = await getDatabaseSafe();
      if (!db) throw new Error("Database not available");

      const { ref, get } = await import("firebase/database");
      const dataRef = ref(db, path);
      const snapshot = await get(dataRef);
      return snapshot.val() || {};
    },

    // Listen to data changes
    listen: async (path: string, callback: (data: any) => void) => {
      const db = await getDatabaseSafe();
      if (!db) throw new Error("Database not available");

      const { ref, onValue } = await import("firebase/database");
      const dataRef = ref(db, path);
      return onValue(dataRef, (snapshot) => {
        callback(snapshot.val() || {});
      });
    },
  };
};

console.log("🔥 Firebase Realtime Database configuration loaded");
