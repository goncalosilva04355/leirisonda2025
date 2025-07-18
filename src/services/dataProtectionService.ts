// Serviço de proteção de dados - NUNCA permite perda de dados
export class DataProtectionService {
  private static readonly BACKUP_KEYS = [
    "app-users",
    "authorizedUsers",
    "pools",
    "works",
    "maintenances",
    "clients",
    "app-settings",
  ];

  private static readonly BACKUP_PREFIX = "BACKUP_";
  private static readonly TIMESTAMP_SUFFIX = "_timestamp";

  // Função auxiliar para setItem seguro
  private static safeSetItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error: any) {
      console.warn(`⚠️ Falha ao guardar ${key}:`, error.message);

      // Se for quota exceeded, tentar limpar alguns backups antigos
      if (
        error.name === "QuotaExceededError" ||
        error.message.includes("quota")
      ) {
        console.log("🧹 Quota excedida, limpando backups antigos...");
        this.cleanOldBackups(3); // Manter apenas 3 backups

        // Tentar novamente
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (secondError: any) {
          console.error(`❌ Falha mesmo após limpeza: ${secondError.message}`);
          return false;
        }
      }
      return false;
    }
  }

  // Criar backup completo de todos os dados críticos
  static createFullBackup(): void {
    const timestamp = new Date().toISOString();
    const backupData: any = {};
    let successCount = 0;
    let totalKeys = 0;

    console.log("💾 Iniciando backup completo...");

    this.BACKUP_KEYS.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        totalKeys++;
        backupData[key] = data;

        // Tentar criar backup individual
        const individualSuccess = this.safeSetItem(
          `${this.BACKUP_PREFIX}${key}`,
          data,
        );
        const timestampSuccess = this.safeSetItem(
          `${this.BACKUP_PREFIX}${key}${this.TIMESTAMP_SUFFIX}`,
          timestamp,
        );

        if (individualSuccess && timestampSuccess) {
          successCount++;
        }
      }
    });

    // Tentar backup consolidado
    const backupJson = JSON.stringify(backupData);
    const consolidatedSuccess = this.safeSetItem("FULL_BACKUP", backupJson);
    const timestampSuccess = this.safeSetItem(
      "FULL_BACKUP_timestamp",
      timestamp,
    );

    if (consolidatedSuccess && timestampSuccess) {
      console.log(
        `✅ Backup completo criado: ${successCount}/${totalKeys} itens`,
      );
    } else {
      console.warn(
        `⚠️ Backup parcial: ${successCount}/${totalKeys} itens salvos`,
      );
    }
  }

  // Verificar se há dados para restaurar
  static hasBackupData(): boolean {
    return localStorage.getItem("FULL_BACKUP") !== null;
  }

  // Restaurar dados do backup
  static restoreFromBackup(): boolean {
    try {
      const fullBackup = localStorage.getItem("FULL_BACKUP");
      if (!fullBackup) {
        console.log("⚠️ Nenhum backup encontrado");
        return false;
      }

      const backupData = JSON.parse(fullBackup);
      let restoredCount = 0;

      this.BACKUP_KEYS.forEach((key) => {
        if (backupData[key]) {
          localStorage.setItem(key, backupData[key]);
          restoredCount++;
        }
      });

      console.log(`✅ Dados restaurados: ${restoredCount} items`);
      return restoredCount > 0;
    } catch (error) {
      console.error("❌ Erro ao restaurar backup:", error);
      return false;
    }
  }

  // Verificar integridade dos dados críticos
  static checkDataIntegrity(): {
    isValid: boolean;
    missingData: string[];
    hasData: boolean;
  } {
    const missingData: string[] = [];
    let hasAnyData = false;

    this.BACKUP_KEYS.forEach((key) => {
      const data = localStorage.getItem(key);
      if (!data || data === "[]" || data === "{}") {
        missingData.push(key);
      } else {
        hasAnyData = true;
      }
    });

    return {
      isValid: missingData.length === 0,
      missingData,
      hasData: hasAnyData,
    };
  }

  // Auto-backup antes de operações críticas
  static autoBackupBeforeOperation(operation: string): void {
    console.log(`🔒 Auto-backup antes de: ${operation}`);
    this.createFullBackup();

    // Manter histórico dos últimos 5 backups
    this.maintainBackupHistory();
  }

  // Limpar backups antigos para liberar espaço
  private static cleanOldBackups(maxToKeep: number = 3): void {
    try {
      console.log(
        `🧹 Limpando backups antigos, mantendo apenas ${maxToKeep}...`,
      );

      // Obter lista de todas as chaves do localStorage
      const allKeys = Object.keys(localStorage);

      // Encontrar chaves de backup
      const backupKeys = allKeys.filter(
        (key) =>
          key.startsWith(this.BACKUP_PREFIX) ||
          key.includes("BACKUP") ||
          key.includes("backup"),
      );

      // Remover backups se há muitos
      if (backupKeys.length > maxToKeep * this.BACKUP_KEYS.length) {
        backupKeys.forEach((key) => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            // Ignorar erros individuais
          }
        });
        console.log(`✅ ${backupKeys.length} backups antigos removidos`);
      }

      // Limpar histórico também
      const backupHistory = JSON.parse(
        localStorage.getItem("BACKUP_HISTORY") || "[]",
      );

      if (backupHistory.length > maxToKeep) {
        const newHistory = backupHistory.slice(0, maxToKeep);
        localStorage.setItem("BACKUP_HISTORY", JSON.stringify(newHistory));
      }
    } catch (error: any) {
      console.warn("⚠️ Erro ao limpar backups antigos:", error.message);
    }
  }

  // Manter histórico de backups
  private static maintainBackupHistory(): void {
    const maxBackups = 5;
    const backupHistory = JSON.parse(
      localStorage.getItem("BACKUP_HISTORY") || "[]",
    );

    const currentBackup = {
      timestamp: new Date().toISOString(),
      id: Date.now(),
    };

    backupHistory.unshift(currentBackup);

    // Manter apenas os últimos backups
    if (backupHistory.length > maxBackups) {
      const oldBackups = backupHistory.slice(maxBackups);
      oldBackups.forEach((backup: any) => {
        this.BACKUP_KEYS.forEach((key) => {
          try {
            localStorage.removeItem(`${this.BACKUP_PREFIX}${key}_${backup.id}`);
          } catch (error) {
            // Ignorar erros de remoção individual
          }
        });
      });
      backupHistory.splice(maxBackups);
    }

    try {
      localStorage.setItem("BACKUP_HISTORY", JSON.stringify(backupHistory));
    } catch (error: any) {
      console.warn("⚠️ Falha ao salvar histórico de backup:", error.message);
    }
  }

  // Restauro de emergência
  static emergencyRestore(): boolean {
    console.log("🚨 RESTAURO DE EMERGÊNCIA ATIVO");

    // Tentar restaurar do backup completo primeiro
    if (this.restoreFromBackup()) {
      console.log("✅ Restauro de backup completo bem-sucedido");
      return true;
    }

    // Tentar restaurar de backups individuais
    let restored = false;
    this.BACKUP_KEYS.forEach((key) => {
      const backupData = localStorage.getItem(`${this.BACKUP_PREFIX}${key}`);
      if (backupData) {
        localStorage.setItem(key, backupData);
        restored = true;
        console.log(`✅ Restaurado ${key} de backup individual`);
      }
    });

    return restored;
  }

  // Verificar se localStorage está disponível
  private static isLocalStorageAvailable(): boolean {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, "test");
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Inicialização segura com verificação automática
  static safeInitialization(): void {
    try {
      console.log("🛡️ Inicialização segura do sistema de proteção de dados");

      // Verificar se localStorage está disponível
      if (!this.isLocalStorageAvailable()) {
        console.warn(
          "⚠️ localStorage não disponível - sistema de backup desativado",
        );
        return;
      }

      const integrity = this.checkDataIntegrity();

      if (!integrity.hasData && this.hasBackupData()) {
        console.log(
          "⚠️ Dados principais ausentes, mas backup disponível. Restaurando...",
        );
        this.emergencyRestore();
      } else if (integrity.hasData) {
        console.log("✅ Dados principais presentes, criando backup preventivo");
        this.createFullBackup();
      } else {
        console.log("ℹ️ Sem dados principais ou backups - aplicação nova");
      }
    } catch (error: any) {
      console.error(
        "❌ Erro na inicialização do sistema de proteção:",
        error.message,
      );
      // Não fazer throw para não quebrar a aplicação
    }
  }

  // Monitorização contínua de perda de dados
  static startDataMonitoring(): void {
    setInterval(() => {
      const integrity = this.checkDataIntegrity();
      if (!integrity.hasData && this.hasBackupData()) {
        console.log(
          "🚨 PERDA DE DADOS DETECTADA! Restaurando automaticamente...",
        );
        this.emergencyRestore();

        // Disparar evento para notificar a aplicação
        window.dispatchEvent(
          new CustomEvent("dataRestored", {
            detail: { automatic: true, timestamp: new Date().toISOString() },
          }),
        );
      }
    }, 30000); // Verificar a cada 30 segundos
  }
}

// Auto-inicialização
DataProtectionService.safeInitialization();
DataProtectionService.startDataMonitoring();
