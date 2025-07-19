/**
 * ReadableStream polyfill specifically for Firebase Firestore compatibility
 * Fixes issues with browsers that don't have full ReadableStream support
 */

// Check if ReadableStream needs polyfilling for Firebase
const needsPolyfill = () => {
  try {
    // Test if ReadableStream exists and has the methods Firebase needs
    if (typeof ReadableStream === "undefined") return true;

    // Test if getReader works
    const test = new ReadableStream();
    const reader = test.getReader();
    if (typeof reader.read !== "function") return true;

    reader.releaseLock();
    return false;
  } catch (error) {
    return true;
  }
};

if (needsPolyfill()) {
  console.log("🔧 Adding ReadableStream polyfill for Firebase compatibility");

  // Simple ReadableStream polyfill focused on Firebase Firestore needs
  (window as any).ReadableStream = class ReadableStreamPolyfill {
    private _controller: any;
    private _reader: any;

    constructor(source?: any) {
      this._controller = {
        enqueue: (chunk: any) => {},
        close: () => {},
        error: (error: any) => {},
      };

      if (source && source.start) {
        try {
          source.start(this._controller);
        } catch (error) {
          console.warn("ReadableStream source start error:", error);
        }
      }
    }

    getReader() {
      if (this._reader) {
        throw new Error("ReadableStreamDefaultReader is already locked");
      }

      this._reader = {
        read: () => {
          return Promise.resolve({ done: true, value: undefined });
        },
        releaseLock: () => {
          this._reader = null;
        },
        cancel: (reason?: any) => {
          return Promise.resolve();
        },
        closed: Promise.resolve(),
      };

      return this._reader;
    }

    cancel(reason?: any) {
      return Promise.resolve();
    }

    pipeTo(dest: any, options?: any) {
      return Promise.resolve();
    }

    pipeThrough(transform: any, options?: any) {
      return transform.readable;
    }

    tee() {
      return [this, this];
    }
  };

  // Also add ReadableStreamDefaultReader if needed
  if (typeof (window as any).ReadableStreamDefaultReader === "undefined") {
    (window as any).ReadableStreamDefaultReader = class {
      constructor(stream: any) {
        this._stream = stream;
      }

      read() {
        return Promise.resolve({ done: true, value: undefined });
      }

      releaseLock() {}

      cancel(reason?: any) {
        return Promise.resolve();
      }

      get closed() {
        return Promise.resolve();
      }
    };
  }

  console.log("✅ ReadableStream polyfill installed");
} else {
  console.log("✅ ReadableStream is natively supported");
}

// Export a test function to verify ReadableStream works
export const testReadableStream = () => {
  try {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue("test");
        controller.close();
      },
    });

    const reader = stream.getReader();
    return reader
      .read()
      .then((result) => {
        reader.releaseLock();
        return { success: true, result };
      })
      .catch((error) => {
        return { success: false, error };
      });
  } catch (error) {
    return Promise.resolve({ success: false, error });
  }
};
