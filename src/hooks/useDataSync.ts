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
const mockWorks: Work[] = [
  /*{
    id: "work-1",
    title: "Instalação Nova Piscina",
    description: "Construção de piscina 8x4m com sistema de filtração",
    client: "Ana Costa",
    contact: "923456789",
    location: "Sintra",
    type: "Instalação",
    status: "in_progress",
    startDate: "2025-01-20",
    budget: 25000,
    assignedTo: "Equipa A",
    assignedUsers: [
      { id: "1", name: "Gonçalo Fonseca" },
      { id: "2", name: "Maria Silva" },
    ],
    assignedUserIds: ["1", "2"],
    folhaGerada: false,
    createdAt: "2025-01-18",
  },
  {
    id: "work-2",
    title: "Reparação Sistema Filtração",
    description: "Substituiç��o de bomba e filtros",
    client: "Pedro Almeida",
    contact: "934567890",
    location: "Cascais",
    type: "Repara��ão",
    status: "pending",
    startDate: "2025-01-25",
    budget: 1500,
    assignedTo: "João Santos",
    assignedUsers: [{ id: "3", name: "João Santos" }],
    assignedUserIds: ["3"],
    folhaGerada: false,
    createdAt: "2025-01-22",
  },
  {
    id: "work-3",
    title: "Manutenção Anual Piscina Premium",
    description: "Serviço completo de manutenção anual com limpeza profunda",
    client: "Hotel Quinta da Marinha",
    contact: "214567890",
    location: "Quinta da Marinha, Cascais",
    type: "Manutenção",
    status: "in_progress",
    startDate: "2025-01-15",
    budget: 3500,
    assignedTo: "Alexandre",
    assignedUsers: [{ id: "4", name: "Alexandre" }],
    assignedUserIds: ["4"],
    folhaGerada: false,
    createdAt: "2025-01-14",
  },
  {
    id: "work-4",
    title: "Instalação Sistema Aquecimento Solar",
    description:
      "Instalação de sistema de aquecimento solar para piscina residencial",
    client: "Carlos Mendes",
    contact: "965432187",
    location: "Sintra",
    type: "Instalação",
    status: "pending",
    startDate: "2025-02-01",
    budget: 4200,
    assignedTo: "Maria Silva, Alexandre",
    assignedUsers: [
      { id: "2", name: "Maria Silva" },
      { id: "4", name: "Alexandre" },
    ],
    assignedUserIds: ["2", "4"],
    folhaGerada: false,
    createdAt: "2025-01-23",
  },
  {
    id: "work-5",
    title: "Renovação Deck Piscina",
    description:
      "Renovação completa do deck envolvente da piscina com materiais anti-derrapantes",
    client: "Família Rodrigues",
    contact: "923456781",
    location: "Estoril",
    type: "Renovação",
    status: "completed",
    startDate: "2024-12-20",
    budget: 6800,
    assignedTo: "João Santos, Alexandre",
    assignedUsers: [
      { id: "3", name: "João Santos" },
      { id: "4", name: "Alexandre" },
    ],
    assignedUserIds: ["3", "4"],
    folhaGerada: true,
    createdAt: "2024-12-15",
  },
];

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
  const [state, setState] = useState<SyncState>({
    pools: [],
    maintenance: [],
    futureMaintenance: [],
    works: [],
    clients: [],
    isLoading: false,
    lastSync: null,
    error: null,
  });

  // Firebase sync is always enabled with fixed configuration
  const [syncEnabled, setSyncEnabled] = useState(true);

  // Hook para sincronização automática em mutações - temporarily disabled
  // const { withAutoSync } = useDataMutationSync();
  const withAutoSync = <T extends any[], R>(
    fn: (...args: T) => R | Promise<R>,
  ) => fn;

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
      setState((prev) => ({
        ...prev,
        pools: pools,
      }));
    });

    const unsubscribeWorks = realFirebaseService.onWorksChange((works) => {
      setState((prev) => ({
        ...prev,
        works: works,
      }));
    });

    const unsubscribeMaintenance = realFirebaseService.onMaintenanceChange(
      (maintenance) => {
        const today = new Date();
        const futureMaintenance = maintenance.filter(
          (m) => new Date(m.scheduledDate) >= today,
        );

        setState((prev) => ({
          ...prev,
          maintenance: maintenance,
          futureMaintenance,
        }));
      },
    );

    const unsubscribeClients = realFirebaseService.onClientsChange(
      (clients) => {
        setState((prev) => ({
          ...prev,
          clients: clients,
        }));
      },
    );

    // Cleanup listeners on unmount
    return () => {
      unsubscribePools();
      unsubscribeWorks();
      unsubscribeMaintenance();
      unsubscribeClients();
    };
  }, [syncEnabled]);

  // Initialize with data from localStorage + mock data
  useEffect(() => {
    const today = new Date();

    // Check if we need to do a one-time cleanup
    const hasBeenCleaned = localStorage.getItem("demo-data-cleaned");

    if (!hasBeenCleaned) {
      // ONE-TIME CLEANUP: Remove old demo data only once
      console.log("🧹 ONE-TIME CLEANUP: Removing old demo data");
      localStorage.removeItem("pools");
      localStorage.removeItem("works");
      localStorage.removeItem("maintenance");
      localStorage.removeItem("interventions");
      localStorage.removeItem("clients");

      // Mark as cleaned so this doesn't happen again
      localStorage.setItem("demo-data-cleaned", "true");
      localStorage.setItem("app-cleaned", new Date().toISOString());
      localStorage.setItem("last-cleanup", new Date().toISOString());

      // Start with empty data after cleanup
      setState((prev) => ({
        ...prev,
        pools: [],
        maintenance: [],
        futureMaintenance: [],
        works: [],
        clients: [],
      }));

      console.log("�� Demo data cleaned - new data will be saved normally");
      return;
    }

    // Normal startup - load existing data from localStorage
    console.log("📂 Loading saved data from localStorage");

    // Clean only specific known mock/fictitious data while preserving real user data
    const cleanMockData = (data: any[], type: string) => {
      if (!Array.isArray(data)) return data;
      // Only remove data with very specific mock identifiers
      return data.filter((item) => {
        if (!item || !item.id) return true; // Keep items without IDs

        // Only remove items that match exact mock data patterns
        const isExactMockPool =
          (item.id === "pool-1" && item.name === "Piscina Villa Marina") ||
          (item.id === "pool-2" && item.name === "Piscina Condomínio Sol");

        const isExactMockWork =
          (item.id === "work-1" && item.title === "Instalação Nova Piscina") ||
          (item.id === "work-2" &&
            item.title === "Reparação Sistema Filtração") ||
          (item.id === "work-3" &&
            item.title === "Manutenção Mensal Pool Club") ||
          (item.id === "work-4" &&
            item.title === "Instalação Cobertura Automática") ||
          (item.id === "work-5" &&
            item.title === "Renovação Sistema Filtração");

        const isExactMockMaintenance =
          item.id === "maint-1" ||
          item.id === "maint-2" ||
          item.id === "maint-3" ||
          item.id === "maint-4" ||
          item.id === "maint-5";

        const isExactMockClient =
          (item.id === "client-1" && item.name === "João Silva") ||
          (item.id === "client-2" && item.name === "Maria Santos");

        // Keep everything except exact mock matches
        return !(
          isExactMockPool ||
          isExactMockWork ||
          isExactMockMaintenance ||
          isExactMockClient
        );
      });
    };

    const rawPools = JSON.parse(localStorage.getItem("pools") || "[]");
    const rawMaintenance = JSON.parse(
      localStorage.getItem("maintenance") || "[]",
    );
    const rawWorks = JSON.parse(localStorage.getItem("works") || "[]");
    const rawClients = JSON.parse(localStorage.getItem("clients") || "[]");

    // Clean mock data from localStorage
    const savedPools = cleanMockData(rawPools, "pools");
    const savedMaintenance = cleanMockData(rawMaintenance, "maintenance");
    const savedWorks = cleanMockData(rawWorks, "works");
    const savedClients = cleanMockData(rawClients, "clients");

    // Save cleaned data back to localStorage
    localStorage.setItem("pools", JSON.stringify(savedPools));
    localStorage.setItem("maintenance", JSON.stringify(savedMaintenance));
    localStorage.setItem("works", JSON.stringify(savedWorks));
    localStorage.setItem("clients", JSON.stringify(savedClients));

    // Log what real data was found and preserved
    console.log("📊 Dados reais carregados:", {
      piscinas: savedPools.length,
      obras: savedWorks.length,
      manutencoes: savedMaintenance.length,
      clientes: savedClients.length,
    });

    // If no data found locally, try to force sync from Firebase
    if (
      savedPools.length === 0 &&
      savedWorks.length === 0 &&
      savedMaintenance.length === 0
    ) {
      console.log(
        "🔄 Nenhum dado local encontrado, tentando recuperar do Firebase...",
      );
      // Trigger sync with Firebase immediately after state is set
      setTimeout(() => {
        if (syncEnabled && realFirebaseService.isReady()) {
          syncWithFirebase();
        }
      }, 1000);
    }

    // Always use only saved data, never add mock data automatically
    const finalPools = savedPools;
    const finalMaintenance = savedMaintenance;
    const finalWorks = savedWorks;
    const finalClients = savedClients;

    // Calculate future maintenance
    const future = finalMaintenance.filter(
      (m) => new Date(m.scheduledDate) >= today,
    );

    // Set the loaded data
    setState((prev) => ({
      ...prev,
      pools: finalPools,
      maintenance: finalMaintenance,
      futureMaintenance: future,
      works: finalWorks,
      clients: finalClients,
    }));

    console.log("✅ Data loaded:", {
      pools: finalPools.length,
      works: finalWorks.length,
      maintenance: finalMaintenance.length,
      clients: finalClients.length,
      alexandreWorks: finalWorks.filter(
        (w) => w.assignedTo && w.assignedTo.includes("Alexandre"),
      ).length,
    });
  }, []);

  // Real Firebase sync
  const syncWithFirebase = useCallback(async () => {
    // Firebase temporarily paused - running in offline mode
    console.log("⏸️ Firebase sync paused - using local storage only");
    setState((prev) => ({ ...prev, isLoading: false, error: null }));
    return;

    if (!syncEnabled) {
      setState((prev) => ({ ...prev, error: "Firebase not configured" }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Initialize Firebase if not already done
      if (!realFirebaseService.isReady()) {
        const initialized = realFirebaseService.initialize();
        if (!initialized) {
          throw new Error("Failed to initialize Firebase");
        }
      }

      // Test connection
      const connectionOk = await realFirebaseService.testConnection();
      if (!connectionOk) {
        throw new Error("Firebase connection test failed");
      }

      // Sync all data from Firebase
      const firebaseData = await realFirebaseService.syncAllData();
      if (firebaseData) {
        // Merge with local data
        const localPools = JSON.parse(localStorage.getItem("pools") || "[]");
        const localWorks = JSON.parse(localStorage.getItem("works") || "[]");
        const localMaintenance = JSON.parse(
          localStorage.getItem("maintenance") || "[]",
        );
        const localInterventions = JSON.parse(
          localStorage.getItem("interventions") || "[]",
        );
        const localClients = JSON.parse(
          localStorage.getItem("clients") || "[]",
        );

        // Upload local data to Firebase if it doesn't exist there
        for (const pool of localPools) {
          if (!firebaseData.pools.find((p) => p.id === pool.id)) {
            await realFirebaseService.addPool(pool);
          }
        }

        for (const work of localWorks) {
          if (!firebaseData.works.find((w) => w.id === work.id)) {
            await realFirebaseService.addWork(work);
          }
        }

        for (const maintenance of localMaintenance) {
          if (!firebaseData.maintenance.find((m) => m.id === maintenance.id)) {
            await realFirebaseService.addMaintenance(maintenance);
          }
        }

        for (const intervention of localInterventions) {
          const maintenanceData = {
            id: intervention.id.toString(),
            poolId: intervention.poolId || "unknown",
            poolName: intervention.poolName || "Piscina",
            type: "Manutenção",
            status: intervention.status || "completed",
            description: intervention.workPerformed || "Manutenção realizada",
            scheduledDate: intervention.date,
            completedDate: intervention.date,
            technician: intervention.technician || "Técnico",
            notes: intervention.observations,
            createdAt: intervention.createdAt || new Date().toISOString(),
          };

          if (
            !firebaseData.maintenance.find((m) => m.id === maintenanceData.id)
          ) {
            await realFirebaseService.addMaintenance(maintenanceData);
          }
        }

        // Get updated data after upload
        const updatedData = await realFirebaseService.syncAllData();
        if (updatedData) {
          const today = new Date();
          const futureMaintenance = updatedData.maintenance.filter(
            (m) => new Date(m.scheduledDate) >= today,
          );

          setState((prev) => ({
            ...prev,
            pools: updatedData.pools,
            works: updatedData.works,
            maintenance: updatedData.maintenance,
            futureMaintenance,
            clients: updatedData.clients,
            isLoading: false,
            lastSync: new Date(),
            error: null,
          }));
        }
      }

      console.log("Firebase sync completed successfully");
    } catch (error) {
      console.error("Firebase sync failed:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: `Sync failed: ${error.message}`,
      }));
    }
  }, [syncEnabled]);

  // Pool actions
  const addPool = useCallback(
    withAutoSync(async (poolData: Omit<Pool, "id" | "createdAt">) => {
      const newPool: Pool = {
        ...poolData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // Add to local state immediately
      setState((prev) => ({
        ...prev,
        pools: [...prev.pools, newPool],
      }));

      // Add to localStorage for backup
      const savedPools = JSON.parse(localStorage.getItem("pools") || "[]");
      savedPools.push(newPool);
      localStorage.setItem("pools", JSON.stringify(savedPools));

      // Add to Firebase if sync is enabled
      if (syncEnabled && realFirebaseService.isReady()) {
        try {
          await realFirebaseService.addPool(newPool);
          console.log("Pool added to Firebase successfully");
        } catch (error) {
          console.error("Failed to add pool to Firebase:", error);
        }
      }
    }),
    [syncEnabled, withAutoSync],
  );

  const updatePool = useCallback(
    (id: string, poolData: Partial<Pool>) => {
      setState((prev) => ({
        ...prev,
        pools: prev.pools.map((pool) =>
          pool.id === id ? { ...pool, ...poolData } : pool,
        ),
      }));

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  const deletePool = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        pools: prev.pools.filter((pool) => pool.id !== id),
      }));

      // Remove from localStorage
      const savedPools = JSON.parse(localStorage.getItem("pools") || "[]");
      const updatedPools = savedPools.filter((pool: Pool) => pool.id !== id);
      localStorage.setItem("pools", JSON.stringify(updatedPools));

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  // Maintenance actions
  const addMaintenance = useCallback(
    withAutoSync(
      async (maintenanceData: Omit<Maintenance, "id" | "createdAt">) => {
        const newMaintenance: Maintenance = {
          ...maintenanceData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };

        // Add to local state immediately
        setState((prev) => {
          const updated = [...prev.maintenance, newMaintenance];
          const future = updated.filter(
            (m) => new Date(m.scheduledDate) >= new Date(),
          );

          return {
            ...prev,
            maintenance: updated,
            futureMaintenance: future,
          };
        });

        // Add to localStorage for backup
        const savedMaintenance = JSON.parse(
          localStorage.getItem("maintenance") || "[]",
        );
        savedMaintenance.push(newMaintenance);
        localStorage.setItem("maintenance", JSON.stringify(savedMaintenance));

        // Add to Firebase if sync is enabled
        if (syncEnabled && realFirebaseService.isReady()) {
          try {
            await realFirebaseService.addMaintenance(newMaintenance);
            console.log("Maintenance added to Firebase successfully");
          } catch (error) {
            console.error("Failed to add maintenance to Firebase:", error);
          }
        }
      },
    ),
    [syncEnabled, withAutoSync],
  );

  const updateMaintenance = useCallback(
    (id: string, maintenanceData: Partial<Maintenance>) => {
      setState((prev) => {
        const updated = prev.maintenance.map((maintenance) =>
          maintenance.id === id
            ? { ...maintenance, ...maintenanceData }
            : maintenance,
        );
        const future = updated.filter(
          (m) => new Date(m.scheduledDate) >= new Date(),
        );

        return {
          ...prev,
          maintenance: updated,
          futureMaintenance: future,
        };
      });

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  const deleteMaintenance = useCallback(
    (id: string) => {
      setState((prev) => {
        const updated = prev.maintenance.filter(
          (maintenance) => maintenance.id !== id,
        );
        const future = updated.filter(
          (m) => new Date(m.scheduledDate) >= new Date(),
        );

        return {
          ...prev,
          maintenance: updated,
          futureMaintenance: future,
        };
      });

      // Remove from localStorage
      const savedMaintenance = JSON.parse(
        localStorage.getItem("maintenance") || "[]",
      );
      const updatedMaintenance = savedMaintenance.filter(
        (maintenance: Maintenance) => maintenance.id !== id,
      );
      localStorage.setItem("maintenance", JSON.stringify(updatedMaintenance));

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  // Work actions
  const addWork = useCallback(
    withAutoSync(async (workData: Omit<Work, "id" | "createdAt">) => {
      const newWork: Work = {
        ...workData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // Add to local state immediately
      setState((prev) => ({
        ...prev,
        works: [...prev.works, newWork],
      }));

      // Add to localStorage for backup
      const savedWorks = JSON.parse(localStorage.getItem("works") || "[]");
      savedWorks.push(newWork);
      localStorage.setItem("works", JSON.stringify(savedWorks));

      // Add to Firebase if sync is enabled
      if (syncEnabled && realFirebaseService.isReady()) {
        try {
          await realFirebaseService.addWork(newWork);
          console.log("Work added to Firebase successfully");
        } catch (error) {
          console.error("Failed to add work to Firebase:", error);
        }
      }
    }),
    [syncEnabled, withAutoSync],
  );

  const updateWork = useCallback(
    (id: string, workData: Partial<Work>) => {
      setState((prev) => {
        const updatedWorks = prev.works.map((work) =>
          work.id === id ? { ...work, ...workData } : work,
        );

        // Persist to localStorage
        localStorage.setItem("works", JSON.stringify(updatedWorks));

        return {
          ...prev,
          works: updatedWorks,
        };
      });

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  const deleteWork = useCallback(
    (id: string) => {
      setState((prev) => {
        const updatedWorks = prev.works.filter((work) => work.id !== id);

        // Persist to localStorage
        localStorage.setItem("works", JSON.stringify(updatedWorks));

        return {
          ...prev,
          works: updatedWorks,
        };
      });

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  // Client actions
  const addClient = useCallback(
    (clientData: Omit<Client, "id" | "createdAt">) => {
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        clients: [...prev.clients, newClient],
      }));

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  const updateClient = useCallback(
    (id: string, clientData: Partial<Client>) => {
      setState((prev) => ({
        ...prev,
        clients: prev.clients.map((client) =>
          client.id === id ? { ...client, ...clientData } : client,
        ),
      }));

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  const deleteClient = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        clients: prev.clients.filter((client) => client.id !== id),
      }));

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  const enableSync = useCallback(
    (enabled: boolean) => {
      setSyncEnabled(enabled);
      if (enabled) {
        // Initialize Firebase when enabling sync
        if (!realFirebaseService.isReady()) {
          const initialized = realFirebaseService.initialize();
          if (initialized) {
            console.log("Firebase initialized for sync");
            syncWithFirebase();
          } else {
            console.error("Failed to initialize Firebase for sync");
            setState((prev) => ({
              ...prev,
              error: "Failed to initialize Firebase",
            }));
          }
        } else {
          syncWithFirebase();
        }
      }
    },
    [syncWithFirebase],
  );

  const cleanAllData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Clear local storage
      localStorage.removeItem("pools");
      localStorage.removeItem("works");
      localStorage.removeItem("maintenance");
      localStorage.removeItem("interventions");
      localStorage.removeItem("clients");

      // Reset state to only mock data
      const today = new Date();
      const future = mockMaintenance.filter(
        (m) => new Date(m.scheduledDate) >= today,
      );

      setState((prev) => ({
        ...prev,
        pools: [],
        maintenance: [],
        futureMaintenance: [],
        works: [],
        clients: [],
        isLoading: false,
        lastSync: new Date(),
        error: null,
      }));

      // Set cleanup flags
      localStorage.setItem("app-cleaned", new Date().toISOString());
      localStorage.setItem("last-cleanup", new Date().toISOString());

      console.log("Data cleanup completed successfully");
    } catch (error: any) {
      console.error("Data cleanup failed:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: `Cleanup failed: ${error.message}`,
      }));
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