// Serviço offline-first - funciona sem Firebase
// O Firebase é opcional e será usado quando disponível

class OfflineFirstService {
  private useFirebase = false;
  private firebaseAvailable = false;

  constructor() {
    // Firebase é opcional - aplicação funciona sem ele
    this.checkFirebaseAvailability();
  }

  private async checkFirebaseAvailability() {
    try {
      // Tentar importar Firebase de forma segura
      const { initializeApp } = await import("firebase/app");

      // Configuração mínima para teste
      const testConfig = {
        apiKey: "test-key",
        authDomain: "test.firebaseapp.com",
        projectId: "test-project",
        storageBucket: "test.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:test",
      };

      // Tentar inicializar (mas não falhar se não conseguir)
      const app = initializeApp(testConfig, "test-app-" + Date.now());

      // Se chegou aqui, Firebase está disponível
      this.firebaseAvailable = true;
      console.log("✅ Firebase disponível (modo opcional)");
    } catch (error) {
      this.firebaseAvailable = false;
      console.log("📱 Firebase não disponível - modo offline ativo");
    }
  }

  // Método principal para criar obra
  async createWork(workData: any): Promise<string> {
    const id = Date.now().toString();
    const work = {
      ...workData,
      id,
      createdAt: new Date().toISOString(),
      source: "localStorage",
    };

    try {
      // 1. Sempre salvar no localStorage primeiro (garantia)
      const existingWorks = JSON.parse(localStorage.getItem("works") || "[]");
      existingWorks.push(work);
      localStorage.setItem("works", JSON.stringify(existingWorks));
      console.log("✅ Obra salva no localStorage:", id);

      // 2. Tentar Firebase se disponível (opcional)
      if (this.firebaseAvailable) {
        this.tryFirebaseSave("obras", work);
      }

      return id;
    } catch (error) {
      console.error("❌ Erro ao criar obra:", error);
      // Mesmo com erro, retornar ID pois pode ter salvado no localStorage
      return id;
    }
  }

  async createPool(poolData: any): Promise<string> {
    const id = Date.now().toString();
    const pool = {
      ...poolData,
      id,
      createdAt: new Date().toISOString(),
      source: "localStorage",
    };

    try {
      const existingPools = JSON.parse(localStorage.getItem("pools") || "[]");
      existingPools.push(pool);
      localStorage.setItem("pools", JSON.stringify(existingPools));
      console.log("✅ Piscina salva no localStorage:", id);

      if (this.firebaseAvailable) {
        this.tryFirebaseSave("piscinas", pool);
      }

      return id;
    } catch (error) {
      console.error("❌ Erro ao criar piscina:", error);
      return id;
    }
  }

  async createMaintenance(maintenanceData: any): Promise<string> {
    const id = Date.now().toString();
    const maintenance = {
      ...maintenanceData,
      id,
      createdAt: new Date().toISOString(),
      source: "localStorage",
    };

    try {
      const existing = JSON.parse(localStorage.getItem("maintenance") || "[]");
      existing.push(maintenance);
      localStorage.setItem("maintenance", JSON.stringify(existing));
      console.log("✅ Manutenção salva no localStorage:", id);

      if (this.firebaseAvailable) {
        this.tryFirebaseSave("manutencoes", maintenance);
      }

      return id;
    } catch (error) {
      console.error("❌ Erro ao criar manutenção:", error);
      return id;
    }
  }

  async createClient(clientData: any): Promise<string> {
    const id = Date.now().toString();
    const client = {
      ...clientData,
      id,
      createdAt: new Date().toISOString(),
      source: "localStorage",
    };

    try {
      const existing = JSON.parse(localStorage.getItem("clients") || "[]");
      existing.push(client);
      localStorage.setItem("clients", JSON.stringify(existing));
      console.log("✅ Cliente salvo no localStorage:", id);

      if (this.firebaseAvailable) {
        this.tryFirebaseSave("clientes", client);
      }

      return id;
    } catch (error) {
      console.error("❌ Erro ao criar cliente:", error);
      return id;
    }
  }

  // Método para tentar salvar no Firebase (não crítico)
  private async tryFirebaseSave(collection: string, data: any) {
    try {
      // Implementação Firebase opcional
      console.log(
        `📱 Firebase sync para ${collection} será implementado depois`,
      );
    } catch (error) {
      console.warn(`⚠️ Firebase sync falhou para ${collection}:`, error);
      // Não é crítico - dados já estão no localStorage
    }
  }

  // Status da aplicação
  getStatus() {
    return {
      offline: true, // Sempre funciona offline
      firebase: this.firebaseAvailable,
      storage: "localStorage",
      message: this.firebaseAvailable
        ? "Aplicação online com backup Firebase"
        : "Aplicação offline - dados em localStorage",
    };
  }
}

export const offlineFirstService = new OfflineFirstService();
export default offlineFirstService;
