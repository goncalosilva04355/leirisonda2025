import { useState, useEffect, useCallback } from "react";
import { forceFirestoreService } from "../services/forceFirestoreService";

/**
 * Hook que força TODOS os dados a serem guardados no Firestore
 * Substitui qualquer uso de localStorage como armazenamento principal
 */
export const useForceFirestore = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState<{
    firestoreReady: boolean;
    collections: { [key: string]: number };
    lastCheck: string;
  }>({
    firestoreReady: false,
    collections: {},
    lastCheck: new Date().toISOString(),
  });

  // Initialize and migrate localStorage data to Firestore
  useEffect(() => {
    const initializeFirestore = async () => {
      try {
        console.log("🔥 FORÇANDO USO DO FIRESTORE - MIGRANDO DADOS LOCAIS");

        // Migrate any existing localStorage data
        const migrationResult =
          await forceFirestoreService.migrateLocalStorageToFirestore();
        console.log("📦 Migração concluída:", migrationResult);

        // Get current status
        const currentStatus = await forceFirestoreService.getStatus();
        setStatus(currentStatus);

        setIsInitialized(true);
        console.log(
          "✅ useForceFirestore inicializado - todos os dados vão para Firestore",
        );
      } catch (error) {
        console.error("❌ Erro ao inicializar useForceFirestore:", error);
        setIsInitialized(true); // Continue mesmo com erro
      }
    };

    initializeFirestore();
  }, []);

  // Pools operations - SEMPRE no Firestore
  const savePools = useCallback(async (pools: any[]): Promise<void> => {
    console.log("💾 Guardando piscinas no Firestore:", pools.length);
    try {
      const operations = pools.map((pool) => ({
        collection: "pools",
        data: pool,
        id: pool.id,
      }));
      await forceFirestoreService.saveBatch(operations);
      console.log("✅ Piscinas guardadas no Firestore");
    } catch (error) {
      console.error("❌ Erro ao guardar piscinas no Firestore:", error);
      throw error;
    }
  }, []);

  const getPools = useCallback(async (): Promise<any[]> => {
    console.log("📖 Obtendo piscinas do Firestore");
    try {
      const pools = await forceFirestoreService.getPools();
      console.log("✅ Piscinas obtidas do Firestore:", pools.length);
      return pools;
    } catch (error) {
      console.error("❌ Erro ao obter piscinas do Firestore:", error);
      return [];
    }
  }, []);

  const savePool = useCallback(async (pool: any): Promise<string> => {
    console.log("💾 Guardando piscina no Firestore:", pool.name || pool.id);
    try {
      const id = await forceFirestoreService.savePool(pool);
      console.log("✅ Piscina guardada no Firestore:", id);
      return id;
    } catch (error) {
      console.error("❌ Erro ao guardar piscina no Firestore:", error);
      throw error;
    }
  }, []);

  const deletePool = useCallback(async (poolId: string): Promise<void> => {
    console.log("🗑️ Eliminando piscina do Firestore:", poolId);
    try {
      await forceFirestoreService.deletePool(poolId);
      console.log("✅ Piscina eliminada do Firestore");
    } catch (error) {
      console.error("❌ Erro ao eliminar piscina do Firestore:", error);
      throw error;
    }
  }, []);

  // Works operations - SEMPRE no Firestore
  const saveWorks = useCallback(async (works: any[]): Promise<void> => {
    console.log("💾 Guardando obras no Firestore:", works.length);
    try {
      const operations = works.map((work) => ({
        collection: "works",
        data: work,
        id: work.id,
      }));
      await forceFirestoreService.saveBatch(operations);
      console.log("✅ Obras guardadas no Firestore");
    } catch (error) {
      console.error("❌ Erro ao guardar obras no Firestore:", error);
      throw error;
    }
  }, []);

  const getWorks = useCallback(async (): Promise<any[]> => {
    console.log("📖 Obtendo obras do Firestore");
    try {
      const works = await forceFirestoreService.getWorks();
      console.log("✅ Obras obtidas do Firestore:", works.length);
      return works;
    } catch (error) {
      console.error("❌ Erro ao obter obras do Firestore:", error);
      return [];
    }
  }, []);

  const saveWork = useCallback(async (work: any): Promise<string> => {
    console.log("💾 Guardando obra no Firestore:", work.name || work.id);
    try {
      const id = await forceFirestoreService.saveWork(work);
      console.log("✅ Obra guardada no Firestore:", id);
      return id;
    } catch (error) {
      console.error("❌ Erro ao guardar obra no Firestore:", error);
      throw error;
    }
  }, []);

  const deleteWork = useCallback(async (workId: string): Promise<void> => {
    console.log("🗑️ Eliminando obra do Firestore:", workId);
    try {
      await forceFirestoreService.deleteWork(workId);
      console.log("✅ Obra eliminada do Firestore");
    } catch (error) {
      console.error("❌ Erro ao eliminar obra do Firestore:", error);
      throw error;
    }
  }, []);

  // Maintenance operations - SEMPRE no Firestore
  const saveMaintenance = useCallback(
    async (maintenanceList: any[]): Promise<void> => {
      console.log(
        "💾 Guardando manutenções no Firestore:",
        maintenanceList.length,
      );
      try {
        const operations = maintenanceList.map((maintenance) => ({
          collection: "maintenance",
          data: maintenance,
          id: maintenance.id,
        }));
        await forceFirestoreService.saveBatch(operations);
        console.log("✅ Manutenções guardadas no Firestore");
      } catch (error) {
        console.error("❌ Erro ao guardar manutenções no Firestore:", error);
        throw error;
      }
    },
    [],
  );

  const getMaintenance = useCallback(async (): Promise<any[]> => {
    console.log("📖 Obtendo manutenções do Firestore");
    try {
      const maintenance = await forceFirestoreService.getMaintenance();
      console.log("✅ Manutenções obtidas do Firestore:", maintenance.length);
      return maintenance;
    } catch (error) {
      console.error("❌ Erro ao obter manutenções do Firestore:", error);
      return [];
    }
  }, []);

  const saveMaintenanceItem = useCallback(
    async (maintenance: any): Promise<string> => {
      console.log(
        "💾 Guardando manutenção no Firestore:",
        maintenance.poolName || maintenance.id,
      );
      try {
        const id = await forceFirestoreService.saveMaintenance(maintenance);
        console.log("✅ Manutenção guardada no Firestore:", id);
        return id;
      } catch (error) {
        console.error("❌ Erro ao guardar manutenção no Firestore:", error);
        throw error;
      }
    },
    [],
  );

  const deleteMaintenance = useCallback(
    async (maintenanceId: string): Promise<void> => {
      console.log("🗑️ Eliminando manutenção do Firestore:", maintenanceId);
      try {
        await forceFirestoreService.deleteMaintenance(maintenanceId);
        console.log("✅ Manutenção eliminada do Firestore");
      } catch (error) {
        console.error("❌ Erro ao eliminar manutenção do Firestore:", error);
        throw error;
      }
    },
    [],
  );

  // Clients operations - SEMPRE no Firestore
  const saveClients = useCallback(async (clients: any[]): Promise<void> => {
    console.log("💾 Guardando clientes no Firestore:", clients.length);
    try {
      const operations = clients.map((client) => ({
        collection: "clients",
        data: client,
        id: client.id,
      }));
      await forceFirestoreService.saveBatch(operations);
      console.log("✅ Clientes guardados no Firestore");
    } catch (error) {
      console.error("❌ Erro ao guardar clientes no Firestore:", error);
      throw error;
    }
  }, []);

  const getClients = useCallback(async (): Promise<any[]> => {
    console.log("📖 Obtendo clientes do Firestore");
    try {
      const clients = await forceFirestoreService.getClients();
      console.log("✅ Clientes obtidos do Firestore:", clients.length);
      return clients;
    } catch (error) {
      console.error("❌ Erro ao obter clientes do Firestore:", error);
      return [];
    }
  }, []);

  const saveClient = useCallback(async (client: any): Promise<string> => {
    console.log("💾 Guardando cliente no Firestore:", client.name || client.id);
    try {
      const id = await forceFirestoreService.saveClient(client);
      console.log("✅ Cliente guardado no Firestore:", id);
      return id;
    } catch (error) {
      console.error("❌ Erro ao guardar cliente no Firestore:", error);
      throw error;
    }
  }, []);

  const deleteClient = useCallback(async (clientId: string): Promise<void> => {
    console.log("🗑️ Eliminando cliente do Firestore:", clientId);
    try {
      await forceFirestoreService.deleteClient(clientId);
      console.log("✅ Cliente eliminado do Firestore");
    } catch (error) {
      console.error("❌ Erro ao eliminar cliente do Firestore:", error);
      throw error;
    }
  }, []);

  // Users operations - SEMPRE no Firestore
  const getUsers = useCallback(async (): Promise<any[]> => {
    console.log("📖 Obtendo utilizadores do Firestore");
    try {
      const users = await forceFirestoreService.getUsers();
      console.log("✅ Utilizadores obtidos do Firestore:", users.length);
      return users;
    } catch (error) {
      console.error("❌ Erro ao obter utilizadores do Firestore:", error);
      return [];
    }
  }, []);

  const saveUser = useCallback(async (user: any): Promise<void> => {
    console.log("💾 Guardando utilizador no Firestore:", user.email);
    try {
      await forceFirestoreService.saveUser(user);
      console.log("✅ Utilizador guardado no Firestore");
    } catch (error) {
      console.error("❌ Erro ao guardar utilizador no Firestore:", error);
      throw error;
    }
  }, []);

  // Generic operations
  const saveData = useCallback(
    async (collection: string, data: any, id?: string): Promise<string> => {
      console.log(
        `💾 Guardando dados no Firestore (${collection}):`,
        id || data.id,
      );
      try {
        const docId = await forceFirestoreService.saveData(
          collection,
          data,
          id,
        );
        console.log(`✅ Dados guardados no Firestore (${collection}):`, docId);
        return docId;
      } catch (error) {
        console.error(
          `❌ Erro ao guardar dados no Firestore (${collection}):`,
          error,
        );
        throw error;
      }
    },
    [],
  );

  const getData = useCallback(async (collection: string): Promise<any[]> => {
    console.log(`📖 Obtendo dados do Firestore (${collection})`);
    try {
      const data = await forceFirestoreService.getData(collection);
      console.log(
        `✅ Dados obtidos do Firestore (${collection}):`,
        data.length,
      );
      return data;
    } catch (error) {
      console.error(
        `❌ Erro ao obter dados do Firestore (${collection}):`,
        error,
      );
      return [];
    }
  }, []);

  const deleteData = useCallback(
    async (collection: string, id: string): Promise<void> => {
      console.log(`🗑️ Eliminando dados do Firestore (${collection}):`, id);
      try {
        await forceFirestoreService.deleteData(collection, id);
        console.log(`✅ Dados eliminados do Firestore (${collection})`);
      } catch (error) {
        console.error(
          `❌ Erro ao eliminar dados do Firestore (${collection}):`,
          error,
        );
        throw error;
      }
    },
    [],
  );

  // Refresh status
  const refreshStatus = useCallback(async (): Promise<void> => {
    try {
      const currentStatus = await forceFirestoreService.getStatus();
      setStatus(currentStatus);
    } catch (error) {
      console.error("❌ Erro ao atualizar status:", error);
    }
  }, []);

  return {
    // Status
    isInitialized,
    status,
    refreshStatus,

    // Pools
    savePools,
    getPools,
    savePool,
    deletePool,

    // Works
    saveWorks,
    getWorks,
    saveWork,
    deleteWork,

    // Maintenance
    saveMaintenance,
    getMaintenance,
    saveMaintenanceItem,
    deleteMaintenance,

    // Clients
    saveClients,
    getClients,
    saveClient,
    deleteClient,

    // Users
    getUsers,
    saveUser,

    // Generic
    saveData,
    getData,
    deleteData,
  };
};

export default useForceFirestore;
