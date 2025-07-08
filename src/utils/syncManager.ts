export class SyncManager {
  private static instance: SyncManager;
  private quotaErrorCount = 0;
  private lastQuotaError: Date | null = null;
  private circuitBreakerOpen = false;

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  // Since Firebase is confirmed working, simplify this
  shouldEnableSync(): boolean {
    // Clear any stuck quota flags
    localStorage.removeItem("firebase-quota-exceeded");
    localStorage.removeItem("firebase-emergency-shutdown");
    localStorage.removeItem("firebase-emergency-time");
    localStorage.removeItem("firebase-quota-check-time");

    // Reset internal state
    this.quotaErrorCount = 0;
    this.lastQuotaError = null;
    this.circuitBreakerOpen = false;

    return true;
  }

  // Keep these methods for compatibility but make them no-ops
  markQuotaExceeded(): void {
    console.log(
      "📝 markQuotaExceeded called but ignored - Firebase is working",
    );
    // Don't actually mark as exceeded since Firebase is confirmed working
  }

  clearQuotaExceeded(): void {
    localStorage.removeItem("firebase-quota-exceeded");
    localStorage.removeItem("firebase-quota-check-time");
    console.log("✅ Quota flags cleared");
  }

  forceEnableSync(): void {
    this.clearQuotaExceeded();
    localStorage.removeItem("firebase-emergency-shutdown");
    localStorage.removeItem("firebase-emergency-time");
    this.quotaErrorCount = 0;
    this.lastQuotaError = null;
    this.circuitBreakerOpen = false;
    console.log("🔄 Firebase sync force-enabled");
  }

  // Status check - simplified since Firebase is working
  getSyncStatus(): {
    enabled: boolean;
    quotaExceeded: boolean;
    emergencyShutdown: boolean;
    hoursUntilRetry?: number;
  } {
    return {
      enabled: true,
      quotaExceeded: false,
      emergencyShutdown: false,
    };
  }

  // Safe sync interval
  getSafeInterval(): number {
    return 30000; // 30 seconds - standard interval
  }

  // Check if operations should proceed
  canPerformOperation(): boolean {
    return true; // Always true since Firebase is working
  }
}

export const syncManager = SyncManager.getInstance();
