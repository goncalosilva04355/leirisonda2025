import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseReady } from "../firebase/config";

export interface SharedDataState {
  pools: any[];
  works: any[];
  maintenance: any[];
  clients: any[];
  lastSync: string;
  sharedGlobally: true;
}

/**
 * Serviço para garantir partilha de dados SEMPRE ativa entre todos os utilizadores
 * NUNCA usa localStorage - apenas dados partilhados globalmente no Firebase
 */
class GlobalDataShareService {
  private listeners: Unsubscribe[] = [];
  private isInitialized = false;

  /**
   * Inicializa o serviço de partilha global
   * Garante que TODOS os dados são sempre partilhados entre utilizadores
   */
  async initialize(): Promise<boolean> {
    if (!isFirebaseReady() || !db) {
      console.error("��� Firebase não disponível - partilha global impossível");
      return false;
    }

    console.log("🌐 INICIANDO PARTILHA GLOBAL DE DADOS");
    console.log("✅ LOCALSTORAGE NUNCA SERÁ USADO");
    console.log("✅ TODOS OS DADOS SEMPRE PARTILHADOS ENTRE UTILIZADORES");

    this.isInitialized = true;
    return true;
  }

  /**
   * Migra TODOS os dados para estrutura global partilhada
   * Remove qualquer dependência de localStorage
   */
  async migrateAllDataToGlobalSharing(): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    console.log("🔄 MIGRANDO TODOS OS DADOS PARA PARTILHA GLOBAL...");

    // Verificar se há dados locais (apenas para migração uma vez)
    const localPools = this.getLocalDataOnce("pools");
    const localWorks = this.getLocalDataOnce("works");
    const localMaintenance = this.getLocalDataOnce("maintenance");
    const localClients = this.getLocalDataOnce("clients");

    const totalLocal =
      localPools.length +
      localWorks.length +
      localMaintenance.length +
      localClients.length;

    if (totalLocal > 0) {
      console.log(`📱 Encontrados ${totalLocal} registros locais para migrar`);

      // Migrar pools para partilha global
      for (const pool of localPools) {
        await this.saveToGlobalCollection("shared_pools", pool);
      }

      // Migrar works para partilha global
      for (const work of localWorks) {
        await this.saveToGlobalCollection("shared_works", work);
      }

      // Migrar maintenance para partilha global
      for (const maintenance of localMaintenance) {
        await this.saveToGlobalCollection("shared_maintenance", maintenance);
      }

      // Migrar clients para partilha global
      for (const client of localClients) {
        await this.saveToGlobalCollection("shared_clients", client);
      }

      console.log(
        "✅ MIGRAÇÃO CONCLUÍDA - Dados agora partilhados globalmente",
      );

      // LIMPAR localStorage após migração
      this.clearAllLocalStorage();
    }

    console.log("🌐 TODOS OS DADOS AGORA SÃO PARTILHADOS ENTRE UTILIZADORES");
  }

  /**
   * Obter dados locais apenas UMA VEZ para migração
   * Após isto, nunca mais usar localStorage
   */
  private getLocalDataOnce(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Guardar dados na coleção global partilhada
   */
  private async saveToGlobalCollection(
    collection: string,
    data: any,
  ): Promise<void> {
    if (!db) return;

    const id = data.id || `${collection}-${Date.now()}-${Math.random()}`;
    await setDoc(doc(db, collection, id), {
      ...data,
      id,
      sharedGlobally: true,
      visibleToAllUsers: true,
      lastSync: new Date().toISOString(),
    });
  }

  /**
   * Configurar listeners para dados globais partilhados
   * TODOS os utilizadores veem os mesmos dados em tempo real
   */
  setupGlobalListeners(callbacks: {
    onPoolsChange: (pools: any[]) => void;
    onWorksChange: (works: any[]) => void;
    onMaintenanceChange: (maintenance: any[]) => void;
    onClientsChange: (clients: any[]) => void;
  }): () => void {
    if (!isFirebaseReady() || !db) {
      console.error("❌ Firebase não disponível para listeners globais");
      return () => {};
    }

    console.log("📡 CONFIGURANDO LISTENERS GLOBAIS");
    console.log("🌐 TODOS OS UTILIZADORES VERÃO OS MESMOS DADOS");

    // Listener para pools partilhados
    const poolsListener = onSnapshot(
      query(collection(db, "shared_pools"), orderBy("lastSync", "desc")),
      (snapshot) => {
        const pools = snapshot.docs.map((doc) => doc.data());
        console.log(`🏊 POOLS GLOBAIS: ${pools.length} disponíveis para todos`);
        callbacks.onPoolsChange(pools);
      },
      (error) => {
        console.error("❌ Erro no listener de pools globais:", error);
      },
    );

    // Listener para works partilhados
    const worksListener = onSnapshot(
      query(collection(db, "shared_works"), orderBy("lastSync", "desc")),
      (snapshot) => {
        const works = snapshot.docs.map((doc) => doc.data());
        console.log(`⚒️ WORKS GLOBAIS: ${works.length} disponíveis para todos`);
        callbacks.onWorksChange(works);
      },
      (error) => {
        console.error("❌ Erro no listener de works globais:", error);
      },
    );

    // Listener para maintenance partilhado
    const maintenanceListener = onSnapshot(
      query(collection(db, "shared_maintenance"), orderBy("lastSync", "desc")),
      (snapshot) => {
        const maintenance = snapshot.docs.map((doc) => doc.data());
        console.log(
          `🔧 MAINTENANCE GLOBAL: ${maintenance.length} disponível para todos`,
        );
        callbacks.onMaintenanceChange(maintenance);
      },
      (error) => {
        console.error("❌ Erro no listener de maintenance global:", error);
      },
    );

    // Listener para clients partilhados
    const clientsListener = onSnapshot(
      query(collection(db, "shared_clients"), orderBy("lastSync", "desc")),
      (snapshot) => {
        const clients = snapshot.docs.map((doc) => doc.data());
        console.log(
          `👥 CLIENTS GLOBAIS: ${clients.length} disponíveis para todos`,
        );
        callbacks.onClientsChange(clients);
      },
      (error) => {
        console.error("❌ Erro no listener de clients globais:", error);
      },
    );

    this.listeners = [
      poolsListener,
      worksListener,
      maintenanceListener,
      clientsListener,
    ];

    console.log("✅ LISTENERS GLOBAIS ATIVOS - Partilha em tempo real ativa");

    return () => {
      console.log("🛑 Desconectando listeners globais");
      this.listeners.forEach((unsubscribe) => unsubscribe());
      this.listeners = [];
    };
  }

  /**
   * Adicionar novo item aos dados globais partilhados
   */
  async addToGlobalData(
    type: "pools" | "works" | "maintenance" | "clients",
    data: any,
  ): Promise<string> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    const collection = `shared_${type}`;
    const id = data.id || `${type}-${Date.now()}-${Math.random()}`;

    const globalData = {
      ...data,
      id,
      sharedGlobally: true,
      visibleToAllUsers: true,
      lastSync: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    };

    await setDoc(doc(db, collection, id), globalData);

    console.log(`✅ ${type.toUpperCase()} adicionado aos dados globais: ${id}`);
    return id;
  }

  /**
   * Atualizar item nos dados globais partilhados
   */
  async updateGlobalData(
    type: "pools" | "works" | "maintenance" | "clients",
    id: string,
    data: any,
  ): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    const collection = `shared_${type}`;
    await updateDoc(doc(db, collection, id), {
      ...data,
      lastSync: new Date().toISOString(),
      sharedGlobally: true,
      visibleToAllUsers: true,
    });

    console.log(`✅ ${type.toUpperCase()} atualizado nos dados globais: ${id}`);
  }

  /**
   * Remover item dos dados globais partilhados
   */
  async deleteFromGlobalData(
    type: "pools" | "works" | "maintenance" | "clients",
    id: string,
  ): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    const collection = `shared_${type}`;
    await deleteDoc(doc(db, collection, id));

    console.log(`✅ ${type.toUpperCase()} removido dos dados globais: ${id}`);
  }

  /**
   * Obter todos os dados globais
   */
  async getAllGlobalData(): Promise<SharedDataState> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    const [poolsSnap, worksSnap, maintenanceSnap, clientsSnap] =
      await Promise.all([
        getDocs(
          query(collection(db, "shared_pools"), orderBy("lastSync", "desc")),
        ),
        getDocs(
          query(collection(db, "shared_works"), orderBy("lastSync", "desc")),
        ),
        getDocs(
          query(
            collection(db, "shared_maintenance"),
            orderBy("lastSync", "desc"),
          ),
        ),
        getDocs(
          query(collection(db, "shared_clients"), orderBy("lastSync", "desc")),
        ),
      ]);

    const data: SharedDataState = {
      pools: poolsSnap.docs.map((doc) => doc.data()),
      works: worksSnap.docs.map((doc) => doc.data()),
      maintenance: maintenanceSnap.docs.map((doc) => doc.data()),
      clients: clientsSnap.docs.map((doc) => doc.data()),
      lastSync: new Date().toISOString(),
      sharedGlobally: true,
    };

    console.log("📊 DADOS GLOBAIS OBTIDOS:", {
      pools: data.pools.length,
      works: data.works.length,
      maintenance: data.maintenance.length,
      clients: data.clients.length,
    });

    return data;
  }

  /**
   * LIMPAR TODO o localStorage (nunca mais usar)
   */
  private clearAllLocalStorage(): void {
    console.log("🧹 REMOVENDO DEPENDÊNCIA DE LOCALSTORAGE");

    const keysToRemove = [
      "pools",
      "works",
      "maintenance",
      "clients",
      "lastSync",
      "user",
      "auth",
      "firebase",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log("✅ LOCALSTORAGE LIMPO - Apenas dados partilhados globalmente");
  }

  /**
   * Verificar se o serviço está pronto
   */
  isReady(): boolean {
    return this.isInitialized && isFirebaseReady();
  }

  /**
   * Cleanup dos listeners
   */
  cleanup(): void {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners = [];
    this.isInitialized = false;
  }
}

export const globalDataShare = new GlobalDataShareService();
export default globalDataShare;
