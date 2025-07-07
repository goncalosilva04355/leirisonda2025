import { useState, useEffect } from "react";

// Simplified auto data sync - only Firebase
export function useDataMutationSync() {
  const [isEnabled, setIsEnabled] = useState(true);

  return {
    isEnabled,
    setEnabled: setIsEnabled,
    forceSyncNow: () => console.log("Firebase-only sync"),
  };
}

// Configuration interface for compatibility
interface AutoSyncConfig {
  enabled?: boolean;
  syncInterval?: number;
  collections?: string[];
}

// Main auto sync hook for compatibility
export function useAutoDataSync(config: AutoSyncConfig = {}) {
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isEnabled, setIsEnabled] = useState(config.enabled ?? true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forceSyncNow = async () => {
    if (!isEnabled) return;

    setSyncing(true);
    setError(null);

    try {
      // Simulate Firebase sync
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLastSync(new Date());
      console.log("✅ Firebase sync completed");
    } catch (err: any) {
      setError(err.message || "Sync error");
      console.error("❌ Firebase sync failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  // Auto sync on interval
  useEffect(() => {
    if (!isEnabled || !config.syncInterval) return;

    const interval = setInterval(() => {
      forceSyncNow();
    }, config.syncInterval);

    return () => clearInterval(interval);
  }, [isEnabled, config.syncInterval]);

  return {
    isEnabled,
    setEnabled: setIsEnabled,
    syncing,
    lastSync,
    error,
    forceSyncNow,
    config: {
      enabled: isEnabled,
      syncInterval: config.syncInterval || 300000,
      collections: config.collections || [],
    },
  };
}

// Firebase realtime sync hook for compatibility
export function useFirebaseRealtimeSync() {
  const [connected, setConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return {
    connected,
    error,
    reconnect: () => {
      setConnected(true);
      setError(null);
      console.log("Firebase realtime reconnected");
    },
  };
}
