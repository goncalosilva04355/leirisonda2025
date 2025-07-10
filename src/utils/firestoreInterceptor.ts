/**
 * Firestore Interceptor
 * Intercepts and blocks all Firestore initialization attempts
 */

// Global override to prevent Firestore initialization
let originalFirestore: any = null;

export const blockFirestoreInitialization = () => {
  try {
    // Override Firebase imports to prevent Firestore initialization
    if (typeof window !== "undefined") {
      // Create a mock getFirestore function that throws a helpful error
      const mockGetFirestore = () => {
        console.warn(
          "🚫 Firestore initialization blocked - service not available",
        );
        console.warn("💡 Using local storage instead of Firestore");
        return null; // Return null instead of throwing to prevent crashes
      };

      // Create a mock initializeFirestore function
      const mockInitializeFirestore = () => {
        console.warn(
          "🚫 Firestore initialization blocked - service not available",
        );
        console.warn("💡 Using local storage instead of Firestore");
        return null; // Return null instead of throwing to prevent crashes
      };

      // Block common Firestore functions
      const blockFirestoreFunction = (functionName: string) => {
        return () => {
          console.warn(`🚫 ${functionName} blocked - Firestore not available`);
          return null;
        };
      };

      // Override any existing Firestore references
      (window as any).__FIRESTORE_DISABLED__ = true;

      // Store original functions if they exist
      if ((window as any).getFirestore) {
        originalFirestore = (window as any).getFirestore;
      }

      // Override with safe versions - comprehensive list
      (window as any).getFirestore = mockGetFirestore;
      (window as any).initializeFirestore = mockInitializeFirestore;
      (window as any).connectFirestoreEmulator = blockFirestoreFunction(
        "connectFirestoreEmulator",
      );
      (window as any).enableNetwork = blockFirestoreFunction("enableNetwork");
      (window as any).disableNetwork = blockFirestoreFunction("disableNetwork");

      // Block Firestore operations
      (window as any).collection = blockFirestoreFunction("collection");
      (window as any).doc = blockFirestoreFunction("doc");
      (window as any).addDoc = blockFirestoreFunction("addDoc");
      (window as any).setDoc = blockFirestoreFunction("setDoc");
      (window as any).updateDoc = blockFirestoreFunction("updateDoc");
      (window as any).deleteDoc = blockFirestoreFunction("deleteDoc");
      (window as any).getDoc = blockFirestoreFunction("getDoc");
      (window as any).getDocs = blockFirestoreFunction("getDocs");
      (window as any).onSnapshot = blockFirestoreFunction("onSnapshot");

      // Override module system to block Firestore imports
      if (typeof module !== "undefined" && module.exports) {
        const originalRequire = module.require;
        if (originalRequire) {
          module.require = function (id: string) {
            if (id.includes("firebase/firestore") || id.includes("firestore")) {
              console.warn(`🚫 Blocked import: ${id}`);
              return {
                getFirestore: mockGetFirestore,
                initializeFirestore: mockInitializeFirestore,
                collection: blockFirestoreFunction("collection"),
                doc: blockFirestoreFunction("doc"),
              };
            }
            return originalRequire.apply(this, arguments);
          };
        }
      }

      console.log(
        "🛡️ Enhanced Firestore interceptor active - all Firestore calls will be blocked",
      );
    }
  } catch (error) {
    console.warn("⚠️ Error setting up Firestore interceptor:", error);
  }
};

export const restoreFirestore = () => {
  try {
    if (typeof window !== "undefined" && originalFirestore) {
      (window as any).getFirestore = originalFirestore;
      delete (window as any).__FIRESTORE_DISABLED__;
      console.log("🔄 Firestore interceptor removed");
    }
  } catch (error) {
    console.warn("⚠️ Error restoring Firestore:", error);
  }
};

export const isFirestoreBlocked = () => {
  return (
    typeof window !== "undefined" &&
    (window as any).__FIRESTORE_DISABLED__ === true
  );
};

// Auto-initialize the interceptor
if (typeof window !== "undefined") {
  blockFirestoreInitialization();
}
