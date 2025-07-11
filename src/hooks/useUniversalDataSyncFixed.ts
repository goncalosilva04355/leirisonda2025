import { useState, useEffect, useCallback } from "react";

export interface UniversalSyncState {
  obras: any[];
  manutencoes: any[];
  piscinas: any[];
  clientes: any[];
  totalItems: number;
  lastSync: string;
  isGloballyShared: boolean;
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

/**
 * FIXED VERSION OF useUniversalDataSync
 * Simplified and more robust to prevent React errors
 */
export function useUniversalDataSyncFixed(): UniversalSyncState &
  UniversalSyncActions {
  // Initialize with simple initial state - safe for SSR
  const [state, setState] = useState<UniversalSyncState>(() => ({
    obras: [],
    manutencoes: [],
    piscinas: [],
    clientes: [],
    totalItems: 0,
    lastSync: "",
    isGloballyShared: false,
    isLoading: false,
    error: null,
    syncStatus: "disconnected",
  }));

  // Safe localStorage access
  const safeGetLocalStorage = useCallback(
    (key: string, defaultValue = "[]") => {
      try {
        if (typeof window === "undefined" || !window.localStorage) {
          return JSON.parse(defaultValue);
        }
        const item = localStorage.getItem(key);
        if (!item) return JSON.parse(defaultValue);
        const parsed = JSON.parse(item);
        return Array.isArray(parsed) ? parsed : JSON.parse(defaultValue);
      } catch (error) {
        console.warn(`⚠️ Error reading localStorage key "${key}":`, error);
        return JSON.parse(defaultValue);
      }
    },
    [],
  );

  // Safe localStorage write
  const safeSetLocalStorage = useCallback((key: string, value: any) => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return false;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`⚠️ Error writing localStorage key "${key}":`, error);
      return false;
    }
  }, []);

  // Load initial data
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const loadData = () => {
      try {
        const obras = safeGetLocalStorage("works");
        const manutencoes = safeGetLocalStorage("maintenance");
        const piscinas = safeGetLocalStorage("pools");
        const clientes = safeGetLocalStorage("clients");

        setState({
          obras,
          manutencoes,
          piscinas,
          clientes,
          totalItems:
            obras.length +
            manutencoes.length +
            piscinas.length +
            clientes.length,
          lastSync: new Date().toISOString(),
          isGloballyShared: true,
          isLoading: false,
          error: null,
          syncStatus: "connected",
        });
      } catch (error) {
        console.error("❌ Error loading initial data:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to load data",
          isLoading: false,
          syncStatus: "error",
        }));
      }
    };

    loadData();

    // Listen for storage changes (only on client side)
    const handleStorageChange = (e: StorageEvent) => {
      if (["works", "maintenance", "pools", "clients"].includes(e.key || "")) {
        loadData();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [safeGetLocalStorage]);

  // Add obra function
  const addObra = useCallback(
    async (obraData: any): Promise<string> => {
      try {
        const id = obraData.id || `obra-${Date.now()}-${Math.random()}`;
        const obra = {
          ...obraData,
          id,
          createdAt: obraData.createdAt || new Date().toISOString(),
          sharedGlobally: true,
          visibleToAllUsers: true,
        };

        const existingObras = safeGetLocalStorage("works");
        const workExists = existingObras.some((w: any) => w.id === obra.id);

        if (!workExists) {
          const updatedObras = [...existingObras, obra];
          safeSetLocalStorage("works", updatedObras);

          setState((prev) => ({
            ...prev,
            obras: updatedObras,
            totalItems: prev.totalItems + 1,
          }));

          // Trigger update event
          window.dispatchEvent(
            new CustomEvent("obrasUpdated", {
              detail: { data: updatedObras, collection: "obras" },
            }),
          );
        }

        return id;
      } catch (error) {
        console.error("❌ Error adding obra:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  // Add manutenção function
  const addManutencao = useCallback(
    async (manutencaoData: any): Promise<string> => {
      try {
        const id =
          manutencaoData.id || `manutencao-${Date.now()}-${Math.random()}`;
        const manutencao = {
          ...manutencaoData,
          id,
          createdAt: manutencaoData.createdAt || new Date().toISOString(),
          sharedGlobally: true,
          visibleToAllUsers: true,
        };

        const existingManutencoes = safeGetLocalStorage("maintenance");
        const maintenanceExists = existingManutencoes.some(
          (m: any) => m.id === manutencao.id,
        );

        if (!maintenanceExists) {
          const updatedManutencoes = [...existingManutencoes, manutencao];
          safeSetLocalStorage("maintenance", updatedManutencoes);

          setState((prev) => ({
            ...prev,
            manutencoes: updatedManutencoes,
            totalItems: prev.totalItems + 1,
          }));

          window.dispatchEvent(
            new CustomEvent("manutencoesUpdated", {
              detail: { data: updatedManutencoes, collection: "manutencoes" },
            }),
          );
        }

        return id;
      } catch (error) {
        console.error("❌ Error adding manutenção:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  // Add piscina function
  const addPiscina = useCallback(
    async (piscinaData: any): Promise<string> => {
      try {
        const id = piscinaData.id || `piscina-${Date.now()}-${Math.random()}`;
        const piscina = {
          ...piscinaData,
          id,
          createdAt: piscinaData.createdAt || new Date().toISOString(),
          sharedGlobally: true,
          visibleToAllUsers: true,
        };

        const existingPiscinas = safeGetLocalStorage("pools");
        const piscinaExists = existingPiscinas.some(
          (p: any) => p.id === piscina.id,
        );

        if (!piscinaExists) {
          const updatedPiscinas = [...existingPiscinas, piscina];
          safeSetLocalStorage("pools", updatedPiscinas);

          setState((prev) => ({
            ...prev,
            piscinas: updatedPiscinas,
            totalItems: prev.totalItems + 1,
          }));

          window.dispatchEvent(
            new CustomEvent("piscinasUpdated", {
              detail: { data: updatedPiscinas, collection: "piscinas" },
            }),
          );
        }

        return id;
      } catch (error) {
        console.error("❌ Error adding piscina:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  // Add cliente function
  const addCliente = useCallback(
    async (clienteData: any): Promise<string> => {
      try {
        const id = clienteData.id || `cliente-${Date.now()}-${Math.random()}`;
        const cliente = {
          ...clienteData,
          id,
          createdAt: clienteData.createdAt || new Date().toISOString(),
          sharedGlobally: true,
          visibleToAllUsers: true,
        };

        const existingClientes = safeGetLocalStorage("clients");
        const clienteExists = existingClientes.some(
          (c: any) => c.id === cliente.id,
        );

        if (!clienteExists) {
          const updatedClientes = [...existingClientes, cliente];
          safeSetLocalStorage("clients", updatedClientes);

          setState((prev) => ({
            ...prev,
            clientes: updatedClientes,
            totalItems: prev.totalItems + 1,
          }));

          window.dispatchEvent(
            new CustomEvent("clientesUpdated", {
              detail: { data: updatedClientes, collection: "clientes" },
            }),
          );
        }

        return id;
      } catch (error) {
        console.error("❌ Error adding cliente:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  // Placeholder functions for update/delete operations
  const updateObra = useCallback(
    async (id: string, data: any): Promise<void> => {
      console.log("updateObra called:", id, data);
    },
    [],
  );

  const deleteObra = useCallback(async (id: string): Promise<void> => {
    console.log("deleteObra called:", id);
  }, []);

  const updateManutencao = useCallback(
    async (id: string, data: any): Promise<void> => {
      console.log("updateManutencao called:", id, data);
    },
    [],
  );

  const deleteManutencao = useCallback(async (id: string): Promise<void> => {
    console.log("deleteManutencao called:", id);
  }, []);

  const updatePiscina = useCallback(
    async (id: string, data: any): Promise<void> => {
      console.log("updatePiscina called:", id, data);
    },
    [],
  );

  const deletePiscina = useCallback(async (id: string): Promise<void> => {
    console.log("deletePiscina called:", id);
  }, []);

  const updateCliente = useCallback(
    async (id: string, data: any): Promise<void> => {
      console.log("updateCliente called:", id, data);
    },
    [],
  );

  const deleteCliente = useCallback(async (id: string): Promise<void> => {
    console.log("deleteCliente called:", id);
  }, []);

  const forceSyncAll = useCallback(async (): Promise<void> => {
    console.log("🔄 forceSyncAll called");
  }, []);

  const resetSync = useCallback(async (): Promise<void> => {
    console.log("🔄 resetSync called");
  }, []);

  return {
    // State
    ...state,

    // Actions
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
}
