// Serviço Firestore ultra-simplificado para diagnóstico
console.log("🔥 Carregando FirestoreService...");

export interface FirestoreEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export class FirestoreService {
  private db: any = null;
  private initialized = false;

  // Inicialização lazy ultra-defensiva
  private ensureInitialized() {
    if (!this.initialized) {
      try {
        const { getDB } = require("../firebase");
        this.db = getDB();
        this.initialized = true;
        console.log("✅ FirestoreService inicializado");
      } catch (error) {
        console.error("❌ Erro ao inicializar FirestoreService:", error);
        this.db = null;
      }
    }
  }

  // Verificar se Firestore está disponível
  private isAvailable(): boolean {
    this.ensureInitialized();
    return this.db !== null;
  }

  // CRUD básico simplificado
  async getObras(): Promise<any[]> {
    try {
      if (!this.isAvailable()) {
        console.warn("Firestore não disponível, usando localStorage");
        const localData = localStorage.getItem("works");
        return localData ? JSON.parse(localData) : [];
      }

      // Tentar Firestore se disponível
      console.log("📖 Lendo obras do Firestore...");
      return []; // Por enquanto retorna vazio
    } catch (error) {
      console.error("❌ Erro ao ler obras:", error);
      const localData = localStorage.getItem("works");
      return localData ? JSON.parse(localData) : [];
    }
  }

  async getPiscinas(): Promise<any[]> {
    try {
      const localData = localStorage.getItem("pools");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("❌ Erro ao ler piscinas:", error);
      return [];
    }
  }

  async getManutencoes(): Promise<any[]> {
    try {
      const localData = localStorage.getItem("maintenance");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("❌ Erro ao ler manutenções:", error);
      return [];
    }
  }

  async getClientes(): Promise<any[]> {
    try {
      const localData = localStorage.getItem("clients");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("❌ Erro ao ler clientes:", error);
      return [];
    }
  }

  async getUtilizadores(): Promise<any[]> {
    try {
      const localData = localStorage.getItem("app-users");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("❌ Erro ao ler utilizadores:", error);
      return [];
    }
  }

  async getLocalizacoes(): Promise<any[]> {
    try {
      const localData = localStorage.getItem("locations");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("❌ Erro ao ler localizações:", error);
      return [];
    }
  }

  async getNotificacoes(): Promise<any[]> {
    try {
      const localData = localStorage.getItem("notifications");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("❌ Erro ao ler notificações:", error);
      return [];
    }
  }

  // Métodos básicos para compatibilidade
  async createObra(obra: any): Promise<string | null> {
    console.log("📝 Criar obra (localStorage apenas)");
    return null;
  }

  async createPiscina(piscina: any): Promise<string | null> {
    console.log("📝 Criar piscina (localStorage apenas)");
    return null;
  }

  async createManutencao(manutencao: any): Promise<string | null> {
    console.log("📝 Criar manutenção (localStorage apenas)");
    return null;
  }

  async createCliente(cliente: any): Promise<string | null> {
    console.log("📝 Criar cliente (localStorage apenas)");
    return null;
  }

  async syncAll(): Promise<void> {
    console.log("🔄 Sync simplificado - apenas localStorage");
  }
}

// Instância singleton simplificada
let firestoreServiceInstance: FirestoreService | null = null;

export const firestoreService = {
  getInstance(): FirestoreService {
    if (!firestoreServiceInstance) {
      firestoreServiceInstance = new FirestoreService();
      console.log("✅ FirestoreService instance criada");
    }
    return firestoreServiceInstance;
  },

  // Métodos delegados simplificados
  async getObras(): Promise<any[]> {
    return this.getInstance().getObras();
  },

  async getPiscinas(): Promise<any[]> {
    return this.getInstance().getPiscinas();
  },

  async getManutencoes(): Promise<any[]> {
    return this.getInstance().getManutencoes();
  },

  async getClientes(): Promise<any[]> {
    return this.getInstance().getClientes();
  },

  async getUtilizadores(): Promise<any[]> {
    return this.getInstance().getUtilizadores();
  },

  async getLocalizacoes(): Promise<any[]> {
    return this.getInstance().getLocalizacoes();
  },

  async getNotificacoes(): Promise<any[]> {
    return this.getInstance().getNotificacoes();
  },

  async syncAll(): Promise<void> {
    return this.getInstance().syncAll();
  },

  // Métodos básicos de criação
  async createObra(obra: any): Promise<string | null> {
    return this.getInstance().createObra(obra);
  },

  async createPiscina(piscina: any): Promise<string | null> {
    return this.getInstance().createPiscina(piscina);
  },

  async createManutencao(manutencao: any): Promise<string | null> {
    return this.getInstance().createManutencao(manutencao);
  },

  async createCliente(cliente: any): Promise<string | null> {
    return this.getInstance().createCliente(cliente);
  },
};

console.log("🔥 FirestoreService module carregado");
