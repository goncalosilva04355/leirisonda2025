// Firebase Error Monitor - Detect and handle Firebase Auth errors automatically
export class FirebaseErrorMonitor {
  private static instance: FirebaseErrorMonitor;
  private errorCount = 0;
  private lastError: string | null = null;
  private isMonitoring = false;

  static getInstance(): FirebaseErrorMonitor {
    if (!FirebaseErrorMonitor.instance) {
      FirebaseErrorMonitor.instance = new FirebaseErrorMonitor();
    }
    return FirebaseErrorMonitor.instance;
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;

    console.log("🔍 Starting Firebase error monitoring...");
    this.isMonitoring = true;

    // Monitor console errors
    this.interceptConsoleError();

    // Monitor unhandled promise rejections
    this.interceptUnhandledRejections();

    // Monitor window errors
    this.interceptWindowErrors();
  }

  private interceptConsoleError(): void {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args.join(" ");
      this.handleError(errorMessage, "console");
      originalError.apply(console, args);
    };
  }

  private interceptUnhandledRejections(): void {
    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason;
      const errorMessage =
        error?.message || error?.toString() || "Unknown error";
      this.handleError(errorMessage, "unhandledrejection");
    });
  }

  private interceptWindowErrors(): void {
    window.addEventListener("error", (event) => {
      const errorMessage =
        event.message || event.error?.message || "Unknown error";
      this.handleError(errorMessage, "window");
    });
  }

  private handleError(errorMessage: string, source: string): void {
    if (this.isFirebaseAuthError(errorMessage)) {
      this.errorCount++;
      this.lastError = errorMessage;

      console.warn(
        `🚨 Firebase Auth Error #${this.errorCount} (${source}):`,
        errorMessage,
      );

      // Auto-fix if possible
      this.attemptAutoFix(errorMessage);
    }
  }

  private isFirebaseAuthError(message: string): boolean {
    const firebaseErrorPatterns = [
      "checkDestroyed",
      "app-deleted",
      "_FirebaseError",
      "Firebase: Firebase App named",
      "already deleted",
      "auth/app-deleted",
      "firestore/app-deleted",
    ];

    return firebaseErrorPatterns.some((pattern) =>
      message.toLowerCase().includes(pattern.toLowerCase()),
    );
  }

  private async attemptAutoFix(errorMessage: string): Promise<void> {
    console.log("🔧 Attempting auto-fix for Firebase error...");

    try {
      // Clear potential corrupted state
      this.clearCorruptedState();

      // Reinitialize Firebase
      await this.reinitializeFirebase();

      // Show user-friendly notification
      this.showUserNotification();
    } catch (fixError) {
      console.error("❌ Auto-fix failed:", fixError);
      this.showFallbackNotification();
    }
  }

  private clearCorruptedState(): void {
    try {
      // Clear potentially corrupted Firebase state
      const keysToCheck = [
        "firebase:",
        "firebaseLocalStorageDb",
        "__reactInternalMemoizedMaskedChildContext",
      ];

      keysToCheck.forEach((key) => {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const storageKey = localStorage.key(i);
          if (storageKey && storageKey.includes(key)) {
            localStorage.removeItem(storageKey);
          }
        }
      });

      console.log("✅ Cleared potentially corrupted Firebase state");
    } catch (error) {
      console.warn("⚠️ Error clearing state:", error);
    }
  }

  private async reinitializeFirebase(): Promise<void> {
    // Firebase desativado em desenvolvimento
    if (import.meta.env.DEV) {
      console.log("🚫 Firebase reinitialization desativado em desenvolvimento");
      return;
    }

    try {
      const { getFirebaseApp } = await import("../firebase/basicConfig");

      // Check if Firebase is working
      const app = getFirebaseApp();

      if (app) {
        console.log("✅ Firebase reinitialized successfully");
      } else {
        throw new Error("Firebase app not available");
      }
    } catch (error) {
      console.error("❌ Firebase reinitialization failed:", error);
      throw error;
    }
  }

  private showUserNotification(): void {
    const notification = document.createElement("div");
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
      ">
        ✅ Problema de conexão resolvido automaticamente
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  private showFallbackNotification(): void {
    const notification = document.createElement("div");
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f59e0b;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        cursor: pointer;
      ">
        ⚠️ Problema detectado - Clique para recarregar
      </div>
    `;

    notification.addEventListener("click", () => {
      window.location.reload();
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  }

  getErrorStats(): { count: number; lastError: string | null } {
    return {
      count: this.errorCount,
      lastError: this.lastError,
    };
  }

  reset(): void {
    this.errorCount = 0;
    this.lastError = null;
  }
}

// Auto-start monitoring
const monitor = FirebaseErrorMonitor.getInstance();
monitor.startMonitoring();

export const firebaseErrorMonitor = monitor;
export default firebaseErrorMonitor;
