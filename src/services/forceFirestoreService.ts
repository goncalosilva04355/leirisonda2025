// SERVIÇO CONVERTIDO PARA REST API PURA - SEM SDK FIREBASE
import {
  saveToFirestoreRest,
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "../utils/firestoreRestApi";

/**
 * Serviço que usa APENAS REST API do Firestore
 * Substitui completamente o Firebase SDK
 */
class ForceFirestoreService {
  private isReady = false;

  private async initialize(): Promise<boolean> {
    if (this.isReady) return true;

    try {
      console.log("🌐 ForceFirestore: Inicializando REST API...");

      // Test REST API connection
      await readFromFirestoreRest("test");
      this.isReady = true;

      console.log("✅ ForceFirestore: REST API inicializada com sucesso");
      return true;
    } catch (error: any) {
      console.error(
        "❌ ForceFirestore: Erro ao inicializar REST API:",
        error.message,
      );
      return false;
    }
  }

  // ==================== USERS ====================
  async saveUser(user: any): Promise<boolean> {
    console.log(
      "👤 ForceFirestore: Tentando guardar utilizador:",
      user?.email || "email n/d",
    );

    try {
      await this.initialize();

      if (!user) {
        throw new Error("Utilizador é null ou undefined");
      }

      const userId = user.uid || user.id || `user-${Date.now()}`;
      console.log("🏷️ ID do utilizador:", userId);

      const userData = {
        ...user,
        uid: userId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      };

      console.log("💾 Dados a guardar:", {
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
        hasPassword: !!userData.password,
      });

      const success = await saveToFirestoreRest("users", userId, userData);

      if (success) {
        console.log(
          "✅ Utilizador guardado via REST API:",
          user.email || userId,
        );
        return true;
      } else {
        console.error("❌ Falha ao guardar utilizador via REST API");
        return false;
      }
    } catch (error: any) {
      console.error("❌ Erro ao guardar utilizador:", error);
      return false;
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      await this.initialize();
      const users = await readFromFirestoreRest("users");
      console.log("✅ Utilizadores obtidos via REST API:", users.length);
      return users;
    } catch (error: any) {
      console.error("❌ Erro ao obter utilizadores via REST API:", error);
      return [];
    }
  }

  // ==================== POOLS ====================
  async savePool(pool: any): Promise<string> {
    try {
      await this.initialize();
      const poolId = pool.id || `pool-${Date.now()}-${Math.random()}`;

      const poolData = {
        ...pool,
        id: poolId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      };

      const success = await saveToFirestoreRest("piscinas", poolId, poolData);

      if (success) {
        console.log("✅ Piscina guardada via REST API:", poolId);
        return poolId;
      } else {
        throw new Error("Falha ao guardar piscina via REST API");
      }
    } catch (error: any) {
      console.error("❌ Erro ao guardar piscina via REST API:", error);
      throw error;
    }
  }

  async getPools(): Promise<any[]> {
    try {
      await this.initialize();
      const pools = await readFromFirestoreRest("piscinas");
      console.log("✅ Piscinas obtidas via REST API:", pools.length);
      return pools;
    } catch (error: any) {
      console.error("❌ Erro ao obter piscinas via REST API:", error);
      return [];
    }
  }

  async deletePool(poolId: string): Promise<boolean> {
    try {
      await this.initialize();
      const success = await deleteFromFirestoreRest("piscinas", poolId);

      if (success) {
        console.log("✅ Piscina eliminada via REST API:", poolId);
        return true;
      } else {
        throw new Error("Falha ao eliminar piscina via REST API");
      }
    } catch (error: any) {
      console.error("❌ Erro ao eliminar piscina via REST API:", error);
      throw error;
    }
  }

  // ==================== WORKS ====================
  async saveWork(work: any): Promise<string> {
    try {
      await this.initialize();
      const workId = work.id || `work-${Date.now()}-${Math.random()}`;

      const workData = {
        ...work,
        id: workId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      };

      const success = await saveToFirestoreRest("obras", workId, workData);

      if (success) {
        console.log("✅ Obra guardada via REST API:", workId);
        return workId;
      } else {
        throw new Error("Falha ao guardar obra via REST API");
      }
    } catch (error: any) {
      console.error("❌ Erro ao guardar obra via REST API:", error);
      throw error;
    }
  }

  async getWorks(): Promise<any[]> {
    try {
      await this.initialize();
      const works = await readFromFirestoreRest("obras");
      console.log("✅ Obras obtidas via REST API:", works.length);
      return works;
    } catch (error: any) {
      console.error("❌ Erro ao obter obras via REST API:", error);
      return [];
    }
  }

  async deleteWork(workId: string): Promise<boolean> {
    try {
      await this.initialize();
      const success = await deleteFromFirestoreRest("obras", workId);

      if (success) {
        console.log("✅ Obra eliminada via REST API:", workId);
        return true;
      } else {
        throw new Error("Falha ao eliminar obra via REST API");
      }
    } catch (error: any) {
      console.error("❌ Erro ao eliminar obra via REST API:", error);
      throw error;
    }
  }

  // ==================== MAINTENANCE ====================
  async saveMaintenance(maintenance: any): Promise<string> {
    try {
      await this.initialize();
      const maintenanceId =
        maintenance.id || `maintenance-${Date.now()}-${Math.random()}`;

      const maintenanceData = {
        ...maintenance,
        id: maintenanceId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      };

      const success = await saveToFirestoreRest(
        "manutencoes",
        maintenanceId,
        maintenanceData,
      );

      if (success) {
        console.log("✅ Manutenção guardada via REST API:", maintenanceId);
        return maintenanceId;
      } else {
        throw new Error("Falha ao guardar manutenção via REST API");
      }
    } catch (error: any) {
      console.error("❌ Erro ao guardar manutenção via REST API:", error);
      throw error;
    }
  }

  async getMaintenance(): Promise<any[]> {
    try {
      await this.initialize();
      const maintenance = await readFromFirestoreRest("manutencoes");
      console.log("✅ Manutenções obtidas via REST API:", maintenance.length);
      return maintenance;
    } catch (error: any) {
      console.error("❌ Erro ao obter manutenções via REST API:", error);
      return [];
    }
  }

  async deleteMaintenance(maintenanceId: string): Promise<boolean> {
    try {
      await this.initialize();
      const success = await deleteFromFirestoreRest(
        "manutencoes",
        maintenanceId,
      );

      if (success) {
        console.log("✅ Manutenção eliminada via REST API:", maintenanceId);
        return true;
      } else {
        throw new Error("Falha ao eliminar manutenção via REST API");
      }
    } catch (error: any) {
      console.error("❌ Erro ao eliminar manutenção via REST API:", error);
      throw error;
    }
  }

  // ==================== CLIENTS ====================
  async saveClient(client: any): Promise<string> {
    try {
      await this.initialize();
      const clientId = client.id || `client-${Date.now()}-${Math.random()}`;

      const clientData = {
        ...client,
        id: clientId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      };

      const success = await saveToFirestoreRest(
        "clientes",
        clientId,
        clientData,
      );

      if (success) {
        console.log("✅ Cliente guardado via REST API:", clientId);
        return clientId;
      } else {
        throw new Error("Falha ao guardar cliente via REST API");
      }
    } catch (error: any) {
      console.error("❌ Erro ao guardar cliente via REST API:", error);
      throw error;
    }
  }

  async getClients(): Promise<any[]> {
    try {
      await this.initialize();
      const clients = await readFromFirestoreRest("clientes");
      console.log("✅ Clientes obtidos via REST API:", clients.length);
      return clients;
    } catch (error: any) {
      console.error("❌ Erro ao obter clientes via REST API:", error);
      return [];
    }
  }

  async deleteClient(clientId: string): Promise<boolean> {
    try {
      await this.initialize();
      const success = await deleteFromFirestoreRest("clientes", clientId);

      if (success) {
        console.log("✅ Cliente eliminado via REST API:", clientId);
        return true;
      } else {
        throw new Error("Falha ao eliminar cliente via REST API");
      }
    } catch (error: any) {
      console.error("❌ Erro ao eliminar cliente via REST API:", error);
      throw error;
    }
  }

  // ==================== GENERIC DATA OPERATIONS ====================
  async saveData(collection: string, data: any, id?: string): Promise<string> {
    try {
      await this.initialize();
      const docId =
        id || data.id || `${collection}-${Date.now()}-${Math.random()}`;

      const docData = {
        ...data,
        id: docId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      };

      const success = await saveToFirestoreRest(collection, docId, docData);

      if (success) {
        console.log(`✅ Dados guardados via REST API (${collection}):`, docId);
        return docId;
      } else {
        throw new Error(`Falha ao guardar dados via REST API (${collection})`);
      }
    } catch (error: any) {
      console.error(
        `❌ Erro ao guardar dados via REST API (${collection}):`,
        error,
      );
      throw error;
    }
  }

  async getData(collectionName: string): Promise<any[]> {
    try {
      await this.initialize();
      const data = await readFromFirestoreRest(collectionName);
      console.log(
        `✅ Dados obtidos via REST API (${collectionName}):`,
        data.length,
      );
      return data;
    } catch (error: any) {
      console.error(
        `❌ Erro ao obter dados via REST API (${collectionName}):`,
        error,
      );
      return [];
    }
  }

  async deleteData(collectionName: string, docId: string): Promise<boolean> {
    try {
      await this.initialize();
      const success = await deleteFromFirestoreRest(collectionName, docId);

      if (success) {
        console.log(
          `✅ Dados eliminados via REST API (${collectionName}):`,
          docId,
        );
        return true;
      } else {
        throw new Error(
          `Falha ao eliminar dados via REST API (${collectionName})`,
        );
      }
    } catch (error: any) {
      console.error(
        `❌ Erro ao eliminar dados via REST API (${collectionName}):`,
        error,
      );
      throw error;
    }
  }

  // ==================== BATCH OPERATIONS ====================
  async saveBatch(
    operations: { collection: string; data: any; id?: string }[],
  ): Promise<string[]> {
    try {
      await this.initialize();
      const ids: string[] = [];

      // Process operations sequentially for REST API
      for (const { collection, data, id } of operations) {
        const docId = await this.saveData(collection, data, id);
        ids.push(docId);
      }

      console.log("✅ Batch guardado via REST API:", ids.length, "documentos");
      return ids;
    } catch (error: any) {
      console.error("❌ Erro ao guardar batch via REST API:", error);
      throw error;
    }
  }

  // ==================== MIGRATION TOOLS ====================
  async migrateLocalStorageToFirestore(): Promise<{
    success: boolean;
    migrated: number;
  }> {
    console.log("🔄 MIGRAÇÃO: localStorage → REST API (FORÇADA)");

    let migrated = 0;
    const collections = [
      "pools",
      "works",
      "maintenance",
      "clients",
      "mock-users",
    ];

    try {
      await this.initialize();

      for (const collectionName of collections) {
        const localData = localStorage.getItem(collectionName);
        if (localData) {
          try {
            const items = JSON.parse(localData);
            if (Array.isArray(items) && items.length > 0) {
              console.log(
                `📦 Migrando ${items.length} itens de ${collectionName}`,
              );

              const targetCollection =
                collectionName === "mock-users"
                  ? "users"
                  : collectionName === "pools"
                    ? "piscinas"
                    : collectionName === "works"
                      ? "obras"
                      : collectionName === "maintenance"
                        ? "manutencoes"
                        : collectionName === "clients"
                          ? "clientes"
                          : collectionName;

              for (const item of items) {
                await this.saveData(targetCollection, item);
                migrated++;
              }

              // Clear localStorage after successful migration
              localStorage.removeItem(collectionName);
              console.log(
                `✅ ${collectionName} migrado e limpo do localStorage`,
              );
            }
          } catch (parseError) {
            console.warn(`⚠️ Erro ao migrar ${collectionName}:`, parseError);
          }
        }
      }

      console.log(
        `✅ Migração concluída: ${migrated} itens movidos para Firestore via REST API`,
      );
      return { success: true, migrated };
    } catch (error: any) {
      console.error("❌ Erro na migração:", error);
      return { success: false, migrated };
    }
  }

  // ==================== STATUS ====================
  async getStatus(): Promise<{
    firestoreReady: boolean;
    collections: { [key: string]: number };
    lastCheck: string;
  }> {
    try {
      const isReady = await this.initialize();
      const collections: { [key: string]: number } = {};

      if (isReady) {
        const collectionNames = [
          "users",
          "piscinas",
          "obras",
          "manutencoes",
          "clientes",
        ];

        for (const name of collectionNames) {
          try {
            const data = await readFromFirestoreRest(name);
            collections[name] = data.length;
          } catch {
            collections[name] = 0;
          }
        }
      }

      return {
        firestoreReady: isReady,
        collections,
        lastCheck: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("❌ Erro ao verificar status:", error);
      return {
        firestoreReady: false,
        collections: {},
        lastCheck: new Date().toISOString(),
      };
    }
  }
}

export const forceFirestoreService = new ForceFirestoreService();
export default forceFirestoreService;
