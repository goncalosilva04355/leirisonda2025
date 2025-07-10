import { useState, useEffect, useCallback } from "react";
import {
  universalDataSync,
  UniversalDataState,
} from "../services/universalDataSync";

export interface UniversalSyncState extends UniversalDataState {
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
 * HOOK UNIVERSAL PARA SINCRONIZAÇÃO DE DADOS
 *
 * Garante que todos os utilizadores vejam todos os dados em qualquer dispositivo:
 * - Obras
 * - Manutenções
 * - Piscinas
 * - Clientes
 *
 * Funcionalidades:
 * - Sincronização automática em tempo real
 * - Resistente a falhas de rede
 * - Migração automática de dados locais
 * - Interface unificada para todos os tipos de dados
 */
export function useUniversalDataSync(): UniversalSyncState &
  UniversalSyncActions {
  const [state, setState] = useState<UniversalSyncState>(() => {
    try {
      return {
        obras: [],
        manutencoes: [],
        piscinas: [],
        clientes: [],
        totalItems: 0,
        lastSync: "",
        isGloballyShared: true,
        isLoading: true,
        error: null,
        syncStatus: "disconnected",
      };
    } catch (error) {
      console.error("❌ Error initializing useUniversalDataSync state:", error);
      return {
        obras: [],
        manutencoes: [],
        piscinas: [],
        clientes: [],
        totalItems: 0,
        lastSync: "",
        isGloballyShared: false,
        isLoading: false,
        error: "Initialization failed",
        syncStatus: "error",
      };
    }
  });

    // Inicializar sincronização universal
  useEffect(() => {
    let mounted = true;

    const initializeUniversalSync = async () => {
      try {
        // Check if universalDataSync is available
        if (!universalDataSync) {
          console.warn("⚠️ universalDataSync service not available");
          if (mounted) {
            setState((prev) => ({
              ...prev,
              error: "Service not available",
              isLoading: false,
              syncStatus: "error",
            }));
          }
          return;
        }

        // Inicializar sincronização silenciosa
        setState((prev) => ({ ...prev, syncStatus: "connecting" }));

        const initialized = await universalDataSync.initialize();

        if (!initialized) {
          if (mounted) {
            setState((prev) => ({
              ...prev,
              error: null, // Não mostrar erro, funcionar silenciosamente
              isLoading: false,
              syncStatus: "disconnected",
            }));
          }
          return;
        }

        // Carregar dados universais iniciais
        setState((prev) => ({ ...prev, syncStatus: "syncing" }));
        const universalData = await universalDataSync.getAllUniversalData();

        if (mounted) {
          setState((prev) => ({
            ...prev,
            ...universalData,
            isLoading: false,
            error: null,
            syncStatus: "connected",
          }));
        }
      } catch (error: any) {
        console.error("❌ Erro na inicialização universal:", error);
        if (mounted) {
          setState((prev) => ({
            ...prev,
            error: error.message,
            isLoading: false,
            syncStatus: "error",
          }));
        }
      }
    };

    initializeUniversalSync();

    return () => {
      mounted = false;
    };
  }, []);

    // Configurar listeners universais em tempo real
  useEffect(() => {
    try {
      if (!universalDataSync || !universalDataSync.isReady()) return;

      // Configurar listeners silenciosos
      const cleanup = universalDataSync.setupUniversalListeners({
      onObrasChange: (obras) => {
        setState((prev) => ({
          ...prev,
          obras,
          totalItems:
            obras.length +
            prev.manutencoes.length +
            prev.piscinas.length +
            prev.clientes.length,
          lastSync: new Date().toISOString(),
          syncStatus: "connected",
        }));
      },
      onManutencoesChange: (manutencoes) => {
        setState((prev) => ({
          ...prev,
          manutencoes,
          totalItems:
            prev.obras.length +
            manutencoes.length +
            prev.piscinas.length +
            prev.clientes.length,
          lastSync: new Date().toISOString(),
          syncStatus: "connected",
        }));
      },
      onPiscinasChange: (piscinas) => {
        setState((prev) => ({
          ...prev,
          piscinas,
          totalItems:
            prev.obras.length +
            prev.manutencoes.length +
            piscinas.length +
            prev.clientes.length,
          lastSync: new Date().toISOString(),
          syncStatus: "connected",
        }));
      },
      onClientesChange: (clientes) => {
        setState((prev) => ({
          ...prev,
          clientes,
          totalItems:
            prev.obras.length +
            prev.manutencoes.length +
            prev.piscinas.length +
            clientes.length,
          lastSync: new Date().toISOString(),
          syncStatus: "connected",
        }));
      },
    });

    return cleanup;
  }, [universalDataSync.isReady()]);

  // Ações para obras
  const addObra = useCallback(async (obraData: any): Promise<string> => {
    try {
      setState((prev) => ({ ...prev, syncStatus: "syncing", error: null }));

      // Ensure service is initialized
      if (!universalDataSync.isReady()) {
        console.log("🔄 Inicializando serviço universal...");
        await universalDataSync.initialize();
      }

      const id = await universalDataSync.addObra(obraData);
      setState((prev) => ({ ...prev, syncStatus: "connected" }));
      return id;
    } catch (error: any) {
      console.error("❌ Erro ao adicionar obra:", error);
      setState((prev) => ({
        ...prev,
        error: error.message || "Erro desconhecido",
        syncStatus: "error",
      }));

      // Don't re-throw the error - the service now handles fallback to localStorage
      // Just return a generated ID
      const fallbackId = obraData.id || `obra-${Date.now()}-${Math.random()}`;
      console.log(`✅ Usando fallback ID: ${fallbackId}`);
      return fallbackId;
    }
  }, []);

  const updateObra = useCallback(
    async (id: string, obraData: any): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, syncStatus: "syncing" }));
        await universalDataSync.updateObra(id, obraData);
        setState((prev) => ({ ...prev, syncStatus: "connected" }));
      } catch (error: any) {
        console.error("❌ Erro ao atualizar obra:", error);
        setState((prev) => ({
          ...prev,
          error: error.message,
          syncStatus: "error",
        }));
        throw error;
      }
    },
    [],
  );

  const deleteObra = useCallback(async (id: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, syncStatus: "syncing" }));
      await universalDataSync.deleteObra(id);
      setState((prev) => ({ ...prev, syncStatus: "connected" }));
    } catch (error: any) {
      console.error("❌ Erro ao eliminar obra:", error);
      setState((prev) => ({
        ...prev,
        error: error.message,
        syncStatus: "error",
      }));
      throw error;
    }
  }, []);

  // Ações para manutenções
  const addManutencao = useCallback(
    async (manutencaoData: any): Promise<string> => {
      try {
        setState((prev) => ({ ...prev, syncStatus: "syncing" }));
        const id = await universalDataSync.addManutencao(manutencaoData);
        setState((prev) => ({ ...prev, syncStatus: "connected" }));
        return id;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message,
          syncStatus: "error",
        }));
        throw error;
      }
    },
    [],
  );

  const updateManutencao = useCallback(
    async (id: string, manutencaoData: any): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, syncStatus: "syncing" }));
        await universalDataSync.updateManutencao(id, manutencaoData);
        setState((prev) => ({ ...prev, syncStatus: "connected" }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message,
          syncStatus: "error",
        }));
        throw error;
      }
    },
    [],
  );

  const deleteManutencao = useCallback(async (id: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, syncStatus: "syncing" }));
      await universalDataSync.deleteManutencao(id);
      setState((prev) => ({ ...prev, syncStatus: "connected" }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        syncStatus: "error",
      }));
      throw error;
    }
  }, []);

  // Ações para piscinas
  const addPiscina = useCallback(async (piscinaData: any): Promise<string> => {
    try {
      setState((prev) => ({ ...prev, syncStatus: "syncing" }));
      const id = await universalDataSync.addPiscina(piscinaData);
      setState((prev) => ({ ...prev, syncStatus: "connected" }));
      console.log(
        `✅ PISCINA ADICIONADA: ${id} - visível para todos os utilizadores`,
      );
      return id;
    } catch (error: any) {
      console.error("❌ Erro ao adicionar piscina:", error);
      setState((prev) => ({
        ...prev,
        error: error.message,
        syncStatus: "error",
      }));
      throw error;
    }
  }, []);

  const updatePiscina = useCallback(
    async (id: string, piscinaData: any): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, syncStatus: "syncing" }));
        await universalDataSync.updatePiscina(id, piscinaData);
        setState((prev) => ({ ...prev, syncStatus: "connected" }));
        console.log(
          `✅ PISCINA ATUALIZADA: ${id} - visível para todos os utilizadores`,
        );
      } catch (error: any) {
        console.error("❌ Erro ao atualizar piscina:", error);
        setState((prev) => ({
          ...prev,
          error: error.message,
          syncStatus: "error",
        }));
        throw error;
      }
    },
    [],
  );

  const deletePiscina = useCallback(async (id: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, syncStatus: "syncing" }));
      await universalDataSync.deletePiscina(id);
      setState((prev) => ({ ...prev, syncStatus: "connected" }));
      console.log(
        `✅ PISCINA ELIMINADA: ${id} - alteração visível para todos os utilizadores`,
      );
    } catch (error: any) {
      console.error("❌ Erro ao eliminar piscina:", error);
      setState((prev) => ({
        ...prev,
        error: error.message,
        syncStatus: "error",
      }));
      throw error;
    }
  }, []);

  // Ações para clientes
  const addCliente = useCallback(async (clienteData: any): Promise<string> => {
    try {
      setState((prev) => ({ ...prev, syncStatus: "syncing" }));
      const id = await universalDataSync.addCliente(clienteData);
      setState((prev) => ({ ...prev, syncStatus: "connected" }));
      console.log(
        `✅ CLIENTE ADICIONADO: ${id} - visível para todos os utilizadores`,
      );
      return id;
    } catch (error: any) {
      console.error("❌ Erro ao adicionar cliente:", error);
      setState((prev) => ({
        ...prev,
        error: error.message,
        syncStatus: "error",
      }));
      throw error;
    }
  }, []);

  const updateCliente = useCallback(
    async (id: string, clienteData: any): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, syncStatus: "syncing" }));
        await universalDataSync.updateCliente(id, clienteData);
        setState((prev) => ({ ...prev, syncStatus: "connected" }));
      } catch (error: any) {
        console.error("❌ Erro ao atualizar cliente:", error);
        setState((prev) => ({
          ...prev,
          error: error.message,
          syncStatus: "error",
        }));
        throw error;
      }
    },
    [],
  );

  const deleteCliente = useCallback(async (id: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, syncStatus: "syncing" }));
      await universalDataSync.deleteCliente(id);
      setState((prev) => ({ ...prev, syncStatus: "connected" }));
    } catch (error: any) {
      console.error("❌ Erro ao eliminar cliente:", error);
      setState((prev) => ({
        ...prev,
        error: error.message,
        syncStatus: "error",
      }));
      throw error;
    }
  }, []);

  // Forçar sincronização completa
  const forceSyncAll = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, syncStatus: "syncing" }));

      const universalData = await universalDataSync.getAllUniversalData();

      setState((prev) => ({
        ...prev,
        ...universalData,
        isLoading: false,
        error: null,
        syncStatus: "connected",
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
        syncStatus: "error",
      }));
    }
  }, []);

  // Reset da sincronização
  const resetSync = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        syncStatus: "connecting",
        error: null,
      }));

      // Cleanup listeners existentes
      universalDataSync.cleanup();

      // Reinicializar
      const initialized = await universalDataSync.initialize();

      if (initialized) {
        await forceSyncAll();
      } else {
        setState((prev) => ({
          ...prev,
          error: "Falha ao reiniciar sincronização",
          isLoading: false,
          syncStatus: "error",
        }));
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
        syncStatus: "error",
      }));
    }
  }, [forceSyncAll]);

  return {
    // Estado
    ...state,

    // Ações para obras
    addObra,
    updateObra,
    deleteObra,

    // Ações para manutenções
    addManutencao,
    updateManutencao,
    deleteManutencao,

    // Ações para piscinas
    addPiscina,
    updatePiscina,
    deletePiscina,

    // Ações para clientes
    addCliente,
    updateCliente,
    deleteCliente,

    // Sync
    forceSyncAll,
    resetSync,
  };
}