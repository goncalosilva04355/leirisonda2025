// Critical Firebase quota protection utility

export const syncManager = {
  // Emergency quota tracking
  quotaErrorCount: 0,
  lastQuotaError: null as Date | null,
  circuitBreakerOpen: false,

  // Check if sync should be enabled based on quota status
  shouldEnableSync(): boolean {
    const quotaExceeded = localStorage.getItem("firebase-quota-exceeded");
    const lastQuotaCheck = localStorage.getItem("firebase-quota-check-time");
    const emergencyShutdown = localStorage.getItem(
      "firebase-emergency-shutdown",
    );

    // EMERGENCY SHUTDOWN - completely disable if triggered
    if (emergencyShutdown === "true") {
      console.error(
        "🚨 EMERGENCY SHUTDOWN ACTIVE - All Firebase operations disabled",
      );
      return false;
    }

    // If quota was exceeded, wait much longer
    if (quotaExceeded === "true" && lastQuotaCheck) {
      const lastCheck = new Date(lastQuotaCheck);
      const now = new Date();
      const hoursElapsed =
        (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);

      // Wait 24 hours after quota exceeded (increased from 4 hours)
      if (hoursElapsed < 24) {
        console.log(
          `🔥 Quota exceeded - waiting ${Math.ceil(24 - hoursElapsed)} more hours`,
        );
        return false;
      } else {
        this.clearQuotaExceeded();
        return false; // Still return false for extra safety
      }
    }

    // Circuit breaker check
    if (this.circuitBreakerOpen) {
      const now = Date.now();
      const timeSinceLastError = this.lastQuotaError
        ? now - this.lastQuotaError.getTime()
        : Infinity;

      // Keep circuit breaker open for 2 hours after quota error
      if (timeSinceLastError < 2 * 60 * 60 * 1000) {
        console.log("⚡ Circuit breaker OPEN - Firebase operations blocked");
        return false;
      } else {
        this.circuitBreakerOpen = false;
        this.quotaErrorCount = 0;
      }
    }

    // Force clear all quota flags since quota was increased
    this.clearQuotaExceeded();
    localStorage.removeItem("firebase-emergency-shutdown");
    localStorage.removeItem("firebase-emergency-time");
    this.circuitBreakerOpen = false;
    this.quotaErrorCount = 0;

    return true; // Reactivated after quota increase confirmed
  },

  // Mark quota as exceeded with emergency measures
  markQuotaExceeded(): void {
    this.quotaErrorCount++;
    this.lastQuotaError = new Date();

    localStorage.setItem("firebase-quota-exceeded", "true");
    localStorage.setItem("firebase-quota-check-time", new Date().toISOString());

    // Trigger emergency shutdown if repeated quota errors
    if (this.quotaErrorCount >= 3) {
      this.triggerEmergencyShutdown();
    } else {
      this.circuitBreakerOpen = true;
    }

    console.error(
      `🚨 Firebase quota exceeded (${this.quotaErrorCount}/3) - sync disabled for 24 hours`,
    );

    // Broadcast emergency message
    window.dispatchEvent(
      new CustomEvent("firebase-quota-exceeded", {
        detail: {
          count: this.quotaErrorCount,
          emergency: this.quotaErrorCount >= 3,
        },
      }),
    );
  },

  // Emergency shutdown
  triggerEmergencyShutdown(): void {
    localStorage.setItem("firebase-emergency-shutdown", "true");
    localStorage.setItem("firebase-emergency-time", new Date().toISOString());
    this.circuitBreakerOpen = true;

    console.error(
      "🚨🚨🚨 EMERGENCY SHUTDOWN ACTIVATED - All Firebase operations stopped",
    );

    // Notify user
    alert(
      "⚠️ FIREBASE QUOTA CRITICAL: Sistema pausado para prevenir bloqueio permanente. Contacte o administrador.",
    );
  },

  // Manual recovery (admin only)
  manualRecovery(): boolean {
    const confirm = window.confirm(
      "⚠️ ATENÇÃO: Reativar Firebase após quota excedida pode causar bloqueio permanente. Continuar apenas se a quota foi renovada. Continuar?",
    );

    if (confirm) {
      this.clearQuotaExceeded();
      localStorage.removeItem("firebase-emergency-shutdown");
      localStorage.removeItem("firebase-emergency-time");
      this.circuitBreakerOpen = false;
      this.quotaErrorCount = 0;

      console.log("🔄 Manual recovery initiated - Firebase re-enabled");
      return true;
    }

    return false;
  },

  // Clear quota exceeded flag
  clearQuotaExceeded(): void {
    localStorage.removeItem("firebase-quota-exceeded");
    localStorage.removeItem("firebase-quota-check-time");
    console.log("✅ Firebase quota flag cleared");
  },

  // Get current sync status
  getSyncStatus(): {
    enabled: boolean;
    quotaExceeded: boolean;
    emergencyShutdown: boolean;
    hoursUntilRetry?: number;
    errorCount: number;
  } {
    const quotaExceeded =
      localStorage.getItem("firebase-quota-exceeded") === "true";
    const emergencyShutdown =
      localStorage.getItem("firebase-emergency-shutdown") === "true";
    const lastQuotaCheck = localStorage.getItem("firebase-quota-check-time");

    let hoursUntilRetry;
    if (quotaExceeded && lastQuotaCheck) {
      const lastCheck = new Date(lastQuotaCheck);
      const now = new Date();
      const hoursElapsed =
        (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);
      hoursUntilRetry = Math.max(0, 24 - hoursElapsed);
    }

    return {
      enabled: this.shouldEnableSync(),
      quotaExceeded,
      emergencyShutdown,
      hoursUntilRetry: hoursUntilRetry ? Math.ceil(hoursUntilRetry) : undefined,
      errorCount: this.quotaErrorCount,
    };
  },

  // Safe sync intervals with quota protection
  getSafeInterval(): number {
    const status = this.getSyncStatus();

    if (status.quotaExceeded || status.emergencyShutdown) {
      return 0; // No sync when quota exceeded
    }

    // Conservative but functional interval for paid plan
    return 60000; // 1 minute - safe for increased quota
  },

  // Check if Firebase operations should be allowed
  isFirebaseOperationAllowed(): boolean {
    const status = this.getSyncStatus();
    return (
      !status.quotaExceeded &&
      !status.emergencyShutdown &&
      !this.circuitBreakerOpen
    );
  },

  // Perform full sync (method needed by components)
  async performFullSync(): Promise<boolean> {
    if (!this.isFirebaseOperationAllowed()) {
      console.warn("Firebase operations not allowed - skipping full sync");
      return false;
    }

    try {
      console.log("🔄 Performing full sync...");
      // Placeholder for full sync logic
      return true;
    } catch (error) {
      console.error("❌ Error during full sync:", error);
      return false;
    }
  },
};
