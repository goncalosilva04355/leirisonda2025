import { useState, useCallback, useEffect } from "react";
import {
  dataCleanupService,
  type CleanupResult,
} from "../services/dataCleanupService";

export interface UseDataCleanupReturn {
  // State
  isLoading: boolean;
  lastResult: CleanupResult | null;
  error: string | null;
  cleanupStats: {
    lastCleanup: string | null;
    isClean: boolean;
    localStorageEmpty: boolean;
  };

  // Actions
  cleanAllData: () => Promise<CleanupResult>;
  clearDeviceMemory: () => Promise<CleanupResult>;
  initializeCleanApp: () => Promise<void>;
  ensureUserSync: () => Promise<boolean>;

  // Utility
  refreshStats: () => void;
}

export function useDataCleanup(): UseDataCleanupReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<CleanupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cleanupStats, setCleanupStats] = useState(() =>
    dataCleanupService.getCleanupStats(),
  );

  // Refresh cleanup statistics
  const refreshStats = useCallback(() => {
    setCleanupStats(dataCleanupService.getCleanupStats());
  }, []);

  // Load initial stats
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Clean all data
  const cleanAllData = useCallback(async (): Promise<CleanupResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dataCleanupService.cleanAllData();
      setLastResult(result);

      if (!result.success) {
        setError(result.message);
      }

      // Refresh stats after cleanup
      refreshStats();

      return result;
    } catch (err: any) {
      const errorMessage = `Erro inesperado na limpeza: ${err.message}`;
      setError(errorMessage);

      const errorResult: CleanupResult = {
        success: false,
        message: errorMessage,
        details: {
          firestoreDeleted: {
            pools: 0,
            works: 0,
            maintenance: 0,
            clients: 0,
            interventions: 0,
          },
          realtimeDbCleared: false,
          localStorageCleared: false,
        },
      };

      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  }, [refreshStats]);

  // Clear complete device memory
  const clearDeviceMemory = useCallback(async (): Promise<CleanupResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dataCleanupService.clearDeviceMemory();
      setLastResult(result);

      if (!result.success) {
        setError(result.message);
      }

      // Note: We don't refresh stats here because the page will reload
      return result;
    } catch (err: any) {
      const errorMessage = `Erro inesperado na limpeza da memória: ${err.message}`;
      setError(errorMessage);

      const errorResult: CleanupResult = {
        success: false,
        message: errorMessage,
        details: {
          firestoreDeleted: {
            pools: 0,
            works: 0,
            maintenance: 0,
            clients: 0,
            interventions: 0,
          },
          realtimeDbCleared: false,
          localStorageCleared: false,
        },
      };

      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize clean application
  const initializeCleanApp = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await dataCleanupService.initializeCleanApplication();
      refreshStats();

      // Clear any previous results since we're starting fresh
      setLastResult(null);

      console.log("Aplicação inicializada com estado limpo");
    } catch (err: any) {
      const errorMessage = `Erro na inicialização limpa: ${err.message}`;
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, [refreshStats]);

  // Ensure user synchronization
  const ensureUserSync = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dataCleanupService.ensureUserSynchronization();

      if (!result) {
        setError(
          "Falha na configuração da sincronização. Verifique a configuração do Firebase.",
        );
      }

      return result;
    } catch (err: any) {
      const errorMessage = `Erro na sincronização: ${err.message}`;
      setError(errorMessage);
      console.error(errorMessage, err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    lastResult,
    error,
    cleanupStats,

    // Actions
    cleanAllData,
    clearDeviceMemory,
    initializeCleanApp,
    ensureUserSync,

    // Utility
    refreshStats,
  };
}

// Hook specifically for checking if app needs cleaning
export function useAppCleanupStatus() {
  const [needsCleanup, setNeedsCleanup] = useState(false);
  const [stats, setStats] = useState(() =>
    dataCleanupService.getCleanupStats(),
  );

  useEffect(() => {
    const checkStatus = () => {
      const currentStats = dataCleanupService.getCleanupStats();
      setStats(currentStats);

      // App needs cleanup if it's not clean and has data
      setNeedsCleanup(!currentStats.isClean && !currentStats.localStorageEmpty);
    };

    checkStatus();

    // Check periodically
    const interval = setInterval(checkStatus, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    needsCleanup,
    stats,
    isClean: stats.isClean,
    hasData: !stats.localStorageEmpty,
  };
}
