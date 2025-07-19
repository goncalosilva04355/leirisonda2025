// Adaptador para compatibilidade entre firestoreService original e REST API
import {
  saveToFirestoreRest,
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "../utils/firestoreRestApi";

export interface UserProfile {
  id?: string;
  nome: string;
  email: string;
  password?: string;
  isActive?: boolean;
  role?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: any;
}

class FirestoreServiceRestAdapter {
  private static instance: FirestoreServiceRestAdapter;

  private constructor() {}

  static getInstance(): FirestoreServiceRestAdapter {
    if (!FirestoreServiceRestAdapter.instance) {
      FirestoreServiceRestAdapter.instance = new FirestoreServiceRestAdapter();
    }
    return FirestoreServiceRestAdapter.instance;
  }

  // Método compatível para obter utilizadores
  async getUtilizadores(): Promise<UserProfile[]> {
    try {
      console.log("📋 Carregando utilizadores via REST API...");
      const users = await readFromFirestoreRest("utilizadores");

      if (Array.isArray(users)) {
        console.log(`✅ ${users.length} utilizadores carregados via REST API`);
        return users.map((user) => ({
          ...user,
          id: user.id || user.documentId,
        }));
      } else {
        console.log("📭 Nenhum utilizador encontrado via REST API");
        return [];
      }
    } catch (error) {
      console.warn("⚠️ Erro ao carregar utilizadores via REST API:", error);
      return [];
    }
  }

  // Método compatível para criar utilizador
  async createUtilizador(user: UserProfile): Promise<string | null> {
    try {
      console.log("👤 Criando utilizador via REST API:", user.email);

      const userData = {
        ...user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: user.isActive !== false, // default true
        role: user.role || "user",
      };

      const docId = await saveToFirestoreRest("utilizadores", userData);

      if (docId) {
        console.log(`✅ Utilizador criado via REST API com ID: ${docId}`);
        return docId;
      } else {
        console.warn("⚠️ Falha ao criar utilizador via REST API");
        return null;
      }
    } catch (error) {
      console.warn("⚠️ Erro ao criar utilizador via REST API:", error);
      return null;
    }
  }

  // Método compatível para atualizar utilizador
  async updateUtilizador(
    id: string,
    user: Partial<UserProfile>,
  ): Promise<boolean> {
    try {
      console.log("🔄 Atualizando utilizador via REST API:", id);

      const userData = {
        ...user,
        updatedAt: new Date().toISOString(),
      };

      const success = await saveToFirestoreRest("utilizadores", userData, id);

      if (success) {
        console.log(`✅ Utilizador ${id} atualizado via REST API`);
        return true;
      } else {
        console.warn(`⚠️ Falha ao atualizar utilizador ${id} via REST API`);
        return false;
      }
    } catch (error) {
      console.warn(
        `⚠️ Erro ao atualizar utilizador ${id} via REST API:`,
        error,
      );
      return false;
    }
  }

  // Método compatível para eliminar utilizador
  async deleteUtilizador(id: string): Promise<boolean> {
    try {
      console.log("🗑️ Eliminando utilizador via REST API:", id);

      const success = await deleteFromFirestoreRest("utilizadores", id);

      if (success) {
        console.log(`✅ Utilizador ${id} eliminado via REST API`);
        return true;
      } else {
        console.warn(`⚠️ Falha ao eliminar utilizador ${id} via REST API`);
        return false;
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao eliminar utilizador ${id} via REST API:`, error);
      return false;
    }
  }

  // Método de compatibilidade para syncAll
  async syncAll(): Promise<void> {
    try {
      console.log("🔄 Sincronização via REST API (placeholder)...");
      // REST API não precisa de sincronização explícita
      console.log("✅ Sincronização REST API completa");
    } catch (error) {
      console.warn("⚠️ Erro na sincronização via REST API:", error);
    }
  }

  // Método de teste de conexão
  async testConnection(): Promise<boolean> {
    try {
      console.log("🔍 Testando conexão REST API...");
      const testData = await readFromFirestoreRest("system_tests");
      console.log("✅ Conexão REST API funcionando");
      return true;
    } catch (error) {
      console.warn("⚠️ Teste de conexão REST API falhou:", error);
      return false;
    }
  }
}

// Export da instância singleton
export const firestoreService = FirestoreServiceRestAdapter.getInstance();
