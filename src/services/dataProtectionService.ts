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

  // Criar backup completo de todos os dados críticos
  static createFullBackup(): void {
    const timestamp = new Date().toISOString();
    const backupData: any = {};

    this.BACKUP_KEYS.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        backupData[key] = data;
        // Criar backup individual também
        localStorage.setItem(`${this.BACKUP_PREFIX}${key}`, data);
        localStorage.setItem(
          `${this.BACKUP_PREFIX}${key}${this.TIMESTAMP_SUFFIX}`,
          timestamp,
        );
      }
    });

    // Backup consolidado
    localStorage.setItem("FULL_BACKUP", JSON.stringify(backupData));
    localStorage.setItem("FULL_BACKUP_timestamp", timestamp);

    console.log("✅ Backup completo criado:", timestamp);
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
          localStorage.removeItem(`${this.BACKUP_PREFIX}${key}_${backup.id}`);
        });
      });
      backupHistory.splice(maxBackups);
    }

    localStorage.setItem("BACKUP_HISTORY", JSON.stringify(backupHistory));
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

  // Inicialização segura com verificação automática
  static safeInitialization(): void {
    console.log("🛡️ Inicialização segura do sistema de proteção de dados");

    const integrity = this.checkDataIntegrity();

    if (!integrity.hasData && this.hasBackupData()) {
      console.log(
        "⚠️ Dados principais ausentes, mas backup disponível. Restaurando...",
      );
      this.emergencyRestore();
    } else if (integrity.hasData) {
      console.log("✅ Dados principais presentes, criando backup preventivo");
      this.createFullBackup();
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
