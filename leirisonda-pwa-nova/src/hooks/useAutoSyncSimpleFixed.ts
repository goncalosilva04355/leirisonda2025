// Hook ultra-simples para auto-sync - VERSÃO CORRIGIDA
import { useState, useCallback } from "react";

type SyncStatus = "idle" | "syncing" | "completed" | "error";

export const useAutoSyncSimpleFixed = () => {
  // Initialize state with factory functions for safer initialization
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => "idle");
  const [lastSync, setLastSync] = useState<Date | null>(() => null);

  // Safe sync function with useCallback
  const performSync = useCallback(async () => {
    try {
      setSyncStatus("syncing");

      // Simular sync simples
      await new Promise((resolve) => setTimeout(resolve, 100));

      setSyncStatus("completed");
      setLastSync(new Date());

      // Reset para idle após um tempo
      setTimeout(() => setSyncStatus("idle"), 2000);
    } catch (error) {
      console.warn("Sync error:", error);
      setSyncStatus("error");
    }
  }, []);

  // Auto-start sync (opcional)
  const startAutoSync = useCallback(() => {
    console.log("Auto-sync iniciado (modo simples)");
  }, []);

  const stopAutoSync = useCallback(() => {
    console.log("Auto-sync parado");
  }, []);

  return {
    syncStatus,
    lastSync,
    performSync,
    startAutoSync,
    stopAutoSync,
    isAutoSyncing: syncStatus === "syncing",
  };
};
