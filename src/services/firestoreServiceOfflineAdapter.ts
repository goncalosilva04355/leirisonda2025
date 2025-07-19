// Adaptador OFFLINE-FIRST para compatibilidade com App.tsx
import {
  saveToOfflineFirestore,
  readFromOfflineFirestore,
  deleteFromOfflineFirestore,
} from "../utils/offlineFirestoreApi";

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

class FirestoreServiceOfflineAdapter {
  private static instance: FirestoreServiceOfflineAdapter;

  private constructor() {}

  static getInstance(): FirestoreServiceOfflineAdapter {
    if (!FirestoreServiceOfflineAdapter.instance) {
      FirestoreServiceOfflineAdapter.instance =
        new FirestoreServiceOfflineAdapter();
    }
    return FirestoreServiceOfflineAdapter.instance;
  }

  // Método compatível para obter utilizadores
  async getUtilizadores(): Promise<UserProfile[]> {
    try {
      console.log("📋 Carregando utilizadores via OFFLINE-FIRST...");
      const users = await readFromOfflineFirestore("utilizadores");

      console.log(
        `✅ ${users.length} utilizadores carregados via OFFLINE-FIRST`,
      );
      return users.map((user) => ({
        ...user,
        id: user.id || user.documentId,
      }));
    } catch (error) {
      console.warn(
        "⚠️ Erro ao carregar utilizadores via OFFLINE-FIRST:",
        error,
      );
      return [];
    }
  }

  // Método compatível para criar utilizador
  async createUtilizador(user: UserProfile): Promise<string | null> {
    try {
      console.log("👤 Criando utilizador via OFFLINE-FIRST:", user.email);

      const userData = {
        ...user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: user.isActive !== false, // default true
        role: user.role || "user",
      };

      const docId = await saveToOfflineFirestore("utilizadores", userData);

      if (docId) {
        console.log(`✅ Utilizador criado via OFFLINE-FIRST com ID: ${docId}`);
        return docId;
      } else {
        console.warn("⚠️ Falha ao criar utilizador via OFFLINE-FIRST");
        return null;
      }
    } catch (error) {
      console.warn("⚠️ Erro ao criar utilizador via OFFLINE-FIRST:", error);
      return null;
    }
  }

  // Método compatível para atualizar utilizador
  async updateUtilizador(
    id: string,
    user: Partial<UserProfile>,
  ): Promise<boolean> {
    try {
      console.log("🔄 Atualizando utilizador via OFFLINE-FIRST:", id);

      const userData = {
        ...user,
        id,
        updatedAt: new Date().toISOString(),
      };

      const success = await saveToOfflineFirestore(
        "utilizadores",
        userData,
        id,
      );

      if (success) {
        console.log(`✅ Utilizador ${id} atualizado via OFFLINE-FIRST`);
        return true;
      } else {
        console.warn(
          `⚠️ Falha ao atualizar utilizador ${id} via OFFLINE-FIRST`,
        );
        return false;
      }
    } catch (error) {
      console.warn(
        `⚠️ Erro ao atualizar utilizador ${id} via OFFLINE-FIRST:`,
        error,
      );
      return false;
    }
  }

  // Método compatível para eliminar utilizador
  async deleteUtilizador(id: string): Promise<boolean> {
    try {
      console.log("🗑️ Eliminando utilizador via OFFLINE-FIRST:", id);

      const success = await deleteFromOfflineFirestore("utilizadores", id);

      if (success) {
        console.log(`✅ Utilizador ${id} eliminado via OFFLINE-FIRST`);
        return true;
      } else {
        console.warn(`⚠️ Falha ao eliminar utilizador ${id} via OFFLINE-FIRST`);
        return false;
      }
    } catch (error) {
      console.warn(
        `⚠️ Erro ao eliminar utilizador ${id} via OFFLINE-FIRST:`,
        error,
      );
      return false;
    }
  }

  // Método de compatibilidade para syncAll
  async syncAll(): Promise<void> {
    try {
      console.log(
        "🔄 Sincronização OFFLINE-FIRST (local storage sempre atualizado)...",
      );
      // Offline-first não precisa de sincronização explícita
      console.log("✅ Sincronização OFFLINE-FIRST completa");
    } catch (error) {
      console.warn("⚠️ Erro na sincronização OFFLINE-FIRST:", error);
    }
  }

  // Método de teste de conexão
  async testConnection(): Promise<boolean> {
    try {
      console.log("🔍 Testando OFFLINE-FIRST (localStorage)...");
      // Testar se localStorage funciona
      const testKey = "offline_test_" + Date.now();
      localStorage.setItem(testKey, "test");
      const result = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (result === "test") {
        console.log("✅ OFFLINE-FIRST funcionando (localStorage OK)");
        return true;
      } else {
        console.warn("⚠️ OFFLINE-FIRST: localStorage não funciona");
        return false;
      }
    } catch (error) {
      console.warn("⚠️ Teste OFFLINE-FIRST falhou:", error);
      return false;
    }
  }
}

// Export da instância singleton
export const firestoreService = FirestoreServiceOfflineAdapter.getInstance();
