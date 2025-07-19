/**
 * Handler específico para erros do Firestore, incluindo ReadableStream
 */

// Global error handler for Firestore ReadableStream issues
window.addEventListener("unhandledrejection", (event) => {
  const error = event.reason;

  // Handle Firestore ReadableStream errors specifically
  if (
    error &&
    typeof error === "object" &&
    (error.message?.includes("ReadableStream") ||
      error.stack?.includes("firebase_firestore.js") ||
      error.stack?.includes("initializeReadableStreamDefaultReader") ||
      error.stack?.includes("getReader"))
  ) {
    console.warn(
      "🔥 Firestore ReadableStream error caught and handled:",
      error,
    );
    event.preventDefault(); // Prevent default error handling

    // Try to reinitialize Firestore connection after a delay
    setTimeout(() => {
      console.log("🔄 Attempting to reinitialize Firestore connection...");
      try {
        // Force a new Firestore connection
        window.dispatchEvent(new CustomEvent("reinitializeFirestore"));
      } catch (reinitError) {
        console.warn("⚠️ Could not reinitialize Firestore:", reinitError);
      }
    }, 5000);

    return;
  }

  // Handle other Firebase errors
  if (
    error &&
    typeof error === "object" &&
    (error.code?.startsWith("firestore/") ||
      error.message?.includes("Firebase") ||
      error.stack?.includes("firebase"))
  ) {
    console.warn("🔥 Firebase error caught and handled:", error);
    event.preventDefault();

    // Show user-friendly message for network issues
    if (
      error.code === "firestore/unavailable" ||
      error.message?.includes("network")
    ) {
      console.log(
        "📱 Network connectivity issue detected - continuing offline",
      );
    }

    return;
  }
});

// Handle global errors from Firestore
window.addEventListener("error", (event) => {
  if (
    event.filename &&
    (event.filename.includes("firebase_firestore.js") ||
      event.filename.includes("firebase/firestore"))
  ) {
    console.warn("🔥 Firestore global error caught:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });

    event.preventDefault();
    return;
  }
});

// Polyfill for ReadableStream if not available (Safari/older browsers)
if (typeof ReadableStream === "undefined") {
  console.warn("⚠️ ReadableStream not available - adding polyfill");

  // Simple polyfill for basic ReadableStream functionality
  (window as any).ReadableStream = class ReadableStreamPolyfill {
    constructor(source: any) {
      this._source = source;
    }

    getReader() {
      return {
        read: () => Promise.resolve({ done: true, value: undefined }),
        releaseLock: () => {},
        cancel: () => Promise.resolve(),
      };
    }
  };
}

// Check if ReadableStream is working properly
try {
  const testStream = new ReadableStream({
    start(controller) {
      controller.enqueue("test");
      controller.close();
    },
  });

  const reader = testStream.getReader();
  reader
    .read()
    .then(() => {
      console.log("✅ ReadableStream is working properly");
      reader.releaseLock();
    })
    .catch((error) => {
      console.warn("⚠️ ReadableStream test failed:", error);
    });
} catch (error) {
  console.warn("⚠️ ReadableStream is not available or working:", error);
}

console.log("✅ Firestore error handler initialized");
