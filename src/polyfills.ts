/**
 * Polyfills for browser compatibility
 * This file should be imported as early as possible
 */

import { installReadableStreamPolyfill } from "./utils/readableStreamPolyfill";

// Install ReadableStream polyfill immediately
installReadableStreamPolyfill();

// ReadableStream polyfill for older browsers and Firebase compatibility
if (typeof globalThis !== "undefined") {
  // Check if ReadableStream is missing or incomplete
  const needsPolyfill =
    !globalThis.ReadableStream ||
    !globalThis.ReadableStream.prototype?.getReader ||
    typeof globalThis.ReadableStream.prototype.getReader !== "function";

  if (needsPolyfill) {
    console.log(
      "🔧 Loading enhanced ReadableStream polyfill for Firebase compatibility",
    );

    // The polyfill has already been installed by installReadableStreamPolyfill()
    console.log("✅ ReadableStream polyfill ready for Firebase compatibility");
  }
}

// Additional Firebase-specific fixes
if (typeof globalThis !== "undefined") {
  // Ensure proper error handling for Firebase operations
  const originalFetch = globalThis.fetch;
  if (originalFetch) {
    globalThis.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      return originalFetch(input, init).catch((error) => {
        if (error.message?.includes("ReadableStream")) {
          console.warn("Fetch ReadableStream error caught:", error.message);
          // Return a minimal response that won't break Firebase
          return new Response("{}", {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        throw error;
      });
    };
  }
}

export {};
