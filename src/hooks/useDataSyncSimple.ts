// Hook ultra-simples para evitar erros React
import { useState } from "react";

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

// Hook ultra-simples
export function useDataSyncSimple(): SimpleState & SimpleActions {
  const [pools, setPools] = useState<Pool[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [futureMaintenance, setFutureMaintenance] = useState<Maintenance[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Actions para pools
  const addPool = (poolData: Omit<Pool, "id" | "createdAt">) => {
    const newPool: Pool = {
      ...poolData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPools((prev) => [...prev, newPool]);
  };

  const updatePool = (id: string, data: Partial<Pool>) => {
    setPools((prev) =>
      prev.map((pool) => (pool.id === id ? { ...pool, ...data } : pool)),
    );
  };

  const deletePool = (id: string) => {
    setPools((prev) => prev.filter((pool) => pool.id !== id));
  };

  // Actions para works
  const addWork = (workData: Omit<Work, "id" | "createdAt">) => {
    const newWork: Work = {
      ...workData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setWorks((prev) => [...prev, newWork]);
  };

  const updateWork = (id: string, data: Partial<Work>) => {
    setWorks((prev) =>
      prev.map((work) => (work.id === id ? { ...work, ...data } : work)),
    );
  };

  const deleteWork = (id: string) => {
    setWorks((prev) => prev.filter((work) => work.id !== id));
  };

  // Actions para maintenance
  const addMaintenance = (
    maintenanceData: Omit<Maintenance, "id" | "createdAt">,
  ) => {
    const newMaintenance: Maintenance = {
      ...maintenanceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setMaintenance((prev) => [...prev, newMaintenance]);
  };

  const updateMaintenance = (id: string, data: Partial<Maintenance>) => {
    setMaintenance((prev) =>
      prev.map((maint) => (maint.id === id ? { ...maint, ...data } : maint)),
    );
  };

  const deleteMaintenance = (id: string) => {
    setMaintenance((prev) => prev.filter((maint) => maint.id !== id));
  };

  // Actions para clients
  const addClient = (clientData: Omit<Client, "id" | "createdAt">) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [...prev, newClient]);
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, ...data } : client,
      ),
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

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
