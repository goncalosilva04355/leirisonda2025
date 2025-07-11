// Hook ultra-simples para evitar erros React - VERSÃO CORRIGIDA
import { useState, useCallback } from "react";

// Interfaces básicas
export interface Pool {
  id: string;
  name: string;
  location: string;
  client: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface Work {
  id: string;
  title: string;
  client: string;
  status: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  type: string;
  poolName: string;
  scheduledDate: string;
  status: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

// State simples
interface SimpleState {
  pools: Pool[];
  works: Work[];
  maintenance: Maintenance[];
  futureMaintenance: Maintenance[];
  clients: Client[];
  lastSync: string | null;
}

// Actions simples
interface SimpleActions {
  addPool: (pool: Omit<Pool, "id" | "createdAt">) => void;
  updatePool: (id: string, data: Partial<Pool>) => void;
  deletePool: (id: string) => void;

  addWork: (work: Omit<Work, "id" | "createdAt">) => void;
  updateWork: (id: string, data: Partial<Work>) => void;
  deleteWork: (id: string) => void;

  addMaintenance: (maintenance: Omit<Maintenance, "id" | "createdAt">) => void;
  updateMaintenance: (id: string, data: Partial<Maintenance>) => void;
  deleteMaintenance: (id: string) => void;

  addClient: (client: Omit<Client, "id" | "createdAt">) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

// Hook ultra-simples - VERSÃO CORRIGIDA
export function useDataSyncSimpleFixed(): SimpleState & SimpleActions {
  // Initialize state with safer pattern
  const [pools, setPools] = useState<Pool[]>(() => []);
  const [works, setWorks] = useState<Work[]>(() => []);
  const [maintenance, setMaintenance] = useState<Maintenance[]>(() => []);
  const [futureMaintenance, setFutureMaintenance] = useState<Maintenance[]>(
    () => [],
  );
  const [clients, setClients] = useState<Client[]>(() => []);
  const [lastSync, setLastSync] = useState<string | null>(() => null);

  // Actions para pools
  const addPool = useCallback((poolData: Omit<Pool, "id" | "createdAt">) => {
    try {
      const newPool: Pool = {
        ...poolData,
        id: `pool-${Date.now()}-${Math.random()}`,
        createdAt: new Date().toISOString(),
      };
      setPools((prev) => [...prev, newPool]);
    } catch (error) {
      console.error("Error adding pool:", error);
    }
  }, []);

  const updatePool = useCallback((id: string, data: Partial<Pool>) => {
    try {
      setPools((prev) =>
        prev.map((pool) => (pool.id === id ? { ...pool, ...data } : pool)),
      );
    } catch (error) {
      console.error("Error updating pool:", error);
    }
  }, []);

  const deletePool = useCallback((id: string) => {
    try {
      setPools((prev) => prev.filter((pool) => pool.id !== id));
    } catch (error) {
      console.error("Error deleting pool:", error);
    }
  }, []);

  // Actions para works
  const addWork = useCallback((workData: Omit<Work, "id" | "createdAt">) => {
    try {
      const newWork: Work = {
        ...workData,
        id: `work-${Date.now()}-${Math.random()}`,
        createdAt: new Date().toISOString(),
      };
      setWorks((prev) => [...prev, newWork]);
    } catch (error) {
      console.error("Error adding work:", error);
    }
  }, []);

  const updateWork = useCallback((id: string, data: Partial<Work>) => {
    try {
      setWorks((prev) =>
        prev.map((work) => (work.id === id ? { ...work, ...data } : work)),
      );
    } catch (error) {
      console.error("Error updating work:", error);
    }
  }, []);

  const deleteWork = useCallback((id: string) => {
    try {
      setWorks((prev) => prev.filter((work) => work.id !== id));
    } catch (error) {
      console.error("Error deleting work:", error);
    }
  }, []);

  // Actions para maintenance
  const addMaintenance = useCallback(
    (maintenanceData: Omit<Maintenance, "id" | "createdAt">) => {
      try {
        const newMaintenance: Maintenance = {
          ...maintenanceData,
          id: `maintenance-${Date.now()}-${Math.random()}`,
          createdAt: new Date().toISOString(),
        };
        setMaintenance((prev) => [...prev, newMaintenance]);
      } catch (error) {
        console.error("Error adding maintenance:", error);
      }
    },
    [],
  );

  const updateMaintenance = useCallback(
    (id: string, data: Partial<Maintenance>) => {
      try {
        setMaintenance((prev) =>
          prev.map((maint) =>
            maint.id === id ? { ...maint, ...data } : maint,
          ),
        );
      } catch (error) {
        console.error("Error updating maintenance:", error);
      }
    },
    [],
  );

  const deleteMaintenance = useCallback((id: string) => {
    try {
      setMaintenance((prev) => prev.filter((maint) => maint.id !== id));
    } catch (error) {
      console.error("Error deleting maintenance:", error);
    }
  }, []);

  // Actions para clients
  const addClient = useCallback(
    (clientData: Omit<Client, "id" | "createdAt">) => {
      try {
        const newClient: Client = {
          ...clientData,
          id: `client-${Date.now()}-${Math.random()}`,
          createdAt: new Date().toISOString(),
        };
        setClients((prev) => [...prev, newClient]);
      } catch (error) {
        console.error("Error adding client:", error);
      }
    },
    [],
  );

  const updateClient = useCallback((id: string, data: Partial<Client>) => {
    try {
      setClients((prev) =>
        prev.map((client) =>
          client.id === id ? { ...client, ...data } : client,
        ),
      );
    } catch (error) {
      console.error("Error updating client:", error);
    }
  }, []);

  const deleteClient = useCallback((id: string) => {
    try {
      setClients((prev) => prev.filter((client) => client.id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  }, []);

  return {
    // State
    pools,
    works,
    maintenance,
    futureMaintenance,
    clients,
    lastSync,

    // Actions
    addPool,
    updatePool,
    deletePool,
    addWork,
    updateWork,
    deleteWork,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    addClient,
    updateClient,
    deleteClient,
  };
}
