// Load polyfills first
import "./polyfills";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ImprovedErrorBoundary from "./components/ImprovedErrorBoundary";
import "./index.css";

// Restauração imediata de utilizadores
import "./utils/immediateUserRestore";

// ReadableStream polyfill for Firebase compatibility
if (
  typeof window !== "undefined" &&
  (!window.ReadableStream || !window.ReadableStream.prototype.getReader)
) {
  console.log("🔧 Adding ReadableStream polyfill for Firebase compatibility");
  import("web-streams-polyfill/ponyfill")
    .then(({ ReadableStream, WritableStream, TransformStream }) => {
      if (!window.ReadableStream) {
        window.ReadableStream = ReadableStream;
      }
      if (!window.WritableStream) {
        window.WritableStream = WritableStream;
      }
      if (!window.TransformStream) {
        window.TransformStream = TransformStream;
      }
      console.log("✅ Web streams polyfill loaded");
    })
    .catch((error) => {
      console.warn("Failed to load web streams polyfill:", error);
      // Fallback to basic implementation
      if (!window.ReadableStream) {
        window.ReadableStream = class ReadableStream {
          constructor(source) {
            this._source = source;
            this._reader = null;
            this._locked = false;
          }

          getReader() {
            if (this._locked) {
              throw new TypeError("ReadableStream is locked");
            }
            this._locked = true;
            this._reader = {
              read: () => Promise.resolve({ done: true, value: undefined }),
              cancel: () => Promise.resolve(),
              releaseLock: () => {
                this._locked = false;
              },
            };
            return this._reader;
          }

          cancel() {
            return Promise.resolve();
          }
        };
      }
    });
}

// Chrome-specific fixes for PWA compatibility
if (typeof window !== "undefined") {
  // Clear any cached data that might be causing issues in Chrome
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        if (
          name.includes("leirisonda-v1") ||
          name.includes("leirisonda-v2") ||
          name.includes("leirisonda-v3")
        ) {
          caches.delete(name);
        }
      });
    });
  }

  // Firebase handles data persistence automatically - no localStorage needed
  console.log("🔥 Firebase handles data persistence automatically");

  // Enhanced promise rejection handler for Firebase errors
  window.addEventListener("unhandledrejection", (event) => {
    console.warn("Unhandled promise rejection:", event.reason);

    // Check if it's a Firebase ReadableStream error
    if (
      event.reason?.message?.includes("ReadableStream") ||
      event.reason?.message?.includes(
        "initializeReadableStreamDefaultReader",
      ) ||
      event.reason?.stack?.includes("firebase_firestore.js")
    ) {
      console.log("🔧 Handling Firebase ReadableStream error");
      event.preventDefault(); // Prevent the error from crashing the app

      // Try to recover by reinitializing Firebase after a delay
      setTimeout(async () => {
        try {
          const { FirebaseErrorFix } = await import("./utils/firebaseErrorFix");
          await FirebaseErrorFix.safeFirebaseReinitialization();
        } catch (error) {
          console.error("Failed to reinitialize Firebase:", error);
        }
      }, 1000);
    } else {
      event.preventDefault();
    }
  });

  // Add error event listener for better error handling
  window.addEventListener("error", (event) => {
    if (
      event.error?.message?.includes("ReadableStream") ||
      event.error?.stack?.includes("firebase_firestore.js")
    ) {
      console.log("🔧 Handling Firebase ReadableStream error via error event");
      event.preventDefault();
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ImprovedErrorBoundary>
    <App />
  </ImprovedErrorBoundary>,
);
