// Utility to manage Firebase sync settings and quota monitoring

export const syncManager = {
  // Check if sync should be enabled based on quota status
  shouldEnableSync(): boolean {
    const quotaExceeded = localStorage.getItem("firebase-quota-exceeded");
    const lastQuotaCheck = localStorage.getItem("firebase-quota-check-time");
    const manuallyEnabled = localStorage.getItem("firebase-sync-enabled");

    // If manually enabled by user, try to enable
    if (manuallyEnabled === "true") {
      localStorage.removeItem("firebase-sync-enabled");
      return true;
    }

    // If quota was exceeded, check if enough time has passed
    if (quotaExceeded === "true" && lastQuotaCheck) {
      const lastCheck = new Date(lastQuotaCheck);
      const now = new Date();
      const hoursElapsed =
        (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);

      // Wait at least 4 hours before trying again
      if (hoursElapsed < 4) {
        console.log(
          `🔥 Quota exceeded - waiting ${Math.ceil(4 - hoursElapsed)} more hours`,
        );
        return false;
      } else {
        // Clear quota exceeded flag and try again
        this.clearQuotaExceeded();
        return true;
      }
    }

    return true;
  },

  // Mark quota as exceeded
  markQuotaExceeded(): void {
    localStorage.setItem("firebase-quota-exceeded", "true");
    localStorage.setItem("firebase-quota-check-time", new Date().toISOString());
    console.error("🚨 Firebase quota exceeded - sync disabled for 4 hours");
  },

  // Clear quota exceeded flag
  clearQuotaExceeded(): void {
    localStorage.removeItem("firebase-quota-exceeded");
    localStorage.removeItem("firebase-quota-check-time");
    console.log("✅ Firebase quota flag cleared - sync can resume");
  },

  // Get current sync status
  getSyncStatus(): {
    enabled: boolean;
    quotaExceeded: boolean;
    hoursUntilRetry?: number;
  } {
    const quotaExceeded =
      localStorage.getItem("firebase-quota-exceeded") === "true";
    const lastQuotaCheck = localStorage.getItem("firebase-quota-check-time");

    if (quotaExceeded && lastQuotaCheck) {
      const lastCheck = new Date(lastQuotaCheck);
      const now = new Date();
      const hoursElapsed =
        (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);
      const hoursUntilRetry = Math.max(0, 4 - hoursElapsed);

      return {
        enabled: false,
        quotaExceeded: true,
        hoursUntilRetry: Math.ceil(hoursUntilRetry),
      };
    }

    return {
      enabled: this.shouldEnableSync(),
      quotaExceeded: false,
    };
  },

  // Conservative sync intervals based on quota status
  getSafeInterval(): number {
    const status = this.getSyncStatus();

    if (status.quotaExceeded) {
      return 0; // No sync
    }

    // Very conservative intervals to prevent quota issues
    return 10 * 60 * 1000; // 10 minutes minimum
  },
};
