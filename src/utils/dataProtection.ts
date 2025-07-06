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

    let totalItems = 0;

    // Backup de todos os dados críticos
    this.CRITICAL_KEYS.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data && data !== "null" && data !== "[]") {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            backup[key] = parsed;
            totalItems += parsed.length;
            console.log(
              `🔒 EMERGENCY BACKUP: ${key} saved (${parsed.length} items)`,
            );
          } else {
            backup[key] = [];
            console.warn(
              `⚠️ EMERGENCY BACKUP: ${key} is not an array, saved as empty`,
            );
          }
        } else {
          backup[key] = [];
          console.log(
            `🔒 EMERGENCY BACKUP: ${key} empty, saved as empty array`,
          );
        }
      } catch (error) {
        console.warn(`⚠️ EMERGENCY BACKUP: Failed to backup ${key}:`, error);
        backup[key] = [];
      }
    });

    // Só salvar se temos dados ou se é o primeiro backup
    const existingBackups = Object.keys(localStorage).filter((key) =>
      key.startsWith("backup_emergency_"),
    );
    if (totalItems > 0 || existingBackups.length === 0) {
      try {
        localStorage.setItem(
          `backup_emergency_${backupId}`,
          JSON.stringify(backup),
        );

        // Manter apenas os últimos 10 backups
        this.cleanupOldBackups();

        console.log(
          `✅ EMERGENCY BACKUP CREATED: ${backupId} (${totalItems} total items)`,
        );
        return backupId;
      } catch (error) {
        console.error("❌ FAILED TO CREATE EMERGENCY BACKUP:", error);
        return "";
      }
    } else {
      console.log("⏭️ SKIPPING BACKUP: No data to backup and backups exist");
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

      console.log(`🔍 Found ${backupKeys.length} emergency backups`);

      if (backupKeys.length === 0) {
        console.warn("❌ NO EMERGENCY BACKUPS FOUND");
        // Tentar outros tipos de backup
        return this.restoreFromAlternativeSources();
      }

      // Tentar restaurar do backup mais recente
      for (const key of backupKeys) {
        console.log(`🔄 Attempting restore from: ${key}`);
        try {
          const backupData = localStorage.getItem(key);
          if (!backupData) {
            console.warn(`⚠️ Backup ${key} is empty`);
            continue;
          }

          const backup = JSON.parse(backupData);
          console.log(`📦 Backup content:`, Object.keys(backup));

          // Verificar se o backup tem dados válidos
          let hasData = false;
          let totalRestored = 0;

          for (const dataKey of this.CRITICAL_KEYS) {
            if (
              backup[dataKey] &&
              Array.isArray(backup[dataKey]) &&
              backup[dataKey].length > 0
            ) {
              hasData = true;
              totalRestored += backup[dataKey].length;
              console.log(
                `✅ Found ${backup[dataKey].length} items in ${dataKey}`,
              );
            }
          }

          if (!hasData) {
            console.warn(`⚠️ Backup ${key} has no valid data`);
            continue;
          }

          console.log(`🔄 Restoring ${totalRestored} total items...`);

          // Restaurar dados
          for (const dataKey of this.CRITICAL_KEYS) {
            if (backup[dataKey] && Array.isArray(backup[dataKey])) {
              localStorage.setItem(dataKey, JSON.stringify(backup[dataKey]));
              console.log(
                `✅ RESTORED: ${dataKey} (${backup[dataKey].length} items)`,
              );
            } else {
              // Garantir que existe pelo menos um array vazio
              localStorage.setItem(dataKey, JSON.stringify([]));
              console.log(`🔧 INITIALIZED: ${dataKey} as empty array`);
            }
          }

          console.log(
            `🎉 DATA RESTORATION SUCCESSFUL from ${backup.id || key} (${totalRestored} items)`,
          );
          return true;
        } catch (error) {
          console.warn(`⚠️ Failed to restore from ${key}:`, error);
          continue;
        }
      }

      console.error("❌ ALL BACKUP RESTORATION ATTEMPTS FAILED");
      // Tentar fontes alternativas
      return this.restoreFromAlternativeSources();
    } catch (error) {
      console.error("❌ RESTORATION PROCESS FAILED:", error);
      return false;
    }
  }

  // Restaurar de fontes alternativas
  private static restoreFromAlternativeSources(): boolean {
    console.log("🔍 Trying alternative restoration sources...");

    try {
      // Tentar backups diários
      const dailyKeys = Object.keys(localStorage).filter((key) =>
        this.CRITICAL_KEYS.some((ck) => key.startsWith(`${ck}_daily_`)),
      );

      if (dailyKeys.length > 0) {
        console.log(`📅 Found ${dailyKeys.length} daily backups`);
        for (const key of dailyKeys.sort().reverse()) {
          try {
            const data = JSON.parse(localStorage.getItem(key)!);
            if (Array.isArray(data) && data.length > 0) {
              const dataType = key.split("_daily_")[0];
              localStorage.setItem(dataType, JSON.stringify(data));
              console.log(
                `✅ RESTORED from daily backup: ${dataType} (${data.length} items)`,
              );
              return true;
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Tentar rolling backups
      for (const key of this.CRITICAL_KEYS) {
        try {
          const rollingData = localStorage.getItem(`${key}_backup_rolling`);
          if (rollingData) {
            const backups = JSON.parse(rollingData);
            if (backups.length > 0) {
              const latest = backups[backups.length - 1];
              if (latest.data && latest.data.length > 0) {
                localStorage.setItem(key, JSON.stringify(latest.data));
                console.log(
                  `✅ RESTORED from rolling backup: ${key} (${latest.data.length} items)`,
                );
                return true;
              }
            }
          }
        } catch (error) {
          continue;
        }
      }

      // Se nada funcionar, inicializar arrays vazios para evitar erros
      console.log("🔧 Initializing empty data structures...");
      this.CRITICAL_KEYS.forEach((key) => {
        localStorage.setItem(key, JSON.stringify([]));
      });

      return false;
    } catch (error) {
      console.error("❌ Alternative restoration failed:", error);
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

  // Criar backup manual com dados mock se necessário
  static createRecoveryBackup(): string {
    console.log("🆘 Creating recovery backup with default data...");

    const timestamp = new Date().toISOString();
    const backupId = `recovery_${Date.now()}`;

    // Dados básicos para recuperação
    const recoveryData = {
      timestamp,
      id: backupId,
      version: "1.0.0",
      works: [],
      pools: [],
      maintenance: [],
      clients: [],
    };

    try {
      localStorage.setItem(
        `backup_emergency_${backupId}`,
        JSON.stringify(recoveryData),
      );

      // Aplicar dados imediatamente
      this.CRITICAL_KEYS.forEach((key) => {
        localStorage.setItem(key, JSON.stringify([]));
      });

      console.log(`✅ RECOVERY BACKUP CREATED: ${backupId}`);
      return backupId;
    } catch (error) {
      console.error("❌ FAILED TO CREATE RECOVERY BACKUP:", error);
      return "";
    }
  }

  // Status do sistema de proteção
  static getProtectionStatus(): any {
    const backupKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("backup_emergency_"),
    );

    const integrity = this.checkDataIntegrity();

    // Verificar se temos dados atuais
    let currentDataCount = 0;
    this.CRITICAL_KEYS.forEach((key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        currentDataCount += data.length;
      } catch (error) {
        // ignore
      }
    });

    return {
      backupsAvailable: backupKeys.length,
      lastBackup:
        backupKeys.length > 0 ? backupKeys[backupKeys.length - 1] : null,
      dataIntegrity: integrity,
      protectionActive: true,
      currentDataCount,
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
    createRecoveryBackup: DataProtectionService.createRecoveryBackup,
  };
};
