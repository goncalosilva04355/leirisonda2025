// SISTEMA DE PROTEÇÃO CRÍTICA DE DADOS - NUNCA PERDER OBRAS
export class DataProtectionService {
  private static CRITICAL_KEYS = ["works", "pools", "maintenance", "clients"];
  private static MAX_BACKUPS = 10;

  // Backup imediato antes de qualquer operação crítica
  static createEmergencyBackup(): string {
    const timestamp = new Date().toISOString();
    const backupId = `emergency_${Date.now()}`;

    const backup: any = {
      timestamp,
      id: backupId,
      version: "1.0.0",
    };

    // Backup de todos os dados críticos
    this.CRITICAL_KEYS.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          backup[key] = parsed;
          console.log(
            `🔒 EMERGENCY BACKUP: ${key} saved (${parsed.length} items)`,
          );
        }
      } catch (error) {
        console.warn(`⚠️ EMERGENCY BACKUP: Failed to backup ${key}:`, error);
        backup[key] = [];
      }
    });

    // Salvar backup de emergência
    try {
      localStorage.setItem(
        `backup_emergency_${backupId}`,
        JSON.stringify(backup),
      );

      // Manter apenas os últimos 10 backups
      this.cleanupOldBackups();

      console.log(`✅ EMERGENCY BACKUP CREATED: ${backupId}`);
      return backupId;
    } catch (error) {
      console.error("❌ FAILED TO CREATE EMERGENCY BACKUP:", error);
      return "";
    }
  }

  // Restaurar do backup mais recente
  static restoreFromLatestBackup(): boolean {
    console.log("🚨 ATTEMPTING DATA RESTORATION...");

    try {
      // Encontrar o backup mais recente
      const backupKeys = Object.keys(localStorage)
        .filter((key) => key.startsWith("backup_emergency_"))
        .sort()
        .reverse();

      if (backupKeys.length === 0) {
        console.warn("❌ NO EMERGENCY BACKUPS FOUND");
        return false;
      }

      // Tentar restaurar do backup mais recente
      for (const key of backupKeys) {
        try {
          const backup = JSON.parse(localStorage.getItem(key)!);

          // Verificar se o backup tem dados válidos
          let hasData = false;
          for (const dataKey of this.CRITICAL_KEYS) {
            if (backup[dataKey] && backup[dataKey].length > 0) {
              hasData = true;
              break;
            }
          }

          if (!hasData) continue;

          // Restaurar dados
          for (const dataKey of this.CRITICAL_KEYS) {
            if (backup[dataKey]) {
              localStorage.setItem(dataKey, JSON.stringify(backup[dataKey]));
              console.log(
                `✅ RESTORED: ${dataKey} (${backup[dataKey].length} items)`,
              );
            }
          }

          console.log(`🎉 DATA RESTORATION SUCCESSFUL from ${backup.id}`);
          return true;
        } catch (error) {
          console.warn(`⚠️ Failed to restore from ${key}:`, error);
          continue;
        }
      }

      console.error("❌ ALL BACKUP RESTORATION ATTEMPTS FAILED");
      return false;
    } catch (error) {
      console.error("❌ RESTORATION PROCESS FAILED:", error);
      return false;
    }
  }

  // Verificar integridade dos dados
  static checkDataIntegrity(): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    this.CRITICAL_KEYS.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (!data) {
          issues.push(`Missing ${key} data`);
          return;
        }

        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) {
          issues.push(`${key} is not an array`);
        }
      } catch (error) {
        issues.push(`${key} data is corrupted: ${error}`);
      }
    });

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  // Backup contínuo a cada operação
  static safeDataOperation<T>(
    operation: () => T,
    description: string = "data operation",
  ): T {
    // Backup antes da operação
    const backupId = this.createEmergencyBackup();

    try {
      console.log(`🔄 EXECUTING: ${description}`);
      const result = operation();
      console.log(`✅ COMPLETED: ${description}`);
      return result;
    } catch (error) {
      console.error(`❌ FAILED: ${description}`, error);

      // Tentar restaurar em caso de erro
      console.log("🚨 Attempting automatic recovery...");
      this.restoreFromLatestBackup();

      throw error;
    }
  }

  // Limpar backups antigos
  private static cleanupOldBackups(): void {
    try {
      const backupKeys = Object.keys(localStorage)
        .filter((key) => key.startsWith("backup_emergency_"))
        .sort();

      while (backupKeys.length > this.MAX_BACKUPS) {
        const oldestKey = backupKeys.shift()!;
        localStorage.removeItem(oldestKey);
        console.log(`🗑️ Removed old backup: ${oldestKey}`);
      }
    } catch (error) {
      console.warn("⚠️ Failed to cleanup old backups:", error);
    }
  }

  // Forçar sincronização com proteção
  static forceSyncWithProtection(): void {
    this.safeDataOperation(() => {
      // Trigger sync event
      window.dispatchEvent(new CustomEvent("forceSyncWithProtection"));
    }, "Force sync with data protection");
  }

  // Status do sistema de proteção
  static getProtectionStatus(): any {
    const backupKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("backup_emergency_"),
    );

    const integrity = this.checkDataIntegrity();

    return {
      backupsAvailable: backupKeys.length,
      lastBackup:
        backupKeys.length > 0 ? backupKeys[backupKeys.length - 1] : null,
      dataIntegrity: integrity,
      protectionActive: true,
    };
  }
}

// Hook para usar proteção de dados
export const useDataProtection = () => {
  return {
    createEmergencyBackup: DataProtectionService.createEmergencyBackup,
    restoreFromLatestBackup: DataProtectionService.restoreFromLatestBackup,
    checkDataIntegrity: DataProtectionService.checkDataIntegrity,
    safeDataOperation: DataProtectionService.safeDataOperation,
    forceSyncWithProtection: DataProtectionService.forceSyncWithProtection,
    getProtectionStatus: DataProtectionService.getProtectionStatus,
  };
};
