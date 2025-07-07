import { useEffect, useCallback, useRef } from "react";
import { syncService } from "../services/firebaseService";

export interface InstantSyncConfig {
  enabled: boolean;
  collections: string[];
  syncOnVisibilityChange: boolean;
  syncOnFocus: boolean;
  syncOnStorageChange: boolean;
}

export function useInstantSync(config: Partial<InstantSyncConfig> = {}) {
  const defaultConfig: InstantSyncConfig = {
    enabled: true,
    collections: ["users", "pools", "maintenance", "works", "clients"],
    syncOnVisibilityChange: true,
    syncOnFocus: true,
    syncOnStorageChange: true,
  };

  const finalConfig = { ...defaultConfig, ...config };
  const lastSyncTime = useRef<number>(0);
  const syncInProgress = useRef<boolean>(false);

  // Throttle sync to prevent excessive calls
  const throttledSync = useCallback(
    async (source: string) => {
      const now = Date.now();
      const minInterval = 2000; // Minimum 2 seconds between syncs

      if (syncInProgress.current || now - lastSyncTime.current < minInterval) {
        console.log(`🚫 Sync throttled from ${source} - too frequent`);
        return;
      }

      try {
        syncInProgress.current = true;
        lastSyncTime.current = now;

        console.log(`🔄 Instant sync triggered from: ${source}`);

        // Force sync for all collections
        for (const collection of finalConfig.collections) {
          await syncService.forceCrossDeviceSync(collection);
        }

        console.log(`✅ Instant sync completed from: ${source}`);
      } catch (error) {
        console.error(`❌ Instant sync failed from ${source}:`, error);
      } finally {
        syncInProgress.current = false;
      }
    },
    [finalConfig.collections],
  );

  // Sync when page becomes visible (user switches back to tab)
  useEffect(() => {
    if (!finalConfig.enabled || !finalConfig.syncOnVisibilityChange) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        throttledSync("visibility-change");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [finalConfig.enabled, finalConfig.syncOnVisibilityChange, throttledSync]);

  // Sync when window gains focus
  useEffect(() => {
    if (!finalConfig.enabled || !finalConfig.syncOnFocus) return;

    const handleFocus = () => {
      throttledSync("window-focus");
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [finalConfig.enabled, finalConfig.syncOnFocus, throttledSync]);

  // Sync when localStorage changes (from other tabs/windows)
  useEffect(() => {
    if (!finalConfig.enabled || !finalConfig.syncOnStorageChange) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && finalConfig.collections.includes(event.key)) {
        throttledSync(`storage-change-${event.key}`);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [
    finalConfig.enabled,
    finalConfig.syncOnStorageChange,
    finalConfig.collections,
    throttledSync,
  ]);

  // Listen to custom sync events
  useEffect(() => {
    if (!finalConfig.enabled) return;

    const handleFirebaseSync = (event: CustomEvent) => {
      const { type, collection } = event.detail;
      console.log(`🔔 Custom sync event received: ${type} for ${collection}`);
      throttledSync(`custom-event-${type}`);
    };

    window.addEventListener(
      "firebase-sync",
      handleFirebaseSync as EventListener,
    );
    window.addEventListener(
      "firebase-auto-sync",
      handleFirebaseSync as EventListener,
    );

    return () => {
      window.removeEventListener(
        "firebase-sync",
        handleFirebaseSync as EventListener,
      );
      window.removeEventListener(
        "firebase-auto-sync",
        handleFirebaseSync as EventListener,
      );
    };
  }, [finalConfig.enabled, throttledSync]);

  // Auto-sync when network connection is restored
  useEffect(() => {
    if (!finalConfig.enabled) return;

    const handleOnline = () => {
      console.log(
        "🌐 Conexão restaurada - disparando sincronização instantânea",
      );
      throttledSync("network-restored");
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [finalConfig.enabled, throttledSync]);

  // Force sync function for manual triggers
  const forceSync = useCallback(
    async (source: string = "manual") => {
      // Reset throttling for manual sync
      lastSyncTime.current = 0;
      await throttledSync(source);
    },
    [throttledSync],
  );

  return {
    forceSync,
    isEnabled: finalConfig.enabled,
    collections: finalConfig.collections,
    isSyncInProgress: syncInProgress.current,
  };
}

// Enhanced hook for components that modify data
export function useDataMutationWithInstantSync() {
  const { forceSync } = useInstantSync();

  const withInstantSync = useCallback(
    <T extends any[], R>(fn: (...args: T) => R | Promise<R>) => {
      return async (...args: T): Promise<R> => {
        try {
          // Execute the original function
          const result = await fn(...args);

          // Trigger instant sync after successful mutation
          setTimeout(() => {
            forceSync("data-mutation");
          }, 100); // Small delay to ensure data is persisted

          return result;
        } catch (error) {
          console.error("❌ Error in data mutation:", error);
          throw error;
        }
      };
    },
    [forceSync],
  );

  return { withInstantSync, forceSync };
}
