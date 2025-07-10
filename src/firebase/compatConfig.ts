// Backward compatibility wrapper for existing Firebase config usage
import { firebaseService } from "./robustConfig";

// Legacy exports that delegate to the robust service
export const getAuthService = () => firebaseService.getAuth();
export const attemptFirestoreInit = () => firebaseService.getFirestore();
export const getDB = () => firebaseService.getFirestore();
export const isFirebaseReady = () => firebaseService.isInitialized();
export const waitForFirebaseInit = async () => {
  await firebaseService.initialize();
  return firebaseService.isInitialized();
};

// Legacy proxy objects for backward compatibility
export const auth = new Proxy(
  {},
  {
    get(target, prop) {
      const authInstance = firebaseService.getAuth();
      if (!authInstance) return null;

      try {
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
      const dbInstance = firebaseService.getFirestore();
      if (!dbInstance) return null;

      try {
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
