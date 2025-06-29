import { useState, useEffect, useCallback } from "react";
import { User, Work, PoolMaintenance } from "@shared/types";
import { firebaseService } from "@/services/FirebaseService";
import { useAuth } from "@/components/AuthProvider";

export function useFirebaseSync() {
  const { user } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [maintenances, setMaintenances] = useState<PoolMaintenance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isFirebaseAvailable] = useState(() => {
    // Check if Firebase is properly initialized
    const status = firebaseService.getFirebaseStatus();
    return status.isAvailable;
  });

  // Monitor online status and auto-sync when back online
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("🌐 App is online - triggering auto-sync...");
      if (user && isFirebaseAvailable) {
        triggerAutoSync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("📱 App is offline - using local data only");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [user, isFirebaseAvailable]);

  // Auto-sync function for when going back online
  const triggerAutoSync = useCallback(async () => {
    if (!user || !isFirebaseAvailable || !isOnline) return;

    try {
      setIsSyncing(true);
      console.log("🔄 Auto-sync triggered...");
      await firebaseService.syncLocalDataToFirebase();
      setLastSync(new Date());
      console.log("✅ Auto-sync completed");
    } catch (error) {
      console.error("❌ Auto-sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [user, isFirebaseAvailable, isOnline]);

  // Manual sync function
  const syncData = useCallback(async () => {
    if (!user) return;

    if (!isFirebaseAvailable) {
      console.log("📱 Local mode - loading local data");
      loadLocalData();
      setLastSync(new Date());
      return;
    }

    if (!isOnline) {
      console.log("📱 Offline - loading local data");
      loadLocalData();
      return;
    }

    try {
      setIsSyncing(true);
      console.log("🔄 Starting manual sync...");
      await firebaseService.syncLocalDataToFirebase();
      setLastSync(new Date());
      console.log("✅ Manual sync completed");
    } catch (error) {
      console.error("❌ Manual sync failed:", error);
      // Fallback to local data
      loadLocalData();
    } finally {
      setIsSyncing(false);
    }
  }, [user, isFirebaseAvailable, isOnline]);

  // Load data from localStorage (offline mode)
  const loadLocalData = useCallback(() => {
    try {
      const localWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const localMaintenances = JSON.parse(
        localStorage.getItem("pool_maintenances") || "[]",
      );
      const localUsers = JSON.parse(localStorage.getItem("users") || "[]");

      setWorks(localWorks);
      setMaintenances(localMaintenances);
      setUsers(localUsers);

      console.log("📱 Loaded data from localStorage");
    } catch (error) {
      console.error("❌ Error loading local data:", error);
    }
  }, []);

  // Set up real-time listeners when user is authenticated
  useEffect(() => {
    if (!user) {
      loadLocalData();
      return;
    }

    console.log("🔄 Setting up real-time sync listeners...");

    // Listen to works with instant updates
    const unsubscribeWorks = firebaseService.listenToWorks((updatedWorks) => {
      setWorks(updatedWorks);
      setLastSync(new Date());
    });

    // Listen to maintenances with instant updates
    const unsubscribeMaintenances = firebaseService.listenToMaintenances(
      (updatedMaintenances) => {
        setMaintenances(updatedMaintenances);
        setLastSync(new Date());
      },
    );

    // Listen to users (admin only)
    let unsubscribeUsers: (() => void) | undefined;
    if (user.permissions.canViewUsers) {
      unsubscribeUsers = firebaseService.listenToUsers((updatedUsers) => {
        setUsers(updatedUsers);
      });
    }

    // Initial sync only if Firebase available and online
    if (isFirebaseAvailable && isOnline) {
      triggerAutoSync();
    }

    // Cleanup listeners
    return () => {
      console.log("🔄 Cleaning up real-time listeners");
      unsubscribeWorks();
      unsubscribeMaintenances();
      if (unsubscribeUsers) unsubscribeUsers();
    };
  }, [user, isFirebaseAvailable, isOnline, triggerAutoSync]);

  // Create new work with instant sync
  const createWork = useCallback(
    async (
      workData: Omit<Work, "id" | "createdAt" | "updatedAt">,
    ): Promise<string> => {
      try {
        // Create work (FirebaseService handles Firebase/local automatically)
        const workId = await firebaseService.createWork(workData);

        // Update sync timestamp
        if (isFirebaseAvailable && isOnline) {
          setLastSync(new Date());
        }

        return workId;
      } catch (error) {
        console.error("❌ Error creating work:", error);
        throw error;
      }
    },
    [isFirebaseAvailable, isOnline],
  );

  // Create new maintenance with instant sync
  const createMaintenance = useCallback(
    async (
      maintenanceData: Omit<PoolMaintenance, "id" | "createdAt" | "updatedAt">,
    ): Promise<string> => {
      try {
        // Create maintenance (FirebaseService handles Firebase/local automatically)
        const maintenanceId =
          await firebaseService.createMaintenance(maintenanceData);

        // Update sync timestamp
        if (isFirebaseAvailable && isOnline) {
          setLastSync(new Date());
        }

        return maintenanceId;
      } catch (error) {
        console.error("❌ Error creating maintenance:", error);
        throw error;
      }
    },
    [isFirebaseAvailable, isOnline],
  );

  // Update work with instant sync
  const updateWork = useCallback(
    async (workId: string, updates: Partial<Work>): Promise<void> => {
      try {
        // Update work (FirebaseService handles Firebase/local automatically)
        await firebaseService.updateWork(workId, updates);

        // Update sync timestamp
        if (isFirebaseAvailable && isOnline) {
          setLastSync(new Date());
        }
      } catch (error) {
        console.error("❌ Error updating work:", error);
        throw error;
      }
    },
    [isFirebaseAvailable, isOnline],
  );

  // Update maintenance with instant sync
  const updateMaintenance = useCallback(
    async (
      maintenanceId: string,
      updates: Partial<PoolMaintenance>,
    ): Promise<void> => {
      try {
        // Update maintenance (FirebaseService handles Firebase/local automatically)
        await firebaseService.updateMaintenance(maintenanceId, updates);

        // Update sync timestamp
        if (isFirebaseAvailable && isOnline) {
          setLastSync(new Date());
        }
      } catch (error) {
        console.error("❌ Error updating maintenance:", error);
        throw error;
      }
    },
    [isFirebaseAvailable, isOnline],
  );

  // Delete work with instant sync
  const deleteWork = useCallback(
    async (workId: string): Promise<void> => {
      try {
        console.log("🗑️ Deleting work with auto-sync:", workId);

        // Delete work (FirebaseService handles Firebase/local automatically)
        await firebaseService.deleteWork(workId);

        // Auto-sync after deletion (if Firebase available and online)
        if (isFirebaseAvailable && isOnline) {
          setLastSync(new Date());
          console.log("✅ Work deleted and auto-synced:", workId);
        } else {
          console.log("📱 Work deleted locally:", workId);
        }
      } catch (error) {
        console.error("❌ Error deleting work:", error);
        throw error;
      }
    },
    [isFirebaseAvailable, isOnline],
  );

  // Delete maintenance with instant sync
  const deleteMaintenance = useCallback(
    async (maintenanceId: string): Promise<void> => {
      try {
        console.log("🗑️ Deleting maintenance with auto-sync:", maintenanceId);

        // Delete maintenance (FirebaseService handles Firebase/local automatically)
        await firebaseService.deleteMaintenance(maintenanceId);

        // Auto-sync after deletion (if Firebase available and online)
        if (isFirebaseAvailable && isOnline) {
          setLastSync(new Date());
          console.log("✅ Maintenance deleted and auto-synced:", maintenanceId);
        } else {
          console.log("📱 Maintenance deleted locally:", maintenanceId);
        }
      } catch (error) {
        console.error("❌ Error deleting maintenance:", error);
        throw error;
      }
    },
    [isFirebaseAvailable, isOnline],
  );

  return {
    // Data
    works,
    maintenances,
    users,

    // Status
    isOnline,
    isSyncing,
    lastSync,
    isFirebaseAvailable,

    // Actions with auto-sync
    createWork,
    createMaintenance,
    updateWork,
    updateMaintenance,
    deleteWork,
    deleteMaintenance,

    // Manual sync
    syncData,
  };
}
