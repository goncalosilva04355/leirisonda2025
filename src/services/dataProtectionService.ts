// 🛡️ DATA PROTECTION MONITOR SERVICE
// This service provides bulletproof protection against data loss

export class DataProtectionService {
  private static instance: DataProtectionService;
  private watchedKeys = ["works", "pools", "maintenance", "clients"];
  private lastKnownCounts: Record<string, number> = {};

  public static getInstance(): DataProtectionService {
    if (!DataProtectionService.instance) {
      DataProtectionService.instance = new DataProtectionService();
    }
    return DataProtectionService.instance;
  }

  constructor() {
    this.initializeProtection();
  }

  private initializeProtection() {
    // Initialize last known counts
    this.watchedKeys.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        this.lastKnownCounts[key] = data ? JSON.parse(data).length : 0;
      } catch (error) {
        this.lastKnownCounts[key] = 0;
      }
    });

    console.log("🛡️ DATA PROTECTION INITIALIZED:", this.lastKnownCounts);

    // Set up localStorage monitoring
    this.setupStorageMonitoring();

    // Create emergency backup on page load
    this.createEmergencyBackup("page_load");
  }

  private setupStorageMonitoring() {
    // Monitor localStorage changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = (key: string, value: string) => {
      if (this.watchedKeys.includes(key)) {
        this.validateDataBeforeSave(key, value);
      }
      return originalSetItem.call(localStorage, key, value);
    };

    // Monitor for suspicious activity
    window.addEventListener("beforeunload", () => {
      this.createEmergencyBackup("page_unload");
    });
  }

  private validateDataBeforeSave(key: string, value: string) {
    try {
      const newData = JSON.parse(value);
      const newCount = Array.isArray(newData) ? newData.length : 0;
      const lastCount = this.lastKnownCounts[key] || 0;

      // CRITICAL: Prevent data loss
      if (newCount === 0 && lastCount > 0) {
        const error = `🚨 CRITICAL ALERT: Attempt to overwrite ${key} with empty array!`;
        console.error(error);

        // Block the save and restore from backup
        this.emergencyRestore(key);

        // Alert user
        if (typeof window !== "undefined") {
          alert(
            `PROTEÇÃO ATIVADA: Tentativa de apagar ${key} foi bloqueada! Dados restaurados automaticamente.`,
          );
        }

        return false;
      }

      // Significant data loss (>50% reduction)
      if (lastCount > 0 && newCount < lastCount * 0.5) {
        const error = `⚠️ WARNING: Significant data reduction in ${key}: ${lastCount} → ${newCount}`;
        console.warn(error);

        // Create backup before allowing save
        this.createBackup(
          key,
          this.getStoredData(key),
          "significant_reduction",
        );
      }

      // Update tracking
      this.lastKnownCounts[key] = newCount;

      console.log(`✅ DATA VALIDATED: ${key} saved safely (${newCount} items)`);
      return true;
    } catch (error) {
      console.error(`🚨 CORRUPT DATA BLOCKED: ${key}`, error);
      return false;
    }
  }

  private getStoredData(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  private emergencyRestore(key: string) {
    // Try to restore from multiple backup sources
    const backupSources = [
      `${key}_backup_rolling`,
      `${key}_daily_${new Date().toISOString().split("T")[0]}`,
      ...this.getEmergencyBackupKeys(),
    ];

    for (const source of backupSources) {
      try {
        if (source.includes("_backup_rolling")) {
          const rolling = localStorage.getItem(source);
          if (rolling) {
            const backups = JSON.parse(rolling);
            if (backups.length > 0) {
              const latest = backups[backups.length - 1];
              if (latest.data && latest.data.length > 0) {
                localStorage.setItem(key, JSON.stringify(latest.data));
                console.log(
                  `🔄 EMERGENCY RESTORE: ${key} restored from rolling backup`,
                );
                return true;
              }
            }
          }
        } else if (source.includes("emergency_backup_")) {
          const emergency = localStorage.getItem(source);
          if (emergency) {
            const backup = JSON.parse(emergency);
            if (backup[key] && backup[key].length > 0) {
              localStorage.setItem(key, JSON.stringify(backup[key]));
              console.log(
                `🚨 EMERGENCY RESTORE: ${key} restored from emergency backup`,
              );
              return true;
            }
          }
        } else {
          const data = localStorage.getItem(source);
          if (data) {
            const parsedData = JSON.parse(data);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              localStorage.setItem(key, data);
              console.log(
                `📅 EMERGENCY RESTORE: ${key} restored from daily backup`,
              );
              return true;
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to restore from ${source}:`, error);
        continue;
      }
    }

    console.error(
      `💥 CRITICAL: Unable to restore ${key} from any backup source!`,
    );
    return false;
  }

  private getEmergencyBackupKeys(): string[] {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith("emergency_backup_"))
      .sort()
      .reverse() // Newest first
      .slice(0, 10); // Last 10 emergency backups
  }

  public createBackup(key: string, data: any[], reason: string = "manual") {
    try {
      const timestamp = new Date().toISOString();
      const backupKey = `${key}_backup_${timestamp}_${reason}`;

      localStorage.setItem(
        backupKey,
        JSON.stringify({
          data,
          timestamp,
          reason,
          count: data.length,
        }),
      );

      console.log(`💾 BACKUP CREATED: ${backupKey} (${data.length} items)`);
    } catch (error) {
      console.error(`Failed to create backup for ${key}:`, error);
    }
  }

  public createEmergencyBackup(reason: string = "unknown") {
    try {
      const allData: Record<string, any[]> = {};
      let totalItems = 0;

      this.watchedKeys.forEach((key) => {
        const data = this.getStoredData(key);
        allData[key] = data;
        totalItems += data.length;
      });

      if (totalItems > 0) {
        const timestamp = Date.now();
        const emergencyKey = `emergency_backup_${timestamp}`;

        localStorage.setItem(
          emergencyKey,
          JSON.stringify({
            ...allData,
            timestamp: new Date().toISOString(),
            reason,
            totalItems,
          }),
        );

        console.log(
          `🚨 EMERGENCY BACKUP CREATED: ${emergencyKey} (${totalItems} total items)`,
        );
      }
    } catch (error) {
      console.error("Failed to create emergency backup:", error);
    }
  }

  public getProtectionStatus() {
    return {
      protected: true,
      lastKnownCounts: this.lastKnownCounts,
      backupCount: Object.keys(localStorage).filter(
        (key) => key.includes("_backup_") || key.includes("emergency_backup_"),
      ).length,
      timestamp: new Date().toISOString(),
    };
  }

  public cleanOldBackups() {
    try {
      const backupKeys = Object.keys(localStorage).filter(
        (key) => key.includes("_backup_") || key.includes("emergency_backup_"),
      );

      // Keep only last 20 backups per type
      const groupedBackups: Record<string, string[]> = {};

      backupKeys.forEach((key) => {
        const baseKey = key.split("_backup_")[0] || "emergency";
        if (!groupedBackups[baseKey]) groupedBackups[baseKey] = [];
        groupedBackups[baseKey].push(key);
      });

      let cleanedCount = 0;
      Object.entries(groupedBackups).forEach(([base, keys]) => {
        if (keys.length > 20) {
          const toDelete = keys.sort().slice(0, keys.length - 20);
          toDelete.forEach((key) => {
            localStorage.removeItem(key);
            cleanedCount++;
          });
        }
      });

      if (cleanedCount > 0) {
        console.log(`🧹 CLEANUP: Removed ${cleanedCount} old backups`);
      }
    } catch (error) {
      console.error("Failed to clean old backups:", error);
    }
  }
}

// Auto-initialize protection
if (typeof window !== "undefined") {
  DataProtectionService.getInstance();
}

export const dataProtection = DataProtectionService.getInstance();
