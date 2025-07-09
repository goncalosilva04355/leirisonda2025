import { useState, useEffect, useCallback } from "react";

export interface UniversalSyncState {
  obras: any[];
  manutencoes: any[];
  piscinas: any[];
  clientes: any[];
  isLoading: boolean;
  error: string | null;
  syncStatus: "disconnected" | "connecting" | "connected" | "syncing" | "error";
}

export interface UniversalSyncActions {
  // Obras
  addObra: (obra: any) => Promise<string>;
  updateObra: (id: string, obra: any) => Promise<void>;
  deleteObra: (id: string) => Promise<void>;

  // Manutenções
  addManutencao: (manutencao: any) => Promise<string>;
  updateManutencao: (id: string, manutencao: any) => Promise<void>;
  deleteManutencao: (id: string) => Promise<void>;

  // Piscinas
  addPiscina: (piscina: any) => Promise<string>;
  updatePiscina: (id: string, piscina: any) => Promise<void>;
  deletePiscina: (id: string) => Promise<void>;

  // Clientes
  addCliente: (cliente: any) => Promise<string>;
  updateCliente: (id: string, cliente: any) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;

  // Sync
  forceSyncAll: () => Promise<void>;
  resetSync: () => Promise<void>;
}

const initialState: UniversalSyncState = {
  obras: [],
  manutencoes: [],
  piscinas: [],
  clientes: [],
  isLoading: false,
  error: null,
  syncStatus: "disconnected",
};

// Safe localStorage operations
const getFromStorage = (key: string): any[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn(`Error reading ${key}:`, error);
    return [];
  }
};

const saveToStorage = (key: string, data: any[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Error saving ${key}:`, error);
  }
};

export const useUniversalDataSync = (): UniversalSyncState &
  UniversalSyncActions => {
  const [state, setState] = useState<UniversalSyncState>(initialState);

  // Initialize data
  useEffect(() => {
    try {
      console.log("🌐 Initializing universal data sync...");

      const obras = getFromStorage("leirisonda_works");
      const manutencoes = getFromStorage("leirisonda_maintenance");
      const piscinas = getFromStorage("leirisonda_pools");
      const clientes = getFromStorage("leirisonda_clients");

      setState({
        obras,
        manutencoes,
        piscinas,
        clientes,
        isLoading: false,
        error: null,
        syncStatus: "connected",
      });

      console.log("✅ Universal data sync initialized");
    } catch (error) {
      console.error("Error initializing universal sync:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erro ao inicializar sincronização",
        syncStatus: "error",
      }));
    }
  }, []);

  // Safe add functions
  const addObra = useCallback(
    async (obra: any): Promise<string> => {
      try {
        const newObra = { ...obra, id: Date.now().toString() };
        const updatedObras = [...state.obras, newObra];

        setState((prev) => ({ ...prev, obras: updatedObras }));
        saveToStorage("leirisonda_works", updatedObras);

        return newObra.id;
      } catch (error) {
        console.error("Error adding obra:", error);
        throw error;
      }
    },
    [state.obras],
  );

  const addManutencao = useCallback(
    async (manutencao: any): Promise<string> => {
      try {
        const newManutencao = { ...manutencao, id: Date.now().toString() };
        const updatedManutencoes = [...state.manutencoes, newManutencao];

        setState((prev) => ({ ...prev, manutencoes: updatedManutencoes }));
        saveToStorage("leirisonda_maintenance", updatedManutencoes);

        return newManutencao.id;
      } catch (error) {
        console.error("Error adding manutencao:", error);
        throw error;
      }
    },
    [state.manutencoes],
  );

  const addPiscina = useCallback(
    async (piscina: any): Promise<string> => {
      try {
        const newPiscina = { ...piscina, id: Date.now().toString() };
        const updatedPiscinas = [...state.piscinas, newPiscina];

        setState((prev) => ({ ...prev, piscinas: updatedPiscinas }));
        saveToStorage("leirisonda_pools", updatedPiscinas);

        return newPiscina.id;
      } catch (error) {
        console.error("Error adding piscina:", error);
        throw error;
      }
    },
    [state.piscinas],
  );

  const addCliente = useCallback(
    async (cliente: any): Promise<string> => {
      try {
        const newCliente = { ...cliente, id: Date.now().toString() };
        const updatedClientes = [...state.clientes, newCliente];

        setState((prev) => ({ ...prev, clientes: updatedClientes }));
        saveToStorage("leirisonda_clients", updatedClientes);

        return newCliente.id;
      } catch (error) {
        console.error("Error adding cliente:", error);
        throw error;
      }
    },
    [state.clientes],
  );

  // Safe update functions
  const updateObra = useCallback(
    async (id: string, obra: any): Promise<void> => {
      try {
        const updatedObras = state.obras.map((o) =>
          o.id === id ? { ...o, ...obra } : o,
        );
        setState((prev) => ({ ...prev, obras: updatedObras }));
        saveToStorage("leirisonda_works", updatedObras);
      } catch (error) {
        console.error("Error updating obra:", error);
        throw error;
      }
    },
    [state.obras],
  );

  const updateManutencao = useCallback(
    async (id: string, manutencao: any): Promise<void> => {
      try {
        const updatedManutencoes = state.manutencoes.map((m) =>
          m.id === id ? { ...m, ...manutencao } : m,
        );
        setState((prev) => ({ ...prev, manutencoes: updatedManutencoes }));
        saveToStorage("leirisonda_maintenance", updatedManutencoes);
      } catch (error) {
        console.error("Error updating manutencao:", error);
        throw error;
      }
    },
    [state.manutencoes],
  );

  const updatePiscina = useCallback(
    async (id: string, piscina: any): Promise<void> => {
      try {
        const updatedPiscinas = state.piscinas.map((p) =>
          p.id === id ? { ...p, ...piscina } : p,
        );
        setState((prev) => ({ ...prev, piscinas: updatedPiscinas }));
        saveToStorage("leirisonda_pools", updatedPiscinas);
      } catch (error) {
        console.error("Error updating piscina:", error);
        throw error;
      }
    },
    [state.piscinas],
  );

  const updateCliente = useCallback(
    async (id: string, cliente: any): Promise<void> => {
      try {
        const updatedClientes = state.clientes.map((c) =>
          c.id === id ? { ...c, ...cliente } : c,
        );
        setState((prev) => ({ ...prev, clientes: updatedClientes }));
        saveToStorage("leirisonda_clients", updatedClientes);
      } catch (error) {
        console.error("Error updating cliente:", error);
        throw error;
      }
    },
    [state.clientes],
  );

  // Safe delete functions
  const deleteObra = useCallback(
    async (id: string): Promise<void> => {
      try {
        const updatedObras = state.obras.filter((o) => o.id !== id);
        setState((prev) => ({ ...prev, obras: updatedObras }));
        saveToStorage("leirisonda_works", updatedObras);
      } catch (error) {
        console.error("Error deleting obra:", error);
        throw error;
      }
    },
    [state.obras],
  );

  const deleteManutencao = useCallback(
    async (id: string): Promise<void> => {
      try {
        const updatedManutencoes = state.manutencoes.filter((m) => m.id !== id);
        setState((prev) => ({ ...prev, manutencoes: updatedManutencoes }));
        saveToStorage("leirisonda_maintenance", updatedManutencoes);
      } catch (error) {
        console.error("Error deleting manutencao:", error);
        throw error;
      }
    },
    [state.manutencoes],
  );

  const deletePiscina = useCallback(
    async (id: string): Promise<void> => {
      try {
        const updatedPiscinas = state.piscinas.filter((p) => p.id !== id);
        setState((prev) => ({ ...prev, piscinas: updatedPiscinas }));
        saveToStorage("leirisonda_pools", updatedPiscinas);
      } catch (error) {
        console.error("Error deleting piscina:", error);
        throw error;
      }
    },
    [state.piscinas],
  );

  const deleteCliente = useCallback(
    async (id: string): Promise<void> => {
      try {
        const updatedClientes = state.clientes.filter((c) => c.id !== id);
        setState((prev) => ({ ...prev, clientes: updatedClientes }));
        saveToStorage("leirisonda_clients", updatedClientes);
      } catch (error) {
        console.error("Error deleting cliente:", error);
        throw error;
      }
    },
    [state.clientes],
  );

  // Safe sync functions
  const forceSyncAll = useCallback(async (): Promise<void> => {
    try {
      console.log("🔄 Force sync all data...");
      setState((prev) => ({ ...prev, lastSync: new Date() }));
    } catch (error) {
      console.error("Error in force sync:", error);
    }
  }, []);

  const resetSync = useCallback(async (): Promise<void> => {
    try {
      console.log("🔄 Reset sync...");
      setState((prev) => ({ ...prev, syncStatus: "connected" }));
    } catch (error) {
      console.error("Error in reset sync:", error);
    }
  }, []);

  return {
    ...state,
    addObra,
    updateObra,
    deleteObra,
    addManutencao,
    updateManutencao,
    deleteManutencao,
    addPiscina,
    updatePiscina,
    deletePiscina,
    addCliente,
    updateCliente,
    deleteCliente,
    forceSyncAll,
    resetSync,
  };
};
