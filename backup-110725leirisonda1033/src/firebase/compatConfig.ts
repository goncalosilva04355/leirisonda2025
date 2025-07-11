// Backward compatibility wrapper for existing Firebase config usage
import { firebaseService } from "./robustConfig";

// Legacy exports that delegate to the robust service
export const getAuthService = async () => {
  try {
    return await firebaseService.getAuth();
  } catch (error) {
    console.warn("⚠️ getAuthService failed:", error);
    return null;
  }
};

export const attemptFirestoreInit = async () => {
  try {
    return await firebaseService.getFirestore();
  } catch (error) {
    console.warn("⚠️ attemptFirestoreInit failed:", error);
    return null;
  }
};

export const getDB = async () => {
  try {
    return await firebaseService.getFirestore();
  } catch (error) {
    console.warn("⚠️ getDB failed:", error);
    return null;
  }
};

export const isFirebaseReady = () => firebaseService.isInitialized();

export const waitForFirebaseInit = async () => {
  try {
    await firebaseService.initialize();
    return firebaseService.isInitialized();
  } catch (error) {
    console.warn("⚠️ waitForFirebaseInit failed:", error);
    return false;
  }
};

// Legacy proxy objects for backward compatibility
export const auth = new Proxy(
  {},
  {
    get(target, prop) {
      try {
        if (!firebaseService.isInitialized()) {
          // Return null for properties when not initialized
          return null;
        }

        const authInstance = firebaseService.getAuth();
        if (!authInstance) return null;

        // Handle special case for currentUser which might be accessed synchronously
        if (prop === "currentUser") {
          return (authInstance as any)[prop] || null;
        }

        return (authInstance as any)[prop];
      } catch (error) {
        console.warn("⚠️ Auth proxy error:", error);
        return null;
      }
    },
  },
);

export const db = new Proxy(
  {},
  {
    get(target, prop) {
      try {
        if (!firebaseService.isInitialized()) {
          return null;
        }

        const dbInstance = firebaseService.getFirestore();
        if (!dbInstance) return null;

        return (dbInstance as any)[prop];
      } catch (error) {
        console.warn("⚠️ Firestore proxy error:", error);
        return null;
      }
    },
  },
);

export const app = firebaseService.getApp();

// Initialize on module load
firebaseService.initialize().catch(console.error);
