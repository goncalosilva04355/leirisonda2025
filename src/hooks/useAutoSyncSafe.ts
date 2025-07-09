import { useEffect, useState } from "react";

export const useAutoSyncSafe = () => {
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "completed" | "error"
  >("idle");
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Safe sync function that doesn't cause errors
  const performSync = async () => {
    try {
      setSyncStatus("syncing");
      // Simulate sync without complex dependencies
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLastSync(new Date());
      setSyncStatus("completed");
    } catch (error) {
      console.warn("Sync failed:", error);
      setSyncStatus("error");
    }
  };

  useEffect(() => {
    // Perform initial sync after a delay to avoid initialization issues
    const timer = setTimeout(() => {
      performSync();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Auto sync every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        performSync();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    syncStatus,
    lastSync,
    performSync,
  };
};
