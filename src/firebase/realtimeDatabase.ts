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

// Test Realtime Database connection with proper error handling
export const testRealtimeDatabase = async () => {
  try {
    console.log("🔍 Testing Realtime Database connection...");

    // Create fresh database instance to avoid deletion issues
    const app = getFirebaseApp();
    if (!app) {
      return { success: false, error: "Firebase app not initialized" };
    }

    console.log("📱 Firebase app found:", app.options.projectId);

    // Import and create fresh database instance
    const { getDatabase, ref, get } = await import("firebase/database");

    let db;
    try {
      db = getDatabase(app);
      console.log("✅ Database instance created");
    } catch (dbError: any) {
      console.error("❌ Database creation failed:", dbError);
      return {
        success: false,
        error: `Database creation failed: ${dbError.message}`,
        suggestion: "Check if Realtime Database is enabled in Firebase Console",
      };
    }

    // Simple connectivity test without writing (safer)
    try {
      const connectRef = ref(db, ".info/connected");
      const snapshot = await get(connectRef);
      const connected = snapshot.val();

      console.log("🌐 Connection status:", connected);

      return {
        success: true,
        message: "Realtime Database connected successfully!",
        connected: connected,
        databaseURL: app.options.databaseURL,
      };
    } catch (connectError: any) {
      console.error("❌ Connection test failed:", connectError);

      if (connectError.message.includes("Permission denied")) {
        return {
          success: false,
          error: "Permission denied - check database rules",
          suggestion:
            "Update database rules in Firebase Console to allow read access",
        };
      }

      if (connectError.message.includes("deleted database")) {
        return {
          success: false,
          error: "Database instance was deleted",
          suggestion: "Refresh the page and try again",
        };
      }

      return {
        success: false,
        error: connectError.message,
        suggestion:
          "Ensure Realtime Database is enabled and properly configured",
      };
    }
  } catch (error: any) {
    console.error("❌ Critical database test error:", error);

    return {
      success: false,
      error: error.message,
      suggestion:
        "Check Firebase configuration and ensure Realtime Database is enabled",
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
