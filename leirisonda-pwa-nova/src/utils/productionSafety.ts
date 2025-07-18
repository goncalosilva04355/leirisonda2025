// Production safety utilities to prevent app crashes

console.log("🛡️ Loading production safety utilities...");

// Global error handler that prevents Firebase from crashing the app
export function initializeProductionSafety() {
  // Prevent Firebase errors from crashing the app
  window.addEventListener("error", (event) => {
    const error = event.error;
    if (error && error.message) {
      const message = error.message.toLowerCase();

      // Firebase-related errors
      if (
        message.includes("firebase") ||
        message.includes("firestore") ||
        message.includes("getimmediate") ||
        message.includes("messaging")
      ) {
        console.warn(
          "⚠️ Firebase error prevented from crashing app:",
          error.message,
        );
        event.preventDefault();
        return false;
      }

      // Network errors
      if (
        message.includes("network") ||
        message.includes("fetch") ||
        message.includes("connection")
      ) {
        console.warn("⚠️ Network error handled gracefully:", error.message);
        event.preventDefault();
        return false;
      }
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    if (reason && typeof reason === "object") {
      const message = reason.message || reason.toString();

      if (
        message.includes("firebase") ||
        message.includes("firestore") ||
        message.includes("messaging")
      ) {
        console.warn("⚠️ Firebase promise rejection handled:", message);
        event.preventDefault();
        return false;
      }
    }
  });

  console.log("✅ Production safety initialized");
}

// Safe localStorage wrapper
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`⚠️ LocalStorage read error for key "${key}":`, error);
    return null;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`⚠️ LocalStorage write error for key "${key}":`, error);
    return false;
  }
}

// Initialize immediately when imported
initializeProductionSafety();
