import { useEffect, useCallback, useRef } from "react";
import { fullSyncService } from "../services/fullSyncService";
import { realFirebaseService } from "../services/realFirebaseService";

interface AutoSyncConfig {
  enabled: boolean;
  syncInterval: number; // milliseconds
  collections: string[];
}

interface SyncStatus {
  isActive: boolean;
  lastSync: Date | null;
  syncing: boolean;
  error: string | null;
}

export const useAutoDataSync = (config: Partial<AutoSyncConfig> = {}) => {
  const defaultConfig: AutoSyncConfig = {
    enabled: true,
    syncInterval: 5000, // 5 segundos para sync responsivo
    collections: ["users", "pools", "maintenance", "works", "clients"],
  };

  const finalConfig = { ...defaultConfig, ...config };

  const syncStatus = useRef<SyncStatus>({
    isActive: false,
    lastSync: null,
    syncing: false,
    error: null,
  });

  const lastDataSnapshot = useRef<Record<string, string>>({});
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  const backoffMultiplier = useRef(1);
  const isQuotaExceeded = useRef(false);
  const quotaExceededCount = useRef(0);
  const circuitBreakerOpen = useRef(false);

  // Função para gerar hash dos dados para detectar mudanças
  const generateDataHash = useCallback((data: any): string => {
    return JSON.stringify(data);
  }, []);

  // Detecta mudanças no localStorage
  const checkForLocalChanges = useCallback((): boolean => {
    let hasChanges = false;

    for (const collection of finalConfig.collections) {
      const currentData = localStorage.getItem(collection);
      const currentHash = generateDataHash(currentData);
      const lastHash = lastDataSnapshot.current[collection];

      if (currentHash !== lastHash) {
        lastDataSnapshot.current[collection] = currentHash;
        hasChanges = true;
        console.log(`🔄 Detectada mudança em ${collection}`);
      }
    }

    return hasChanges;
  }, [finalConfig.collections, generateDataHash]);

  // Sincronização bidirecional automática
  const performAutoSync = useCallback(async (): Promise<void> => {
    if (syncStatus.current.syncing || !finalConfig.enabled) {
      return;
    }

    try {
      syncStatus.current.syncing = true;
      syncStatus.current.error = null;

      // 1. Verifica se há mudanças locais
      const hasLocalChanges = checkForLocalChanges();

      // 2. Sincroniza dados APENAS se há mudanças ou se é a primeira vez
      if (hasLocalChanges || !isInitialized.current) {
        console.log("🔄 Mudanças detectadas - iniciando sincronização...");

        // Sincronização completa bidirecional
        const result = await fullSyncService.syncAllData();

        if (result.success) {
          syncStatus.current.lastSync = new Date();
          syncStatus.current.error = null;
          backoffMultiplier.current = 1; // Reset backoff on success
          isQuotaExceeded.current = false;
          console.log("✅ Sincronização automática concluída");

          // Atualiza snapshots após sincronização
          for (const collection of finalConfig.collections) {
            const currentData = localStorage.getItem(collection);
            lastDataSnapshot.current[collection] =
              generateDataHash(currentData);
          }
        } else {
          syncStatus.current.error = result.message;
          console.warn("⚠️ Sincronização com avisos:", result.message);
        }

        isInitialized.current = true;
      } else {
        console.log("✅ Nenhuma mudança detectada - skip sync");
      }

      // 3. Agenda próxima verificação SEMPRE (mas só sync se houver mudanças)
      if (finalConfig.enabled) {
        syncTimeoutRef.current = setTimeout(
          performAutoSync,
          finalConfig.syncInterval,
        );
      }
    } catch (error: any) {
      syncStatus.current.error = error.message;
      console.error("❌ Erro na sincronização automática:", error);

      // Check if it's a Firebase quota exceeded error
      if (
        error.message?.includes("quota") ||
        error.message?.includes("resource-exhausted")
      ) {
        isQuotaExceeded.current = true;
        backoffMultiplier.current = Math.min(backoffMultiplier.current * 2, 32); // Max 32x backoff
        console.warn(
          `🔥 Firebase quota exceeded. Using ${backoffMultiplier.current}x backoff`,
        );
      } else {
        // Reset backoff for non-quota errors
        backoffMultiplier.current = Math.max(backoffMultiplier.current / 2, 1);
      }

      // Reagenda com backoff exponencial
      if (finalConfig.enabled && !isQuotaExceeded.current) {
        const nextInterval =
          finalConfig.syncInterval * backoffMultiplier.current;
        console.log(`⏰ Reagendando sincronização em ${nextInterval / 1000}s`);
        syncTimeoutRef.current = setTimeout(performAutoSync, nextInterval);
      } else if (isQuotaExceeded.current) {
        // Para quota exceeded, espera muito mais tempo
        const quotaBackoffTime = finalConfig.syncInterval * 60; // 60x o intervalo normal
        console.log(
          `🔥 Quota exceeded: aguardando ${quotaBackoffTime / 1000}s antes de tentar novamente`,
        );
        syncTimeoutRef.current = setTimeout(() => {
          isQuotaExceeded.current = false;
          backoffMultiplier.current = 1;
          performAutoSync();
        }, quotaBackoffTime);
      }
    } finally {
      syncStatus.current.syncing = false;
    }
  }, [
    finalConfig.enabled,
    finalConfig.syncInterval,
    finalConfig.collections,
    checkForLocalChanges,
    generateDataHash,
  ]);

  // Força sincronização imediata
  const forceSyncNow = useCallback(async (): Promise<void> => {
    console.log("🚀 Forçando sincronização imediata...");

    // Cancela timeout atual
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }

    // Força verificação de mudanças
    isInitialized.current = false;

    // Executa sincronização
    await performAutoSync();
  }, [performAutoSync]);

  // Listener para mudanças no localStorage (storage events)
  const handleStorageChange = useCallback(
    (event: StorageEvent) => {
      if (finalConfig.collections.includes(event.key || "")) {
        console.log(`📢 Storage event detectado: ${event.key}`);
        // Força sincronização quando localStorage muda
        forceSyncNow();
      }
    },
    [finalConfig.collections, forceSyncNow],
  );

  // Observer personalizado para mudanças no localStorage
  const createLocalStorageObserver = useCallback(() => {
    const originalSetItem = localStorage.setItem.bind(localStorage);
    const originalRemoveItem = localStorage.removeItem.bind(localStorage);

    // Override setItem
    localStorage.setItem = function (key: string, value: string) {
      const oldValue = localStorage.getItem(key);
      originalSetItem(key, value);

      if (finalConfig.collections.includes(key) && value !== oldValue) {
        console.log(`🔍 localStorage setItem detectado: ${key}`);
        setTimeout(forceSyncNow, 100); // Pequeno delay para garantir que a operação terminou
      }
    };

    // Override removeItem
    localStorage.removeItem = function (key: string) {
      const hadItem = localStorage.getItem(key) !== null;
      originalRemoveItem(key);

      if (finalConfig.collections.includes(key) && hadItem) {
        console.log(`🔍 localStorage removeItem detectado: ${key}`);
        setTimeout(forceSyncNow, 100);
      }
    };

    // Função para restaurar métodos originais
    return () => {
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
    };
  }, [finalConfig.collections, forceSyncNow]);

  // Inicialização e cleanup
  useEffect(() => {
    if (!finalConfig.enabled) {
      syncStatus.current.isActive = false;
      syncStatus.current.syncing = false;
      syncStatus.current.lastSync = null;
      syncStatus.current.error = null;
      console.log("🛑 Auto-sync disabled via config");
      return;
    }

    console.log("🚀 Iniciando sistema de sincronização automática");
    syncStatus.current.isActive = true;

    // Inicializa snapshots
    for (const collection of finalConfig.collections) {
      const currentData = localStorage.getItem(collection);
      lastDataSnapshot.current[collection] = generateDataHash(currentData);
    }

    // Configura observadores
    const restoreLocalStorage = createLocalStorageObserver();
    window.addEventListener("storage", handleStorageChange);

    // Inicia primeira sincronização
    performAutoSync();

    // Cleanup
    return () => {
      console.log("🛑 Parando sistema de sincronização automática");
      syncStatus.current.isActive = false;

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }

      window.removeEventListener("storage", handleStorageChange);
      restoreLocalStorage();
    };
  }, [
    finalConfig.enabled,
    finalConfig.collections,
    createLocalStorageObserver,
    handleStorageChange,
    performAutoSync,
    generateDataHash,
  ]);

  // API pública
  return {
    isActive: syncStatus.current.isActive,
    syncing: syncStatus.current.syncing,
    lastSync: syncStatus.current.lastSync,
    error: syncStatus.current.error,
    forceSyncNow,
    config: finalConfig,
  };
};

// Hook específico para componentes que modificam dados
export const useDataMutationSync = () => {
  const { forceSyncNow } = useAutoDataSync();

  // Wrapper para funções que modificam dados
  const withAutoSync = useCallback(
    <T extends any[], R>(fn: (...args: T) => R | Promise<R>) => {
      return async (...args: T): Promise<R> => {
        const result = await fn(...args);

        // Força sincronização após mutação
        setTimeout(forceSyncNow, 50);

        return result;
      };
    },
    [forceSyncNow],
  );

  return { withAutoSync, forceSyncNow };
};

// Hook para monitoramento em tempo real do Firebase
export const useFirebaseRealtimeSync = () => {
  const { forceSyncNow } = useAutoDataSync();

  useEffect(() => {
    if (!realFirebaseService.isReady()) {
      return;
    }

    console.log("📡 Configurando listeners em tempo real do Firebase");

    // Throttle sync calls to prevent quota exceeded
    let lastSyncTime = 0;
    const MIN_SYNC_INTERVAL = 5000; // 5 seconds minimum between syncs

    const throttledSync = () => {
      const now = Date.now();
      if (now - lastSyncTime > MIN_SYNC_INTERVAL) {
        lastSyncTime = now;
        forceSyncNow();
      } else {
        console.log("🚫 Sync throttled - too frequent");
      }
    };

    // Listeners para mudanças em tempo real no Firebase
    const unsubscribers = [
      realFirebaseService.onPoolsChange(() => {
        console.log("🔄 Mudança detectada em pools (Firebase)");
        throttledSync();
      }),

      realFirebaseService.onWorksChange(() => {
        console.log("🔄 Mudança detectada em works (Firebase)");
        throttledSync();
      }),

      realFirebaseService.onMaintenanceChange(() => {
        console.log("🔄 Mudança detectada em maintenance (Firebase)");
        throttledSync();
      }),

      realFirebaseService.onClientsChange(() => {
        console.log("🔄 Mudança detectada em clients (Firebase)");
        throttledSync();
      }),
    ];

    return () => {
      console.log("🛑 Desconectando listeners do Firebase");
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [forceSyncNow]);

  return { forceSyncNow };
};
