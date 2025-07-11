// Serviço centralizado do Firestore para todas as entidades
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { getDB as getFirebaseFirestore } from "../firebase";

export interface FirestoreEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export class FirestoreService {
  private db: any = null;
  private initialized = false;

  // Inicialização lazy
  private ensureInitialized() {
    if (!this.initialized) {
      this.db = getFirebaseFirestore();
      this.initialized = true;
    }
  }

  // Verificar se Firestore está disponível
  private isAvailable(): boolean {
    return this.db !== null;
  }

  // Triggerar sincronização automática após operações
  private async triggerAutoSync(
    collectionName: string,
    operation: "create" | "update" | "delete",
    data?: any,
  ): Promise<void> {
    try {
      const { autoSyncService } = await import("./autoSyncService");
      await autoSyncService.forceSyncAfterOperation(
        collectionName,
        operation,
        data,
      );
    } catch (error) {
      console.warn(
        `⚠️ Erro na sincronização automática de ${collectionName}:`,
        error,
      );
    }
  }

  // CRUD genérico para qualquer coleção
  async create<T extends FirestoreEntity>(
    collectionName: string,
    data: T,
  ): Promise<string | null> {
    if (!this.isAvailable()) {
      console.warn(`Firestore não disponível para criar ${collectionName}`);
      return null;
    }

    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(this.db!, collectionName), {
        ...data,
        createdAt: now,
        updatedAt: now,
      });

      console.log(`✅ ${collectionName} criado no Firestore:`, docRef.id);

      // Sincronização automática imediata
      this.triggerAutoSync(collectionName, "create", data);

      return docRef.id;
    } catch (error) {
      console.error(`❌ Erro ao criar ${collectionName}:`, error);
      return null;
    }
  }

  async read<T extends FirestoreEntity>(collectionName: string): Promise<T[]> {
    if (!this.isAvailable()) {
      console.warn(`Firestore não disponível para ler ${collectionName}`);
      return [];
    }

    try {
      const querySnapshot = await getDocs(collection(this.db!, collectionName));
      const items: T[] = [];

      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        } as T);
      });

      console.log(`📖 ${collectionName} lidos do Firestore:`, items.length);
      return items;
    } catch (error) {
      console.error(`❌ Erro ao ler ${collectionName}:`, error);
      return [];
    }
  }

  async readOne<T extends FirestoreEntity>(
    collectionName: string,
    id: string,
  ): Promise<T | null> {
    if (!this.isAvailable()) return null;

    try {
      const docRef = doc(this.db!, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as T;
      }
      return null;
    } catch (error) {
      console.error(`❌ Erro ao ler ${collectionName}/${id}:`, error);
      return null;
    }
  }

  async update<T extends FirestoreEntity>(
    collectionName: string,
    id: string,
    data: Partial<T>,
  ): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const docRef = doc(this.db!, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ ${collectionName}/${id} atualizado no Firestore`);

      // Sincronização automática imediata
      this.triggerAutoSync(collectionName, "update", data);

      return true;
    } catch (error) {
      console.error(`❌ Erro ao atualizar ${collectionName}/${id}:`, error);
      return false;
    }
  }

  async delete(collectionName: string, id: string): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      await deleteDoc(doc(this.db!, collectionName, id));
      console.log(`✅ ${collectionName}/${id} eliminado do Firestore`);

      // Sincronização automática imediata
      this.triggerAutoSync(collectionName, "delete", { id });

      return true;
    } catch (error) {
      console.error(`❌ Erro ao eliminar ${collectionName}/${id}:`, error);
      return false;
    }
  }

  // Sync bidireccional com localStorage
  async syncWithLocalStorage<T extends FirestoreEntity>(
    collectionName: string,
    localStorageKey: string,
  ): Promise<T[]> {
    if (!this.isAvailable()) {
      // Fallback para localStorage
      const localData = localStorage.getItem(localStorageKey);
      return localData ? JSON.parse(localData) : [];
    }

    try {
      // 1. Ler dados do Firestore
      const firestoreData = await this.read<T>(collectionName);

      // 2. Ler dados locais
      const localDataStr = localStorage.getItem(localStorageKey);
      const localData: T[] = localDataStr ? JSON.parse(localDataStr) : [];

      // 3. Sincronizar dados locais para Firestore (se houver)
      for (const localItem of localData) {
        if (!localItem.id) {
          // Item local sem ID - criar no Firestore
          const newId = await this.create(collectionName, localItem);
          if (newId) {
            localItem.id = newId;
          }
        }
      }

      // 4. Atualizar localStorage com dados do Firestore
      localStorage.setItem(localStorageKey, JSON.stringify(firestoreData));

      console.log(
        `🔄 ${collectionName} sincronizado: ${firestoreData.length} itens`,
      );
      return firestoreData;
    } catch (error) {
      console.error(`❌ Erro na sincronização de ${collectionName}:`, error);
      // Fallback para dados locais
      const localData = localStorage.getItem(localStorageKey);
      return localData ? JSON.parse(localData) : [];
    }
  }

  // Métodos específicos para cada entidade

  // OBRAS
  async createObra(obra: any): Promise<string | null> {
    return this.create("obras", obra);
  }

  async getObras(): Promise<any[]> {
    return this.syncWithLocalStorage("obras", "works");
  }

  async updateObra(id: string, obra: any): Promise<boolean> {
    const success = await this.update("obras", id, obra);
    if (success) {
      // Atualizar localStorage também
      const obras = await this.getObras();
      localStorage.setItem("works", JSON.stringify(obras));
    }
    return success;
  }

  async deleteObra(id: string): Promise<boolean> {
    const success = await this.delete("obras", id);
    if (success) {
      const obras = await this.getObras();
      localStorage.setItem("works", JSON.stringify(obras));
    }
    return success;
  }

  // PISCINAS
  async createPiscina(piscina: any): Promise<string | null> {
    return this.create("piscinas", piscina);
  }

  async getPiscinas(): Promise<any[]> {
    return this.syncWithLocalStorage("piscinas", "pools");
  }

  async updatePiscina(id: string, piscina: any): Promise<boolean> {
    const success = await this.update("piscinas", id, piscina);
    if (success) {
      const piscinas = await this.getPiscinas();
      localStorage.setItem("pools", JSON.stringify(piscinas));
    }
    return success;
  }

  async deletePiscina(id: string): Promise<boolean> {
    const success = await this.delete("piscinas", id);
    if (success) {
      const piscinas = await this.getPiscinas();
      localStorage.setItem("pools", JSON.stringify(piscinas));
    }
    return success;
  }

  // MANUTENÇÕES
  async createManutencao(manutencao: any): Promise<string | null> {
    return this.create("manutencoes", manutencao);
  }

  async getManutencoes(): Promise<any[]> {
    return this.syncWithLocalStorage("manutencoes", "maintenance");
  }

  async updateManutencao(id: string, manutencao: any): Promise<boolean> {
    const success = await this.update("manutencoes", id, manutencao);
    if (success) {
      const manutencoes = await this.getManutencoes();
      localStorage.setItem("maintenance", JSON.stringify(manutencoes));
    }
    return success;
  }

  async deleteManutencao(id: string): Promise<boolean> {
    const success = await this.delete("manutencoes", id);
    if (success) {
      const manutencoes = await this.getManutencoes();
      localStorage.setItem("maintenance", JSON.stringify(manutencoes));
    }
    return success;
  }

  // UTILIZADORES
  async createUtilizador(utilizador: any): Promise<string | null> {
    return this.create("utilizadores", utilizador);
  }

  async getUtilizadores(): Promise<any[]> {
    return this.syncWithLocalStorage("utilizadores", "app-users");
  }

  async updateUtilizador(id: string, utilizador: any): Promise<boolean> {
    const success = await this.update("utilizadores", id, utilizador);
    if (success) {
      const utilizadores = await this.getUtilizadores();
      localStorage.setItem("app-users", JSON.stringify(utilizadores));
    }
    return success;
  }

  async deleteUtilizador(id: string): Promise<boolean> {
    const success = await this.delete("utilizadores", id);
    if (success) {
      const utilizadores = await this.getUtilizadores();
      localStorage.setItem("app-users", JSON.stringify(utilizadores));
    }
    return success;
  }

  // CLIENTES
  async createCliente(cliente: any): Promise<string | null> {
    return this.create("clientes", cliente);
  }

  async getClientes(): Promise<any[]> {
    return this.syncWithLocalStorage("clientes", "clients");
  }

  async updateCliente(id: string, cliente: any): Promise<boolean> {
    const success = await this.update("clientes", id, cliente);
    if (success) {
      const clientes = await this.getClientes();
      localStorage.setItem("clients", JSON.stringify(clientes));
    }
    return success;
  }

  async deleteCliente(id: string): Promise<boolean> {
    const success = await this.delete("clientes", id);
    if (success) {
      const clientes = await this.getClientes();
      localStorage.setItem("clients", JSON.stringify(clientes));
    }
    return success;
  }

  // LOCALIZAÇÕES
  async createLocalizacao(localizacao: any): Promise<string | null> {
    return this.create("localizacoes", localizacao);
  }

  async getLocalizacoes(): Promise<any[]> {
    return this.syncWithLocalStorage("localizacoes", "locations");
  }

  async updateLocalizacao(id: string, localizacao: any): Promise<boolean> {
    const success = await this.update("localizacoes", id, localizacao);
    if (success) {
      const localizacoes = await this.getLocalizacoes();
      localStorage.setItem("locations", JSON.stringify(localizacoes));
    }
    return success;
  }

  async deleteLocalizacao(id: string): Promise<boolean> {
    const success = await this.delete("localizacoes", id);
    if (success) {
      const localizacoes = await this.getLocalizacoes();
      localStorage.setItem("locations", JSON.stringify(localizacoes));
    }
    return success;
  }

  // NOTIFICAÇÕES
  async createNotificacao(notificacao: any): Promise<string | null> {
    return this.create("notificacoes", notificacao);
  }

  async createNotification(notification: any): Promise<string | null> {
    const notificationData = {
      ...notification,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docId = await this.create("notificacoes", notificationData);
    if (docId) {
      // Atualizar localStorage
      const notificacoes = await this.getNotificacoes();
      localStorage.setItem("notifications", JSON.stringify(notificacoes));
    }
    return docId;
  }

  async getNotificacoes(): Promise<any[]> {
    return this.syncWithLocalStorage("notificacoes", "notifications");
  }

  async updateNotificacao(id: string, notificacao: any): Promise<boolean> {
    const success = await this.update("notificacoes", id, notificacao);
    if (success) {
      const notificacoes = await this.getNotificacoes();
      localStorage.setItem("notifications", JSON.stringify(notificacoes));
    }
    return success;
  }

  async deleteNotificacao(id: string): Promise<boolean> {
    const success = await this.delete("notificacoes", id);
    if (success) {
      const notificacoes = await this.getNotificacoes();
      localStorage.setItem("notifications", JSON.stringify(notificacoes));
    }
    return success;
  }

  // Sincronização completa de tudo
  async syncAll(): Promise<void> {
    console.log("🔄 Iniciando sincronização completa com Firestore...");

    try {
      await Promise.all([
        this.getObras(),
        this.getPiscinas(),
        this.getManutencoes(),
        this.getUtilizadores(),
        this.getClientes(),
        this.getLocalizacoes(),
        this.getNotificacoes(),
      ]);

      console.log("✅ Sincronização completa concluída!");
    } catch (error) {
      console.error("❌ Erro na sincronização completa:", error);
    }
  }
}

// Instância singleton
export const firestoreService = new FirestoreService();
