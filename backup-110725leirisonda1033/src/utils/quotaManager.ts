/**
 * Quota Manager - Intelligent Firebase quota management
 *
 * This utility helps prevent Firebase quota exceeded errors by:
 * - Tracking quota usage patterns
 * - Implementing exponential backoff
 * - Managing cooldown periods
 * - Providing quota-aware operation scheduling
 */

interface QuotaUsage {
  timestamp: number;
  operation: string;
  success: boolean;
  errorType?: string;
}

export class QuotaManager {
  private static readonly QUOTA_KEY = "firebase-quota-exceeded";
  private static readonly USAGE_HISTORY_KEY = "firebase-usage-history";
  private static readonly COOLDOWN_PERIODS = {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 15 * 60 * 1000, // 15 minutes
    LONG: 30 * 60 * 1000, // 30 minutes
    EXTENDED: 60 * 60 * 1000, // 1 hour
  };

  /**
   * Check if Firebase is currently in quota cooldown
   */
  static isInCooldown(): boolean {
    const quotaFlag = localStorage.getItem(this.QUOTA_KEY);
    if (!quotaFlag) return false;

    const quotaTime = parseInt(quotaFlag);
    const cooldownPeriod = this.getCooldownPeriod();

    return Date.now() - quotaTime < cooldownPeriod;
  }

  /**
   * Mark quota as exceeded with intelligent cooldown
   */
  static markQuotaExceeded(operation?: string): void {
    const now = Date.now();
    localStorage.setItem(this.QUOTA_KEY, now.toString());

    this.recordUsage(operation || "unknown", false, "quota-exceeded");

    console.warn(
      `🚨 Firebase quota exceeded - cooldown activated for ${this.getCooldownPeriod() / 60000} minutes`,
    );
  }

  /**
   * Clear quota exceeded flag
   */
  static clearQuotaFlag(): void {
    localStorage.removeItem(this.QUOTA_KEY);
    console.log("✅ Firebase quota flag cleared");
  }

  /**
   * Get appropriate cooldown period based on usage history
   */
  private static getCooldownPeriod(): number {
    const history = this.getUsageHistory();
    const recentFailures = history.filter(
      (usage) =>
        !usage.success &&
        usage.errorType === "quota-exceeded" &&
        Date.now() - usage.timestamp < 24 * 60 * 60 * 1000, // Last 24 hours
    );

    // Exponential backoff based on recent failures
    if (recentFailures.length >= 5) return this.COOLDOWN_PERIODS.EXTENDED;
    if (recentFailures.length >= 3) return this.COOLDOWN_PERIODS.LONG;
    if (recentFailures.length >= 2) return this.COOLDOWN_PERIODS.MEDIUM;
    return this.COOLDOWN_PERIODS.SHORT;
  }

  /**
   * Record operation usage for quota analysis
   */
  static recordUsage(
    operation: string,
    success: boolean,
    errorType?: string,
  ): void {
    const usage: QuotaUsage = {
      timestamp: Date.now(),
      operation,
      success,
      errorType,
    };

    const history = this.getUsageHistory();
    history.push(usage);

    // Keep only last 100 entries
    const trimmedHistory = history.slice(-100);
    localStorage.setItem(
      this.USAGE_HISTORY_KEY,
      JSON.stringify(trimmedHistory),
    );
  }

  /**
   * Get usage history for analysis
   */
  private static getUsageHistory(): QuotaUsage[] {
    try {
      const history = localStorage.getItem(this.USAGE_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.warn("Error loading usage history:", error);
      return [];
    }
  }

  /**
   * Get quota status and recommendations
   */
  static getQuotaStatus(): {
    inCooldown: boolean;
    cooldownRemaining: number;
    recommendedAction: string;
    canSync: boolean;
    usageStats: {
      recentFailures: number;
      recentOperations: number;
      successRate: number;
    };
  } {
    const inCooldown = this.isInCooldown();
    const history = this.getUsageHistory();
    const recentHistory = history.filter(
      (usage) => Date.now() - usage.timestamp < 60 * 60 * 1000, // Last hour
    );

    const recentFailures = recentHistory.filter(
      (usage) => !usage.success,
    ).length;
    const successRate =
      recentHistory.length > 0
        ? (recentHistory.filter((usage) => usage.success).length /
            recentHistory.length) *
          100
        : 100;

    let cooldownRemaining = 0;
    if (inCooldown) {
      const quotaTime = parseInt(localStorage.getItem(this.QUOTA_KEY) || "0");
      const cooldownPeriod = this.getCooldownPeriod();
      cooldownRemaining = Math.max(
        0,
        cooldownPeriod - (Date.now() - quotaTime),
      );
    }

    let recommendedAction = "Normal operation";
    if (inCooldown) {
      recommendedAction = `Wait ${Math.ceil(cooldownRemaining / 60000)} minutes before retrying`;
    } else if (successRate < 50) {
      recommendedAction = "Reduce sync frequency - high failure rate detected";
    } else if (recentFailures > 3) {
      recommendedAction = "Use caution - multiple recent failures";
    }

    return {
      inCooldown,
      cooldownRemaining,
      recommendedAction,
      canSync: !inCooldown && successRate > 30,
      usageStats: {
        recentFailures,
        recentOperations: recentHistory.length,
        successRate,
      },
    };
  }

  /**
   * Wrapper for quota-aware Firebase operations
   */
  static async executeWithQuotaProtection<T>(
    operation: () => Promise<T>,
    operationName: string,
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    const status = this.getQuotaStatus();

    if (!status.canSync) {
      return {
        success: false,
        error: `Operation blocked: ${status.recommendedAction}`,
      };
    }

    try {
      const data = await operation();
      this.recordUsage(operationName, true);
      return { success: true, data };
    } catch (error: any) {
      const isQuotaError =
        error.message?.includes("quota") ||
        error.message?.includes("resource-exhausted");

      if (isQuotaError) {
        this.markQuotaExceeded(operationName);
      } else {
        this.recordUsage(operationName, false, error.code || "unknown-error");
      }

      return {
        success: false,
        error: error.message || "Operation failed",
      };
    }
  }

  /**
   * Get optimal sync interval based on current quota status
   */
  static getOptimalSyncInterval(): number {
    const status = this.getQuotaStatus();
    const baseInterval = 5 * 60 * 1000; // 5 minutes

    if (status.inCooldown) {
      return baseInterval * 6; // 30 minutes during cooldown
    }

    if (status.usageStats.successRate < 50) {
      return baseInterval * 4; // 20 minutes if low success rate
    }

    if (status.usageStats.recentFailures > 2) {
      return baseInterval * 2; // 10 minutes if recent failures
    }

    return baseInterval; // 5 minutes for normal operation
  }

  /**
   * Clean up old usage history
   */
  static cleanupHistory(): void {
    const history = this.getUsageHistory();
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days

    const cleanHistory = history.filter((usage) => usage.timestamp > cutoff);
    localStorage.setItem(this.USAGE_HISTORY_KEY, JSON.stringify(cleanHistory));

    console.log(
      `🧹 Cleaned usage history: ${history.length - cleanHistory.length} old entries removed`,
    );
  }
}

export default QuotaManager;
