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
        throw new Error(
          "Service firestore is not available - using local storage mode",
        );
      };

      // Create a mock initializeFirestore function
      const mockInitializeFirestore = () => {
        console.warn(
          "🚫 Firestore initialization blocked - service not available",
        );
        console.warn("💡 Using local storage instead of Firestore");
        throw new Error(
          "Service firestore is not available - using local storage mode",
        );
      };

      // Override any existing Firestore references
      (window as any).__FIRESTORE_DISABLED__ = true;

      // Store original functions if they exist
      if ((window as any).getFirestore) {
        originalFirestore = (window as any).getFirestore;
      }

      // Override with safe versions
      (window as any).getFirestore = mockGetFirestore;
      (window as any).initializeFirestore = mockInitializeFirestore;

      console.log(
        "🛡️ Firestore interceptor active - all Firestore calls will be blocked",
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
