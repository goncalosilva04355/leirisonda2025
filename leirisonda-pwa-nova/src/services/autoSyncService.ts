// Sistema de sincronização automática em tempo real
import {
  onSnapshot,
  collection,
  doc,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { getFirebaseFirestore } from "../firebase/firestoreConfig";
import { firestoreService } from "./firestoreService";
import { SystemConfig, isSystemDisabled } from "../config/systemConfig";

export interface SyncObserver {
  collection: string;
  localStorageKey: string;
  callback?: (data: any[]) => void;
  unsubscribe?: Unsubscribe;
}

export class AutoSyncService {
  private observers: Map<string, SyncObserver> = new Map();
  private db = getFirebaseFirestore();
  private isActive = false;
  private firestoreAvailable = false;

  // Check if Firestore is available
  private async checkFirestoreAvailability(): Promise<boolean> {
    try {
      this.db = getFirebaseFirestore();
      if (this.db) {
        this.firestoreAvailable = true;
        console.log("✅ Firestore disponível para sincronização");
        return true;
      } else {
        this.firestoreAvailable = false;
        console.warn(
          "⚠️ Firestore não disponível - usando apenas localStorage",
        );
        return false;
      }
    } catch (error: any) {
      this.firestoreAvailable = false;
      if (
        error.message?.includes("getImmediate") ||
        error.code === "firestore/unavailable" ||
        error.message?.includes("Service firestore is not available")
      ) {
        console.warn("⚠️ Firestore não está habilitado no projeto Firebase");
        console.info("💡 Aplicação funcionará com localStorage apenas");
      } else {
        console.error("❌ Erro ao verificar Firestore:", error.message);
      }
      return false;
    }
  }

  // Inicializar sincronização automática
  async startAutoSync(): Promise<void> {
    console.log("🔄 Iniciando sincronização automática...");

    // Check Firestore availability first
    const firestoreAvailable = await this.checkFirestoreAvailability();

    if (!firestoreAvailable) {
      console.log("📱 Modo localStorage ativo - sincronização limitada");
      this.isActive = true; // Still mark as active for localStorage operations
      return;
    }

    if (this.isActive) return;

    console.log("🔄 Iniciando sincronização em tempo real...");
    this.isActive = true;

    // Configurar observadores para todas as coleções
    await this.setupObservers();

    console.log("✅ Sincronização automática ativa!");
  }

  // Parar sincronizaç��o automática
  stopAutoSync(): void {
    console.log("⏹️ Parando sincronização automática...");

    this.observers.forEach((observer) => {
      if (observer.unsubscribe) {
        observer.unsubscribe();
      }
    });

    this.observers.clear();
    this.isActive = false;

    console.log("✅ Sincronização automática parada");
  }

  // Configurar observadores para todas as coleções
  private async setupObservers(): Promise<void> {
    const collections = [
      { name: "obras", localKey: "works" },
      { name: "piscinas", localKey: "pools" },
      { name: "manutencoes", localKey: "maintenance" },
      { name: "utilizadores", localKey: "app-users" },
      { name: "clientes", localKey: "clients" },
      { name: "localizacoes", localKey: "locations" },
      { name: "notificacoes", localKey: "notifications" },
      { name: "photos", localKey: "photos" },
    ];

    for (const col of collections) {
      await this.createObserver(col.name, col.localKey);
    }
  }

  // Criar observador para uma coleção específica
  private async createObserver(
    collectionName: string,
    localStorageKey: string,
  ): Promise<void> {
    if (!this.db) return;

    try {
      const collectionRef = collection(this.db, collectionName);

      const unsubscribe = onSnapshot(
        collectionRef,
        (snapshot: QuerySnapshot<DocumentData>) => {
          this.handleCollectionChange(
            collectionName,
            localStorageKey,
            snapshot,
          );
        },
        (error) => {
          console.error(`❌ Erro no observador ${collectionName}:`, error);
        },
      );

      const observer: SyncObserver = {
        collection: collectionName,
        localStorageKey,
        unsubscribe,
      };

      this.observers.set(collectionName, observer);
      console.log(`📱 Observador ativo para ${collectionName}`);
    } catch (error) {
      console.error(
        `❌ Erro ao criar observador para ${collectionName}:`,
        error,
      );
    }
  }

  // Processar mudanças na coleção
  private handleCollectionChange(
    collectionName: string,
    localStorageKey: string,
    snapshot: QuerySnapshot<DocumentData>,
  ): void {
    try {
      const data: any[] = [];

      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Atualizar localStorage automaticamente com tratamento de erro
      try {
        const jsonData = JSON.stringify(data);

        // Verificar se os dados não são muito grandes (limite ~5MB)
        const dataSize = new Blob([jsonData]).size;
        if (dataSize > 5000000) {
          // 5MB
          console.warn(
            `⚠️ Dados muito grandes para localStorage (${Math.round(dataSize / 1024 / 1024)}MB), usando cache reduzido`,
          );

          // Tentar salvar apenas os primeiros 100 registros
          const reducedData = data.slice(0, 100);
          localStorage.setItem(localStorageKey, JSON.stringify(reducedData));
          localStorage.setItem(`${localStorageKey}_truncated`, "true");
        } else {
          localStorage.setItem(localStorageKey, jsonData);
          localStorage.removeItem(`${localStorageKey}_truncated`);
        }

        console.log(
          `💾 ${collectionName}: ${data.length} registros salvos no localStorage`,
        );
      } catch (storageError) {
        console.warn(
          `⚠️ Erro ao salvar no localStorage (${collectionName}):`,
          storageError,
        );

        // Tentar limpar espaço e tentar novamente
        try {
          // Limpar caches antigos
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes("_cache_") && key !== localStorageKey) {
              localStorage.removeItem(key);
            }
          }

          // Tentar novamente com dados reduzidos
          const essentialData = data.slice(0, 50).map((item) => ({
            id: item.id,
            nome: item.nome,
            email: item.email,
            // Manter apenas campos essenciais
          }));

          localStorage.setItem(localStorageKey, JSON.stringify(essentialData));
          localStorage.setItem(`${localStorageKey}_reduced`, "true");

          console.log(
            `💾 ${collectionName}: salvos ${essentialData.length} registros essenciais`,
          );
        } catch (finalError) {
          console.error(
            `❌ Falha definitiva ao salvar ${collectionName}:`,
            finalError,
          );
          // Continuar sem localStorage - dados só ficarão em memória
        }
      }

      // Disparar evento customizado para atualizar UI
      window.dispatchEvent(
        new CustomEvent(`${collectionName}Updated`, {
          detail: { data, collection: collectionName },
        }),
      );

      console.log(`🔄 ${collectionName} sincronizado: ${data.length} itens`);
    } catch (error) {
      console.error(
        `❌ Erro ao processar mudança em ${collectionName}:`,
        error,
      );
    }
  }

  // Sincronização manual de uma coleção específica
  async syncCollection(
    collectionName: string,
    localStorageKey: string,
  ): Promise<void> {
    try {
      console.log(`🔄 Sincronizando ${collectionName} manualmente...`);

      if (!this.firestoreAvailable) {
        console.log(
          `📱 Firestore indisponível - usando dados locais para ${collectionName}`,
        );

        // Use local data if Firestore is not available
        const localData = this.getLocalStorageData(localStorageKey);

        // Dispatch event with local data
        window.dispatchEvent(
          new CustomEvent(`${collectionName}Updated`, {
            detail: {
              data: localData,
              collection: collectionName,
              source: "localStorage",
            },
          }),
        );

        console.log(
          `📱 ${collectionName} carregado do localStorage: ${localData.length} itens`,
        );
        return;
      }

      const data = await firestoreService.getCollection(collectionName);
      localStorage.setItem(localStorageKey, JSON.stringify(data));

      // Disparar evento de atualização
      window.dispatchEvent(
        new CustomEvent(`${collectionName}Updated`, {
          detail: { data, collection: collectionName, source: "firestore" },
        }),
      );

      console.log(
        `✅ ${collectionName} sincronizado manualmente: ${data.length} itens`,
      );
    } catch (error: any) {
      // Check if it's a Firestore unavailability error
      if (
        error.message?.includes("getImmediate") ||
        error.code === "firestore/unavailable" ||
        error.message?.includes("Service firestore is not available")
      ) {
        console.warn(
          `⚠️ Firestore não disponível para ${collectionName} - usando dados locais`,
        );

        // Try to get data from localStorage as fallback
        const localData = this.getLocalStorageData(localStorageKey);
        if (localData.length > 0) {
          console.log(
            `📱 ${collectionName} carregado do localStorage: ${localData.length} itens`,
          );

          // Dispatch event with local data
          window.dispatchEvent(
            new CustomEvent(`${collectionName}Updated`, {
              detail: {
                data: localData,
                collection: collectionName,
                source: "localStorage",
              },
            }),
          );
        }
      } else {
        console.error(
          `❌ Erro na sincronização manual de ${collectionName}:`,
          error.message || error,
        );
      }
    }
  }

  // Sincronizar todas as coleções manualmente
  async syncAllCollections(): Promise<void> {
    console.log("��� Sincronização manual completa iniciada...");

    const collections = [
      { name: "obras", localKey: "works" },
      { name: "piscinas", localKey: "pools" },
      { name: "manutencoes", localKey: "maintenance" },
      { name: "utilizadores", localKey: "app-users" },
      { name: "clientes", localKey: "clients" },
      { name: "localizacoes", localKey: "locations" },
      { name: "notificacoes", localKey: "notifications" },
    ];

    await Promise.all(
      collections.map((col) => this.syncCollection(col.name, col.localKey)),
    );

    console.log("✅ Sincronização manual completa concluída!");
  }

  // Verificar se a sincronização está ativa
  isAutoSyncActive(): boolean {
    return this.isActive;
  }

  // Verificar e iniciar auto sync após login (método específico)
  async ensureAutoSyncAfterLogin(): Promise<boolean> {
    try {
      console.log("🔑 Verificando auto sync após login...");

      if (!this.db) {
        console.warn("⚠️ Firebase não disponível para auto sync");
        return false;
      }

      if (this.isActive) {
        console.log("✅ Auto sync já está ativo após login");
        return true;
      }

      console.log("🚀 Iniciando auto sync após login...");
      await this.startAutoSync();

      if (this.isActive) {
        console.log("✅ Auto sync iniciado com sucesso após login!");

        // Forçar uma sincronização completa imediata
        await this.syncAllCollections();
        console.log("🔄 Sincronização completa executada após login");

        return true;
      } else {
        console.warn("⚠️ Falha ao iniciar auto sync após login");
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao garantir auto sync após login:", error);
      return false;
    }
  }

  // Obter status dos observadores
  getObserversStatus(): { [key: string]: boolean } {
    const status: { [key: string]: boolean } = {};

    this.observers.forEach((observer, key) => {
      status[key] = observer.unsubscribe !== undefined;
    });

    return status;
  }

  // Forçar sincronização imediata após operação CRUD
  async forceSyncAfterOperation(
    collectionName: string,
    operation: "create" | "update" | "delete",
    data?: any,
  ): Promise<void> {
    console.log(
      `⚡ Sincronização forçada após ${operation} em ${collectionName}`,
    );

    try {
      // Aguardar um pouco para o Firestore processar
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Sincronizar a coleção específica
      const localStorageKey = this.getLocalStorageKey(collectionName);
      if (localStorageKey) {
        await this.syncCollection(collectionName, localStorageKey);
      }
    } catch (error) {
      console.error(`❌ Erro na sincronização forçada:`, error);
    }
  }

  // Mapear nome da coleção para chave do localStorage
  private getLocalStorageKey(collectionName: string): string | null {
    const mapping: { [key: string]: string } = {
      obras: "works",
      piscinas: "pools",
      manutencoes: "maintenance",
      utilizadores: "app-users",
      clientes: "clients",
      localizacoes: "locations",
      notificacoes: "notifications",
      photos: "photos",
    };

    return mapping[collectionName] || null;
  }

  // Helper method to get data from localStorage
  private getLocalStorageData(localStorageKey: string): any[] {
    try {
      const data = localStorage.getItem(localStorageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn(`⚠️ Erro ao ler ${localStorageKey} do localStorage:`, error);
      return [];
    }
  }
}

// Instância singleton
export const autoSyncService = new AutoSyncService();
