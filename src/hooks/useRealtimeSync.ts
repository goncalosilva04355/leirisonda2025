import { useState, useEffect, useRef } from "react";
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

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Conexão restaurada - reativando sincronização");
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log("🌐 Conexão perdida - pausando sincronização");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let unsubscribeAll: (() => void) | null = null;
    let unsubscribeFuture: (() => void) | null = null;

    const initializeAndSubscribe = async () => {
      try {
        // Firebase realtime sync enabled for cross-device functionality
        console.log(
          "🔥 Inicializando sincronização em tempo real - atualizações automáticas entre dispositivos",
        );

        // Firebase is always configured with fixed settings
        console.log("🔄 Firebase configurado - sincronização completa ativada");

        // Initialize default data if needed
        await syncService.initializeData();

        // Subscribe to all data changes with enhanced error handling
        unsubscribeAll = syncService.subscribeToAllData({
          onUsersChange: (users) => {
            console.log(
              `👥 Dados de usuários atualizados: ${users.length} usuários`,
            );
            setState((prev) => ({
              ...prev,
              users,
              loading: false,
              error: null,
            }));

            // Trigger localStorage update for cross-device sync
            localStorage.setItem("users", JSON.stringify(users));
          },
          onPoolsChange: (pools) => {
            console.log(
              `🏊 Dados de piscinas atualizados: ${pools.length} piscinas`,
            );
            setState((prev) => ({ ...prev, pools }));

            // Trigger localStorage update for cross-device sync
            localStorage.setItem("pools", JSON.stringify(pools));
          },
          onMaintenanceChange: (maintenance) => {
            console.log(
              `🔧 Dados de manutenção atualizados: ${maintenance.length} manutenções`,
            );
            setState((prev) => ({ ...prev, maintenance }));

            // Trigger localStorage update for cross-device sync
            localStorage.setItem("maintenance", JSON.stringify(maintenance));
          },
          onWorksChange: (works) => {
            console.log(`⚒️ Dados de obras atualizados: ${works.length} obras`);
            setState((prev) => ({ ...prev, works }));

            // Trigger localStorage update for cross-device sync
            localStorage.setItem("works", JSON.stringify(works));
          },
        });

        // Subscribe to future maintenance separately with enhanced monitoring
        unsubscribeFuture = maintenanceService.subscribeToFutureMaintenance(
          (futureMaintenance) => {
            console.log(
              `📅 Manutenções futuras atualizadas: ${futureMaintenance.length} agendadas`,
            );
            setState((prev) => ({ ...prev, futureMaintenance }));
          },
        );

        console.log("✅ Sincronização em tempo real configurada com sucesso");
      } catch (error) {
        console.error("❌ Erro ao inicializar sincronização:", error);
        setState((prev) => ({
          ...prev,
          error: "Erro ao sincronizar dados. Tentando reconectar...",
          loading: false,
        }));

        // Auto-retry connection after error
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("🔄 Tentando reconectar sincronização...");
          initializeAndSubscribe();
        }, 5000); // Retry after 5 seconds
      }
    };

    // Only initialize if online
    if (isOnline) {
      initializeAndSubscribe();
    } else {
      setState((prev) => ({
        ...prev,
        error: "Sem conexão - sincronização pausada",
        loading: false,
      }));
    }

    // Cleanup subscriptions
    return () => {
      if (unsubscribeAll) unsubscribeAll();
      if (unsubscribeFuture) unsubscribeFuture();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isOnline]);

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
