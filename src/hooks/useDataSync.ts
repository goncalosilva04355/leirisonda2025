import { useState, useEffect, useCallback } from "react";

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

  // Initialize with mock data
  useEffect(() => {
    const today = new Date();
    const future = mockMaintenance.filter(
      (m) => new Date(m.scheduledDate) >= today,
    );

    setState((prev) => ({
      ...prev,
      pools: mockPools,
      maintenance: mockMaintenance,
      futureMaintenance: future,
      works: mockWorks,
      clients: mockClients,
    }));
  }, []);

  // Simulate Firebase sync
  const syncWithFirebase = useCallback(async () => {
    if (!syncEnabled) {
      setState((prev) => ({ ...prev, error: "Firebase not configured" }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful sync
      setState((prev) => ({
        ...prev,
        isLoading: false,
        lastSync: new Date(),
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Sync failed",
      }));
    }
  }, [syncEnabled]);

  // Pool actions
  const addPool = useCallback(
    (poolData: Omit<Pool, "id" | "createdAt">) => {
      const newPool: Pool = {
        ...poolData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        pools: [...prev.pools, newPool],
      }));

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
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
    (maintenanceData: Omit<Maintenance, "id" | "createdAt">) => {
      const newMaintenance: Maintenance = {
        ...maintenanceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

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

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
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
    (workData: Omit<Work, "id" | "createdAt">) => {
      const newWork: Work = {
        ...workData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        works: [...prev.works, newWork],
      }));

      if (syncEnabled) {
        syncWithFirebase();
      }
    },
    [syncEnabled, syncWithFirebase],
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
