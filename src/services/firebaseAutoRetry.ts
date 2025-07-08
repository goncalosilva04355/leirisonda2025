import {
  getFirebaseStatus,
  reinitializeFirebase,
  waitForFirebaseInit,
} from "../firebase/config";

class FirebaseAutoRetryService {
  private retryInterval: number = 30000; // 30 seconds
  private maxRetries: number = 10;
  private currentRetries: number = 0;
  private isRetrying: boolean = false;
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    // Initial Firebase check
    this.checkAndRetryConnection();

    // Set up periodic monitoring
    setInterval(() => {
      if (!this.isRetrying) {
        this.checkAndRetryConnection();
      }
    }, this.retryInterval);

    // Monitor network connectivity
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        console.log("🌐 Network restored - attempting Firebase reconnection");
        this.resetRetryCount();
        this.attemptReconnection();
      });

      window.addEventListener("offline", () => {
        console.log("📱 Network lost - Firebase auto-retry paused");
        this.stopRetrying();
      });
    }
  }

  private async checkAndRetryConnection() {
    const status = getFirebaseStatus();

    // If Firebase is not ready and we're online, try to reconnect
    if (!status.ready && !status.quotaExceeded && navigator.onLine) {
      if (this.currentRetries < this.maxRetries) {
        await this.attemptReconnection();
      } else {
        console.log(
          "🔄 Firebase auto-retry: Maximum attempts reached, will retry later",
        );
        // Reset after a longer delay
        setTimeout(() => {
          this.resetRetryCount();
        }, 300000); // 5 minutes
      }
    } else if (status.ready && this.currentRetries > 0) {
      // Firebase is now working, reset retry count
      console.log("✅ Firebase connection restored, resetting retry count");
      this.resetRetryCount();
    }
  }

  private async attemptReconnection() {
    if (this.isRetrying) return;

    this.isRetrying = true;
    this.currentRetries++;

    console.log(
      `🔄 Firebase auto-retry attempt ${this.currentRetries}/${this.maxRetries}`,
    );

    try {
      // First try a simple initialization
      const initialized = await waitForFirebaseInit();

      if (!initialized) {
        // If simple init fails, try full reinitialization
        console.log("🔄 Simple init failed, trying full reinitialization...");
        await reinitializeFirebase();
      }

      const status = getFirebaseStatus();
      if (status.ready) {
        console.log("✅ Firebase auto-retry successful!");
        this.resetRetryCount();

        // Dispatch event to notify other components
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("firebase-reconnected", {
              detail: { retryAttempt: this.currentRetries },
            }),
          );
        }
      } else {
        console.log(
          `⚠️ Firebase auto-retry ${this.currentRetries} unsuccessful`,
        );
      }
    } catch (error) {
      console.warn(
        `❌ Firebase auto-retry ${this.currentRetries} failed:`,
        error,
      );
    } finally {
      this.isRetrying = false;
    }
  }

  private resetRetryCount() {
    this.currentRetries = 0;
    this.isRetrying = false;
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }

  private stopRetrying() {
    this.isRetrying = false;
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }

  // Public method to manually trigger retry
  public manualRetry(): Promise<boolean> {
    this.resetRetryCount();
    return this.attemptReconnection().then(() => {
      const status = getFirebaseStatus();
      return status.ready;
    });
  }

  // Get current retry status
  public getRetryStatus() {
    return {
      currentRetries: this.currentRetries,
      maxRetries: this.maxRetries,
      isRetrying: this.isRetrying,
      retryInterval: this.retryInterval,
    };
  }
}

// Create and export singleton instance
export const firebaseAutoRetry = new FirebaseAutoRetryService();
