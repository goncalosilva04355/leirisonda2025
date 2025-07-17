// HOOK CONVERTIDO PARA REST API - SEM SDK FIREBASE
import { useState, useEffect, useCallback } from "react";
import {
  saveToFirestoreRest,
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "../utils/firestoreRestApi";

/**
 * Hook que usa APENAS REST API do Firestore (sem SDK)
 * Substitui totalmente o Firebase SDK
 */
export const useForceFirestore = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState<{
    firestoreReady: boolean;
    collections: { [key: string]: number };
  }>({
    firestoreReady: false,
    collections: {},
  });

  // Initialize REST API
  useEffect(() => {
    const initializeRestApi = async () => {
      try {
        console.log("🌐 USANDO APENAS REST API - SEM SDK FIREBASE");

        // Test REST API connection
        const testData = await readFromFirestoreRest("test");

        setStatus({
          firestoreReady: true,
          collections: {},
        });
        setIsInitialized(true);

        console.log("✅ REST API inicializada com sucesso");
      } catch (error) {
        console.error("❌ Erro ao inicializar REST API:", error);
        setIsInitialized(true);
      }
    };

    initializeRestApi();
  }, []);

  // Pools operations - REST API
  const savePools = useCallback(async (pools: any[]): Promise<void> => {
    console.log("💾 Guardando piscinas via REST API:", pools.length);
    try {
      for (const pool of pools) {
        await saveToFirestoreRest(
          "piscinas",
          pool.id || `pool_${Date.now()}`,
          pool,
        );
      }
      console.log("✅ Piscinas guardadas via REST API");
    } catch (error) {
      console.error("❌ Erro ao guardar piscinas via REST API:", error);
      throw error;
    }
  }, []);

  const getPools = useCallback(async (): Promise<any[]> => {
    console.log("📖 Obtendo piscinas via REST API");
    try {
      const pools = await readFromFirestoreRest("piscinas");
      console.log("✅ Piscinas obtidas via REST API:", pools.length);
      return pools;
    } catch (error) {
      console.error("❌ Erro ao obter piscinas via REST API:", error);
      return [];
    }
  }, []);

  const savePool = useCallback(async (pool: any): Promise<string> => {
    console.log("💾 Guardando piscina via REST API:", pool.name || pool.id);
    try {
      const id = pool.id || `pool_${Date.now()}`;
      await saveToFirestoreRest("piscinas", id, pool);
      console.log("✅ Piscina guardada via REST API:", id);
      return id;
    } catch (error) {
      console.error("❌ Erro ao guardar piscina via REST API:", error);
      throw error;
    }
  }, []);

  const deletePool = useCallback(async (poolId: string): Promise<void> => {
    console.log("🗑️ Eliminando piscina via REST API:", poolId);
    try {
      await deleteFromFirestoreRest("piscinas", poolId);
      console.log("✅ Piscina eliminada via REST API");
    } catch (error) {
      console.error("❌ Erro ao eliminar piscina via REST API:", error);
      throw error;
    }
  }, []);

  // Works operations - REST API
  const saveWorks = useCallback(async (works: any[]): Promise<void> => {
    console.log("💾 Guardando obras via REST API:", works.length);
    try {
      for (const work of works) {
        await saveToFirestoreRest(
          "obras",
          work.id || `work_${Date.now()}`,
          work,
        );
      }
      console.log("✅ Obras guardadas via REST API");
    } catch (error) {
      console.error("❌ Erro ao guardar obras via REST API:", error);
      throw error;
    }
  }, []);

  const getWorks = useCallback(async (): Promise<any[]> => {
    console.log("📖 Obtendo obras via REST API");
    try {
      const works = await readFromFirestoreRest("obras");
      console.log("✅ Obras obtidas via REST API:", works.length);
      return works;
    } catch (error) {
      console.error("❌ Erro ao obter obras via REST API:", error);
      return [];
    }
  }, []);

  const saveWork = useCallback(async (work: any): Promise<string> => {
    console.log("💾 Guardando obra via REST API:", work.name || work.id);
    try {
      const id = work.id || `work_${Date.now()}`;
      await saveToFirestoreRest("obras", id, work);
      console.log("✅ Obra guardada via REST API:", id);
      return id;
    } catch (error) {
      console.error("❌ Erro ao guardar obra via REST API:", error);
      throw error;
    }
  }, []);

  const deleteWork = useCallback(async (workId: string): Promise<void> => {
    console.log("🗑️ Eliminando obra via REST API:", workId);
    try {
      await deleteFromFirestoreRest("obras", workId);
      console.log("✅ Obra eliminada via REST API");
    } catch (error) {
      console.error("❌ Erro ao eliminar obra via REST API:", error);
      throw error;
    }
  }, []);

  // Maintenance operations - REST API
  const saveMaintenance = useCallback(
    async (maintenanceList: any[]): Promise<void> => {
      console.log(
        "💾 Guardando manutenções via REST API:",
        maintenanceList.length,
      );
      try {
        for (const maintenance of maintenanceList) {
          await saveToFirestoreRest(
            "manutencoes",
            maintenance.id || `maint_${Date.now()}`,
            maintenance,
          );
        }
        console.log("✅ Manutenções guardadas via REST API");
      } catch (error) {
        console.error("❌ Erro ao guardar manutenções via REST API:", error);
        throw error;
      }
    },
    [],
  );

  const getMaintenance = useCallback(async (): Promise<any[]> => {
    console.log("📖 Obtendo manutenções via REST API");
    try {
      const maintenance = await readFromFirestoreRest("manutencoes");
      console.log("✅ Manutenções obtidas via REST API:", maintenance.length);
      return maintenance;
    } catch (error) {
      console.error("❌ Erro ao obter manutenções via REST API:", error);
      return [];
    }
  }, []);

  const saveMaintenanceItem = useCallback(
    async (maintenance: any): Promise<string> => {
      console.log(
        "💾 Guardando manutenção via REST API:",
        maintenance.poolName || maintenance.id,
      );
      try {
        const id = maintenance.id || `maint_${Date.now()}`;
        await saveToFirestoreRest("manutencoes", id, maintenance);
        console.log("✅ Manutenção guardada via REST API:", id);
        return id;
      } catch (error) {
        console.error("❌ Erro ao guardar manutenção via REST API:", error);
        throw error;
      }
    },
    [],
  );

  const deleteMaintenance = useCallback(
    async (maintenanceId: string): Promise<void> => {
      console.log("🗑️ Eliminando manutenção via REST API:", maintenanceId);
      try {
        await deleteFromFirestoreRest("manutencoes", maintenanceId);
        console.log("✅ Manutenção eliminada via REST API");
      } catch (error) {
        console.error("❌ Erro ao eliminar manutenção via REST API:", error);
        throw error;
      }
    },
    [],
  );

  // Clients operations - REST API
  const saveClients = useCallback(async (clients: any[]): Promise<void> => {
    console.log("💾 Guardando clientes via REST API:", clients.length);
    try {
      for (const client of clients) {
        await saveToFirestoreRest(
          "clientes",
          client.id || `client_${Date.now()}`,
          client,
        );
      }
      console.log("✅ Clientes guardados via REST API");
    } catch (error) {
      console.error("❌ Erro ao guardar clientes via REST API:", error);
      throw error;
    }
  }, []);

  const getClients = useCallback(async (): Promise<any[]> => {
    console.log("📖 Obtendo clientes via REST API");
    try {
      const clients = await readFromFirestoreRest("clientes");
      console.log("✅ Clientes obtidos via REST API:", clients.length);
      return clients;
    } catch (error) {
      console.error("❌ Erro ao obter clientes via REST API:", error);
      return [];
    }
  }, []);

  const saveClient = useCallback(async (client: any): Promise<string> => {
    console.log("💾 Guardando cliente via REST API:", client.name || client.id);
    try {
      const id = client.id || `client_${Date.now()}`;
      await saveToFirestoreRest("clientes", id, client);
      console.log("✅ Cliente guardado via REST API:", id);
      return id;
    } catch (error) {
      console.error("❌ Erro ao guardar cliente via REST API:", error);
      throw error;
    }
  }, []);

  const deleteClient = useCallback(async (clientId: string): Promise<void> => {
    console.log("🗑️ Eliminando cliente via REST API:", clientId);
    try {
      await deleteFromFirestoreRest("clientes", clientId);
      console.log("✅ Cliente eliminado via REST API");
    } catch (error) {
      console.error("❌ Erro ao eliminar cliente via REST API:", error);
      throw error;
    }
  }, []);

  // Users operations - REST API
  const getUsers = useCallback(async (): Promise<any[]> => {
    console.log("📖 Obtendo utilizadores via REST API");
    try {
      const users = await readFromFirestoreRest("users");
      console.log("✅ Utilizadores obtidos via REST API:", users.length);
      return users;
    } catch (error) {
      console.error("❌ Erro ao obter utilizadores via REST API:", error);
      return [];
    }
  }, []);

  const saveUser = useCallback(async (user: any): Promise<void> => {
    console.log("💾 Guardando utilizador via REST API:", user.email);
    try {
      const id = user.id || user.email || `user_${Date.now()}`;
      await saveToFirestoreRest("users", id, user);
      console.log("✅ Utilizador guardado via REST API");
    } catch (error) {
      console.error("❌ Erro ao guardar utilizador via REST API:", error);
      throw error;
    }
  }, []);

  // Generic data operations - REST API
  const saveData = useCallback(
    async (collection: string, data: any, id?: string): Promise<string> => {
      console.log(
        `💾 Guardando dados via REST API (${collection}):`,
        id || data.id,
      );
      try {
        const docId = id || data.id || `${collection}_${Date.now()}`;
        await saveToFirestoreRest(collection, docId, data);
        console.log(`✅ Dados guardados via REST API (${collection}):`, docId);
        return docId;
      } catch (error) {
        console.error(
          `❌ Erro ao guardar dados via REST API (${collection}):`,
          error,
        );
        throw error;
      }
    },
    [],
  );

  const getData = useCallback(async (collection: string): Promise<any[]> => {
    console.log(`📖 Obtendo dados via REST API (${collection})`);
    try {
      const data = await readFromFirestoreRest(collection);
      console.log(
        `✅ Dados obtidos via REST API (${collection}):`,
        data.length,
      );
      return data;
    } catch (error) {
      console.error(
        `❌ Erro ao obter dados via REST API (${collection}):`,
        error,
      );
      return [];
    }
  }, []);

  const deleteData = useCallback(
    async (collection: string, id: string): Promise<void> => {
      console.log(`🗑️ Eliminando dados via REST API (${collection}):`, id);
      try {
        await deleteFromFirestoreRest(collection, id);
        console.log(`✅ Dados eliminados via REST API (${collection})`);
      } catch (error) {
        console.error(
          `❌ Erro ao eliminar dados via REST API (${collection}):`,
          error,
        );
        throw error;
      }
    },
    [],
  );

  // Status check
  const getStatus = useCallback(async () => {
    try {
      // Test if REST API is working
      await readFromFirestoreRest("test");
      const newStatus = {
        firestoreReady: true,
        collections: {},
      };
      setStatus(newStatus);
      return newStatus;
    } catch (error) {
      console.error("❌ Erro ao verificar status REST API:", error);
      const newStatus = {
        firestoreReady: false,
        collections: {},
      };
      setStatus(newStatus);
      return newStatus;
    }
  }, []);

  return {
    isInitialized,
    status,

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
    getStatus,
  };
};

export default useForceFirestore;
