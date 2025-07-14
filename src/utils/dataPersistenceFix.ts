// Diagnóstico e correção de persistência de dados para app publicada
import { firestoreService } from "../services/firestoreService";
import { isFirestoreReady } from "../firebase/firestoreConfig";

export interface DataPersistenceStatus {
  localStorage: boolean;
  firestore: boolean;
  working: boolean;
  issues: string[];
  recommendations: string[];
}

export class DataPersistenceManager {
  private static instance: DataPersistenceManager;

  static getInstance(): DataPersistenceManager {
    if (!DataPersistenceManager.instance) {
      DataPersistenceManager.instance = new DataPersistenceManager();
    }
    return DataPersistenceManager.instance;
  }

  async diagnoseDataPersistence(): Promise<DataPersistenceStatus> {
    const status: DataPersistenceStatus = {
      localStorage: false,
      firestore: false,
      working: false,
      issues: [],
      recommendations: [],
    };

    // Teste localStorage
    try {
      const testKey = "test-persistence-" + Date.now();
      const testData = { test: true, timestamp: Date.now() };

      localStorage.setItem(testKey, JSON.stringify(testData));
      const retrieved = localStorage.getItem(testKey);

      if (retrieved && JSON.parse(retrieved).test === true) {
        status.localStorage = true;
        console.log("✅ localStorage está funcional");
      } else {
        status.issues.push("localStorage não consegue guardar/ler dados");
        status.recommendations.push(
          "Verificar se o navegador permite localStorage",
        );
      }

      localStorage.removeItem(testKey);
    } catch (error) {
      status.issues.push(`Erro no localStorage: ${error}`);
      status.recommendations.push(
        "localStorage pode estar desativado no navegador",
      );
    }

    // Teste Firestore
    try {
      if (isFirestoreReady()) {
        // Teste básico de escrita/leitura
        const testDoc = await firestoreService.create("system_tests", {
          type: "persistence_test",
          timestamp: new Date().toISOString(),
          data: { test: true },
        });

        if (testDoc) {
          status.firestore = true;
          console.log("✅ Firestore está funcional");

          // Limpar teste
          await firestoreService.delete("system_tests", testDoc);
        } else {
          status.issues.push("Firestore não consegue criar documentos");
          status.recommendations.push(
            "Verificar regras de segurança do Firestore",
          );
        }
      } else {
        status.issues.push("Firestore não está inicializado");
        status.recommendations.push("Verificar configuração do Firebase");
      }
    } catch (error) {
      // Não reportar como erro se Firestore simplesmente não está habilitado
      if (error.toString().includes("Service firestore is not available")) {
        status.recommendations.push(
          "Firestore não habilitado - aplicação funciona com localStorage",
        );
      } else {
        status.issues.push(`Problema no Firestore: ${error}`);
        status.recommendations.push(
          "Verificar ligação à internet e configuração Firebase",
        );
      }
    }

    // Determinar se o sistema está funcional
    status.working = status.localStorage || status.firestore;

    if (!status.working) {
      status.issues.push("Nenhum sistema de persistência está funcional");
      status.recommendations.push("Contactar suporte técnico urgentemente");
    }

    return status;
  }

  async forceDataSync(): Promise<boolean> {
    console.log("🔄 Iniciando sincronização forçada de dados...");

    try {
      if (!isFirestoreReady()) {
        console.warn("⚠️ Firestore não disponível, a usar apenas localStorage");
        return false;
      }

      // Sincronizar todas as entidades
      await firestoreService.syncAll();

      // Verificar se dados foram persistidos
      const status = await this.diagnoseDataPersistence();

      if (status.working) {
        console.log("✅ Sincronização forçada concluída com sucesso");
        return true;
      } else {
        console.error("❌ Sincronização forçada falhou");
        return false;
      }
    } catch (error) {
      console.error("❌ Erro na sincronização forçada:", error);
      return false;
    }
  }

  async ensureDataPersistence(
    data: any,
    collection: string,
    localKey: string,
  ): Promise<boolean> {
    let success = false;

    // Tentar guardar no Firestore primeiro
    if (isFirestoreReady()) {
      try {
        const docId = await firestoreService.create(collection, data);
        if (docId) {
          success = true;
          console.log(
            `✅ Dados guardados no Firestore: ${collection}/${docId}`,
          );
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao guardar no Firestore: ${error}`);
      }
    }

    // Guardar no localStorage como backup
    try {
      const existingData = localStorage.getItem(localKey);
      const dataArray = existingData ? JSON.parse(existingData) : [];

      // Adicionar novo item com ID único se não tiver
      if (!data.id) {
        data.id = Date.now().toString();
      }

      dataArray.push(data);
      localStorage.setItem(localKey, JSON.stringify(dataArray));

      success = true;
      console.log(`✅ Dados guardados no localStorage: ${localKey}`);
    } catch (error) {
      console.error(`❌ Erro ao guardar no localStorage: ${error}`);
    }

    return success;
  }

  async checkDataIntegrity(): Promise<{
    localCount: number;
    firestoreCount: number;
    synced: boolean;
    missing: string[];
  }> {
    const result = {
      localCount: 0,
      firestoreCount: 0,
      synced: false,
      missing: [],
    };

    try {
      // Contar dados locais
      const collections = [
        "works",
        "pools",
        "maintenance",
        "app-users",
        "clients",
      ];

      for (const collection of collections) {
        const localData = localStorage.getItem(collection);
        if (localData) {
          const parsed = JSON.parse(localData);
          result.localCount += Array.isArray(parsed) ? parsed.length : 0;
        }
      }

      // Contar dados no Firestore
      if (isFirestoreReady()) {
        const firestoreCollections = [
          "obras",
          "piscinas",
          "manutencoes",
          "utilizadores",
          "clientes",
        ];

        for (const collection of firestoreCollections) {
          const data = await firestoreService.read(collection);
          result.firestoreCount += data.length;
        }
      }

      result.synced = Math.abs(result.localCount - result.firestoreCount) <= 2; // Margem de tolerância

      if (!result.synced) {
        result.missing.push(
          `Diferença de ${Math.abs(result.localCount - result.firestoreCount)} registos entre local e Firestore`,
        );
      }
    } catch (error) {
      console.error("❌ Erro na verificação de integridade:", error);
      result.missing.push(`Erro na verificação: ${error}`);
    }

    return result;
  }

  async repairDataPersistence(): Promise<boolean> {
    console.log("🔧 Iniciando reparação da persistência de dados...");

    try {
      // 1. Diagnóstico inicial
      const status = await this.diagnoseDataPersistence();
      console.log("📊 Estado da persistência:", status);

      // 2. Se Firestore está funcional, sincronizar tudo
      if (status.firestore) {
        await this.forceDataSync();
      }

      // 3. Verificar integridade
      const integrity = await this.checkDataIntegrity();
      console.log("🔍 Integridade dos dados:", integrity);

      // 4. Se há problemas, tentar reparar
      if (!integrity.synced) {
        console.log("🔧 Reparando inconsistências...");

        // Forçar sincronização bi-direccional
        if (isFirestoreReady()) {
          const collections = [
            { firestore: "obras", local: "works" },
            { firestore: "piscinas", local: "pools" },
            { firestore: "manutencoes", local: "maintenance" },
            { firestore: "utilizadores", local: "app-users" },
            { firestore: "clientes", local: "clients" },
          ];

          for (const { firestore, local } of collections) {
            await firestoreService.syncWithLocalStorage(firestore, local);
          }
        }
      }

      // 5. Verificação final
      const finalStatus = await this.diagnoseDataPersistence();

      if (finalStatus.working) {
        console.log("✅ Reparação concluída com sucesso");

        // Mostrar notificação ao utilizador
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          new Notification("✅ Sistema Reparado", {
            body: "A persistência de dados foi reparada com sucesso",
            icon: "/icon.svg",
          });
        }

        return true;
      } else {
        console.error("❌ Reparação falhou");
        return false;
      }
    } catch (error) {
      console.error("❌ Erro na reparação:", error);
      return false;
    }
  }

  // Monitorizar persistência em tempo real
  startPersistenceMonitoring(): void {
    console.log("👁️ Iniciando monitorização de persistência...");

    // Verificar a cada 30 segundos
    setInterval(async () => {
      const status = await this.diagnoseDataPersistence();

      if (!status.working) {
        console.warn("⚠️ Problema de persistência detectado:", status.issues);

        // Tentar reparar automaticamente
        const repaired = await this.repairDataPersistence();

        if (!repaired) {
          // Alertar utilizador se não conseguir reparar
          console.error("🚨 CRÍTICO: Persistência de dados falhada");

          if (typeof window !== "undefined") {
            alert(
              "⚠️ ATENÇÃO: Os dados podem não estar a ser guardados. Contacte o suporte técnico.",
            );
          }
        }
      }
    }, 30000); // 30 segundos
  }
}

// Instância global
export const dataPersistenceManager = DataPersistenceManager.getInstance();

// Auto-inicializar monitorização quando importado
if (typeof window !== "undefined") {
  // Aguardar um pouco antes de iniciar
  setTimeout(() => {
    dataPersistenceManager.startPersistenceMonitoring();
  }, 5000);
}
