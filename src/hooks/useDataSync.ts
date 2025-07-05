import { useState, useEffect, useCallback } from "react";
import { realFirebaseService } from "../services/realFirebaseService";
import { useDataMutationSync } from "./useAutoDataSync";

// Simulate data types
export interface Pool {
  id: string;
  name: string;
  location: string;
  client: string;
  type: string;
  status: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  poolId: string;
  poolName: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | "scheduled";
  description: string;
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  notes?: string;
  observations?: string;
  clientName?: string;
  clientContact?: string;
  location?: string;
  createdAt: string;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  client: string;
  contact?: string;
  location: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  startDate: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  assignedTo: string;
  assignedUsers?: Array<{ id: string; name: string }>;
  assignedUserIds?: string[];
  folhaGerada?: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  pools: string[];
  createdAt: string;
}

// Mock data for demonstration
const mockPools: Pool[] = [
  {
    id: "pool-1",
    name: "Piscina Villa Marina",
    location: "Quinta da Marinha, Cascais",
    client: "João Silva",
    type: "Residencial",
    status: "Ativa",
    lastMaintenance: "2025-01-15",
    nextMaintenance: "2025-02-15",
    createdAt: "2025-01-01",
  },
  {
    id: "pool-2",
    name: "Piscina Condomínio Sol",
    location: "Estoril",
    client: "Condomínio Sol Nascente",
    type: "Comunitária",
    status: "Ativa",
    lastMaintenance: "2025-01-10",
    nextMaintenance: "2025-02-10",
    createdAt: "2025-01-02",
  },
];

// Mock maintenance data
const mockMaintenance: Maintenance[] = [
  {
    id: "maint-1",
    poolId: "pool-1",
    poolName: "Piscina Villa Marina",
    type: "Limpeza",
    status: "completed",
    description: "Limpeza completa e tratamento químico",
    scheduledDate: "2025-01-15",
    completedDate: "2025-01-15",
    technician: "Maria Santos",
    notes: "Piscina em excelentes condições",
    clientName: "João Silva",
    clientContact: "912345678",
    location: "Quinta da Marinha, Cascais",
    createdAt: "2025-01-10",
  },
  {
    id: "maint-2",
    poolId: "pool-2",
    poolName: "Piscina Condomínio Sol",
    type: "Manutenção",
    status: "completed",
    description: "Verificação de equipamentos e limpeza",
    scheduledDate: "2025-01-10",
    completedDate: "2025-01-10",
    technician: "João Santos",
    notes: "Bomba a precisar de revisão",
    clientName: "Condomínio Sol Nascente",
    clientContact: "213456789",
    location: "Estoril",
    createdAt: "2025-01-05",
  },
  {
    id: "maint-3",
    poolId: "pool-1",
    poolName: "Piscina Villa Marina",
    type: "Limpeza",
    status: "scheduled",
    description: "Limpeza mensal programada",
    scheduledDate: "2025-02-15",
    technician: "Maria Santos",
    clientName: "João Silva",
    clientContact: "912345678",
    location: "Quinta da Marinha, Cascais",
    createdAt: "2025-01-15",
  },
  {
    id: "maint-4",
    poolId: "pool-2",
    poolName: "Piscina Condomínio Sol",
    type: "Tratamento",
    status: "scheduled",
    description: "Tratamento químico e análise da água",
    scheduledDate: "2025-02-10",
    technician: "João Santos",
    clientName: "Condomínio Sol Nascente",
    clientContact: "213456789",
    location: "Estoril",
    createdAt: "2025-01-10",
  },
];

// Mock works data - DISABLED to prevent auto-populated test data
const mockWorks: Work[] = [];

// Mock clients data
const mockClients: Client[] = [
  {
    id: "client-1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "912345678",
    address: "Quinta da Marinha, Cascais",
    pools: ["pool-1"],
    createdAt: "2025-01-01",
  },
  {
    id: "client-2",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "923456789",
    address: "Sintra",
    pools: [],
    createdAt: "2025-01-18",
  },
];

export interface SyncState {
  pools: Pool[];
  maintenance: Maintenance[];
  futureMaintenance: Maintenance[];
  works: Work[];
  clients: Client[];
  isLoading: boolean;
  lastSync: Date | null;
  error: string | null;
}

export interface SyncActions {
  addPool: (pool: Omit<Pool, "id" | "createdAt">) => void;
  updatePool: (id: string, pool: Partial<Pool>) => void;
  deletePool: (id: string) => void;

  addMaintenance: (maintenance: Omit<Maintenance, "id" | "createdAt">) => void;
  updateMaintenance: (id: string, maintenance: Partial<Maintenance>) => void;
  deleteMaintenance: (id: string) => void;

  addWork: (work: Omit<Work, "id" | "createdAt">) => void;
  updateWork: (id: string, work: Partial<Work>) => void;
  deleteWork: (id: string) => void;

  addClient: (client: Omit<Client, "id" | "createdAt">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  syncWithFirebase: () => Promise<void>;
  enableSync: (enabled: boolean) => void;
  cleanAllData: () => Promise<void>;
}

export function useDataSync(): SyncState & SyncActions {
  const [state, setState] = useState<SyncState>(() => {
    // CRITICAL: Load existing data from localStorage to prevent data loss
    try {
      const storedWorks = localStorage.getItem("works");
      const storedPools = localStorage.getItem("pools");
      const storedMaintenance = localStorage.getItem("maintenance");
      const storedClients = localStorage.getItem("clients");

      const works = storedWorks ? JSON.parse(storedWorks) : [];
      const pools = storedPools ? JSON.parse(storedPools) : [];
      const maintenance = storedMaintenance
        ? JSON.parse(storedMaintenance)
        : [];
      const clients = storedClients ? JSON.parse(storedClients) : [];

      console.log("🔄 Restored data from localStorage:", {
        works: works.length,
        pools: pools.length,
        maintenance: maintenance.length,
        clients: clients.length,
      });

      const today = new Date();
      const futureMaintenance = maintenance.filter(
        (m: Maintenance) => new Date(m.scheduledDate) >= today,
      );

      return {
        pools,
        maintenance,
        futureMaintenance,
        works,
        clients,
        isLoading: false,
        lastSync: null,
        error: null,
      };
    } catch (error) {
      console.error("❌ Error loading data from localStorage:", error);
      return {
        pools: [],
        maintenance: [],
        futureMaintenance: [],
        works: [],
        clients: [],
        isLoading: false,
        lastSync: null,
        error: null,
      };
    }
  });

  // Firebase sync is always enabled with fixed configuration
  const [syncEnabled, setSyncEnabled] = useState(true);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem("works", JSON.stringify(state.works));
      localStorage.setItem("pools", JSON.stringify(state.pools));
      localStorage.setItem("maintenance", JSON.stringify(state.maintenance));
      localStorage.setItem("clients", JSON.stringify(state.clients));
    } catch (error) {
      console.error("❌ Error saving data to localStorage:", error);
    }
  }, [state.works, state.pools, state.maintenance, state.clients]);

  // Hook para sincronização automática em mutações - with debugging
  const withAutoSync = <T extends any[], R>(
    fn: (...args: T) => R | Promise<R>,
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        console.log("🔄 Executing data operation with args:", args);
        const result = await fn(...args);
        console.log("✅ Data operation completed successfully");
        return result;
      } catch (error) {
        console.error("❌ Error in data operation:", error);
        throw error;
      }
    };
  };

  // Initial sync when enabled
  useEffect(() => {
    if (syncEnabled) {
      const performInitialSync = async () => {
        try {
          const initialized = realFirebaseService.initialize();
          if (initialized) {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
              const connectionOk = await realFirebaseService.testConnection();
              if (!connectionOk) {
                console.warn(
                  "Firebase connection test failed, using local mode",
                );
                setState((prev) => ({
                  ...prev,
                  isLoading: false,
                  error: null,
                }));
                return;
              }

              // Set successful sync immediately to remove "waiting" status
              setState((prev) => ({
                ...prev,
                isLoading: false,
                lastSync: new Date(),
                error: null,
              }));
            } catch (error: any) {
              console.warn(
                "Initial Firebase sync failed, using local mode:",
                error,
              );
              setState((prev) => ({
                ...prev,
                isLoading: false,
                error: null, // Don't show error, just use local mode
              }));
            }
          } else {
            // Clear error when Firebase is not configured - should show "Modo Local"
            setState((prev) => ({
              ...prev,
              error: null,
              isLoading: false,
            }));
          }
        } catch (error: any) {
          console.warn(
            "Firebase initialization error, using local mode:",
            error,
          );
          setState((prev) => ({
            ...prev,
            error: null,
            isLoading: false,
          }));
        }
      };

      performInitialSync();
    } else {
      // When sync is disabled, clear any errors
      setState((prev) => ({
        ...prev,
        error: null,
        isLoading: false,
      }));
    }
  }, [syncEnabled]);

  // Real-time listeners
  useEffect(() => {
    if (!syncEnabled || !realFirebaseService.isReady()) {
      return;
    }

    // Set up real-time listeners
    const unsubscribePools = realFirebaseService.onPoolsChange((pools) => {
      // Only update if Firebase has data or if local data is empty
      setState((prev) => ({
        ...prev,
        pools: pools.length > 0 || prev.pools.length === 0 ? pools : prev.pools,
      }));
    });

    const unsubscribeWorks = realFirebaseService.onWorksChange((works) => {
      // Only update if Firebase has data or if local data is empty
      setState((prev) => ({
        ...prev,
        works: works.length > 0 || prev.works.length === 0 ? works : prev.works,
      }));
    });

    const unsubscribeMaintenance = realFirebaseService.onMaintenanceChange(
      (maintenance) => {
        const today = new Date();
        const futureMaintenance = maintenance.filter(
          (m) => new Date(m.scheduledDate) >= today,
        );

        // Only update if Firebase has data or if local data is empty
        setState((prev) => ({
          ...prev,
          maintenance:
            maintenance.length > 0 || prev.maintenance.length === 0
              ? maintenance
              : prev.maintenance,
          futureMaintenance:
            maintenance.length > 0 || prev.maintenance.length === 0
              ? futureMaintenance
              : prev.futureMaintenance,
        }));
      },
    );

    const unsubscribeClients = realFirebaseService.onClientsChange(
      (clients) => {
        // Only update if Firebase has data or if local data is empty
        setState((prev) => ({
          ...prev,
          clients:
            clients.length > 0 || prev.clients.length === 0
              ? clients
              : prev.clients,
        }));
      },
    );

    // Cleanup function
    return () => {
      unsubscribePools();
      unsubscribeWorks();
      unsubscribeMaintenance();
      unsubscribeClients();
    };
  }, [syncEnabled]);

  // CRUD operations

  // Pools
  const addPool = useCallback(
    withAutoSync(async (poolData: Omit<Pool, "id" | "createdAt">) => {
      const newPool: Pool = {
        ...poolData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        pools: [...prev.pools, newPool],
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.addPool(newPool);
      }
    }),
    [withAutoSync],
  );

  const updatePool = useCallback(
    withAutoSync(async (id: string, poolData: Partial<Pool>) => {
      setState((prev) => ({
        ...prev,
        pools: prev.pools.map((pool) =>
          pool.id === id ? { ...pool, ...poolData } : pool,
        ),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.updatePool(id, poolData);
      }
    }),
    [withAutoSync],
  );

  const deletePool = useCallback(
    withAutoSync(async (id: string) => {
      setState((prev) => ({
        ...prev,
        pools: prev.pools.filter((pool) => pool.id !== id),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.deletePool(id);
      }
    }),
    [withAutoSync],
  );

  // Maintenance
  const addMaintenance = useCallback(
    withAutoSync(
      async (maintenanceData: Omit<Maintenance, "id" | "createdAt">) => {
        const newMaintenance: Maintenance = {
          ...maintenanceData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };

        // Update both maintenance and futureMaintenance arrays
        const today = new Date();
        const isFuture =
          new Date(newMaintenance.scheduledDate) >= today &&
          (newMaintenance.status === "scheduled" ||
            newMaintenance.status === "pending");

        setState((prev) => ({
          ...prev,
          maintenance: [...prev.maintenance, newMaintenance],
          futureMaintenance: isFuture
            ? [...prev.futureMaintenance, newMaintenance]
            : prev.futureMaintenance,
        }));

        if (realFirebaseService.isReady()) {
          await realFirebaseService.addMaintenance(newMaintenance);
        }
      },
    ),
    [withAutoSync],
  );

  const updateMaintenance = useCallback(
    withAutoSync(async (id: string, maintenanceData: Partial<Maintenance>) => {
      setState((prev) => {
        const updatedMaintenance = prev.maintenance.map((maint) =>
          maint.id === id ? { ...maint, ...maintenanceData } : maint,
        );

        // Recalculate future maintenance
        const today = new Date();
        const futureMaintenance = updatedMaintenance.filter(
          (m) =>
            new Date(m.scheduledDate) >= today &&
            (m.status === "scheduled" || m.status === "pending"),
        );

        return {
          ...prev,
          maintenance: updatedMaintenance,
          futureMaintenance,
        };
      });

      if (realFirebaseService.isReady()) {
        await realFirebaseService.updateMaintenance(id, maintenanceData);
      }
    }),
    [withAutoSync],
  );

  const deleteMaintenance = useCallback(
    withAutoSync(async (id: string) => {
      setState((prev) => ({
        ...prev,
        maintenance: prev.maintenance.filter((maint) => maint.id !== id),
        futureMaintenance: prev.futureMaintenance.filter(
          (maint) => maint.id !== id,
        ),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.deleteMaintenance(id);
      }
    }),
    [withAutoSync],
  );

  // Works
  const addWork = useCallback(
    withAutoSync(async (workData: Omit<Work, "id" | "createdAt">) => {
      console.log("🔧 addWork called with data:", workData);

      const newWork: Work = {
        ...workData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      console.log("🆕 Creating new work:", newWork);

      setState((prev) => {
        const updatedWorks = [...prev.works, newWork];
        console.log("📊 Updated works count:", updatedWorks.length);
        return {
          ...prev,
          works: updatedWorks,
        };
      });

      if (realFirebaseService.isReady()) {
        console.log("🔥 Syncing to Firebase...");
        await realFirebaseService.addWork(newWork);
      } else {
        console.log("📱 Firebase not ready, using local storage only");
      }

      console.log("✅ Work added successfully");
    }),
    [withAutoSync],
  );

  const updateWork = useCallback(
    withAutoSync(async (id: string, workData: Partial<Work>) => {
      setState((prev) => ({
        ...prev,
        works: prev.works.map((work) =>
          work.id === id ? { ...work, ...workData } : work,
        ),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.updateWork(id, workData);
      }
    }),
    [withAutoSync],
  );

  const deleteWork = useCallback(
    withAutoSync(async (id: string) => {
      setState((prev) => ({
        ...prev,
        works: prev.works.filter((work) => work.id !== id),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.deleteWork(id);
      }
    }),
    [withAutoSync],
  );

  // Clients
  const addClient = useCallback(
    withAutoSync(async (clientData: Omit<Client, "id" | "createdAt">) => {
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        clients: [...prev.clients, newClient],
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.addClient(newClient);
      }
    }),
    [withAutoSync],
  );

  const updateClient = useCallback(
    withAutoSync(async (id: string, clientData: Partial<Client>) => {
      setState((prev) => ({
        ...prev,
        clients: prev.clients.map((client) =>
          client.id === id ? { ...client, ...clientData } : client,
        ),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.updateClient(id, clientData);
      }
    }),
    [withAutoSync],
  );

  const deleteClient = useCallback(
    withAutoSync(async (id: string) => {
      setState((prev) => ({
        ...prev,
        clients: prev.clients.filter((client) => client.id !== id),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.deleteClient(id);
      }
    }),
    [withAutoSync],
  );

  // Sync operations
  const syncWithFirebase = useCallback(async () => {
    if (!realFirebaseService.isReady()) {
      console.warn("Firebase service not ready");
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [pools, maintenance, works, clients] = await Promise.all([
        realFirebaseService.getPools(),
        realFirebaseService.getMaintenance(),
        realFirebaseService.getWorks(),
        realFirebaseService.getClients(),
      ]);

      // Calculate future maintenance
      const today = new Date();
      const futureMaintenance = maintenance.filter(
        (m) =>
          new Date(m.scheduledDate) >= today &&
          (m.status === "scheduled" || m.status === "pending"),
      );

      setState((prev) => ({
        ...prev,
        pools,
        maintenance,
        futureMaintenance,
        works,
        clients,
        isLoading: false,
        lastSync: new Date(),
        error: null,
      }));
    } catch (error: any) {
      console.error("Firebase sync error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Sync failed",
      }));
    }
  }, []);

  const enableSync = useCallback((enabled: boolean) => {
    setSyncEnabled(enabled);
  }, []);

  const cleanAllData = useCallback(async () => {
    // Clear all data locally
    setState({
      pools: [],
      maintenance: [],
      futureMaintenance: [],
      works: [],
      clients: [],
      isLoading: false,
      lastSync: null,
      error: null,
    });

    // Clear all data in Firebase if connected
    if (realFirebaseService.isReady()) {
      try {
        await realFirebaseService.cleanAllData();
      } catch (error) {
        console.warn("Failed to clean Firebase data:", error);
      }
    }
  }, []);

  return {
    ...state,
    addPool,
    updatePool,
    deletePool,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    addWork,
    updateWork,
    deleteWork,
    addClient,
    updateClient,
    deleteClient,
    syncWithFirebase,
    enableSync,
    cleanAllData,
  };
}
