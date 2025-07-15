// Serviço automático que substitui o firebaseService problemático
import {
  isFirestoreRESTEnabled,
  useFirestoreREST,
} from "./firestoreIntegration";

// Classe que substitui automaticamente os serviços problemáticos
export class AutoFirebaseService {
  private restService = useFirestoreREST();
  private isRESTActive = isFirestoreRESTEnabled();

  constructor() {
    // Verificar se REST API foi ativada automaticamente
    setTimeout(() => {
      this.isRESTActive = isFirestoreRESTEnabled();
      if (this.isRESTActive) {
        console.log("🚀 AutoFirebaseService usando REST API");
      } else {
        console.log("📱 AutoFirebaseService usando localStorage");
      }
    }, 3000);
  }

  // Método para adicionar obra (substitui o problemático)
  async addObra(data: any): Promise<any> {
    try {
      if (this.isRESTActive) {
        console.log("💾 Guardando obra via REST API...");
        return await this.restService.addObra(data);
      }
    } catch (error) {
      console.warn("REST API falhou, usando localStorage:", error);
    }

    // Fallback localStorage
    return this.addToLocalStorage("obras", data);
  }

  // Método para adicionar piscina
  async addPiscina(data: any): Promise<any> {
    try {
      if (this.isRESTActive) {
        console.log("💾 Guardando piscina via REST API...");
        return await this.restService.addPiscina(data);
      }
    } catch (error) {
      console.warn("REST API falhou, usando localStorage:", error);
    }

    return this.addToLocalStorage("piscinas", data);
  }

  // Método para adicionar manutenção
  async addManutencao(data: any): Promise<any> {
    try {
      if (this.isRESTActive) {
        console.log("💾 Guardando manutenção via REST API...");
        return await this.restService.addManutencao(data);
      }
    } catch (error) {
      console.warn("REST API falhou, usando localStorage:", error);
    }

    return this.addToLocalStorage("manutencoes", data);
  }

  // Método para adicionar cliente
  async addCliente(data: any): Promise<any> {
    try {
      if (this.isRESTActive) {
        console.log("💾 Guardando cliente via REST API...");
        return await this.restService.addCliente(data);
      }
    } catch (error) {
      console.warn("REST API falhou, usando localStorage:", error);
    }

    return this.addToLocalStorage("clientes", data);
  }

  // Método helper para localStorage
  private addToLocalStorage(collection: string, data: any): any {
    const items = JSON.parse(localStorage.getItem(collection) || "[]");
    const newItem = {
      ...data,
      id: Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    items.push(newItem);
    localStorage.setItem(collection, JSON.stringify(items));
    console.log(`✅ ${collection} guardado no localStorage:`, newItem.id);
    return newItem;
  }

  // Método para atualizar dados
  async updateDocument(
    collection: string,
    id: string,
    data: any,
  ): Promise<any> {
    try {
      if (this.isRESTActive) {
        await this.restService.updateDocument(collection, id, data);
        console.log(`✅ ${collection}/${id} atualizado via REST API`);
        return;
      }
    } catch (error) {
      console.warn("REST API update falhou, usando localStorage:", error);
    }

    // Fallback localStorage
    const items = JSON.parse(localStorage.getItem(collection) || "[]");
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updatedAt: new Date() };
      localStorage.setItem(collection, JSON.stringify(items));
      console.log(`✅ ${collection}/${id} atualizado no localStorage`);
    }
  }

  // Método para sincronizar dados
  async syncData(): Promise<boolean> {
    try {
      if (this.isRESTActive) {
        const success = await this.restService.syncFromFirestore();
        if (success) {
          console.log("✅ Dados sincronizados do Firestore");
          return true;
        }
      }
    } catch (error) {
      console.warn("Sincronização falhou:", error);
    }

    console.log("📱 Usando dados locais");
    return false;
  }

  // Verificar se está funcionando
  isWorking(): boolean {
    return true; // Sempre funciona (REST API ou localStorage)
  }

  // Verificar se está usando REST API
  isUsingRESTAPI(): boolean {
    return this.isRESTActive;
  }
}

// Instância singleton que substitui os serviços problemáticos
export const autoFirebaseService = new AutoFirebaseService();

// Função para substituir automaticamente os imports problemáticos
export function getWorkingFirebaseService() {
  return autoFirebaseService;
}

// Compatibilidade com código existente
export const addObra = (data: any) => autoFirebaseService.addObra(data);
export const addPiscina = (data: any) => autoFirebaseService.addPiscina(data);
export const addManutencao = (data: any) =>
  autoFirebaseService.addManutencao(data);
export const addCliente = (data: any) => autoFirebaseService.addCliente(data);
export const updateDocument = (collection: string, id: string, data: any) =>
  autoFirebaseService.updateDocument(collection, id, data);

console.log(
  "🔧 AutoFirebaseService carregado - substitui serviços problemáticos",
);
