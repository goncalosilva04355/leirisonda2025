import { useEffect, useState, useCallback } from "react";
import { DataProtectionService } from "../services/dataProtectionService";

export function useDataProtectionFixed() {
  // Initialize state with factory functions for safer initialization
  const [isProtected, setIsProtected] = useState(() => false);
  const [lastBackup, setLastBackup] = useState<string | null>(() => null);
  const [dataRestored, setDataRestored] = useState(() => false);

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error("❌ Error in useDataProtection initialization:", error);
    }
  }, []);

  // Função para criar backup manual
  const createBackup = useCallback(() => {
    try {
      DataProtectionService.createFullBackup();
      const newTimestamp = localStorage.getItem("FULL_BACKUP_timestamp");
      setLastBackup(newTimestamp);
    } catch (error) {
      console.error("❌ Error creating backup:", error);
    }
  }, []);

  // Função para restaurar dados
  const restoreData = useCallback(() => {
    try {
      const success = DataProtectionService.restoreFromBackup();
      if (success) {
        // Recarregar a página para aplicar dados restaurados
        window.location.reload();
      }
      return success;
    } catch (error) {
      console.error("❌ Error restoring data:", error);
      return false;
    }
  }, []);

  // Função para backup antes de operações
  const backupBeforeOperation = useCallback((operation: string) => {
    try {
      DataProtectionService.autoBackupBeforeOperation(operation);
      const newTimestamp = localStorage.getItem("FULL_BACKUP_timestamp");
      setLastBackup(newTimestamp);
    } catch (error) {
      console.error("❌ Error backing up before operation:", error);
    }
  }, []);

  // Verificar integridade dos dados
  const checkIntegrity = useCallback(() => {
    try {
      return DataProtectionService.checkDataIntegrity();
    } catch (error) {
      console.error("❌ Error checking data integrity:", error);
      return { isValid: false, issues: ["Error checking integrity"] };
    }
  }, []);

  // Get backup status safely
  const hasBackup = useCallback(() => {
    try {
      return DataProtectionService.hasBackupData();
    } catch (error) {
      console.error("❌ Error checking backup data:", error);
      return false;
    }
  }, []);

  return {
    isProtected,
    lastBackup,
    dataRestored,
    createBackup,
    restoreData,
    backupBeforeOperation,
    checkIntegrity,
    hasBackup: hasBackup(),
  };
}
