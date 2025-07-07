// 🛡️ ENHANCED DATA PROTECTION SERVICE
// Proteção contra perda de dados quando editam no Builder.io

export class EnhancedDataProtection {
  private static instance: EnhancedDataProtection;
  private criticalKeys = ["works", "pools", "maintenance", "clients"];
  private isMonitoring = false;

  public static getInstance(): EnhancedDataProtection {
    if (!EnhancedDataProtection.instance) {
      EnhancedDataProtection.instance = new EnhancedDataProtection();
    }
    return EnhancedDataProtection.instance;
  }

  constructor() {
    this.initializeProtection();
  }

  private initializeProtection() {
    if (this.isMonitoring) return;

    console.log("🛡️ ENHANCED DATA PROTECTION ACTIVATED");

    // Create initial backup
    this.createEmergencyBackup("initialization");

    // Monitor for data changes and Builder.io events
    this.setupBuilderIoProtection();
    this.setupStorageProtection();
    this.setupPageProtection();

    this.isMonitoring = true;
  }

  private setupBuilderIoProtection() {
    // Monitor for Builder.io activity
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // Check if Builder.io editor is loaded
          const builderElements =
            document.querySelectorAll("[data-builder-io]");
          if (builderElements.length > 0) {
            console.log("🚨 BUILDER.IO DETECTED - Creating protective backup");
            this.createEmergencyBackup("builder_io_detected");
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Monitor for URL changes that might indicate Builder.io editing
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        if (
          url.includes("builder.io") ||
          url.includes("edit") ||
          url.includes("preview")
        ) {
          console.log("🚨 EDITING MODE DETECTED - Creating protective backup");
          this.createEmergencyBackup("editing_mode_detected");
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }

  private setupStorageProtection() {
    // Override localStorage methods to protect data
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;

    localStorage.setItem = (key: string, value: string) => {
      if (this.criticalKeys.includes(key)) {
        console.log(`🛡️ PROTECTING: ${key} being modified`);
        this.createBackup(key, this.getData(key), "before_modification");

        // Validate new data
        try {
          const newData = JSON.parse(value);
          const currentData = this.getData(key);

          // Prevent empty overwrites
          if (
            Array.isArray(newData) &&
            newData.length === 0 &&
            currentData.length > 0
          ) {
            console.error(
              `🚨 BLOCKED: Attempt to clear ${key} with ${currentData.length} items!`,
            );
            alert(
              `PROTEÇÃO ATIVADA: Tentativa de apagar ${key} foi bloqueada automaticamente!`,
            );
            return;
          }
        } catch (error) {
          console.error(`🚨 BLOCKED: Invalid data for ${key}`, error);
          return;
        }
      }
      return originalSetItem.call(localStorage, key, value);
    };

    localStorage.removeItem = (key: string) => {
      if (this.criticalKeys.includes(key)) {
        console.log(`🛡️ BLOCKING: Attempt to remove critical key ${key}`);
        this.createBackup(key, this.getData(key), "before_removal");
        alert(`PROTEÇÃO ATIVADA: Remoção de ${key} foi bloqueada!`);
        return;
      }
      return originalRemoveItem.call(localStorage, key);
    };

    localStorage.clear = () => {
      console.log("🚨 BLOCKING: Attempt to clear all localStorage");
      this.createEmergencyBackup("before_clear_attempt");
      alert(
        "PROTEÇÃO ATIVADA: Limpeza completa do localStorage foi bloqueada!",
      );
      return;
    };
  }

  private setupPageProtection() {
    // Create backups before page navigation
    window.addEventListener("beforeunload", () => {
      this.createEmergencyBackup("page_unload");
    });

    // Monitor for suspicious activity
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.createEmergencyBackup("page_hidden");
      }
    });

    // Create periodic backups
    setInterval(() => {
      this.createEmergencyBackup("periodic");
    }, 30000); // Every 30 seconds
  }

  private getData(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  private createBackup(key: string, data: any[], reason: string) {
    try {
      const timestamp = Date.now();
      const backupKey = `${key}_backup_${timestamp}_${reason}`;

      localStorage.setItem(
        backupKey,
        JSON.stringify({
          data,
          timestamp: new Date().toISOString(),
          reason,
          count: data.length,
        }),
      );

      console.log(`💾 BACKUP CREATED: ${backupKey} (${data.length} items)`);
    } catch (error) {
      console.error(`Failed to create backup for ${key}:`, error);
    }
  }

  private createEmergencyBackup(reason: string) {
    try {
      const allData: Record<string, any[]> = {};
      let totalItems = 0;

      this.criticalKeys.forEach((key) => {
        const data = this.getData(key);
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
          `🚨 EMERGENCY BACKUP: ${emergencyKey} (${totalItems} items) - ${reason}`,
        );
      }
    } catch (error) {
      console.error("Failed to create emergency backup:", error);
    }
  }

  public restoreFromBackup(): boolean {
    try {
      // Find most recent emergency backup
      const backupKeys = Object.keys(localStorage)
        .filter((key) => key.startsWith("emergency_backup_"))
        .sort()
        .reverse();

      if (backupKeys.length === 0) {
        console.error("No emergency backups found");
        return false;
      }

      const latestBackup = localStorage.getItem(backupKeys[0]);
      if (!latestBackup) return false;

      const backup = JSON.parse(latestBackup);

      // Restore each collection
      this.criticalKeys.forEach((key) => {
        if (
          backup[key] &&
          Array.isArray(backup[key]) &&
          backup[key].length > 0
        ) {
          localStorage.setItem(key, JSON.stringify(backup[key]));
          console.log(`✅ RESTORED: ${key} (${backup[key].length} items)`);
        }
      });

      alert(
        `DADOS RESTAURADOS com sucesso! Total de ${backup.totalItems} itens recuperados.`,
      );
      return true;
    } catch (error) {
      console.error("Failed to restore from backup:", error);
      return false;
    }
  }

  public getProtectionStatus() {
    const backups = Object.keys(localStorage).filter(
      (key) => key.includes("_backup_") || key.includes("emergency_backup_"),
    );

    const status = {
      protected: this.isMonitoring,
      backupsCount: backups.length,
      criticalData: {} as Record<string, number>,
    };

    this.criticalKeys.forEach((key) => {
      status.criticalData[key] = this.getData(key).length;
    });

    return status;
  }
}

// Auto-initialize enhanced protection
if (typeof window !== "undefined") {
  const protection = EnhancedDataProtection.getInstance();

  // Make restore function globally available for emergency recovery
  (window as any).emergencyDataRestore = () => {
    return protection.restoreFromBackup();
  };

  // Make status check globally available
  (window as any).dataProtectionStatus = () => {
    return protection.getProtectionStatus();
  };
}

export const enhancedDataProtection = EnhancedDataProtection.getInstance();
