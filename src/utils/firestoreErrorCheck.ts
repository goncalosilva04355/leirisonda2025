/**
 * Firestore Error Check
 * Monitors and reports Firestore initialization errors
 */

export const checkFirestoreErrors = () => {
  // Override console.error to capture Firestore errors
  const originalError = console.error;

  console.error = (...args) => {
    const message = args.join(" ");

    if (message.includes("Service firestore is not available")) {
      console.warn("🚫 FIRESTORE ERROR DETECTED:", message);
      console.warn(
        "🔧 This error indicates Firestore is trying to initialize but the service is not enabled",
      );
      console.warn(
        "💡 Solution: Ensure all Firestore imports are removed or properly handled",
      );

      // Log stack trace to help identify source
      const error = new Error("Firestore error trace");
      console.warn("📍 Error stack trace:", error.stack);
    }

    // Call original console.error
    originalError.apply(console, args);
  };

  console.log("🔍 Firestore error monitoring active");
};

// Auto-initialize
if (typeof window !== "undefined") {
  checkFirestoreErrors();
}
