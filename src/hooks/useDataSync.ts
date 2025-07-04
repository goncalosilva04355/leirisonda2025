import { useState, useEffect, useCallback } from "react";
import { realFirebaseService } from "../services/realFirebaseService";

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
  status: "pending" | "in_progress" | "completed" | "cancelled";
  description: string;
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  notes?: string;
  createdAt: string;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  client: string;
  location: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  startDate: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  assignedTo: string;
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
    id: "1",
    name: "Piscina Villa Marina",
    location: "Cascais, Villa Marina Resort",
    client: "Hotel Marina",
    type: "Comercial",
    status: "Ativa",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-01-22",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Piscina Residencial Costa",
    location: "Sintra, Quinta da Beloura",
    client: "Família Costa",
    type: "Residencial",
    status: "Ativa",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-01-17",
    createdAt: "2024-01-05",
  },
];

const mockMaintenance: Maintenance[] = [
  {
    id: "1",
    poolId: "1",
    poolName: "Piscina Villa Marina",
    type: "Limpeza Completa",
    status: "completed",
    description: "Limpeza completa da piscina, verificação química",
    scheduledDate: "2024-01-15",
    completedDate: "2024-01-15",
    technician: "João Santos",
    notes: "pH ajustado, cloro adicionado",
    createdAt: "2024-01-14",
  },
  {
    id: "2",
    poolId: "2",
    poolName: "Piscina Residencial Costa",
    type: "Manutenção Preventiva",
    status: "pending",
    description: "Verificação dos sistemas de filtração",
    scheduledDate: "2024-01-20",
    technician: "Maria Silva",
    createdAt: "2024-01-18",
  },
];

const mockWorks: Work[] = [
  {
    id: "1",
    title: "Renovação Sistema Filtração",
    description: "Substituição completa do sistema de filtração da piscina",
    client: "Hotel Marina",
    location: "Cascais, Villa Marina Resort",
    type: "Renovação",
    status: "in_progress",
    startDate: "2024-01-10",
    budget: 5000,
    assignedTo: "Equipa Técnica A",
    createdAt: "2024-01-08",
  },
  {
    id: "2",
    title: "Instalação Nova Piscina",
    description: "Construção de nova piscina 8x4m com deck",
    client: "Família Costa",
    location: "Sintra, Quinta da Beloura",
    type: "Construção",
    status: "pending",
    startDate: "2024-02-01",
    budget: 25000,
    assignedTo: "Equipa Construção",
    createdAt: "2024-01-20",
  },
];

const mockClients: Client[] = [
  {
    id: "1",
    name: "Hotel Marina",
    email: "gestao@hotelmarina.pt",
    phone: "+351 214 123 456",
    address: "Av. Marginal, 2750 Cascais",
    pools: ["1"],
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Família Costa",
    email: "joao.costa@email.pt",
    phone: "+351 919 876 543",
    address: "Quinta da Beloura, 2710 Sintra",
    pools: ["2"],
    createdAt: "2024-01-05",
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

  // Check if Firebase sync is configured
  const [syncEnabled, setSyncEnabled] = useState(() => {
    return !!localStorage.getItem("firebase-config");
  });

  // Real-time listeners
  useEffect(() => {
    if (!syncEnabled || !realFirebaseService.isReady()) {
      return;
    }

    // Set up real-time listeners
    const unsubscribePools = realFirebaseService.onPoolsChange((pools) => {
      setState((prev) => ({
        ...prev,
        pools: [...mockPools, ...pools],
      }));
    });

    const unsubscribeWorks = realFirebaseService.onWorksChange((works) => {
      setState((prev) => ({
        ...prev,
        works: [...mockWorks, ...works],
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
          maintenance: [...mockMaintenance, ...maintenance],
          futureMaintenance,
        }));
      },
    );

    const unsubscribeClients = realFirebaseService.onClientsChange(
      (clients) => {
        setState((prev) => ({
          ...prev,
          clients: [...mockClients, ...clients],
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

    // Load saved data from localStorage
    const savedPools = JSON.parse(localStorage.getItem("pools") || "[]");
    const savedMaintenance = JSON.parse(
      localStorage.getItem("maintenance") || "[]",
    );
    const savedInterventions = JSON.parse(
      localStorage.getItem("interventions") || "[]",
    );
    const savedWorks = JSON.parse(localStorage.getItem("works") || "[]");
    const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");

    // Convert interventions to maintenance format
    const interventionsAsMaintenance = savedInterventions.map(
      (intervention) => ({
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
      }),
    );

    // Combine all maintenance data
    const allMaintenance = [
      ...mockMaintenance,
      ...savedMaintenance,
      ...interventionsAsMaintenance,
    ];
    const future = allMaintenance.filter(
      (m) => new Date(m.scheduledDate) >= today,
    );

    // Combine all data
    const allPools = [...mockPools, ...savedPools];
    const allWorks = [...mockWorks, ...savedWorks];
    const allClients = [...mockClients, ...savedClients];

    setState((prev) => ({
      ...prev,
      pools: allPools,
      maintenance: allMaintenance,
      futureMaintenance: future,
      works: allWorks,
      clients: allClients,
    }));
  }, []);

  // Real Firebase sync
  const syncWithFirebase = useCallback(async () => {
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
            pools: [...mockPools, ...updatedData.pools],
            works: [...mockWorks, ...updatedData.works],
            maintenance: [...mockMaintenance, ...updatedData.maintenance],
            futureMaintenance,
            clients: [...mockClients, ...updatedData.clients],
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
    async (poolData: Omit<Pool, "id" | "createdAt">) => {
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
    },
    [syncEnabled],
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

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  // Maintenance actions
  const addMaintenance = useCallback(
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
    [syncEnabled],
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

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  // Work actions
  const addWork = useCallback(
    async (workData: Omit<Work, "id" | "createdAt">) => {
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
    },
    [syncEnabled],
  );

  const updateWork = useCallback(
    (id: string, workData: Partial<Work>) => {
      setState((prev) => ({
        ...prev,
        works: prev.works.map((work) =>
          work.id === id ? { ...work, ...workData } : work,
        ),
      }));

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
  );

  const deleteWork = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        works: prev.works.filter((work) => work.id !== id),
      }));

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
        syncWithFirebase();
      }
    },
    [syncWithFirebase],
  );

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
  };
}
