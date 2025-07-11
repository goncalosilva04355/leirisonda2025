import React, { useEffect } from "react";
import { useInstantSync } from "../hooks/useInstantSync";
import { useRealtimeSync } from "../hooks/useRealtimeSync";

interface InstantSyncManagerProps {
  children: React.ReactNode;
}

export const InstantSyncManager: React.FC<InstantSyncManagerProps> = ({
  children,
}) => {
  // Initialize instant sync capabilities
  const { forceSync, isEnabled } = useInstantSync({
    enabled: true,
    collections: ["users", "pools", "maintenance", "works", "clients"],
    syncOnVisibilityChange: true,
    syncOnFocus: true,
    syncOnStorageChange: true,
  });

  // Initialize realtime sync
  const realtimeSync = useRealtimeSync();

  // Setup automatic sync on app start
  useEffect(() => {
    if (isEnabled) {
      console.log(
        "🚀 InstantSyncManager inicializado - sincronização automática ativa",
      );

      // Force initial sync after component mount
      setTimeout(() => {
        forceSync("app-startup");
      }, 1000);
    }
  }, [isEnabled, forceSync]);

  // Monitor realtime sync errors and retry
  useEffect(() => {
    if (realtimeSync.error) {
      console.warn(
        "⚠️ Erro na sincronização em tempo real:",
        realtimeSync.error,
      );

      // Auto-retry sync on error after 5 seconds
      setTimeout(() => {
        console.log("🔄 Tentando reconectar sincronização...");
        forceSync("error-recovery");
      }, 5000);
    }
  }, [realtimeSync.error, forceSync]);

  // Log sync status changes
  useEffect(() => {
    if (realtimeSync.loading) {
      console.log("⏳ Carregando dados da sincronização...");
    }

    if (!realtimeSync.loading && !realtimeSync.error) {
      console.log("✅ Dados sincronizados com sucesso:", {
        users: realtimeSync.users.length,
        pools: realtimeSync.pools.length,
        maintenance: realtimeSync.maintenance.length,
        works: realtimeSync.works.length,
      });
    }
  }, [
    realtimeSync.loading,
    realtimeSync.error,
    realtimeSync.users,
    realtimeSync.pools,
    realtimeSync.maintenance,
    realtimeSync.works,
  ]);

  return <>{children}</>;
};

// Hook para acessar funcionalidades de sync em qualquer componente
export const useGlobalSync = () => {
  const instantSync = useInstantSync();
  const realtimeSync = useRealtimeSync();

  return {
    // Instant sync capabilities
    forceSync: instantSync.forceSync,
    isSyncEnabled: instantSync.isEnabled,

    // Realtime sync state
    data: {
      users: realtimeSync.users,
      pools: realtimeSync.pools,
      maintenance: realtimeSync.maintenance,
      futureMaintenance: realtimeSync.futureMaintenance,
      works: realtimeSync.works,
    },
    loading: realtimeSync.loading,
    error: realtimeSync.error,
    services: realtimeSync.services,

    // Combined status
    isFullySynced:
      !realtimeSync.loading && !realtimeSync.error && instantSync.isEnabled,
  };
};
