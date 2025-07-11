import { useState, useEffect } from "react";

// Simple safe interfaces
export interface Pool {
  id: string;
  name: string;
  location: string;
  client: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  poolId: string;
  poolName: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | "scheduled";
  description: string;
  date: string;
  createdAt: string;
}

export interface Work {
  id: string;
  name: string;
  location: string;
  client: string;
  startDate: string;
  endDate?: string;
  status: "planned" | "in_progress" | "completed" | "on_hold";
  budget?: number;
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

export interface SyncState {
  pools: Pool[];
  maintenance: Maintenance[];
  futureMaintenance: Maintenance[];
  works: Work[];
  clients: Client[];
  lastSync: Date | null;
}

export interface SyncActions {
  addPool: (pool: Omit<Pool, "id" | "createdAt">) => Promise<string>;
  updatePool: (id: string, pool: Partial<Pool>) => Promise<void>;
  deletePool: (id: string) => Promise<void>;
  addMaintenance: (
    maintenance: Omit<Maintenance, "id" | "createdAt">,
  ) => Promise<string>;
  updateMaintenance: (
    id: string,
    maintenance: Partial<Maintenance>,
  ) => Promise<void>;
  deleteMaintenance: (id: string) => Promise<void>;
  addWork: (work: Omit<Work, "id" | "createdAt">) => Promise<string>;
  updateWork: (id: string, work: Partial<Work>) => Promise<void>;
  deleteWork: (id: string) => Promise<void>;
  addClient: (client: Omit<Client, "id" | "createdAt">) => Promise<string>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  syncData: () => Promise<void>;
  enableSync: (enabled: boolean) => void;
  cleanAllData: () => Promise<void>;
}

export function useDataSyncSafe(): SyncState & SyncActions {
  const [state, setState] = useState<SyncState>({
    pools: [],
    maintenance: [],
    futureMaintenance: [],
    works: [],
    clients: [],
    lastSync: null,
  });

  // Safe no-op actions
  const actions: SyncActions = {
    addPool: async (pool) => {
      const newPool = {
        ...pool,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, pools: [...prev.pools, newPool] }));
      return newPool.id;
    },
    updatePool: async (id, updates) => {
      setState((prev) => ({
        ...prev,
        pools: prev.pools.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    },
    deletePool: async (id) => {
      setState((prev) => ({
        ...prev,
        pools: prev.pools.filter((p) => p.id !== id),
      }));
    },
    addMaintenance: async (maintenance) => {
      const newMaintenance = {
        ...maintenance,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        maintenance: [...prev.maintenance, newMaintenance],
      }));
      return newMaintenance.id;
    },
    updateMaintenance: async (id, updates) => {
      setState((prev) => ({
        ...prev,
        maintenance: prev.maintenance.map((m) =>
          m.id === id ? { ...m, ...updates } : m,
        ),
      }));
    },
    deleteMaintenance: async (id) => {
      setState((prev) => ({
        ...prev,
        maintenance: prev.maintenance.filter((m) => m.id !== id),
      }));
    },
    addWork: async (work) => {
      const newWork = {
        ...work,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, works: [...prev.works, newWork] }));
      return newWork.id;
    },
    updateWork: async (id, updates) => {
      setState((prev) => ({
        ...prev,
        works: prev.works.map((w) => (w.id === id ? { ...w, ...updates } : w)),
      }));
    },
    deleteWork: async (id) => {
      setState((prev) => ({
        ...prev,
        works: prev.works.filter((w) => w.id !== id),
      }));
    },
    addClient: async (client) => {
      const newClient = {
        ...client,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, clients: [...prev.clients, newClient] }));
      return newClient.id;
    },
    updateClient: async (id, updates) => {
      setState((prev) => ({
        ...prev,
        clients: prev.clients.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      }));
    },
    deleteClient: async (id) => {
      setState((prev) => ({
        ...prev,
        clients: prev.clients.filter((c) => c.id !== id),
      }));
    },
    syncData: async () => {
      setState((prev) => ({ ...prev, lastSync: new Date() }));
    },
    enableSync: (enabled: boolean) => {
      console.log(`Sync ${enabled ? "enabled" : "disabled"}`);
    },
    cleanAllData: async () => {
      setState({
        pools: [],
        maintenance: [],
        futureMaintenance: [],
        works: [],
        clients: [],
        lastSync: null,
      });
    },
  };

  return { ...state, ...actions };
}
