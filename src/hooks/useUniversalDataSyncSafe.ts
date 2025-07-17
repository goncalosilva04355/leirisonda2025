// HOOK CONVERTIDO PARA USAR APENAS REST API - SEM SDK FIREBASE
import { useState, useCallback, useEffect } from "react";
import {
  saveToFirestoreRest,
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "../utils/firestoreRestApi";

interface SyncState {
  obras: any[];
  manutencoes: any[];
  piscinas: any[];
  clientes: any[];
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  totalItems: number;
}

export const useUniversalDataSyncSafe = () => {
  const [state, setState] = useState<SyncState>({
    obras: [],
    manutencoes: [],
    piscinas: [],
    clientes: [],
    isLoading: false,
    error: null,
    lastSync: null,
    totalItems: 0,
  });

  // Safe localStorage helpers
  const safeGetLocalStorage = (key: string, defaultValue: any[] = []) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const safeSetLocalStorage = (key: string, value: any[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`⚠️ Erro ao salvar ${key} no localStorage:`, error);
    }
  };

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Load from localStorage first
      const localObras = safeGetLocalStorage("works", []);
      const localManutencoes = safeGetLocalStorage("maintenance", []);
      const localPiscinas = safeGetLocalStorage("pools", []);
      const localClientes = safeGetLocalStorage("clients", []);

      // Set local data immediately
      setState((prev) => ({
        ...prev,
        obras: localObras,
        manutencoes: localManutencoes,
        piscinas: localPiscinas,
        clientes: localClientes,
        totalItems:
          localObras.length +
          localManutencoes.length +
          localPiscinas.length +
          localClientes.length,
        isLoading: false,
      }));

      // Then try to sync with REST API
      try {
        console.log("🌐 Sincronizando com REST API...");
        const [obrasRest, manutencaoRest, piscinasRest, clientesRest] =
          await Promise.all([
            readFromFirestoreRest("obras"),
            readFromFirestoreRest("manutencoes"),
            readFromFirestoreRest("piscinas"),
            readFromFirestoreRest("clientes"),
          ]);

        // Update with REST API data
        setState((prev) => ({
          ...prev,
          obras: obrasRest,
          manutencoes: manutencaoRest,
          piscinas: piscinasRest,
          clientes: clientesRest,
          totalItems:
            obrasRest.length +
            manutencaoRest.length +
            piscinasRest.length +
            clientesRest.length,
          lastSync: new Date().toISOString(),
        }));

        // Update localStorage
        safeSetLocalStorage("works", obrasRest);
        safeSetLocalStorage("maintenance", manutencaoRest);
        safeSetLocalStorage("pools", piscinasRest);
        safeSetLocalStorage("clients", clientesRest);

        console.log("✅ Sincronização REST API concluída");
      } catch (restError) {
        console.warn("⚠️ Falha na sincronização REST API:", restError);
        // Continue with local data
      }
    } catch (error: any) {
      console.error("❌ Erro ao carregar dados iniciais:", error);
      setState((prev) => ({ ...prev, error: error.message, isLoading: false }));
    }
  }, []);

  // Add obra with REST API sync
  const addObra = useCallback(async (obraData: any): Promise<string> => {
    const obra = {
      ...obraData,
      id: obraData.id || `obra_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Save to REST API first
      const success = await saveToFirestoreRest("obras", obra.id, obra);

      if (success) {
        console.log("✅ Obra criada via REST API:", obra.id);
      } else {
        console.warn("⚠️ Falha ao salvar via REST API, usando localStorage");
      }

      // Update local state and localStorage
      setState((prev) => {
        const newObras = [...prev.obras, obra];
        safeSetLocalStorage("works", newObras);
        return {
          ...prev,
          obras: newObras,
          totalItems: prev.totalItems + 1,
        };
      });

      return obra.id;
    } catch (error: any) {
      console.error("❌ Erro ao adicionar obra:", error);
      throw error;
    }
  }, []);

  // Add manutenção with REST API sync
  const addManutencao = useCallback(
    async (manutencaoData: any): Promise<string> => {
      const manutencao = {
        ...manutencaoData,
        id: manutencaoData.id || `manutencao_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        // Save to REST API first
        const success = await saveToFirestoreRest(
          "manutencoes",
          manutencao.id,
          manutencao,
        );

        if (success) {
          console.log("✅ Manutenção criada via REST API:", manutencao.id);
        } else {
          console.warn("⚠️ Falha ao salvar via REST API, usando localStorage");
        }

        // Update local state and localStorage
        setState((prev) => {
          const newManutencoes = [...prev.manutencoes, manutencao];
          safeSetLocalStorage("maintenance", newManutencoes);
          return {
            ...prev,
            manutencoes: newManutencoes,
            totalItems: prev.totalItems + 1,
          };
        });

        return manutencao.id;
      } catch (error: any) {
        console.error("❌ Erro ao adicionar manutenção:", error);
        throw error;
      }
    },
    [],
  );

  // Add piscina with REST API sync
  const addPiscina = useCallback(async (piscinaData: any): Promise<string> => {
    const piscina = {
      ...piscinaData,
      id: piscinaData.id || `piscina_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Save to REST API first
      const success = await saveToFirestoreRest(
        "piscinas",
        piscina.id,
        piscina,
      );

      if (success) {
        console.log("✅ Piscina criada via REST API:", piscina.id);
      } else {
        console.warn("⚠️ Falha ao salvar via REST API, usando localStorage");
      }

      // Update local state and localStorage
      setState((prev) => {
        const newPiscinas = [...prev.piscinas, piscina];
        safeSetLocalStorage("pools", newPiscinas);
        return {
          ...prev,
          piscinas: newPiscinas,
          totalItems: prev.totalItems + 1,
        };
      });

      return piscina.id;
    } catch (error: any) {
      console.error("❌ Erro ao adicionar piscina:", error);
      throw error;
    }
  }, []);

  // Add cliente with REST API sync
  const addCliente = useCallback(async (clienteData: any): Promise<string> => {
    const cliente = {
      ...clienteData,
      id: clienteData.id || `cliente_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Save to REST API first
      const success = await saveToFirestoreRest(
        "clientes",
        cliente.id,
        cliente,
      );

      if (success) {
        console.log("✅ Cliente criado via REST API:", cliente.id);
      } else {
        console.warn("⚠️ Falha ao salvar via REST API, usando localStorage");
      }

      // Update local state and localStorage
      setState((prev) => {
        const newClientes = [...prev.clientes, cliente];
        safeSetLocalStorage("clients", newClientes);
        return {
          ...prev,
          clientes: newClientes,
          totalItems: prev.totalItems + 1,
        };
      });

      return cliente.id;
    } catch (error: any) {
      console.error("❌ Erro ao adicionar cliente:", error);
      throw error;
    }
  }, []);

  // Delete functions with REST API sync
  const deleteObra = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteFromFirestoreRest("obras", id);
      console.log("✅ Obra eliminada via REST API:", id);

      setState((prev) => {
        const newObras = prev.obras.filter((obra) => obra.id !== id);
        safeSetLocalStorage("works", newObras);
        return {
          ...prev,
          obras: newObras,
          totalItems: prev.totalItems - 1,
        };
      });
    } catch (error: any) {
      console.error("❌ Erro ao eliminar obra:", error);
      throw error;
    }
  }, []);

  const deleteManutencao = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteFromFirestoreRest("manutencoes", id);
      console.log("✅ Manutenção eliminada via REST API:", id);

      setState((prev) => {
        const newManutencoes = prev.manutencoes.filter((m) => m.id !== id);
        safeSetLocalStorage("maintenance", newManutencoes);
        return {
          ...prev,
          manutencoes: newManutencoes,
          totalItems: prev.totalItems - 1,
        };
      });
    } catch (error: any) {
      console.error("❌ Erro ao eliminar manutenção:", error);
      throw error;
    }
  }, []);

  const deletePiscina = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteFromFirestoreRest("piscinas", id);
      console.log("✅ Piscina eliminada via REST API:", id);

      setState((prev) => {
        const newPiscinas = prev.piscinas.filter((p) => p.id !== id);
        safeSetLocalStorage("pools", newPiscinas);
        return {
          ...prev,
          piscinas: newPiscinas,
          totalItems: prev.totalItems - 1,
        };
      });
    } catch (error: any) {
      console.error("❌ Erro ao eliminar piscina:", error);
      throw error;
    }
  }, []);

  const deleteCliente = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteFromFirestoreRest("clientes", id);
      console.log("✅ Cliente eliminado via REST API:", id);

      setState((prev) => {
        const newClientes = prev.clientes.filter((c) => c.id !== id);
        safeSetLocalStorage("clients", newClientes);
        return {
          ...prev,
          clientes: newClientes,
          totalItems: prev.totalItems - 1,
        };
      });
    } catch (error: any) {
      console.error("❌ Erro ao eliminar cliente:", error);
      throw error;
    }
  }, []);

  // Force sync with REST API
  const forceSyncAll = useCallback(async (): Promise<void> => {
    console.log("🔄 Forçando sincronização com REST API...");
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const [obrasRest, manutencaoRest, piscinasRest, clientesRest] =
        await Promise.all([
          readFromFirestoreRest("obras"),
          readFromFirestoreRest("manutencoes"),
          readFromFirestoreRest("piscinas"),
          readFromFirestoreRest("clientes"),
        ]);

      setState((prev) => ({
        ...prev,
        obras: obrasRest,
        manutencoes: manutencaoRest,
        piscinas: piscinasRest,
        clientes: clientesRest,
        totalItems:
          obrasRest.length +
          manutencaoRest.length +
          piscinasRest.length +
          clientesRest.length,
        lastSync: new Date().toISOString(),
        isLoading: false,
        error: null,
      }));

      // Update localStorage
      safeSetLocalStorage("works", obrasRest);
      safeSetLocalStorage("maintenance", manutencaoRest);
      safeSetLocalStorage("pools", piscinasRest);
      safeSetLocalStorage("clients", clientesRest);

      console.log("✅ Sincronização forçada concluída");
    } catch (error: any) {
      console.error("❌ Erro na sincronização forçada:", error);
      setState((prev) => ({ ...prev, error: error.message, isLoading: false }));
    }
  }, []);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    // State
    ...state,

    // Functions
    addObra,
    addManutencao,
    addPiscina,
    addCliente,
    deleteObra,
    deleteManutencao,
    deletePiscina,
    deleteCliente,
    forceSyncAll,
    loadInitialData,
  };
};

export default useUniversalDataSyncSafe;
