import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Default Firebase config
const defaultFirebaseConfig = {
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

// Function to get Firebase config from localStorage or use default
const getFirebaseConfig = () => {
  console.log("🔄 Firebase: Using default configuration");
  return defaultFirebaseConfig;
};

// Function to save Firebase config to localStorage
export const saveFirebaseConfig = (config: any) => {
  try {
    console.log("🔧 Firebase: Configuration using default settings");
    return true;
  } catch (error) {
    console.error("❌ Firebase: Error saving config:", error);
    return false;
  }
};

// Get current Firebase config (from localStorage or default)
const firebaseConfig = getFirebaseConfig();

// Função segura para obter/criar Firebase app
const getFirebaseApp = () => {
  try {
    // Verificar apps existentes primeiro
    const existingApps = getApps();
    if (existingApps.length > 0) {
      const existingApp = existingApps[0];
      if (existingApp && existingApp.options && existingApp.name) {
        console.log("🔄 Usando Firebase app existente");
        return existingApp;
      }
    }

    console.log("🚀 Inicializando novo Firebase app...");
    const app = initializeApp(firebaseConfig);
    console.log("✅ Firebase app inicializado com sucesso");
    return app;
  } catch (error: any) {
    console.error("❌ Erro na inicialização do Firebase:", error);
    return null;
  }
};

// Initialize Firebase services
console.log("🔥 Firebase initialization starting...");
let app: any = null;
let db: any = null;
let auth: any = null;

// Initialize Firebase immediately
try {
  app = getFirebaseApp();
  if (app) {
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("✅ Firebase services initialized successfully");
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  app = null;
  db = null;
  auth = null;
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

// Function to ensure Firebase is initialized before use
export const waitForFirebaseInit = async (): Promise<boolean> => {
  try {
    return isFirebaseReady();
  } catch (error) {
    console.warn("Failed to wait for Firebase initialization:", error);
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
    quotaExceeded: false,
  };
};

// Function to attempt Firebase reinitialization
export const reinitializeFirebase = async (): Promise<boolean> => {
  try {
    // Reset the current instances
    app = null;
    db = null;
    auth = null;

    // Start a new initialization
    app = getFirebaseApp();
    if (app) {
      db = getFirestore(app);
      auth = getAuth(app);
    }

    console.log("✅ Firebase successfully reinitialized");
    return isFirebaseReady();
  } catch (error) {
    console.warn("⚠️ Firebase reinitialization error:", error);
    return false;
  }
};

// Lazy loading getters for Firebase services
export const getDB = async () => {
  return db;
};

export const getAuthService = async () => {
  return auth;
};

export { app, db, auth };
export default app;
