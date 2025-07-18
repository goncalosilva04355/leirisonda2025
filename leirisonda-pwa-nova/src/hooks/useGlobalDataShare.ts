import { useState, useEffect, useCallback } from "react";
import { globalDataShare } from "../services/globalDataShareService";

export interface GlobalDataState {
  pools: any[];
  works: any[];
  maintenance: any[];
  clients: any[];
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  isGloballyShared: true;
}

/**
 * Hook para partilha de dados SEMPRE ativa entre utilizadores
 * NUNCA usa localStorage - apenas dados partilhados globalmente
 */
export function useGlobalDataShare() {
  const [state, setState] = useState<GlobalDataState>({
    pools: [],
    works: [],
    maintenance: [],
    clients: [],
    isLoading: true,
    error: null,
    lastSync: null,
    isGloballyShared: true,
  });

  // Inicializar serviço de partilha global
  useEffect(() => {
    let mounted = true;

    const initializeGlobalSharing = async () => {
      try {
        console.log("🌐 INICIALIZANDO PARTILHA GLOBAL DE DADOS");
        console.log("❌ LOCALSTORAGE: Nunca será usado");

        const initialized = await globalDataShare.initialize();

        if (!initialized) {
          if (mounted) {
            setState((prev) => ({
              ...prev,
              error: "Firebase não disponível para partilha global",
              isLoading: false,
            }));
          }
          return;
        }

        // Migrar dados existentes para estrutura global
        await globalDataShare.migrateAllDataToGlobalSharing();

        // Carregar dados globais iniciais
        const globalData = await globalDataShare.getAllGlobalData();

        if (mounted) {
          setState({
            pools: globalData.pools,
            works: globalData.works,
            maintenance: globalData.maintenance,
            clients: globalData.clients,
            isLoading: false,
            error: null,
            lastSync: globalData.lastSync,
            isGloballyShared: true,
          });

          console.log("✅ PARTILHA GLOBAL ATIVA:", {
            pools: globalData.pools.length,
            works: globalData.works.length,
            maintenance: globalData.maintenance.length,
            clients: globalData.clients.length,
          });
        }
      } catch (error: any) {
        console.error("❌ Erro ao inicializar partilha global:", error);
        if (mounted) {
          setState((prev) => ({
            ...prev,
            error: error.message,
            isLoading: false,
          }));
        }
      }
    };

    initializeGlobalSharing();

    return () => {
      mounted = false;
    };
  }, []);

  // Configurar listeners para dados globais em tempo real
  useEffect(() => {
    if (!globalDataShare.isReady()) return;

    console.log("📡 CONFIGURANDO LISTENERS PARA PARTILHA GLOBAL");

    const cleanup = globalDataShare.setupGlobalListeners({
      onPoolsChange: (pools) => {
        setState((prev) => ({
          ...prev,
          pools,
          lastSync: new Date().toISOString(),
        }));
        console.log(
          `🏊 POOLS GLOBAIS ATUALIZADOS: ${pools.length} visíveis para todos`,
        );
      },
      onWorksChange: (works) => {
        setState((prev) => ({
          ...prev,
          works,
          lastSync: new Date().toISOString(),
        }));
        console.log(
          `⚒️ WORKS GLOBAIS ATUALIZADOS: ${works.length} visíveis para todos`,
        );
      },
      onMaintenanceChange: (maintenance) => {
        setState((prev) => ({
          ...prev,
          maintenance,
          lastSync: new Date().toISOString(),
        }));
        console.log(
          `🔧 MAINTENANCE GLOBAL ATUALIZADO: ${maintenance.length} visível para todos`,
        );
      },
      onClientsChange: (clients) => {
        setState((prev) => ({
          ...prev,
          clients,
          lastSync: new Date().toISOString(),
        }));
        console.log(
          `👥 CLIENTS GLOBAIS ATUALIZADOS: ${clients.length} visíveis para todos`,
        );
      },
    });

    console.log("✅ LISTENERS GLOBAIS ATIVOS - Todos veem os mesmos dados");

    return cleanup;
  }, [globalDataShare.isReady()]);

  // Funções para adicionar dados aos globais partilhados
  const addToGlobal = useCallback(
    async (type: "pools" | "works" | "maintenance" | "clients", data: any) => {
      try {
        const id = await globalDataShare.addToGlobalData(type, data);
        console.log(`✅ ${type.toUpperCase()} adicionado globalmente: ${id}`);
        return id;
      } catch (error: any) {
        console.error(`❌ Erro ao adicionar ${type}:`, error);
        setState((prev) => ({ ...prev, error: error.message }));
        throw error;
      }
    },
    [],
  );

  // Funções para atualizar dados globais
  const updateGlobal = useCallback(
    async (
      type: "pools" | "works" | "maintenance" | "clients",
      id: string,
      data: any,
    ) => {
      try {
        await globalDataShare.updateGlobalData(type, id, data);
        console.log(`✅ ${type.toUpperCase()} atualizado globalmente: ${id}`);
      } catch (error: any) {
        console.error(`❌ Erro ao atualizar ${type}:`, error);
        setState((prev) => ({ ...prev, error: error.message }));
        throw error;
      }
    },
    [],
  );

  // Funções para remover dados globais
  const deleteFromGlobal = useCallback(
    async (type: "pools" | "works" | "maintenance" | "clients", id: string) => {
      try {
        await globalDataShare.deleteFromGlobalData(type, id);
        console.log(`✅ ${type.toUpperCase()} removido globalmente: ${id}`);
      } catch (error: any) {
        console.error(`❌ Erro ao remover ${type}:`, error);
        setState((prev) => ({ ...prev, error: error.message }));
        throw error;
      }
    },
    [],
  );

  // Forçar sincronização global
  const forceGlobalSync = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const globalData = await globalDataShare.getAllGlobalData();

      setState({
        pools: globalData.pools,
        works: globalData.works,
        maintenance: globalData.maintenance,
        clients: globalData.clients,
        isLoading: false,
        error: null,
        lastSync: globalData.lastSync,
        isGloballyShared: true,
      });

      console.log("🔄 SINCRONIZAÇÃO GLOBAL FORÇADA - Dados atualizados");
    } catch (error: any) {
      console.error("❌ Erro na sincronização global:", error);
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  }, []);

  return {
    // Estado
    ...state,

    // Ações globais
    addPool: (data: any) => addToGlobal("pools", data),
    updatePool: (id: string, data: any) => updateGlobal("pools", id, data),
    deletePool: (id: string) => deleteFromGlobal("pools", id),

    addWork: (data: any) => addToGlobal("works", data),
    updateWork: (id: string, data: any) => updateGlobal("works", id, data),
    deleteWork: (id: string) => deleteFromGlobal("works", id),

    addMaintenance: (data: any) => addToGlobal("maintenance", data),
    updateMaintenance: (id: string, data: any) =>
      updateGlobal("maintenance", id, data),
    deleteMaintenance: (id: string) => deleteFromGlobal("maintenance", id),

    addClient: (data: any) => addToGlobal("clients", data),
    updateClient: (id: string, data: any) => updateGlobal("clients", id, data),
    deleteClient: (id: string) => deleteFromGlobal("clients", id),

    // Sincronização
    forceGlobalSync,
  };
}
