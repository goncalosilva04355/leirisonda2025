// Serviço de sincronização híbrida: Firebase ↔ localStorage
import { FirestoreService } from "./firestoreService";

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string;
  pendingSync: number;
  firebaseAvailable: boolean;
}

class HybridDataSyncService {
  private firestoreService = new FirestoreService();
  private syncInterval: NodeJS.Timeout | null = null;
  private pendingOperations: Array<{
    collection: string;
    operation: "create" | "update" | "delete";
    data: any;
    localId: string;
  }> = [];

  constructor() {
    this.startAutoSync();
    this.setupOnlineListener();
  }

  // Sincronização reduzida para evitar refresh constante
  private startAutoSync(): void {
    this.syncInterval = setInterval(() => {
      this.performBackgroundSync();
    }, 300000); // 5 minutos em vez de 30 segundos
  }

  // Monitorar conexão à internet
  private setupOnlineListener(): void {
    window.addEventListener("online", () => {
      console.log("🌐 Conexão restaurada - iniciando sincronização");
      this.performBackgroundSync();
    });

    window.addEventListener("offline", () => {
      console.log("📴 Modo offline - dados salvos localmente");
    });
  }

  // Sincronização principal
  async performBackgroundSync(): Promise<void> {
    try {
      if (!navigator.onLine) {
        console.log("📴 Offline - saltando sincronização");
        return;
      }

      console.log("🔄 Iniciando sincronização automática...");

      // Sincronizar each tipo de dados
      await Promise.all([
        this.syncCollection("obras", "works"),
        this.syncCollection("manutencoes", "maintenances"),
        this.syncCollection("piscinas", "pools"),
        this.syncCollection("clientes", "clients"),
        this.syncCollection("utilizadores", "app-users"),
      ]);

      // Processar operações pendentes
      await this.processPendingOperations();

      console.log("✅ Sincronização automática concluída");
      localStorage.setItem("lastSyncTime", new Date().toISOString());
    } catch (error) {
      console.warn("⚠️ Erro na sincronização automática:", error);
    }
  }

  // Sincronizar uma coleção específica
  private async syncCollection(
    firestoreCollection: string,
    localStorageKey: string,
  ): Promise<void> {
    try {
      // 1. Buscar dados do Firebase
      let firebaseData: any[] = [];
      try {
        if (firestoreCollection === "obras") {
          firebaseData = await this.firestoreService.getObras();
        } else if (firestoreCollection === "manutencoes") {
          firebaseData = await this.firestoreService.getMaintenances();
        } else if (firestoreCollection === "piscinas") {
          firebaseData = await this.firestoreService.getPools();
        } else if (firestoreCollection === "clientes") {
          firebaseData = await this.firestoreService.getClients();
        } else if (firestoreCollection === "utilizadores") {
          firebaseData = await this.firestoreService.getUsers();
        }
      } catch (firebaseError) {
        console.log(`ℹ️ Firebase indisponível para ${firestoreCollection}`);
        return;
      }

      // 2. Buscar dados locais
      const localData = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]",
      );

      // 3. Merge inteligente
      const mergedData = this.mergeData(localData, firebaseData);

      // 4. Salvar localmente
      localStorage.setItem(localStorageKey, JSON.stringify(mergedData));

      // 5. Sincronizar novos dados locais para Firebase
      await this.syncLocalToFirebase(
        localData,
        firebaseData,
        firestoreCollection,
      );
    } catch (error) {
      console.warn(`⚠️ Erro ao sincronizar ${firestoreCollection}:`, error);
    }
  }

  // Merge inteligente de dados locais e Firebase
  private mergeData(localData: any[], firebaseData: any[]): any[] {
    const merged = [...firebaseData];

    // Adicionar items que existem apenas localmente
    localData.forEach((localItem) => {
      const existsInFirebase = firebaseData.some(
        (firebaseItem) =>
          firebaseItem.id === localItem.id ||
          firebaseItem.localId === localItem.id,
      );

      if (!existsInFirebase) {
        // Item novo local - adicionar à lista para sincronizar
        this.addToPendingOperations("create", "obras", localItem);
        merged.push({ ...localItem, needsSync: true });
      }
    });

    // Priorizar dados mais recentes baseado em updatedAt
    return merged.map((item) => {
      const localVersion = localData.find(
        (local) => local.id === item.id || local.id === item.localId,
      );

      if (localVersion && localVersion.updatedAt && item.updatedAt) {
        const localTime = new Date(localVersion.updatedAt).getTime();
        const firebaseTime = new Date(item.updatedAt).getTime();

        // Se versão local é mais recente, usar dados locais
        if (localTime > firebaseTime) {
          this.addToPendingOperations("update", "obras", localVersion);
          return { ...localVersion, firebaseId: item.id };
        }
      }

      return item;
    });
  }

  // Sincronizar dados locais para Firebase
  private async syncLocalToFirebase(
    localData: any[],
    firebaseData: any[],
    collection: string,
  ): Promise<void> {
    // Encontrar items que precisam ser enviados para Firebase
    const itemsToSync = localData.filter((localItem) => {
      // Item não existe no Firebase
      const existsInFirebase = firebaseData.some(
        (firebaseItem) =>
          firebaseItem.id === localItem.id ||
          firebaseItem.localId === localItem.id,
      );

      return !existsInFirebase || localItem.needsSync;
    });

    // Enviar para Firebase
    for (const item of itemsToSync) {
      try {
        if (collection === "obras") {
          await this.firestoreService.addObra(item);
        } else if (collection === "manutencoes") {
          await this.firestoreService.addMaintenance(item);
        } else if (collection === "piscinas") {
          await this.firestoreService.addPool(item);
        } else if (collection === "clientes") {
          await this.firestoreService.addClient(item);
        }

        console.log(`✅ Item sincronizado para Firebase: ${collection}`);
      } catch (error) {
        console.warn(`⚠️ Falha ao sincronizar item para Firebase:`, error);
        // Manter na lista de pendentes
        this.addToPendingOperations("create", collection, item);
      }
    }
  }

  // Adicionar operação à lista de pendentes
  private addToPendingOperations(
    operation: "create" | "update" | "delete",
    collection: string,
    data: any,
  ): void {
    this.pendingOperations.push({
      collection,
      operation,
      data,
      localId: data.id || `temp-${Date.now()}`,
    });

    // Limitar operações pendentes a 100
    if (this.pendingOperations.length > 100) {
      this.pendingOperations = this.pendingOperations.slice(-100);
    }
  }

  // Processar operações pendentes
  private async processPendingOperations(): Promise<void> {
    if (this.pendingOperations.length === 0) return;

    console.log(
      `🔄 Processando ${this.pendingOperations.length} operações pendentes...`,
    );

    const operationsToProcess = [...this.pendingOperations];
    this.pendingOperations = [];

    for (const operation of operationsToProcess) {
      try {
        await this.executeFirebaseOperation(operation);
        console.log(`✅ Operação pendente processada: ${operation.operation}`);
      } catch (error) {
        console.warn(`⚠️ Falha na operação pendente:`, error);
        // Re-adicionar à lista se falhar
        this.pendingOperations.push(operation);
      }
    }
  }

  // Executar operação no Firebase
  private async executeFirebaseOperation(operation: any): Promise<void> {
    const { collection, operation: op, data } = operation;

    if (collection === "obras") {
      if (op === "create") {
        await this.firestoreService.addObra(data);
      } else if (op === "update") {
        await this.firestoreService.updateObra(data.id, data);
      } else if (op === "delete") {
        await this.firestoreService.deleteObra(data.id);
      }
    }
    // Adicionar outros tipos conforme necessário
  }

  // API pública para adicionar dados
  async addObra(obra: any): Promise<any> {
    // Adicionar timestamp
    const obraWithTimestamp = {
      ...obra,
      id:
        obra.id ||
        `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: obra.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salvar localmente imediatamente
    const localObras = JSON.parse(localStorage.getItem("works") || "[]");
    localObras.push(obraWithTimestamp);
    localStorage.setItem("works", JSON.stringify(localObras));

    // Tentar sincronizar com Firebase
    try {
      if (navigator.onLine) {
        const firebaseObra =
          await this.firestoreService.addObra(obraWithTimestamp);
        console.log("✅ Obra salva no Firebase e local");
        return firebaseObra;
      } else {
        this.addToPendingOperations("create", "obras", obraWithTimestamp);
        console.log("📴 Obra salva localmente - sincronizará quando online");
      }
    } catch (error) {
      console.warn("⚠️ Erro Firebase, dados salvos localmente:", error);
      this.addToPendingOperations("create", "obras", obraWithTimestamp);
    }

    return obraWithTimestamp;
  }

  // Métodos similares para outros tipos de dados
  async addMaintenance(maintenance: any): Promise<any> {
    const maintenanceWithTimestamp = {
      ...maintenance,
      id:
        maintenance.id ||
        `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: maintenance.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salvar localmente
    const localMaintenances = JSON.parse(
      localStorage.getItem("maintenances") || "[]",
    );
    localMaintenances.push(maintenanceWithTimestamp);
    localStorage.setItem("maintenances", JSON.stringify(localMaintenances));

    // Tentar Firebase
    try {
      if (navigator.onLine) {
        const firebaseMaintenance = await this.firestoreService.addMaintenance(
          maintenanceWithTimestamp,
        );
        console.log("✅ Manutenção salva no Firebase e local");
        return firebaseMaintenance;
      } else {
        this.addToPendingOperations(
          "create",
          "manutencoes",
          maintenanceWithTimestamp,
        );
        console.log("📴 Manutenção salva localmente");
      }
    } catch (error) {
      console.warn("⚠️ Erro Firebase para manutenção:", error);
      this.addToPendingOperations(
        "create",
        "manutencoes",
        maintenanceWithTimestamp,
      );
    }

    return maintenanceWithTimestamp;
  }

  // Obter status de sincronização
  getSyncStatus(): SyncStatus {
    return {
      isOnline: navigator.onLine,
      lastSync: localStorage.getItem("lastSyncTime") || "Nunca",
      pendingSync: this.pendingOperations.length,
      firebaseAvailable: this.firestoreService !== null,
    };
  }

  // Forçar sincronização manual
  async forceSyncNow(): Promise<void> {
    console.log("🚀 Sincronização manual iniciada...");
    await this.performBackgroundSync();
  }

  // Destruir serviço
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

export const hybridDataSync = new HybridDataSyncService();
export default hybridDataSync;
