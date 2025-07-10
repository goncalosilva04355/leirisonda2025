/**
 * Firestore Error Check
 * Monitors and reports Firestore initialization errors
 */

export const checkFirestoreErrors = () => {
  // Override console.error to capture Firestore errors
  const originalError = console.error;

  console.error = (...args) => {
    const message = args.join(" ");

    if (
      message.includes("Service firestore is not available") ||
      message.includes("firestore") ||
      message.includes("Firestore")
    ) {
      console.warn("🚫 FIRESTORE ERROR DETECTED:", message);
      console.warn("🔧 Error source analysis:");
      console.warn("📍 Arguments:", args);

      // Log stack trace to help identify source
      const error = new Error("Firestore error trace");
      console.warn("📍 Stack trace:", error.stack);

      // Try to identify the source
      const stack = error.stack?.split("\n") || [];
      const relevantLines = stack.filter(
        (line) =>
          line.includes("/src/") &&
          !line.includes("firestoreErrorCheck") &&
          !line.includes("node_modules"),
      );

      if (relevantLines.length > 0) {
        console.warn("🎯 Likely source files:", relevantLines);
      }

      // Prevent the error from propagating if it's a Firestore error
      if (message.includes("Service firestore is not available")) {
        console.warn("🛡️ Firestore error blocked from propagating");
        return;
      }
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
