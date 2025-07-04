import { useState, useEffect } from "react";
import {
  syncService,
  userService,
  poolService,
  maintenanceService,
  workService,
  type User,
  type Pool,
  type Maintenance,
  type Work,
} from "../services/firebaseService";

export interface SyncState {
  users: User[];
  pools: Pool[];
  maintenance: Maintenance[];
  futureMaintenance: Maintenance[];
  works: Work[];
  loading: boolean;
  error: string | null;
}

export function useRealtimeSync() {
  const [state, setState] = useState<SyncState>({
    users: [],
    pools: [],
    maintenance: [],
    futureMaintenance: [],
    works: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let unsubscribeAll: (() => void) | null = null;
    let unsubscribeFuture: (() => void) | null = null;

    const initializeAndSubscribe = async () => {
      try {
        // TEMPORARILY DISABLED TO PREVENT FIREBASE QUOTA EXCEEDED ERRORS
        console.warn("🛑 useRealtimeSync DISABLED to prevent quota exceeded");
        setState((prev) => ({ ...prev, loading: false }));
        return;

        // Firebase is always configured with fixed settings
        console.log("Firebase sync always available with fixed configuration");

        // Initialize default data if needed
        await syncService.initializeData();

        // Subscribe to all data changes
        unsubscribeAll = syncService.subscribeToAllData({
          onUsersChange: (users) => {
            setState((prev) => ({ ...prev, users, loading: false }));
          },
          onPoolsChange: (pools) => {
            setState((prev) => ({ ...prev, pools }));
          },
          onMaintenanceChange: (maintenance) => {
            setState((prev) => ({ ...prev, maintenance }));
          },
          onWorksChange: (works) => {
            setState((prev) => ({ ...prev, works }));
          },
        });

        // Subscribe to future maintenance separately
        unsubscribeFuture = maintenanceService.subscribeToFutureMaintenance(
          (futureMaintenance) => {
            setState((prev) => ({ ...prev, futureMaintenance }));
          },
        );
      } catch (error) {
        console.error("Error initializing sync:", error);
        setState((prev) => ({
          ...prev,
          error: "Erro ao sincronizar dados. Verifique a conexão.",
          loading: false,
        }));
      }
    };

    initializeAndSubscribe();

    // Cleanup subscriptions
    return () => {
      if (unsubscribeAll) unsubscribeAll();
      if (unsubscribeFuture) unsubscribeFuture();
    };
  }, []);

  // Service functions for easy access
  const services = {
    users: userService,
    pools: poolService,
    maintenance: maintenanceService,
    works: workService,
  };

  return {
    ...state,
    services,
  };
}

// Separate hook for managing users specifically
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = userService.subscribeToUsers((userData) => {
      setUsers(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addUser = async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await userService.addUser(userData);
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Erro ao adicionar utilizador");
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      await userService.updateUser(userId, userData);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Erro ao atualizar utilizador");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Erro ao eliminar utilizador");
    }
  };

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
  };
}

// Hook for managing pools specifically
export function usePools() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = poolService.subscribeToPools((poolData) => {
      setPools(poolData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPool = async (
    poolData: Omit<Pool, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await poolService.addPool(poolData);
    } catch (error) {
      console.error("Error adding pool:", error);
      setError("Erro ao adicionar piscina");
    }
  };

  const updatePool = async (poolId: string, poolData: Partial<Pool>) => {
    try {
      await poolService.updatePool(poolId, poolData);
    } catch (error) {
      console.error("Error updating pool:", error);
      setError("Erro ao atualizar piscina");
    }
  };

  const deletePool = async (poolId: string) => {
    try {
      await poolService.deletePool(poolId);
    } catch (error) {
      console.error("Error deleting pool:", error);
      setError("Erro ao eliminar piscina");
    }
  };

  return {
    pools,
    loading,
    error,
    addPool,
    updatePool,
    deletePool,
  };
}

// Hook for managing maintenance specifically
export function useMaintenance() {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [futureMaintenance, setFutureMaintenance] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeMaintenance = maintenanceService.subscribeToMaintenance(
      (maintenanceData) => {
        setMaintenance(maintenanceData);
        setLoading(false);
      },
    );

    const unsubscribeFuture = maintenanceService.subscribeToFutureMaintenance(
      (futureData) => {
        setFutureMaintenance(futureData);
      },
    );

    return () => {
      unsubscribeMaintenance();
      unsubscribeFuture();
    };
  }, []);

  const addMaintenance = async (
    maintenanceData: Omit<Maintenance, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await maintenanceService.addMaintenance(maintenanceData);
    } catch (error) {
      console.error("Error adding maintenance:", error);
      setError("Erro ao adicionar manutenção");
    }
  };

  const updateMaintenance = async (
    maintenanceId: string,
    maintenanceData: Partial<Maintenance>,
  ) => {
    try {
      await maintenanceService.updateMaintenance(
        maintenanceId,
        maintenanceData,
      );
    } catch (error) {
      console.error("Error updating maintenance:", error);
      setError("Erro ao atualizar manutenção");
    }
  };

  const deleteMaintenance = async (maintenanceId: string) => {
    try {
      await maintenanceService.deleteMaintenance(maintenanceId);
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      setError("Erro ao eliminar manutenção");
    }
  };

  return {
    maintenance,
    futureMaintenance,
    loading,
    error,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
  };
}
