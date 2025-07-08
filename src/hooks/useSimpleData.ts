import { useState, useEffect } from "react";
import {
  syncService,
  userService,
  poolService,
  maintenanceService,
  workService,
  clientService,
  User,
  Pool,
  Maintenance,
  Work,
  Client,
} from "../services/simpleFirebaseService";

interface SimpleDataState {
  users: User[];
  pools: Pool[];
  maintenance: Maintenance[];
  futureMaintenance: Maintenance[];
  works: Work[];
  clients: Client[];
  isLoading: boolean;
  error: string | null;
}

export function useSimpleData() {
  const [state, setState] = useState<SimpleDataState>({
    users: [],
    pools: [],
    maintenance: [],
    futureMaintenance: [],
    works: [],
    clients: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    console.log("🚀 Inicializando dados simples...");

    // Initialize Firebase data
    syncService.initializeData().catch((error) => {
      console.warn("⚠️ Erro na inicialização:", error);
    });

    // Subscribe to all data changes
    const unsubscribe = syncService.subscribeToAllData({
      onUsersChange: (users) => {
        setState((prev) => ({ ...prev, users, isLoading: false }));
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
      onClientsChange: (clients) => {
        setState((prev) => ({ ...prev, clients }));
      },
    });

    // Subscribe to future maintenance separately
    const unsubscribeFuture = maintenanceService.subscribeToFutureMaintenance(
      (futureMaintenance) => {
        setState((prev) => ({ ...prev, futureMaintenance }));
      },
    );

    return () => {
      console.log("🛑 Limpando subscriptions simples");
      unsubscribe();
      if (unsubscribeFuture) unsubscribeFuture();
    };
  }, []);

  return {
    // Data
    ...state,

    // Services for direct use
    userService,
    poolService,
    maintenanceService,
    workService,
    clientService,
  };
}
