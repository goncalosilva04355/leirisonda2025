import { useEffect, useState } from "react";
import { fullSyncService } from "../services/fullSyncService";

export const useAutoSync = () => {
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "completed" | "error"
  >("idle");
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const performAutoSync = async () => {
      // Firebase temporarily disabled due to quota - running in offline mode
      console.log("⏸️ Firebase sync paused - running in offline mode");
      setSyncStatus("completed");
      const now = new Date();
      setLastSync(now);
      sessionStorage.setItem("auto-sync-completed", "true");
      return;

      // Check if we should auto-sync (e.g., only once per session)
      const hasAutoSynced = sessionStorage.getItem("auto-sync-completed");

      if (hasAutoSynced) {
        setSyncStatus("completed");
        const lastSyncTime = localStorage.getItem("last-full-sync");
        if (lastSyncTime) {
          setLastSync(new Date(lastSyncTime));
        }
        return;
      }

      setSyncStatus("syncing");

      try {
        // Perform full sync
        const result = await fullSyncService.syncAllData();

        if (result.success) {
          setSyncStatus("completed");
          const now = new Date();
          setLastSync(now);
          localStorage.setItem("last-full-sync", now.toISOString());
          sessionStorage.setItem("auto-sync-completed", "true");
          console.log("✅ Auto-sync completed successfully");
        } else {
          setSyncStatus("error");
          console.warn("⚠️ Auto-sync completed with errors:", result.message);
        }
      } catch (error: any) {
        setSyncStatus("error");
        console.error("❌ Auto-sync failed:", error);

        // Handle quota exceeded specifically
        if (
          error.message?.includes("quota") ||
          error.message?.includes("resource-exhausted")
        ) {
          console.warn("🔥 Firebase quota exceeded in auto-sync");
          setSyncStatus("completed"); // Set as completed to prevent retries
        }
      }
    };

    // Delay auto-sync to let the app initialize
    const timer = setTimeout(performAutoSync, 2000);

    return () => clearTimeout(timer);
  }, []);

  return {
    syncStatus,
    lastSync,
    isAutoSyncing: syncStatus === "syncing",
  };
};
