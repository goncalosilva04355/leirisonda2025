import { useState } from "react";

// Simplified auto sync - Firebase only
export function useAutoSync() {
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "completed" | "error"
  >("idle");

  return {
    lastSync,
    syncStatus,
    isAutoSyncing: syncStatus === "syncing",
    forceSyncNow: () => {
      setSyncStatus("syncing");
      setTimeout(() => {
        setLastSync(new Date());
        setSyncStatus("completed");
      }, 1000);
    },
  };
}
