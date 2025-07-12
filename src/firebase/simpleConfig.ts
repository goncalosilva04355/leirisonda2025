// Simple, direct Firebase configuration to avoid app destruction errors
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseConfig } from "../config/firebaseEnv";

const firebaseConfig = getFirebaseConfig();

// Simple singleton pattern without complex async initialization
let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

// Initialize Firebase immediately and simply
function initializeFirebase(): boolean {
  try {
    // Only initialize if not already done
    if (!firebaseApp) {
      const existingApps = getApps();
      if (existingApps.length > 0) {
        firebaseApp = existingApps[0];
        console.log("✅ Using existing Firebase app");
      } else {
        firebaseApp = initializeApp(firebaseConfig);
        console.log("✅ Firebase app initialized");
      }
    }

    // Initialize Auth if not already done
    if (!auth && firebaseApp) {
      try {
        auth = getAuth(firebaseApp);
        console.log("✅ Firebase Auth ready");
      } catch (error) {
        console.warn("⚠️ Firebase Auth not available:", error);
      }
    }

    // Initialize Firestore if not already done
    if (!firestore && firebaseApp) {
      try {
        firestore = getFirestore(firebaseApp);
        console.log("✅ Firebase Firestore ready");
      } catch (error) {
        console.warn("⚠️ Firebase Firestore not available:", error);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    return false;
  }
}

// Initialize immediately
initializeFirebase();

// Simple getters that always return current instances
export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore | null {
  if (!firestore) {
    initializeFirebase();
  }
  return firestore;
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return firebaseApp;
}

export function isFirebaseAvailable(): boolean {
  return !!(firebaseApp && auth);
}

// Função para obter status detalhado do Firebase
export function getFirebaseStatus() {
  return {
    ready: !!(firebaseApp && auth && firestore),
    app: !!firebaseApp,
    auth: !!auth,
    db: !!firestore,
    firestore: !!firestore,
    isInitialized: !!firebaseApp,
    authReady: !!auth,
    firestoreReady: !!firestore,
    quotaExceeded: false, // TODO: Implementar verificação de quota se necessário
  };
}

// Legacy compatibility exports
export const getAuthService = () => Promise.resolve(getFirebaseAuth());
export const attemptFirestoreInit = () =>
  Promise.resolve(getFirebaseFirestore());
export const getDB = () => Promise.resolve(getFirebaseFirestore());
export const isFirebaseReady = () => isFirebaseAvailable();
export const waitForFirebaseInit = () => Promise.resolve(isFirebaseAvailable());

// Direct exports for immediate use
export { auth as firebaseAuth, firestore as firebaseFirestore, firebaseApp };

// Legacy db export for backward compatibility
export const db = new Proxy(
  {},
  {
    get(target, prop) {
      const firestoreInstance = getFirebaseFirestore();
      if (!firestoreInstance) return null;

      try {
        return (firestoreInstance as any)[prop];
      } catch (error) {
        console.warn("⚠️ Firestore db proxy error:", error);
        return null;
      }
    },
  },
);

// Legacy auth export for backward compatibility
export { auth };

// Legacy app export for backward compatibility
export const app = firebaseApp;
