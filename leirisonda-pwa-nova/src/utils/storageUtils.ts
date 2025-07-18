/**
 * Storage utility that handles private browsing mode gracefully
 * Provides fallbacks when localStorage/sessionStorage are not available
 */

// In-memory storage fallback for private browsing mode
class MemoryStorage implements Storage {
  private data: Map<string, string> = new Map();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.data.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

// Test if storage is available and functional
function isStorageAvailable(type: "localStorage" | "sessionStorage"): boolean {
  try {
    const storage = window[type];
    const testKey = "__storage_test__";
    storage.setItem(testKey, "test");
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// Detect if we're in private browsing mode
export function isPrivateBrowsing(): boolean {
  try {
    // Multiple detection methods for different browsers

    // Method 1: localStorage availability
    if (!isStorageAvailable("localStorage")) {
      return true;
    }

    // Method 2: Safari private browsing detection
    if (window.safari && window.safari.pushNotification) {
      return false; // Safari with push notifications = not private
    }

    // Method 3: indexedDB availability
    if (!window.indexedDB) {
      return true;
    }

    // Method 4: Chrome/Firefox detection
    try {
      const db = indexedDB.open("test");
      db.onerror = () => true;
    } catch (e) {
      return true;
    }

    return false;
  } catch (e) {
    return true; // Assume private if we can't detect
  }
}

// Safe storage interface that works in private browsing
class SafeStorage {
  private storage: Storage;
  private isPrivate: boolean;

  constructor(type: "localStorage" | "sessionStorage" = "localStorage") {
    this.isPrivate = isPrivateBrowsing() || !isStorageAvailable(type);

    if (this.isPrivate) {
      console.warn(
        `Using memory storage fallback (private browsing mode detected)`,
      );
      this.storage = new MemoryStorage();
    } else {
      this.storage = window[type];
    }
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch (e) {
      console.warn(`Storage getItem failed for key "${key}":`, e);
      return null;
    }
  }

  setItem(key: string, value: string): boolean {
    try {
      this.storage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`Storage setItem failed for key "${key}":`, e);
      return false;
    }
  }

  removeItem(key: string): boolean {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`Storage removeItem failed for key "${key}":`, e);
      return false;
    }
  }

  clear(): boolean {
    try {
      this.storage.clear();
      return true;
    } catch (e) {
      console.warn("Storage clear failed:", e);
      return false;
    }
  }

  get length(): number {
    try {
      return this.storage.length;
    } catch (e) {
      console.warn("Storage length access failed:", e);
      return 0;
    }
  }

  key(index: number): string | null {
    try {
      return this.storage.key(index);
    } catch (e) {
      console.warn(`Storage key access failed for index ${index}:`, e);
      return null;
    }
  }

  isUsingMemoryFallback(): boolean {
    return this.isPrivate;
  }
}

// Export singleton instances
export const safeLocalStorage = new SafeStorage("localStorage");
export const safeSessionStorage = new SafeStorage("sessionStorage");

// Utility functions for common operations
export const storageUtils = {
  // Get item with JSON parsing
  getJson<T>(key: string, defaultValue?: T): T | null {
    const value = safeLocalStorage.getItem(key);
    if (!value) return defaultValue ?? null;

    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn(`Failed to parse JSON for key "${key}":`, e);
      return defaultValue ?? null;
    }
  },

  // Set item with JSON stringification
  setJson(key: string, value: any): boolean {
    try {
      return safeLocalStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to stringify and set JSON for key "${key}":`, e);
      return false;
    }
  },

  // Check if storage is available (not private mode)
  isStorageAvailable(): boolean {
    return !safeLocalStorage.isUsingMemoryFallback();
  },

  // Get private browsing status
  isPrivateBrowsing,
};

export default storageUtils;
