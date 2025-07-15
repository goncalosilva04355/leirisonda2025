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
  writeBatch,
} from "firebase/firestore";
import { db, isFirebaseReady, waitForFirebaseInit } from "../firebase/config";

export interface UniversalDataState {
  obras: any[];
  manutencoes: any[];
  piscinas: any[];
  clientes: any[];
  totalItems: number;
  lastSync: string;
  isGloballyShared: boolean;
}

/**
 * SERVIÇO UNIVERSAL DE SINCRONIZAÇÃO
 * Garante que TODOS os utilizadores vejam TODOS os dados em QUALQUER dispositivo
 *
 * Funcionalidades:
 * - Partilha global automática de obras, manutenções, piscinas e clientes
 * - Sincronização em tempo real entre todos os dispositivos
 * - Migração automática de dados locais para globais
 * - Resistente a falhas de rede
 * - Backup automático de dados
 */
class UniversalDataSyncService {
  private listeners: Unsubscribe[] = [];
  private isInitialized = false;
  private syncInProgress = false;

  /**
   * Inicializar o serviço universal
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    // Clean up any duplicate data first
    this.cleanupDuplicateWorks();

    // Inicializar sincronização universal silenciosa

    try {
      const firebaseReady = await waitForFirebaseInit();
      if (!firebaseReady || !isFirebaseReady()) {
        console.warn("⚠️ Firebase não disponível - modo local apenas");
        // Still return true to allow local operation
        this.isInitialized = true;
        return true;
      }

      // Migrar dados existentes para estrutura universal
      await this.migrateToUniversalSharing();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("❌ Erro na inicialização universal:", error);
      return false;
    }
  }

  /**
   * Migrar todos os dados para partilha universal
   */
  private async migrateToUniversalSharing(): Promise<void> {
    if (this.syncInProgress) {
      console.log("⏳ Migração já em progresso...");
      return;
    }

    this.syncInProgress = true;
    console.log("🔄 MIGRANDO DADOS PARA PARTILHA UNIVERSAL...");

    try {
      // Obter dados locais (apenas uma vez para migração)
      const localData = {
        obras: this.getLocalDataSafe("works") || [],
        manutencoes: this.getLocalDataSafe("maintenance") || [],
        piscinas: this.getLocalDataSafe("pools") || [],
        clientes: this.getLocalDataSafe("clients") || [],
      };

      const totalLocal = Object.values(localData).reduce(
        (total, items) => total + items.length,
        0,
      );

      if (totalLocal > 0) {
        console.log(`📱 Encontrados ${totalLocal} registos locais para migrar`);

        // Verificar dados existentes no Firebase
        const existingData = await this.getAllUniversalData();
        const totalExisting = existingData.totalItems;

        if (totalExisting === 0) {
          console.log(
            "🚀 Primeira migração - transferindo todos os dados locais",
          );

          // Migrar em lotes para melhor performance
          const batch = writeBatch(db!);
          let batchCount = 0;
          const maxBatchSize = 450; // Limite do Firestore

          // Migrar obras
          for (const obra of localData.obras) {
            const id = obra.id || `obra-${Date.now()}-${Math.random()}`;
            const docRef = doc(db!, "universal_obras", id);
            batch.set(docRef, {
              ...obra,
              id,
              universallyShared: true,
              visibleToAllUsers: true,
              migratedAt: new Date().toISOString(),
              lastSync: new Date().toISOString(),
            });

            batchCount++;
            if (batchCount >= maxBatchSize) {
              await batch.commit();
              batchCount = 0;
            }
          }

          // Migrar manutenções
          for (const manutencao of localData.manutencoes) {
            const id =
              manutencao.id || `manutencao-${Date.now()}-${Math.random()}`;
            const docRef = doc(db!, "universal_manutencoes", id);
            batch.set(docRef, {
              ...manutencao,
              id,
              universallyShared: true,
              visibleToAllUsers: true,
              migratedAt: new Date().toISOString(),
              lastSync: new Date().toISOString(),
            });

            batchCount++;
            if (batchCount >= maxBatchSize) {
              await batch.commit();
              batchCount = 0;
            }
          }

          // Migrar piscinas
          for (const piscina of localData.piscinas) {
            const id = piscina.id || `piscina-${Date.now()}-${Math.random()}`;
            const docRef = doc(db!, "universal_piscinas", id);
            batch.set(docRef, {
              ...piscina,
              id,
              universallyShared: true,
              visibleToAllUsers: true,
              migratedAt: new Date().toISOString(),
              lastSync: new Date().toISOString(),
            });

            batchCount++;
            if (batchCount >= maxBatchSize) {
              await batch.commit();
              batchCount = 0;
            }
          }

          // Migrar clientes
          for (const cliente of localData.clientes) {
            const id = cliente.id || `cliente-${Date.now()}-${Math.random()}`;
            const docRef = doc(db!, "universal_clientes", id);
            batch.set(docRef, {
              ...cliente,
              id,
              universallyShared: true,
              visibleToAllUsers: true,
              migratedAt: new Date().toISOString(),
              lastSync: new Date().toISOString(),
            });

            batchCount++;
            if (batchCount >= maxBatchSize) {
              await batch.commit();
              batchCount = 0;
            }
          }

          // Executar último batch se houver dados pendentes
          if (batchCount > 0) {
            await batch.commit();
          }

          console.log(
            "✅ MIGRAÇÃO CONCLUÍDA - Dados agora universalmente partilhados",
          );

          // Criar marca de migração
          await setDoc(doc(db!, "universal_config", "migration_status"), {
            completed: true,
            migratedAt: new Date().toISOString(),
            totalMigrated: totalLocal,
            migratedData: {
              obras: localData.obras.length,
              manutencoes: localData.manutencoes.length,
              piscinas: localData.piscinas.length,
              clientes: localData.clientes.length,
            },
          });
        } else {
          console.log(
            `📊 Dados existentes no Firebase: ${totalExisting} registos`,
          );
        }
      } else {
        console.log("📭 Nenhum dado local encontrado para migrar");
      }

      console.log("🌐 TODOS OS DADOS AGORA SÃO UNIVERSALMENTE PARTILHADOS");
    } catch (error) {
      console.error("❌ Erro na migração universal:", error);
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Obter dados locais de forma segura
   */
  private getLocalDataSafe(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn(`⚠️ Erro ao ler dados locais ${key}:`, error);
      return [];
    }
  }

  /**
   * Configurar listeners do localStorage como fallback
   */
  private setupLocalStorageListeners(callbacks: {
    onObrasChange: (obras: any[]) => void;
    onManutencoesChange: (manutencoes: any[]) => void;
    onPiscinasChange: (piscinas: any[]) => void;
    onClientesChange: (clientes: any[]) => void;
  }): () => void {
    console.log("📱 Configurando listeners do armazenamento local");

    // Debounce function to prevent rapid fire updates
    let refreshTimeout: NodeJS.Timeout | null = null;

    // Function to refresh all data with debounce
    const refreshAllData = () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }

      refreshTimeout = setTimeout(() => {
        try {
          const currentData = this.getLocalData();
          callbacks.onObrasChange(currentData.obras);
          callbacks.onManutencoesChange(currentData.manutencoes);
          callbacks.onPiscinasChange(currentData.piscinas);
          callbacks.onClientesChange(currentData.clientes);
        } catch (error) {
          console.warn("Erro ao verificar mudanças locais:", error);
        }
      }, 100); // 100ms debounce
    };

    // Load initial data
    refreshAllData();

    // Only listen for native storage events (more stable)
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key &&
        ["works", "maintenance", "pools", "clients"].includes(event.key)
      ) {
        console.log("📱 Storage alterado:", event.key);
        refreshAllData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Polling temporarily disabled to prevent Builder.io crashes
    // const pollInterval = setInterval(refreshAllData, 10000);

    // Return cleanup function
    return () => {
      // clearInterval(pollInterval); // Disabled polling
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      window.removeEventListener("storage", handleStorageChange);
      console.log("🛑 Listeners locais desconectados");
    };
  }

  /**
   * Configurar listeners universais para todos os tipos de dados
   */
  setupUniversalListeners(callbacks: {
    onObrasChange: (obras: any[]) => void;
    onManutencoesChange: (manutencoes: any[]) => void;
    onPiscinasChange: (piscinas: any[]) => void;
    onClientesChange: (clientes: any[]) => void;
  }): () => void {
    // Verificação mais robusta para Firestore
    try {
      if (!isFirebaseReady() || !db || typeof db !== "object") {
        throw new Error("Firestore não disponível");
      }

      // Teste básico para ver se Firestore funciona
      const testCollection = collection(db, "test");
      if (!testCollection) {
        throw new Error("Firestore collection não funciona");
      }
    } catch (error) {
      console.log(
        "📱 Firebase/Firestore não disponível - usando localStorage como fallback",
      );
      console.log("💡 Razão:", (error as Error).message);

      // Use localStorage listeners as stable fallback
      return this.setupLocalStorageListeners(callbacks);
    }

    console.log("📡 CONFIGURANDO LISTENERS UNIVERSAIS");
    console.log("🌐 TODOS OS UTILIZADORES VERÃO OS MESMOS DADOS EM TEMPO REAL");

    const listeners: Unsubscribe[] = [];

    try {
      // Listener para obras universais
      const obrasListener = onSnapshot(
        query(collection(db!, "universal_obras"), orderBy("lastSync", "desc")),
        {
          next: (snapshot) => {
            try {
              const obras = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              console.log(
                `⚒️ OBRAS UNIVERSAIS: ${obras.length} visíveis para todos os utilizadores`,
              );
              callbacks.onObrasChange(obras);
            } catch (error) {
              console.error("❌ Erro ao processar obras:", error);
              callbacks.onObrasChange([]);
            }
          },
          error: (error) => {
            console.error("❌ Erro no listener de obras universais:", error);
            callbacks.onObrasChange([]);
          },
        },
      );
      listeners.push(obrasListener);

      // Listener para manutenções universais
      const manutencoesListener = onSnapshot(
        query(
          collection(db!, "universal_manutencoes"),
          orderBy("lastSync", "desc"),
        ),
        {
          next: (snapshot) => {
            try {
              const manutencoes = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              console.log(
                `🔧 MANUTENÇÕES UNIVERSAIS: ${manutencoes.length} visíveis para todos os utilizadores`,
              );
              callbacks.onManutencoesChange(manutencoes);
            } catch (error) {
              console.error("❌ Erro ao processar manutenções:", error);
              callbacks.onManutencoesChange([]);
            }
          },
          error: (error) => {
            console.error(
              "❌ Erro no listener de manutenções universais:",
              error,
            );
            callbacks.onManutencoesChange([]);
          },
        },
      );
      listeners.push(manutencoesListener);

      // Listener para piscinas universais
      const piscinasListener = onSnapshot(
        query(
          collection(db!, "universal_piscinas"),
          orderBy("lastSync", "desc"),
        ),
        {
          next: (snapshot) => {
            try {
              const piscinas = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              console.log(
                `🏊 PISCINAS UNIVERSAIS: ${piscinas.length} visíveis para todos os utilizadores`,
              );
              callbacks.onPiscinasChange(piscinas);
            } catch (error) {
              console.error("❌ Erro ao processar piscinas:", error);
              callbacks.onPiscinasChange([]);
            }
          },
          error: (error) => {
            console.error("❌ Erro no listener de piscinas universais:", error);
            callbacks.onPiscinasChange([]);
          },
        },
      );
      listeners.push(piscinasListener);

      // Listener para clientes universais
      const clientesListener = onSnapshot(
        query(
          collection(db!, "universal_clientes"),
          orderBy("lastSync", "desc"),
        ),
        {
          next: (snapshot) => {
            try {
              const clientes = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              console.log(
                `👥 CLIENTES UNIVERSAIS: ${clientes.length} visíveis para todos os utilizadores`,
              );
              callbacks.onClientesChange(clientes);
            } catch (error) {
              console.error("❌ Erro ao processar clientes:", error);
              callbacks.onClientesChange([]);
            }
          },
          error: (error) => {
            console.error("❌ Erro no listener de clientes universais:", error);
            callbacks.onClientesChange([]);
          },
        },
      );
      listeners.push(clientesListener);

      this.listeners = listeners;
      console.log(
        "✅ LISTENERS UNIVERSAIS ATIVOS - Sincronização em tempo real para todos",
      );
    } catch (error) {
      console.error("❌ Erro ao configurar listeners universais:", error);
      listeners.forEach((unsubscribe) => {
        try {
          unsubscribe();
        } catch {}
      });
      return () => {};
    }

    return () => {
      console.log("🛑 Desconectando listeners universais");
      this.listeners.forEach((unsubscribe) => {
        try {
          unsubscribe();
        } catch (error) {
          console.warn("⚠️ Erro ao desconectar listener:", error);
        }
      });
      this.listeners = [];
    };
  }

  /**
   * Adicionar nova obra universal
   */
  async addObra(obraData: any): Promise<string> {
    try {
      // Wait for Firebase to be ready
      const firebaseReady = await waitForFirebaseInit();
      if (!firebaseReady || !isFirebaseReady() || !db) {
        console.log("📱 Firebase não disponível - usando armazenamento local");

        // Fallback to localStorage
        const id = obraData.id || `obra-${Date.now()}-${Math.random()}`;
        const obra = {
          ...obraData,
          id,
          createdAt: obraData.createdAt || new Date().toISOString(),
        };

        const existingWorks = JSON.parse(localStorage.getItem("works") || "[]");

        // Check if work already exists to prevent duplicates
        const workExists = existingWorks.some((w: any) => w.id === obra.id);
        if (!workExists) {
          existingWorks.push(obra);
          localStorage.setItem("works", JSON.stringify(existingWorks));
          localStorage.setItem("lastLocalSync", new Date().toISOString());

          // Trigger storage event for cross-tab sync (stable approach)
          setTimeout(() => {
            window.dispatchEvent(
              new StorageEvent("storage", {
                key: "works",
                newValue: JSON.stringify(existingWorks),
                storageArea: localStorage,
              }),
            );
          }, 100);

          console.log(`✅ OBRA SALVA LOCALMENTE: ${id}`);
        } else {
          console.log(`⚠️ Obra ${id} já existe, ignorando duplicação`);
        }
        return id;
      }

      const id = obraData.id || `obra-${Date.now()}-${Math.random()}`;
      const obra = {
        ...obraData,
        id,
        universallyShared: true,
        visibleToAllUsers: true,
        createdAt: obraData.createdAt || new Date().toISOString(),
        lastSync: new Date().toISOString(),
      };

      await setDoc(doc(db, "universal_obras", id), obra);
      console.log(
        `✅ OBRA ADICIONADA UNIVERSALMENTE: ${id} - visível para todos`,
      );
      return id;
    } catch (error) {
      console.log("📱 Salvando obra localmente:", error.message || error);

      // Fallback to localStorage on any error
      const id = obraData.id || `obra-${Date.now()}-${Math.random()}`;
      const obra = {
        ...obraData,
        id,
        createdAt: obraData.createdAt || new Date().toISOString(),
      };

      const existingWorks = JSON.parse(localStorage.getItem("works") || "[]");

      // Check if work already exists to prevent duplicates
      const workExists = existingWorks.some((w: any) => w.id === obra.id);
      if (!workExists) {
        existingWorks.push(obra);
        localStorage.setItem("works", JSON.stringify(existingWorks));
        localStorage.setItem("lastLocalSync", new Date().toISOString());

        // Trigger storage event for cross-tab sync (stable approach)
        setTimeout(() => {
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "works",
              newValue: JSON.stringify(existingWorks),
              storageArea: localStorage,
            }),
          );
        }, 100);

        console.log(`✅ OBRA SALVA LOCALMENTE (fallback): ${id}`);
      } else {
        console.log(`⚠️ Obra ${id} já existe, ignorando duplicação`);
      }
      return id;
    }
  }

  /**
   * Adicionar nova manutenção universal
   */
  async addManutencao(manutencaoData: any): Promise<string> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase n��o disponível");
    }

    const id = manutencaoData.id || `manutencao-${Date.now()}-${Math.random()}`;
    const manutencao = {
      ...manutencaoData,
      id,
      universallyShared: true,
      visibleToAllUsers: true,
      createdAt: manutencaoData.createdAt || new Date().toISOString(),
      lastSync: new Date().toISOString(),
    };

    await setDoc(doc(db!, "universal_manutencoes", id), manutencao);
    console.log(
      `��� MANUTENÇÃO ADICIONADA UNIVERSALMENTE: ${id} - visível para todos`,
    );
    return id;
  }

  /**
   * Adicionar nova piscina universal
   */
  async addPiscina(piscinaData: any): Promise<string> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    const id = piscinaData.id || `piscina-${Date.now()}-${Math.random()}`;
    const piscina = {
      ...piscinaData,
      id,
      universallyShared: true,
      visibleToAllUsers: true,
      createdAt: piscinaData.createdAt || new Date().toISOString(),
      lastSync: new Date().toISOString(),
    };

    await setDoc(doc(db!, "universal_piscinas", id), piscina);
    console.log(
      `✅ PISCINA ADICIONADA UNIVERSALMENTE: ${id} - visível para todos`,
    );
    return id;
  }

  /**
   * Adicionar novo cliente universal
   */
  async addCliente(clienteData: any): Promise<string> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    const id = clienteData.id || `cliente-${Date.now()}-${Math.random()}`;
    const cliente = {
      ...clienteData,
      id,
      universallyShared: true,
      visibleToAllUsers: true,
      createdAt: clienteData.createdAt || new Date().toISOString(),
      lastSync: new Date().toISOString(),
    };

    await setDoc(doc(db!, "universal_clientes", id), cliente);
    console.log(
      `✅ CLIENTE ADICIONADO UNIVERSALMENTE: ${id} - visível para todos`,
    );
    return id;
  }

  /**
   * Atualizar obra universal
   */
  async updateObra(id: string, obraData: any): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    await updateDoc(doc(db!, "universal_obras", id), {
      ...obraData,
      lastSync: new Date().toISOString(),
      universallyShared: true,
      visibleToAllUsers: true,
    });

    console.log(
      `✅ OBRA ATUALIZADA UNIVERSALMENTE: ${id} - visível para todos`,
    );
  }

  /**
   * Atualizar manutenção universal
   */
  async updateManutencao(id: string, manutencaoData: any): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    await updateDoc(doc(db!, "universal_manutencoes", id), {
      ...manutencaoData,
      lastSync: new Date().toISOString(),
      universallyShared: true,
      visibleToAllUsers: true,
    });

    console.log(
      `✅ MANUTENÇÃO ATUALIZADA UNIVERSALMENTE: ${id} - visível para todos`,
    );
  }

  /**
   * Atualizar piscina universal
   */
  async updatePiscina(id: string, piscinaData: any): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    await updateDoc(doc(db!, "universal_piscinas", id), {
      ...piscinaData,
      lastSync: new Date().toISOString(),
      universallyShared: true,
      visibleToAllUsers: true,
    });

    console.log(
      `✅ PISCINA ATUALIZADA UNIVERSALMENTE: ${id} - visível para todos`,
    );
  }

  /**
   * Atualizar cliente universal
   */
  async updateCliente(id: string, clienteData: any): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    await updateDoc(doc(db!, "universal_clientes", id), {
      ...clienteData,
      lastSync: new Date().toISOString(),
      universallyShared: true,
      visibleToAllUsers: true,
    });

    console.log(
      `✅ CLIENTE ATUALIZADO UNIVERSALMENTE: ${id} - visível para todos`,
    );
  }

  /**
   * Eliminar obra universal
   */
  async deleteObra(id: string): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    await deleteDoc(doc(db!, "universal_obras", id));
    console.log(`✅ OBRA ELIMINADA UNIVERSALMENTE: ${id}`);
  }

  /**
   * Eliminar manutenção universal
   */
  async deleteManutencao(id: string): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    await deleteDoc(doc(db!, "universal_manutencoes", id));
    console.log(`✅ MANUTENÇÃO ELIMINADA UNIVERSALMENTE: ${id}`);
  }

  /**
   * Eliminar piscina universal
   */
  async deletePiscina(id: string): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    await deleteDoc(doc(db!, "universal_piscinas", id));
    console.log(`✅ PISCINA ELIMINADA UNIVERSALMENTE: ${id}`);
  }

  /**
   * Eliminar cliente universal
   */
  async deleteCliente(id: string): Promise<void> {
    if (!isFirebaseReady() || !db) {
      throw new Error("Firebase não disponível");
    }

    await deleteDoc(doc(db!, "universal_clientes", id));
    console.log(`✅ CLIENTE ELIMINADO UNIVERSALMENTE: ${id}`);
  }

  /**
   * Reset completo de emergência - limpa todos os dados
   */
  static emergencyReset(): void {
    console.log("🚨 RESET DE EMERGÊNCIA - Limpando todos os dados");

    // Clear localStorage
    localStorage.removeItem("works");
    localStorage.removeItem("maintenance");
    localStorage.removeItem("pools");
    localStorage.removeItem("clients");
    localStorage.removeItem("lastLocalSync");

    // Clear session storage
    sessionStorage.clear();

    console.log("✅ Dados limpos - recarregue a página");
  }

  /**
   * Limpar dados duplicados do localStorage
   */
  private cleanupDuplicateWorks(): void {
    try {
      const works = JSON.parse(localStorage.getItem("works") || "[]");
      const uniqueWorks = works.filter(
        (work: any, index: number, self: any[]) =>
          index === self.findIndex((w: any) => w.id === work.id),
      );

      if (works.length !== uniqueWorks.length) {
        console.log(
          `🧹 Removendo ${works.length - uniqueWorks.length} obras duplicadas`,
        );
        localStorage.setItem("works", JSON.stringify(uniqueWorks));
      }
    } catch (error) {
      console.warn("Erro ao limpar obras duplicadas:", error);
    }
  }

  /**
   * Carregar dados do localStorage
   */
  private getLocalData(): UniversalDataState {
    try {
      // Clean up any duplicate works first
      this.cleanupDuplicateWorks();

      const obras = JSON.parse(localStorage.getItem("works") || "[]");
      const manutencoes = JSON.parse(
        localStorage.getItem("maintenance") || "[]",
      );
      const piscinas = JSON.parse(localStorage.getItem("pools") || "[]");
      const clientes = JSON.parse(localStorage.getItem("clients") || "[]");

      return {
        obras,
        manutencoes,
        piscinas,
        clientes,
        totalItems:
          obras.length + manutencoes.length + piscinas.length + clientes.length,
        lastSync:
          localStorage.getItem("lastLocalSync") || new Date().toISOString(),
        isGloballyShared: false, // Local data is not globally shared
      };
    } catch (error) {
      console.warn("Erro ao carregar dados locais:", error);
      return {
        obras: [],
        manutencoes: [],
        piscinas: [],
        clientes: [],
        totalItems: 0,
        lastSync: new Date().toISOString(),
        isGloballyShared: false,
      };
    }
  }

  /**
   * Obter todos os dados universais
   */
  async getAllUniversalData(): Promise<UniversalDataState> {
    // Verificação mais robusta para Firestore
    try {
      if (!isFirebaseReady() || !db || typeof db !== "object") {
        throw new Error("Firestore não disponível");
      }

      // Teste básico para ver se Firestore funciona
      const testCollection = collection(db, "test");
      if (!testCollection) {
        throw new Error("Firestore collection não funciona");
      }
    } catch (error) {
      console.log("📱 Carregando dados do armazenamento local");
      console.log("💡 Firestore não disponível:", (error as Error).message);
      return this.getLocalData();
    }

    try {
      const [obrasSnap, manutencoesSnap, piscinasSnap, clientesSnap] =
        await Promise.all([
          getDocs(
            query(
              collection(db!, "universal_obras"),
              orderBy("lastSync", "desc"),
            ),
          ),
          getDocs(
            query(
              collection(db!, "universal_manutencoes"),
              orderBy("lastSync", "desc"),
            ),
          ),
          getDocs(
            query(
              collection(db!, "universal_piscinas"),
              orderBy("lastSync", "desc"),
            ),
          ),
          getDocs(
            query(
              collection(db!, "universal_clientes"),
              orderBy("lastSync", "desc"),
            ),
          ),
        ]);

      const data: UniversalDataState = {
        obras: obrasSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        manutencoes: manutencoesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        piscinas: piscinasSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        clientes: clientesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        totalItems: 0,
        lastSync: new Date().toISOString(),
        isGloballyShared: true,
      };

      data.totalItems =
        data.obras.length +
        data.manutencoes.length +
        data.piscinas.length +
        data.clientes.length;

      console.log("📊 DADOS UNIVERSAIS OBTIDOS:", {
        obras: data.obras.length,
        manutencoes: data.manutencoes.length,
        piscinas: data.piscinas.length,
        clientes: data.clientes.length,
        total: data.totalItems,
      });

      return data;
    } catch (error) {
      console.error("❌ Erro ao obter dados universais:", error);
      throw error;
    }
  }

  /**
   * Verificar se o servi��o está pronto
   */
  isReady(): boolean {
    return this.isInitialized && isFirebaseReady();
  }

  /**
   * Cleanup dos listeners
   */
  cleanup(): void {
    this.listeners.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch (error) {
        console.warn("⚠️ Erro ao limpar listener:", error);
      }
    });
    this.listeners = [];
    this.isInitialized = false;
  }
}

// Exportar instância singleton
export const universalDataSync = new UniversalDataSyncService();

// Expor função de reset de emergência globalmente
(window as any).emergencyReset = UniversalDataSyncService.emergencyReset;

export default universalDataSync;
