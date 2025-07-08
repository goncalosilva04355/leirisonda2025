import { useState, useEffect } from "react";
import {
  syncService,
  User,
  Pool,
  Maintenance,
  Work,
} from "../services/firebaseService";

interface DataSyncState {
  // Data
  users: User[];
  pools: Pool[];
  maintenance: Maintenance[];
  works: Work[];
  clients: any[];

  // Status
  isLoading: boolean;
  error: string | null;

  // Stats
  totalItems: number;
}

export const useDataSync = () => {
  const [state, setState] = useState<DataSyncState>({
    users: [],
    pools: [],
    maintenance: [],
    works: [],
    clients: [],
    isLoading: true,
    error: null,
    totalItems: 0,
  });

  useEffect(() => {
    console.log("🔄 Iniciando sincronização global simples...");

    // Initialize data
    syncService.initializeData().catch((error) => {
      console.error("Erro ao inicializar dados:", error);
      setState((prev) => ({
        ...prev,
        error: "Erro ao inicializar dados",
        isLoading: false,
      }));
    });

    // Subscribe to all data changes
    const unsubscribe = syncService.subscribeToAllData({
      onUsersChange: (users) => {
        console.log(`👥 Utilizadores sincronizados: ${users.length}`);
        setState((prev) => {
          const newState = { ...prev, users, isLoading: false };
          newState.totalItems =
            newState.users.length +
            newState.pools.length +
            newState.maintenance.length +
            newState.works.length +
            newState.clients.length;
          return newState;
        });
      },
      onPoolsChange: (pools) => {
        console.log(`🏊 Piscinas sincronizadas: ${pools.length}`);
        setState((prev) => {
          const newState = { ...prev, pools };
          newState.totalItems =
            newState.users.length +
            newState.pools.length +
            newState.maintenance.length +
            newState.works.length +
            newState.clients.length;
          return newState;
        });
      },
      onMaintenanceChange: (maintenance) => {
        console.log(`🔧 Manutenções sincronizadas: ${maintenance.length}`);
        setState((prev) => {
          const newState = { ...prev, maintenance };
          newState.totalItems =
            newState.users.length +
            newState.pools.length +
            newState.maintenance.length +
            newState.works.length +
            newState.clients.length;
          return newState;
        });
      },
      onWorksChange: (works) => {
        console.log(`⚒️ Obras sincronizadas: ${works.length}`);
        setState((prev) => {
          const newState = { ...prev, works };
          newState.totalItems =
            newState.users.length +
            newState.pools.length +
            newState.maintenance.length +
            newState.works.length +
            newState.clients.length;
          return newState;
        });
      },
      onClientsChange: (clients) => {
        console.log(`👔 Clientes sincronizados: ${clients.length}`);
        setState((prev) => {
          const newState = { ...prev, clients };
          newState.totalItems =
            newState.users.length +
            newState.pools.length +
            newState.maintenance.length +
            newState.works.length +
            newState.clients.length;
          return newState;
        });
      },
    });

    console.log(
      "✅ Sincronização global configurada - todos os dados partilhados",
    );

    return () => {
      console.log("🛑 Desconectando sincronização global");
      unsubscribe();
    };
  }, []);

  return state;
};
