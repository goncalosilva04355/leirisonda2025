import { useState, useEffect } from "react";
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
    try {
      return (
        window.firebase !== undefined ||
        (typeof db !== "undefined" && db !== null)
      );
    } catch {
      return false;
    }
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("🌐 App is online - syncing data...");
      syncData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("📱 App is offline - using local data");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync data when online
  const syncData = async () => {
    if (!user) return;

    if (!isFirebaseAvailable) {
      console.log("📱 Local mode - no sync needed");
      setLastSync(new Date());
      return;
    }

    if (!isOnline) return;

    try {
      setIsSyncing(true);
      console.log("🔄 Starting Firebase sync...");

      // Sync local data to Firebase first
      await firebaseService.syncLocalDataToFirebase();

      setLastSync(new Date());
      console.log("✅ Firebase sync completed");
    } catch (error) {
      console.error("❌ Firebase sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Set up real-time listeners when user is authenticated
  useEffect(() => {
    if (!user || !isOnline) {
      // Load from localStorage when offline or not authenticated
      loadLocalData();
      return;
    }

    console.log("🔄 Setting up Firebase real-time listeners...");

    // Listen to works
    const unsubscribeWorks = firebaseService.listenToWorks((firebaseWorks) => {
      setWorks(firebaseWorks);
      // Update localStorage for offline access
      localStorage.setItem("works", JSON.stringify(firebaseWorks));
      console.log(`📋 Received ${firebaseWorks.length} works from Firebase`);
    });

    // Listen to maintenances
    const unsubscribeMaintenances = firebaseService.listenToMaintenances(
      (firebaseMaintenances) => {
        setMaintenances(firebaseMaintenances);
        // Update localStorage for offline access
        localStorage.setItem(
          "pool_maintenances",
          JSON.stringify(firebaseMaintenances),
        );
        console.log(
          `🏊 Received ${firebaseMaintenances.length} maintenances from Firebase`,
        );
      },
    );

    // Listen to users (admin only)
    let unsubscribeUsers: (() => void) | undefined;
    if (user.permissions.canViewUsers) {
      unsubscribeUsers = firebaseService.listenToUsers((firebaseUsers) => {
        setUsers(firebaseUsers);
        localStorage.setItem("users", JSON.stringify(firebaseUsers));
        console.log(`👥 Received ${firebaseUsers.length} users from Firebase`);
      });
    }

    // Initial sync
    syncData();

    // Cleanup listeners
    return () => {
      unsubscribeWorks();
      unsubscribeMaintenances();
      if (unsubscribeUsers) unsubscribeUsers();
    };
  }, [user, isOnline]);

  // Load data from localStorage (offline mode)
  const loadLocalData = () => {
    try {
      const localWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const localMaintenances = JSON.parse(
        localStorage.getItem("pool_maintenances") || "[]",
      );
      const localUsers = JSON.parse(localStorage.getItem("users") || "[]");

      setWorks(localWorks);
      setMaintenances(localMaintenances);
      setUsers(localUsers);

      console.log("📱 Loaded data from localStorage (offline mode)");
    } catch (error) {
      console.error("❌ Error loading local data:", error);
    }
  };

  // Create new work (with Firebase sync)
  const createWork = async (
    workData: Omit<Work, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> => {
    try {
      if (isOnline && user) {
        // Create in Firebase
        const workId = await firebaseService.createWork(workData);
        console.log("✅ Work created in Firebase:", workId);
        return workId;
      } else {
        // Create locally
        const newWork: Work = {
          ...workData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedWorks = [...works, newWork];
        setWorks(updatedWorks);
        localStorage.setItem("works", JSON.stringify(updatedWorks));

        console.log("📱 Work created locally (offline)");
        return newWork.id;
      }
    } catch (error) {
      console.error("❌ Error creating work:", error);
      throw error;
    }
  };

  // Create new maintenance (with Firebase sync)
  const createMaintenance = async (
    maintenanceData: Omit<PoolMaintenance, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> => {
    try {
      if (isOnline && user) {
        // Create in Firebase
        const maintenanceId =
          await firebaseService.createMaintenance(maintenanceData);
        console.log("✅ Maintenance created in Firebase:", maintenanceId);
        return maintenanceId;
      } else {
        // Create locally
        const newMaintenance: PoolMaintenance = {
          ...maintenanceData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedMaintenances = [...maintenances, newMaintenance];
        setMaintenances(updatedMaintenances);
        localStorage.setItem(
          "pool_maintenances",
          JSON.stringify(updatedMaintenances),
        );

        console.log("📱 Maintenance created locally (offline)");
        return newMaintenance.id;
      }
    } catch (error) {
      console.error("❌ Error creating maintenance:", error);
      throw error;
    }
  };

  // Update work (with Firebase sync)
  const updateWork = async (
    workId: string,
    updates: Partial<Work>,
  ): Promise<void> => {
    try {
      if (isOnline && user) {
        // Update in Firebase
        await firebaseService.updateWork(workId, updates);
        console.log("✅ Work updated in Firebase:", workId);
      } else {
        // Update locally
        const updatedWorks = works.map((work) =>
          work.id === workId
            ? { ...work, ...updates, updatedAt: new Date().toISOString() }
            : work,
        );
        setWorks(updatedWorks);
        localStorage.setItem("works", JSON.stringify(updatedWorks));

        console.log("📱 Work updated locally (offline)");
      }
    } catch (error) {
      console.error("❌ Error updating work:", error);
      throw error;
    }
  };

  // Update maintenance (with Firebase sync)
  const updateMaintenance = async (
    maintenanceId: string,
    updates: Partial<PoolMaintenance>,
  ): Promise<void> => {
    try {
      if (isOnline && user) {
        // Update in Firebase
        await firebaseService.updateMaintenance(maintenanceId, updates);
        console.log("✅ Maintenance updated in Firebase:", maintenanceId);
      } else {
        // Update locally
        const updatedMaintenances = maintenances.map((maintenance) =>
          maintenance.id === maintenanceId
            ? {
                ...maintenance,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : maintenance,
        );
        setMaintenances(updatedMaintenances);
        localStorage.setItem(
          "pool_maintenances",
          JSON.stringify(updatedMaintenances),
        );

        console.log("📱 Maintenance updated locally (offline)");
      }
    } catch (error) {
      console.error("❌ Error updating maintenance:", error);
      throw error;
    }
  };

  return {
    // Data
    works,
    maintenances,
    users,

    // Status
    isOnline,
    isSyncing,
    lastSync,

    // Actions
    createWork,
    createMaintenance,
    updateWork,
    updateMaintenance,
    syncData,
  };
}
