// Backward compatibility wrapper for existing Firebase config usage
import { getFirebaseApp, getAuth } from "./basicConfig";
import { getFirebaseFirestore } from "./firestoreConfig";

// Legacy exports that delegate to the new basic service
export const getAuthService = async () => {
  try {
    return getAuth();
  } catch (error) {
    console.warn("⚠️ getAuthService failed:", error);
    return null;
  }
};

export const attemptFirestoreInit = async () => {
  try {
    const { getFirebaseFirestoreAsync } = await import("./firestoreConfig");
    return await getFirebaseFirestoreAsync();
  } catch (error) {
    console.warn("⚠️ attemptFirestoreInit failed:", error);
    return null;
  }
};

export const getDB = async () => {
  try {
    const { getFirebaseFirestoreAsync } = await import("./firestoreConfig");
    return await getFirebaseFirestoreAsync();
  } catch (error) {
    console.warn("⚠️ getDB failed:", error);
    return null;
  }
};

export const isFirebaseReady = () => {
  const app = getFirebaseApp();
  return app !== null;
};

export const waitForFirebaseInit = async () => {
  try {
    const app = getFirebaseApp();
    return app !== null;
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
        const authInstance = getAuth();
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
        const dbInstance = getFirebaseFirestore();
        if (!dbInstance) return null;

        return (dbInstance as any)[prop];
      } catch (error) {
        console.warn("⚠️ Firestore proxy error:", error);
        return null;
      }
    },
  },
);

export const app = getFirebaseApp();
