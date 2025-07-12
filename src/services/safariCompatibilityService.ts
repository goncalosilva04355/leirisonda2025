/**
 * Safari Compatibility Service
 * Handles iOS Safari limitations and Firebase compatibility issues
 */

export class SafariCompatibilityService {
  private static instance: SafariCompatibilityService;
  private isSafari: boolean = false;
  private isIOS: boolean = false;
  private isPrivateBrowsing: boolean = false;
  private storageAvailable: boolean = true;

  constructor() {
    this.detectEnvironment();
  }

  static getInstance(): SafariCompatibilityService {
    if (!SafariCompatibilityService.instance) {
      SafariCompatibilityService.instance = new SafariCompatibilityService();
    }
    return SafariCompatibilityService.instance;
  }

  private detectEnvironment() {
    const userAgent = navigator.userAgent;

    // Detect Safari
    this.isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

    // Detect iOS
    this.isIOS = /iPad|iPhone|iPod/.test(userAgent);

    // Detect private browsing
    this.detectPrivateBrowsing();

    // Check storage availability
    this.checkStorageAvailability();

    console.log("🔍 Safari Compatibility Check:", {
      isSafari: this.isSafari,
      isIOS: this.isIOS,
      isPrivateBrowsing: this.isPrivateBrowsing,
      storageAvailable: this.storageAvailable,
    });
  }

  private detectPrivateBrowsing() {
    try {
      // Test localStorage
      const testKey = "__test_private_browsing__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      this.isPrivateBrowsing = false;
    } catch (error) {
      this.isPrivateBrowsing = true;
    }
  }

  private checkStorageAvailability() {
    try {
      // Test localStorage
      const testKey = "__test_storage__";
      localStorage.setItem(testKey, "test");
      localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      // Test sessionStorage
      sessionStorage.setItem(testKey, "test");
      sessionStorage.getItem(testKey);
      sessionStorage.removeItem(testKey);

      this.storageAvailable = true;
    } catch (error) {
      this.storageAvailable = false;
    }
  }

  /**
   * Safe Firebase operation wrapper
   */
  async safeFirebaseOperation<T>(
    operation: () => Promise<T>,
    fallback?: T,
  ): Promise<T | null> {
    try {
      // Add delay for iOS Safari to settle
      if (this.isIOS) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const result = await operation();
      return result;
    } catch (error: any) {
      console.warn("🍎 Safari Firebase operation failed:", error);

      // Handle specific Safari errors
      if (this.isSafariSpecificError(error)) {
        console.log("🔄 Attempting Safari-specific retry...");
        return this.retrySafariOperation(operation, fallback);
      }

      return fallback ?? null;
    }
  }

  private isSafariSpecificError(error: any): boolean {
    const safariErrors = [
      "unavailable",
      "deadline-exceeded",
      "internal",
      "permission-denied",
      "failed-precondition",
    ];

    return safariErrors.some(
      (errorCode) =>
        error.code?.includes(errorCode) ||
        error.message?.toLowerCase().includes(errorCode),
    );
  }

  private async retrySafariOperation<T>(
    operation: () => Promise<T>,
    fallback?: T,
    maxRetries: number = 3,
  ): Promise<T | null> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));

        console.log(`🔄 Safari retry attempt ${attempt}/${maxRetries}`);
        const result = await operation();
        console.log(`✅ Safari retry ${attempt} succeeded`);
        return result;
      } catch (error) {
        if (attempt === maxRetries) {
          console.error(`❌ Safari retry ${attempt} failed (final):`, error);
          break;
        }
        console.warn(`⚠️ Safari retry ${attempt} failed:`, error);
      }
    }

    return fallback ?? null;
  }

  /**
   * Safe storage operations
   */
  safeLocalStorageGet(key: string, defaultValue?: string): string | null {
    if (!this.storageAvailable) {
      console.warn("📱 LocalStorage not available, using fallback");
      return defaultValue ?? null;
    }

    try {
      return localStorage.getItem(key) ?? defaultValue ?? null;
    } catch (error) {
      console.warn("📱 LocalStorage get failed:", error);
      return defaultValue ?? null;
    }
  }

  safeLocalStorageSet(key: string, value: string): boolean {
    if (!this.storageAvailable) {
      console.warn("📱 LocalStorage not available, skipping set");
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn("📱 LocalStorage set failed:", error);
      return false;
    }
  }

  /**
   * Get compatibility status
   */
  getCompatibilityStatus() {
    const issues: string[] = [];
    const warnings: string[] = [];

    if (this.isPrivateBrowsing) {
      issues.push("Modo de navegação privada detectado - storage limitado");
    }

    if (!this.storageAvailable) {
      issues.push("Storage não disponível - funcionalidade limitada");
    }

    if (this.isIOS && this.isSafari) {
      warnings.push("iOS Safari detectado - usando compatibilidade especial");
    }

    return {
      compatible: issues.length === 0,
      issues,
      warnings,
      environment: {
        isSafari: this.isSafari,
        isIOS: this.isIOS,
        isPrivateBrowsing: this.isPrivateBrowsing,
        storageAvailable: this.storageAvailable,
      },
    };
  }

  /**
   * Apply Safari-specific Firebase configuration
   */
  getSafariOptimizedFirebaseConfig() {
    const baseConfig = {
      apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
      authDomain: "leiria-1cfc9.firebaseapp.com",
      projectId: "leiria-1cfc9",
      storageBucket: "leiria-1cfc9.firebasestorage.app",
      messagingSenderId: "632599887141",
      appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
    };

    // Safari-specific optimizations
    if (this.isSafari || this.isIOS) {
      return {
        ...baseConfig,
        // Add Safari-specific settings if needed
        experimentalForceLongPolling: true, // For better iOS compatibility
      };
    }

    return baseConfig;
  }
}

export const safariCompatibility = SafariCompatibilityService.getInstance();
export default SafariCompatibilityService;
