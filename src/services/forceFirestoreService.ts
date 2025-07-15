import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getFirebaseFirestoreAsync } from "../firebase/firestoreConfig";

/**
 * Serviço que força TODOS os dados a serem guardados no Firestore
 * NUNCA usar localStorage como armazenamento principal
 */
class ForceFirestoreService {
  private db: any = null;

  private async getDB() {
    if (!this.db) {
      try {
        console.log("🔄 ForceFirestore: Inicializando Firestore...");
        this.db = await getFirebaseFirestoreAsync();
        if (this.db) {
          console.log("✅ ForceFirestore: Firestore inicializado com sucesso");
        } else {
          console.warn(
            "⚠️ ForceFirestore: Firestore não está disponível ainda",
          );
        }
      } catch (error: any) {
        console.error(
          "❌ ForceFirestore: Erro ao inicializar Firestore:",
          error.message,
        );
        this.db = null;
      }
    }
    return this.db;
  }

  // Função para garantir que a DB está pronta com retry
  private async ensureDB(retries = 3): Promise<any> {
    console.log(
      `🔄 EnsureDB: Tentando obter Firestore (máx ${retries} tentativas)`,
    );

    for (let i = 0; i < retries; i++) {
      try {
        console.log(`🔍 Tentativa ${i + 1}/${retries} - chamando getDB()...`);
        const db = await this.getDB();

        if (db) {
          console.log(`✅ EnsureDB: Firestore obtido na tentativa ${i + 1}`);
          return db;
        }

        console.warn(
          `⚠️ EnsureDB: Tentativa ${i + 1}/${retries} falhou - Firestore retornou null`,
        );
      } catch (error: any) {
        console.error(
          `❌ EnsureDB: Erro na tentativa ${i + 1}:`,
          error.message,
        );
      }

      if (i < retries - 1) {
        const delay = 1000 * (i + 1);
        console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    const error = new Error(
      `Firestore não está disponível após ${retries} tentativas`,
    );
    console.error("❌ EnsureDB: Falha final:", error.message);
    throw error;
  }

  // ==================== USERS ====================
  async saveUser(user: any): Promise<boolean> {
    console.log(
      "👤 ForceFirestore: Tentando guardar utilizador:",
      user?.email || "email n/d",
    );

    try {
      // Validar dados do utilizador
      if (!user) {
        throw new Error("Utilizador é null ou undefined");
      }

      if (!user.email) {
        console.warn("⚠️ Utilizador sem email:", user);
      }

      console.log("🔄 Obtendo instância do Firestore...");
      const db = await this.ensureDB();
      console.log("✅ Firestore obtido com sucesso");

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

      console.log("📄 Criando referência do documento...");
      const docRef = doc(db, "users", userId);

      console.log("💾 Guardando no Firestore...");
      await setDoc(docRef, userData);

      console.log(
        "✅ Utilizador guardado no Firestore com sucesso:",
        user.email || userId,
      );
      return true;
    } catch (error: any) {
      console.error("❌ Erro detalhado ao guardar utilizador:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
        userEmail: user?.email,
        userId: user?.uid || user?.id,
      });

      // Não fazer throw para não quebrar o fluxo de login
      return false;
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const usersSnapshot = await getDocs(collection(db, "users"));
      return usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ Erro ao obter utilizadores do Firestore:", error);
      return [];
    }
  }

  // ==================== POOLS ====================
  async savePool(pool: any): Promise<string> {
    try {
      const db = await this.ensureDB();
      const poolId = pool.id || `pool-${Date.now()}-${Math.random()}`;

      await setDoc(doc(db, "pools", poolId), {
        ...pool,
        id: poolId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      });

      console.log("✅ Piscina guardada no Firestore:", poolId);
      return poolId;
    } catch (error: any) {
      console.error("❌ Erro ao guardar piscina no Firestore:", error);
      throw error;
    }
  }

  async getPools(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const poolsSnapshot = await getDocs(collection(db, "pools"));
      return poolsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ Erro ao obter piscinas do Firestore:", error);
      return [];
    }
  }

  async deletePool(poolId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      await deleteDoc(doc(db, "pools", poolId));
      console.log("✅ Piscina eliminada do Firestore:", poolId);
      return true;
    } catch (error: any) {
      console.error("❌ Erro ao eliminar piscina do Firestore:", error);
      throw error;
    }
  }

  // ==================== WORKS ====================
  async saveWork(work: any): Promise<string> {
    try {
      const db = await this.ensureDB();
      const workId = work.id || `work-${Date.now()}-${Math.random()}`;

      await setDoc(doc(db, "works", workId), {
        ...work,
        id: workId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      });

      console.log("✅ Obra guardada no Firestore:", workId);
      return workId;
    } catch (error: any) {
      console.error("❌ Erro ao guardar obra no Firestore:", error);
      throw error;
    }
  }

  async getWorks(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const worksSnapshot = await getDocs(collection(db, "works"));
      return worksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ Erro ao obter obras do Firestore:", error);
      return [];
    }
  }

  async deleteWork(workId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      await deleteDoc(doc(db, "works", workId));
      console.log("✅ Obra eliminada do Firestore:", workId);
      return true;
    } catch (error: any) {
      console.error("❌ Erro ao eliminar obra do Firestore:", error);
      throw error;
    }
  }

  // ==================== MAINTENANCE ====================
  async saveMaintenance(maintenance: any): Promise<string> {
    try {
      const db = await this.ensureDB();
      const maintenanceId =
        maintenance.id || `maintenance-${Date.now()}-${Math.random()}`;

      await setDoc(doc(db, "maintenance", maintenanceId), {
        ...maintenance,
        id: maintenanceId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      });

      console.log("✅ Manutenção guardada no Firestore:", maintenanceId);
      return maintenanceId;
    } catch (error: any) {
      console.error("❌ Erro ao guardar manutenção no Firestore:", error);
      throw error;
    }
  }

  async getMaintenance(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const maintenanceSnapshot = await getDocs(collection(db, "maintenance"));
      return maintenanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error: any) {
      console.error("❌ Erro ao obter manutenções do Firestore:", error);
      return [];
    }
  }

  async deleteMaintenance(maintenanceId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      await deleteDoc(doc(db, "maintenance", maintenanceId));
      console.log("✅ Manutenção eliminada do Firestore:", maintenanceId);
      return true;
    } catch (error: any) {
      console.error("❌ Erro ao eliminar manutenção do Firestore:", error);
      throw error;
    }
  }

  // ==================== CLIENTS ====================
  async saveClient(client: any): Promise<string> {
    try {
      const db = await this.ensureDB();
      const clientId = client.id || `client-${Date.now()}-${Math.random()}`;

      await setDoc(doc(db, "clients", clientId), {
        ...client,
        id: clientId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      });

      console.log("✅ Cliente guardado no Firestore:", clientId);
      return clientId;
    } catch (error: any) {
      console.error("❌ Erro ao guardar cliente no Firestore:", error);
      throw error;
    }
  }

  async getClients(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const clientsSnapshot = await getDocs(collection(db, "clients"));
      return clientsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ Erro ao obter clientes do Firestore:", error);
      return [];
    }
  }

  async deleteClient(clientId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      await deleteDoc(doc(db, "clients", clientId));
      console.log("✅ Cliente eliminado do Firestore:", clientId);
      return true;
    } catch (error: any) {
      console.error("❌ Erro ao eliminar cliente do Firestore:", error);
      throw error;
    }
  }

  // ==================== GENERIC DATA OPERATIONS ====================
  async saveData(collection: string, data: any, id?: string): Promise<string> {
    try {
      const db = await this.ensureDB();
      const docId =
        id || data.id || `${collection}-${Date.now()}-${Math.random()}`;

      await setDoc(doc(db, collection, docId), {
        ...data,
        id: docId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      });

      console.log(`✅ Dados guardados no Firestore (${collection}):`, docId);
      return docId;
    } catch (error: any) {
      console.error(
        `❌ Erro ao guardar dados no Firestore (${collection}):`,
        error,
      );
      throw error;
    }
  }

  async getData(collectionName: string): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error(
        `❌ Erro ao obter dados do Firestore (${collectionName}):`,
        error,
      );
      return [];
    }
  }

  async deleteData(collectionName: string, docId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      await deleteDoc(doc(db, collectionName, docId));
      console.log(
        `✅ Dados eliminados do Firestore (${collectionName}):`,
        docId,
      );
      return true;
    } catch (error: any) {
      console.error(
        `❌ Erro ao eliminar dados do Firestore (${collectionName}):`,
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
      const db = await this.ensureDB();
      const batch = writeBatch(db);
      const ids: string[] = [];

      operations.forEach(({ collection, data, id }) => {
        const docId =
          id || data.id || `${collection}-${Date.now()}-${Math.random()}`;
        const docRef = doc(db, collection, docId);

        batch.set(docRef, {
          ...data,
          id: docId,
          updatedAt: new Date().toISOString(),
          savedToFirestore: true,
        });

        ids.push(docId);
      });

      await batch.commit();
      console.log("✅ Batch guardado no Firestore:", ids.length, "documentos");
      return ids;
    } catch (error: any) {
      console.error("❌ Erro ao guardar batch no Firestore:", error);
      throw error;
    }
  }

  // ==================== MIGRATION TOOLS ====================
  async migrateLocalStorageToFirestore(): Promise<{
    success: boolean;
    migrated: number;
  }> {
    console.log("🔄 MIGRAÇÃO: localStorage → Firestore (FORÇADA)");

    let migrated = 0;
    const collections = [
      "pools",
      "works",
      "maintenance",
      "clients",
      "mock-users",
    ];

    try {
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
                collectionName === "mock-users" ? "users" : collectionName;

              for (const item of items) {
                await this.saveData(targetCollection, item);
                migrated++;
              }

              // Limpar localStorage após migração bem-sucedida
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
        `✅ Migração concluída: ${migrated} itens movidos para Firestore`,
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
      const db = await this.getDB();
      const isReady = !!db;

      const collections: { [key: string]: number } = {};

      if (isReady) {
        const collectionNames = [
          "users",
          "pools",
          "works",
          "maintenance",
          "clients",
        ];

        for (const name of collectionNames) {
          try {
            const snapshot = await getDocs(collection(db, name));
            collections[name] = snapshot.size;
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
