import { useState, useEffect, useCallback } from "react";

// Simple data types
export interface Pool {
  id: string;
  name: string;
  location: string;
  client: string;
  type: string;
  status: string;
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
  assignedUsers?: Array<{ id: string; name: string }>;
  assignedUserIds?: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

interface DataState {
  pools: Pool[];
  maintenance: Maintenance[];
  futureMaintenance: Maintenance[];
  works: Work[];
  clients: Client[];
  isLoading: boolean;
  lastSync: Date | null;
  error: string | null;
}

const initialState: DataState = {
  pools: [],
  maintenance: [],
  futureMaintenance: [],
  works: [],
  clients: [],
  isLoading: false,
  lastSync: null,
  error: null,
};

// Safe localStorage getter
const getFromStorage = (key: string): any[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

// Safe localStorage setter
const saveToStorage = (key: string, data: any[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Error saving ${key} to localStorage:`, error);
  }
};

export const useDataSync = (syncEnabled: boolean = false) => {
  const [state, setState] = useState<DataState>(initialState);

  // Initialize data on mount
  useEffect(() => {
    console.log("📱 Initializing local data sync...");

    try {
      const pools = getFromStorage("leirisonda_pools");
      const maintenance = getFromStorage("leirisonda_maintenance");
      const works = getFromStorage("leirisonda_works");
      const clients = getFromStorage("leirisonda_clients");

      // Filter future maintenance safely
      let futureMaintenance: Maintenance[] = [];
      try {
        const today = new Date().toISOString().split("T")[0];
        futureMaintenance = maintenance.filter((m: Maintenance) => {
          try {
            return m.scheduledDate >= today;
          } catch {
            return false;
          }
        });
      } catch (error) {
        console.warn("Error filtering future maintenance:", error);
        futureMaintenance = [];
      }

      setState({
        pools,
        maintenance,
        futureMaintenance,
        works,
        clients,
        isLoading: false,
        lastSync: new Date(),
        error: null,
      });

      console.log("✅ Local data loaded successfully");
    } catch (error) {
      console.error("Error loading local data:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erro ao carregar dados locais",
      }));
    }
  }, []);

  // Add data functions
  const addPool = useCallback(
    (poolData: Omit<Pool, "id">) => {
      try {
        const newPool = {
          ...poolData,
          id: Date.now().toString(),
        };

        const updatedPools = [...state.pools, newPool];
        setState((prev) => ({ ...prev, pools: updatedPools }));
        saveToStorage("leirisonda_pools", updatedPools);

        console.log("✅ Pool added locally");
        return newPool.id;
      } catch (error) {
        console.error("Error adding pool:", error);
        throw error;
      }
    },
    [state.pools],
  );

  const addMaintenance = useCallback(
    (maintenanceData: Omit<Maintenance, "id">) => {
      try {
        const newMaintenance = {
          ...maintenanceData,
          id: Date.now().toString(),
        };

        const updatedMaintenance = [...state.maintenance, newMaintenance];
        setState((prev) => ({
          ...prev,
          maintenance: updatedMaintenance,
          futureMaintenance: updatedMaintenance.filter((m: Maintenance) => {
            try {
              const today = new Date().toISOString().split("T")[0];
              return m.scheduledDate >= today;
            } catch {
              return false;
            }
          }),
        }));
        saveToStorage("leirisonda_maintenance", updatedMaintenance);

        console.log("✅ Maintenance added locally");
        return newMaintenance.id;
      } catch (error) {
        console.error("Error adding maintenance:", error);
        throw error;
      }
    },
    [state.maintenance],
  );

  const addWork = useCallback(
    (workData: Omit<Work, "id">) => {
      try {
        const newWork = {
          ...workData,
          id: Date.now().toString(),
        };

        const updatedWorks = [...state.works, newWork];
        setState((prev) => ({ ...prev, works: updatedWorks }));
        saveToStorage("leirisonda_works", updatedWorks);

        console.log("✅ Work added locally");
        return newWork.id;
      } catch (error) {
        console.error("Error adding work:", error);
        throw error;
      }
    },
    [state.works],
  );

  const addClient = useCallback(
    (clientData: Omit<Client, "id">) => {
      try {
        const newClient = {
          ...clientData,
          id: Date.now().toString(),
        };

        const updatedClients = [...state.clients, newClient];
        setState((prev) => ({ ...prev, clients: updatedClients }));
        saveToStorage("leirisonda_clients", updatedClients);

        console.log("✅ Client added locally");
        return newClient.id;
      } catch (error) {
        console.error("Error adding client:", error);
        throw error;
      }
    },
    [state.clients],
  );

  // Safe sync function that doesn't crash
  const forceSyncNow = useCallback(async () => {
    try {
      console.log("🔄 Refreshing local data...");
      setState((prev) => ({ ...prev, lastSync: new Date() }));
      return true;
    } catch (error) {
      console.error("Error in force sync:", error);
      return false;
    }
  }, []);

  return {
    ...state,
    addPool,
    addMaintenance,
    addWork,
    addClient,
    forceSyncNow,
    // Legacy compatibility
    pools: state.pools,
    maintenance: state.maintenance,
    futureMaintenance: state.futureMaintenance,
    works: state.works,
    clients: state.clients,
  };
};
