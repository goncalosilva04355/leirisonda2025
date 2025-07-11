import { useEffect, useState } from "react";
import { DataProtectionService } from "../services/dataProtectionService";

export function useDataProtection() {
  const [isProtected, setIsProtected] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [dataRestored, setDataRestored] = useState(false);

  useEffect(() => {
    // Inicialização segura
    DataProtectionService.safeInitialization();
    setIsProtected(true);

    const backupTimestamp = localStorage.getItem("FULL_BACKUP_timestamp");
    setLastBackup(backupTimestamp);

    // Listener para restauros automáticos
    const handleDataRestored = (event: CustomEvent) => {
      setDataRestored(true);
      setTimeout(() => setDataRestored(false), 5000); // Reset após 5 segundos
    };

    window.addEventListener(
      "dataRestored",
      handleDataRestored as EventListener,
    );

    return () => {
      window.removeEventListener(
        "dataRestored",
        handleDataRestored as EventListener,
      );
    };
  }, []);

  // Função para criar backup manual
  const createBackup = () => {
    DataProtectionService.createFullBackup();
    const newTimestamp = localStorage.getItem("FULL_BACKUP_timestamp");
    setLastBackup(newTimestamp);
  };

  // Função para restaurar dados
  const restoreData = () => {
    const success = DataProtectionService.restoreFromBackup();
    if (success) {
      // Recarregar a página para aplicar dados restaurados
      window.location.reload();
    }
    return success;
  };

  // Função para backup antes de operações
  const backupBeforeOperation = (operation: string) => {
    DataProtectionService.autoBackupBeforeOperation(operation);
    const newTimestamp = localStorage.getItem("FULL_BACKUP_timestamp");
    setLastBackup(newTimestamp);
  };

  // Verificar integridade dos dados
  const checkIntegrity = () => {
    return DataProtectionService.checkDataIntegrity();
  };

  return {
    isProtected,
    lastBackup,
    dataRestored,
    createBackup,
    restoreData,
    backupBeforeOperation,
    checkIntegrity,
    hasBackup: DataProtectionService.hasBackupData(),
  };
}
