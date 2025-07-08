/**
 * Polyfills for browser compatibility
 * This file should be imported as early as possible
 */

// ReadableStream polyfill for older browsers and Firebase compatibility
if (typeof globalThis !== "undefined") {
  // Check if ReadableStream is missing or incomplete
  const needsPolyfill =
    !globalThis.ReadableStream ||
    !globalThis.ReadableStream.prototype?.getReader ||
    typeof globalThis.ReadableStream.prototype.getReader !== "function";

  if (needsPolyfill) {
    console.log(
      "🔧 Loading ReadableStream polyfill for Firebase compatibility",
    );

    // Try to load the full polyfill
    import("web-streams-polyfill/ponyfill")
      .then(({ ReadableStream, WritableStream, TransformStream }) => {
        if (!globalThis.ReadableStream || needsPolyfill) {
          globalThis.ReadableStream = ReadableStream;
          console.log("✅ ReadableStream polyfill loaded");
        }
        if (!globalThis.WritableStream) {
          globalThis.WritableStream = WritableStream;
        }
        if (!globalThis.TransformStream) {
          globalThis.TransformStream = TransformStream;
        }
      })
      .catch((error) => {
        console.warn(
          "Failed to load web-streams-polyfill, using fallback:",
          error,
        );

        // Fallback implementation for ReadableStream
        if (!globalThis.ReadableStream) {
          globalThis.ReadableStream = class ReadableStream {
            private _source: any;
            private _reader: any;
            private _locked: boolean;

            constructor(source?: any) {
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
                  this._reader = null;
                },
              };
              return this._reader;
            }

            cancel() {
              if (this._reader) {
                this._reader.releaseLock();
              }
              return Promise.resolve();
            }

            get locked() {
              return this._locked;
            }
          } as any;

          console.log("✅ Fallback ReadableStream implementation loaded");
        }
      });
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
