import { useState, useEffect, useCallback, useMemo } from "react";

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
 * SAFE VERSION OF useUniversalDataSync
 * Simplified to prevent initialization errors
 */
export function useUniversalDataSyncSafe(): UniversalSyncState &
  UniversalSyncActions {
  const [state, setState] = useState<UniversalSyncState>({
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
  });

  // Load data from localStorage as fallback
  useEffect(() => {
    try {
      const loadLocalData = () => {
        const obras = JSON.parse(localStorage.getItem("works") || "[]");
        const manutencoes = JSON.parse(
          localStorage.getItem("maintenance") || "[]",
        );
        const piscinas = JSON.parse(localStorage.getItem("pools") || "[]");
        const clientes = JSON.parse(localStorage.getItem("clients") || "[]");

        setState((prev) => ({
          ...prev,
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
          isLoading: false,
          syncStatus: "connected",
        }));
      };

      loadLocalData();

      // Listen for storage changes
      const handleStorageChange = () => {
        loadLocalData();
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    } catch (error) {
      console.error("❌ Error in useUniversalDataSyncSafe:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to load data",
        isLoading: false,
        syncStatus: "error",
      }));
    }
  }, []);

  // Enhanced add obra function with Firebase sync
  const addObra = useCallback(async (obraData: any): Promise<string> => {
    try {
      const id = obraData.id || `obra-${Date.now()}-${Math.random()}`;
      const obra = {
        ...obraData,
        id,
        createdAt: obraData.createdAt || new Date().toISOString(),
        // Add global sharing flags
        sharedGlobally: true,
        visibleToAllUsers: true,
        isGlobalData: true,
        dataSharing: "all_users",
      };

      // Try to save to Firebase first
      try {
        const { isFirestoreReady } = await import(
          "../firebase/firestoreConfig"
        );
        if (isFirestoreReady()) {
          const { firestoreService } = await import(
            "../services/firestoreService"
          );
          const firestoreId = await firestoreService.createObra(obra);
          if (firestoreId) {
            console.log("✅ Obra criada no Firestore:", firestoreId);
            // Also save to localStorage as backup
            const existingObras = JSON.parse(
              localStorage.getItem("works") || "[]",
            );
            const workExists = existingObras.some((w: any) => w.id === obra.id);
            if (!workExists) {
              existingObras.push(obra);
              localStorage.setItem("works", JSON.stringify(existingObras));
            }
            // Firebase will trigger sync automatically via observers
            return firestoreId;
          }
        }
      } catch (firebaseError) {
        console.warn(
          "⚠️ Erro ao criar obra no Firebase, usando localStorage:",
          firebaseError,
        );
      }

      // Fallback to localStorage
      const existingObras = JSON.parse(localStorage.getItem("works") || "[]");
      const workExists = existingObras.some((w: any) => w.id === obra.id);

      if (!workExists) {
        existingObras.push(obra);
        localStorage.setItem("works", JSON.stringify(existingObras));

        setState((prev) => ({
          ...prev,
          obras: existingObras,
          totalItems: prev.totalItems + 1,
        }));

        // Trigger manual sync event
        window.dispatchEvent(
          new CustomEvent("obrasUpdated", {
            detail: { data: existingObras, collection: "obras" },
          }),
        );
      }

      return id;
    } catch (error) {
      console.error("❌ Error adding obra:", error);
      throw error;
    }
  }, []);

  // Enhanced add manutenção function with Firebase sync
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

        // Try to save to Firebase first
        try {
          const { isFirestoreReady } = await import(
            "../firebase/firestoreConfig"
          );
          if (isFirestoreReady()) {
            const { firestoreService } = await import(
              "../services/firestoreService"
            );
            const firestoreId =
              await firestoreService.createManutencao(manutencao);
            if (firestoreId) {
              console.log("✅ Manutenção criada no Firestore:", firestoreId);
            }
          }
        } catch (firebaseError) {
          console.warn(
            "⚠️ Erro ao criar manutenção no Firebase:",
            firebaseError,
          );
        }

        // Always save to localStorage as backup/primary
        const existingManutencoes = JSON.parse(
          localStorage.getItem("maintenance") || "[]",
        );
        const maintenanceExists = existingManutencoes.some(
          (m: any) => m.id === manutencao.id,
        );

        if (!maintenanceExists) {
          existingManutencoes.push(manutencao);
          localStorage.setItem(
            "maintenance",
            JSON.stringify(existingManutencoes),
          );

          setState((prev) => ({
            ...prev,
            manutencoes: existingManutencoes,
            totalItems: prev.totalItems + 1,
          }));

          // Trigger manual sync event
          window.dispatchEvent(
            new CustomEvent("manutencoesUpdated", {
              detail: { data: existingManutencoes, collection: "manutencoes" },
            }),
          );
        }

        return id;
      } catch (error) {
        console.error("❌ Error adding manutenção:", error);
        throw error;
      }
    },
    [],
  );

  // Enhanced add piscina function with Firebase sync
  const addPiscina = useCallback(async (piscinaData: any): Promise<string> => {
    try {
      const id = piscinaData.id || `piscina-${Date.now()}-${Math.random()}`;
      const piscina = {
        ...piscinaData,
        id,
        createdAt: piscinaData.createdAt || new Date().toISOString(),
        sharedGlobally: true,
        visibleToAllUsers: true,
      };

      // Try to save to Firebase first
      try {
        const { isFirestoreReady } = await import(
          "../firebase/firestoreConfig"
        );
        if (isFirestoreReady()) {
          const { firestoreService } = await import(
            "../services/firestoreService"
          );
          const firestoreId = await firestoreService.createPiscina(piscina);
          if (firestoreId) {
            console.log("✅ Piscina criada no Firestore:", firestoreId);
          }
        }
      } catch (firebaseError) {
        console.warn("⚠️ Erro ao criar piscina no Firebase:", firebaseError);
      }

      // Always save to localStorage as backup/primary
      const existingPiscinas = JSON.parse(
        localStorage.getItem("pools") || "[]",
      );
      const piscinaExists = existingPiscinas.some(
        (p: any) => p.id === piscina.id,
      );

      if (!piscinaExists) {
        existingPiscinas.push(piscina);
        localStorage.setItem("pools", JSON.stringify(existingPiscinas));

        setState((prev) => ({
          ...prev,
          piscinas: existingPiscinas,
          totalItems: prev.totalItems + 1,
        }));

        // Trigger manual sync event
        window.dispatchEvent(
          new CustomEvent("piscinasUpdated", {
            detail: { data: existingPiscinas, collection: "piscinas" },
          }),
        );
      }

      return id;
    } catch (error) {
      console.error("❌ Error adding piscina:", error);
      throw error;
    }
  }, []);

  // Simple add cliente function
  const addCliente = useCallback(async (clienteData: any): Promise<string> => {
    try {
      const id = clienteData.id || `cliente-${Date.now()}-${Math.random()}`;
      const cliente = {
        ...clienteData,
        id,
        createdAt: clienteData.createdAt || new Date().toISOString(),
      };

      const existingClientes = JSON.parse(
        localStorage.getItem("clients") || "[]",
      );
      existingClientes.push(cliente);
      localStorage.setItem("clients", JSON.stringify(existingClientes));

      setState((prev) => ({
        ...prev,
        clientes: existingClientes,
        totalItems: prev.totalItems + 1,
      }));

      return id;
    } catch (error) {
      console.error("❌ Error adding cliente:", error);
      throw error;
    }
  }, []);

  // Placeholder functions for other operations
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
    try {
      console.log("🔄 Iniciando sincronização forçada completa...");

      // Import autoSyncService dynamically to avoid circular dependencies
      const { autoSyncService } = await import("../services/autoSyncService");

      if (autoSyncService.isAutoSyncActive()) {
        await autoSyncService.syncAllCollections();
        console.log("✅ Sincronização forçada completa!");
      } else {
        console.log("⚠️ Auto sync não está ativo, usando apenas localStorage");
      }
    } catch (error) {
      console.error("❌ Erro na sincronização forçada:", error);
    }
  }, []);

  const resetSync = useCallback(async (): Promise<void> => {
    // console.log("resetSync called");
  }, []);

  return useMemo(
    () => ({
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
    }),
    [
      state,
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
    ],
  );
}
