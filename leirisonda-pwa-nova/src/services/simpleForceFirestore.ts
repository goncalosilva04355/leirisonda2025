import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import {
  initializeSimpleFirestore,
  getSimpleFirestore,
  ensureSimpleFirestore,
} from "../utils/simpleFirestoreFix";

/**
 * Serviço SIMPLIFICADO que força dados para Firestore
 * Versão mais robusta e sem complexidade desnecessária
 */
class SimpleForceFirestoreService {
  private db: any = null;

  private async ensureDB(): Promise<any> {
    if (this.db) {
      return this.db;
    }

    console.log("🔄 SimpleForce: Garantindo Firestore...");

    try {
      this.db = await ensureSimpleFirestore(3);
      console.log("✅ SimpleForce: Firestore obtido");
      return this.db;
    } catch (error: any) {
      console.error("❌ SimpleForce: Erro ao obter Firestore:", error.message);
      throw new Error(`Firestore não disponível: ${error.message}`);
    }
  }

  // ==================== USERS ====================
  async saveUser(user: any): Promise<boolean> {
    console.log("👤 SimpleForce: Guardando utilizador:", user?.email || "N/A");

    try {
      if (!user || !user.email) {
        console.warn("⚠️ Dados de utilizador inválidos");
        return false;
      }

      const db = await this.ensureDB();
      const userId = user.uid || user.id || `user-${Date.now()}`;

      await setDoc(doc(db, "users", userId), {
        ...user,
        uid: userId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      });

      console.log("✅ Utilizador guardado:", user.email);
      return true;
    } catch (error: any) {
      console.error("❌ Erro ao guardar utilizador:", error.message);
      return false; // Não quebrar o fluxo
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const snapshot = await getDocs(collection(db, "users"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ Erro ao obter utilizadores:", error.message);
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

      console.log("✅ Piscina guardada:", poolId);
      return poolId;
    } catch (error: any) {
      console.error("❌ Erro ao guardar piscina:", error.message);
      throw error;
    }
  }

  async getPools(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const snapshot = await getDocs(collection(db, "pools"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ Erro ao obter piscinas:", error.message);
      return [];
    }
  }

  async deletePool(poolId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      await deleteDoc(doc(db, "pools", poolId));
      console.log("✅ Piscina eliminada:", poolId);
      return true;
    } catch (error: any) {
      console.error("❌ Erro ao eliminar piscina:", error.message);
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

      console.log("✅ Obra guardada:", workId);
      return workId;
    } catch (error: any) {
      console.error("❌ Erro ao guardar obra:", error.message);
      throw error;
    }
  }

  async getWorks(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const snapshot = await getDocs(collection(db, "works"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ Erro ao obter obras:", error.message);
      return [];
    }
  }

  async deleteWork(workId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      await deleteDoc(doc(db, "works", workId));
      console.log("✅ Obra eliminada:", workId);
      return true;
    } catch (error: any) {
      console.error("❌ Erro ao eliminar obra:", error.message);
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

      console.log("✅ Manutenção guardada:", maintenanceId);
      return maintenanceId;
    } catch (error: any) {
      console.error("❌ Erro ao guardar manutenção:", error.message);
      throw error;
    }
  }

  async getMaintenance(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const snapshot = await getDocs(collection(db, "maintenance"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ Erro ao obter manutenções:", error.message);
      return [];
    }
  }

  async deleteMaintenance(maintenanceId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      await deleteDoc(doc(db, "maintenance", maintenanceId));
      console.log("✅ Manutenção eliminada:", maintenanceId);
      return true;
    } catch (error: any) {
      console.error("❌ Erro ao eliminar manutenção:", error.message);
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

      console.log("✅ Cliente guardado:", clientId);
      return clientId;
    } catch (error: any) {
      console.error("❌ Erro ao guardar cliente:", error.message);
      throw error;
    }
  }

  async getClients(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      const snapshot = await getDocs(collection(db, "clients"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ Erro ao obter clientes:", error.message);
      return [];
    }
  }

  async deleteClient(clientId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      await deleteDoc(doc(db, "clients", clientId));
      console.log("✅ Cliente eliminado:", clientId);
      return true;
    } catch (error: any) {
      console.error("❌ Erro ao eliminar cliente:", error.message);
      throw error;
    }
  }

  // ==================== GENERIC ====================
  async saveData(
    collectionName: string,
    data: any,
    id?: string,
  ): Promise<string> {
    try {
      const db = await this.ensureDB();
      const docId =
        id || data.id || `${collectionName}-${Date.now()}-${Math.random()}`;

      await setDoc(doc(db, collectionName, docId), {
        ...data,
        id: docId,
        updatedAt: new Date().toISOString(),
        savedToFirestore: true,
      });

      console.log(`✅ Dados guardados (${collectionName}):`, docId);
      return docId;
    } catch (error: any) {
      console.error(
        `❌ Erro ao guardar dados (${collectionName}):`,
        error.message,
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
        `❌ Erro ao obter dados (${collectionName}):`,
        error.message,
      );
      return [];
    }
  }

  async deleteData(collectionName: string, docId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      await deleteDoc(doc(db, collectionName, docId));
      console.log(`✅ Dados eliminados (${collectionName}):`, docId);
      return true;
    } catch (error: any) {
      console.error(
        `❌ Erro ao eliminar dados (${collectionName}):`,
        error.message,
      );
      throw error;
    }
  }

  // ==================== BATCH ====================
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
      console.log("✅ Batch guardado:", ids.length, "documentos");
      return ids;
    } catch (error: any) {
      console.error("❌ Erro ao guardar batch:", error.message);
      throw error;
    }
  }

  // ==================== STATUS ====================
  async getStatus(): Promise<{
    firestoreReady: boolean;
    collections: { [key: string]: number };
    lastCheck: string;
  }> {
    try {
      const db = await this.ensureDB();
      const collections: { [key: string]: number } = {};
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

      return {
        firestoreReady: true,
        collections,
        lastCheck: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        firestoreReady: false,
        collections: {},
        lastCheck: new Date().toISOString(),
      };
    }
  }

  // ==================== MIGRATION ====================
  async migrateLocalStorageToFirestore(): Promise<{
    success: boolean;
    migrated: number;
  }> {
    console.log("🔄 MIGRAÇÃO: localStorage → Firestore");

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

              localStorage.removeItem(collectionName);
              console.log(`✅ ${collectionName} migrado`);
            }
          } catch (parseError) {
            console.warn(`⚠️ Erro ao migrar ${collectionName}`);
          }
        }
      }

      console.log(`✅ Migração concluída: ${migrated} itens`);
      return { success: true, migrated };
    } catch (error: any) {
      console.error("❌ Erro na migração:", error.message);
      return { success: false, migrated };
    }
  }
}

export const simpleForceFirestoreService = new SimpleForceFirestoreService();
export default simpleForceFirestoreService;
