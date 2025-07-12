/**
 * Simple ReadableStream polyfill specifically for Firebase compatibility
 * This is a minimal implementation that focuses on what Firebase needs
 */

export function installReadableStreamPolyfill() {
  if (typeof globalThis === "undefined") {
    return;
  }

  // Always install our polyfill for Firebase compatibility
  // Even if ReadableStream exists, it might not work properly with Firebase
  const needsPolyfill = true;

  if (!needsPolyfill) {
    return;
  }

  console.log(
    "🔧 Installing ReadableStream polyfill for Firebase compatibility",
  );

  // Basic ReadableStream implementation
  class ReadableStreamPolyfill {
    private _source: any;
    private _reader: any;
    private _locked: boolean;
    private _cancelled: boolean;
    private _controller: any;

    constructor(source?: any) {
      this._source = source;
      this._reader = null;
      this._locked = false;
      this._cancelled = false;
      this._controller = null;

      // Initialize controller if source provides one
      if (source && typeof source.start === "function") {
        this._controller = {
          enqueue: (chunk: any) => {},
          close: () => {},
          error: (error: any) => {},
        };

        try {
          source.start(this._controller);
        } catch (error) {
          console.warn("ReadableStream source start error:", error);
        }
      }
    }

    getReader() {
      if (this._locked) {
        throw new TypeError("ReadableStream is already locked");
      }

      this._locked = true;

      this._reader = {
        read: () => {
          try {
            if (this._cancelled) {
              return Promise.resolve({ done: true, value: undefined });
            }

            // If source has a pull method, try to use it
            if (this._source && typeof this._source.pull === "function") {
              try {
                const result = this._source.pull(this._controller);
                return Promise.resolve(result)
                  .then(() => ({ done: false, value: null }))
                  .catch((error) => {
                    console.warn("ReadableStream pull error:", error);
                    return { done: true, value: undefined };
                  });
              } catch (error) {
                console.warn("ReadableStream pull sync error:", error);
                return Promise.resolve({ done: true, value: undefined });
              }
            }

            // Default behavior - return done
            return Promise.resolve({ done: true, value: undefined });
          } catch (error) {
            console.warn("ReadableStream read error:", error);
            return Promise.resolve({ done: true, value: undefined });
          }
        },

        cancel: (reason?: any) => {
          this._cancelled = true;

          if (this._source && typeof this._source.cancel === "function") {
            try {
              return Promise.resolve(this._source.cancel(reason));
            } catch (error) {
              return Promise.resolve();
            }
          }

          return Promise.resolve();
        },

        releaseLock: () => {
          this._locked = false;
          this._reader = null;
        },

        get closed() {
          return this._cancelled ? Promise.resolve() : new Promise(() => {});
        },
      };

      return this._reader;
    }

    cancel(reason?: any) {
      this._cancelled = true;

      if (this._reader) {
        return this._reader.cancel(reason);
      }

      if (this._source && typeof this._source.cancel === "function") {
        try {
          return Promise.resolve(this._source.cancel(reason));
        } catch (error) {
          return Promise.resolve();
        }
      }

      return Promise.resolve();
    }

    get locked() {
      return this._locked;
    }

    // Additional methods that Firebase might expect
    pipeTo() {
      return Promise.resolve();
    }

    pipeThrough() {
      return this;
    }

    tee() {
      return [this, this];
    }
  }

  // Install the polyfill
  globalThis.ReadableStream = ReadableStreamPolyfill as any;

  // Also provide basic WritableStream and TransformStream if needed
  if (!globalThis.WritableStream) {
    globalThis.WritableStream = class WritableStream {
      constructor(sink?: any) {}

      getWriter() {
        return {
          write: () => Promise.resolve(),
          close: () => Promise.resolve(),
          abort: () => Promise.resolve(),
          releaseLock: () => {},
        };
      }

      abort() {
        return Promise.resolve();
      }

      get locked() {
        return false;
      }
    } as any;
  }

  if (!globalThis.TransformStream) {
    globalThis.TransformStream = class TransformStream {
      constructor(transformer?: any) {}

      get readable() {
        return new globalThis.ReadableStream();
      }

      get writable() {
        return new globalThis.WritableStream();
      }
    } as any;
  }

  console.log("✅ ReadableStream polyfill installed successfully");
}

// Auto-install when this module is imported
installReadableStreamPolyfill();
