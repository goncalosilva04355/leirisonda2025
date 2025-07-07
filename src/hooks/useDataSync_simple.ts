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
  createdBy?: string;
  createdByUser?: string;
  updatedAt?: string;
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
  const [works, setWorks] = useState<Work[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadFromFirebase = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize Firebase service if not already initialized
        if (!realFirebaseService.isReady()) {
          const initSuccess = realFirebaseService.initialize();
          if (!initSuccess) {
            throw new Error("Failed to initialize Firebase service");
          }
        }

        const [worksData, poolsData, maintenanceData, clientsData] =
          await Promise.all([
            realFirebaseService.loadWorks(),
            realFirebaseService.loadPools(),
            realFirebaseService.loadMaintenance(),
            realFirebaseService.loadClients(),
          ]);

        setWorks(worksData || []);
        setPools(poolsData || []);
        setMaintenance(maintenanceData || []);
        setClients(clientsData || []);
        setLastSync(new Date());

        console.log("✅ Data loaded from Firebase successfully");
      } catch (error: any) {
        console.error("❌ Error loading data from Firebase:", error);
        setError("Erro ao carregar dados do Firebase");
      } finally {
        setIsLoading(false);
      }
    };

    loadFromFirebase();
  }, []);

  // Future maintenance derived from regular maintenance
  const futureMaintenance = maintenance.filter(
    (m) => new Date(m.scheduledDate) > new Date() && m.status === "scheduled",
  );

  // Sync with Firebase
  const syncWithFirebase = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Save all data to Firebase
      await Promise.all([
        realFirebaseService.saveWorks(works),
        realFirebaseService.savePools(pools),
        realFirebaseService.saveMaintenance(maintenance),
        realFirebaseService.saveClients(clients),
      ]);

      setLastSync(new Date());
      console.log("✅ Data synced to Firebase successfully");
    } catch (error: any) {
      console.error("❌ Error syncing to Firebase:", error);
      setError("Erro ao sincronizar com Firebase");
    } finally {
      setIsLoading(false);
    }
  }, [works, pools, maintenance, clients]);

  // Data mutation functions
  const addWork = useCallback((work: Omit<Work, "id" | "createdAt">) => {
    const newWork: Work = {
      ...work,
      id: `work-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setWorks((prev) => [...prev, newWork]);
  }, []);

  const updateWork = useCallback((id: string, work: Partial<Work>) => {
    setWorks((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, ...work, updatedAt: new Date().toISOString() }
          : w,
      ),
    );
  }, []);

  const deleteWork = useCallback((id: string) => {
    setWorks((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const addPool = useCallback((pool: Omit<Pool, "id" | "createdAt">) => {
    const newPool: Pool = {
      ...pool,
      id: `pool-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPools((prev) => [...prev, newPool]);
  }, []);

  const updatePool = useCallback((id: string, pool: Partial<Pool>) => {
    setPools((prev) => prev.map((p) => (p.id === id ? { ...p, ...pool } : p)));
  }, []);

  const deletePool = useCallback((id: string) => {
    setPools((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addMaintenance = useCallback(
    (maintenanceData: Omit<Maintenance, "id" | "createdAt">) => {
      const newMaintenance: Maintenance = {
        ...maintenanceData,
        id: `maintenance-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setMaintenance((prev) => [...prev, newMaintenance]);
    },
    [],
  );

  const updateMaintenance = useCallback(
    (id: string, maintenanceData: Partial<Maintenance>) => {
      setMaintenance((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...maintenanceData } : m)),
      );
    },
    [],
  );

  const deleteMaintenance = useCallback((id: string) => {
    setMaintenance((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const addClient = useCallback((client: Omit<Client, "id" | "createdAt">) => {
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [...prev, newClient]);
  }, []);

  const updateClient = useCallback((id: string, client: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...client } : c)),
    );
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const enableSync = useCallback((enabled: boolean) => {
    console.log(`Sync ${enabled ? "enabled" : "disabled"}`);
  }, []);

  const cleanAllData = useCallback(async () => {
    setWorks([]);
    setPools([]);
    setMaintenance([]);
    setClients([]);
    setLastSync(null);
    console.log("✅ All data cleaned");
  }, []);

  return {
    // State
    pools,
    maintenance,
    futureMaintenance,
    works,
    clients,
    isLoading,
    lastSync,
    error,

    // Actions
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
