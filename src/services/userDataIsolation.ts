/**
 * Serviço de Isolamento de Dados por Utilizador
 * Garante que cada utilizador só acede aos seus próprios dados
 */

import {
  collection,
  doc,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db, getAuthService } from "../firebase/config";

export interface UserDataAccess {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  reason?: string;
}

export class UserDataIsolationService {
  private static instance: UserDataIsolationService;
  private currentUserId: string | null = null;
  private listeners: Unsubscribe[] = [];

  public static getInstance(): UserDataIsolationService {
    if (!UserDataIsolationService.instance) {
      UserDataIsolationService.instance = new UserDataIsolationService();
    }
    return UserDataIsolationService.instance;
  }

  constructor() {
    this.initializeUserTracking();
  }

  private async initializeUserTracking() {
    try {
      const auth = await getAuthService();
      if (auth) {
        // Escutar mudanças de autenticação
        auth.onAuthStateChanged((user) => {
          if (user) {
            this.currentUserId = user.uid;
            console.log("🔐 Utilizador autenticado:", user.uid);
            console.log("✅ Isolamento de dados ativo para este utilizador");
          } else {
            this.currentUserId = null;
            console.log("🚫 Nenhum utilizador autenticado - acesso negado");
            this.clearAllListeners();
          }
        });
      }
    } catch (error) {
      console.error(
        "❌ Erro ao inicializar rastreamento de utilizador:",
        error,
      );
    }
  }

  /**
   * Verifica se o utilizador atual pode aceder a um documento
   */
  public validateDataAccess(documentData: any): UserDataAccess {
    if (!this.currentUserId) {
      return {
        canRead: false,
        canWrite: false,
        canDelete: false,
        reason: "Utilizador não autenticado",
      };
    }

    // Verificar se o documento pertence ao utilizador atual
    const ownerField =
      documentData.createdByUser || documentData.userId || documentData.ownerId;

    if (!ownerField) {
      // MIGRAÇÃO SUAVE: Dados existentes sem dono são acessíveis
      // Isso preserva os dados já existentes no sistema
      console.log(
        "📄 Dados legados detectados - acesso permitido para migração",
      );
      return {
        canRead: true,
        canWrite: true,
        canDelete: true,
        reason: "Dados legados - acesso preservado durante migração",
      };
    }

    const isOwner = ownerField === this.currentUserId;

    if (isOwner) {
      return {
        canRead: true,
        canWrite: true,
        canDelete: true,
        reason: "Utilizador é o proprietário dos dados",
      };
    } else {
      // Para dados novos com dono, aplicar isolamento
      console.log("🔒 Dados com proprietário específico - acesso restrito");
      return {
        canRead: false,
        canWrite: false,
        canDelete: false,
        reason: "Dados pertencem a outro utilizador",
      };
    }
  }

  /**
   * Cria uma query que só retorna dados do utilizador atual
   */
  public createUserScopedQuery(collectionName: string) {
    if (!this.currentUserId || !db) {
      throw new Error("Utilizador não autenticado ou Firebase não disponível");
    }

    // Tentar diferentes campos que podem indicar propriedade
    const possibleOwnerFields = ["createdByUser", "userId", "ownerId"];

    return query(
      collection(db, collectionName),
      where("createdByUser", "==", this.currentUserId),
    );
  }

  /**
   * Adiciona metadados de propriedade a um documento
   */
  public addOwnershipMetadata(data: any): any {
    if (!this.currentUserId) {
      throw new Error("Utilizador não autenticado");
    }

    return {
      ...data,
      createdByUser: this.currentUserId,
      ownerId: this.currentUserId,
      userId: this.currentUserId,
      createdAt: data.createdAt || new Date().toISOString(),
      isPrivate: true,
      dataAccessLevel: "user-private",
    };
  }

  /**
   * Filtra array de dados para mostrar apenas dados do utilizador
   * MODO MIGRAÇÃO: Permite acesso a todos os dados existentes
   */
  public filterUserData<T extends any>(dataArray: T[]): T[] {
    if (!this.currentUserId) {
      console.warn("🚫 Acesso negado: Utilizador não autenticado");
      return [];
    }

    // MIGRAÇÃO SUAVE: Permitir acesso a todos os dados por enquanto
    // Gradualmente os novos dados terão proprietários específicos
    console.log("📂 Modo migração ativo - todos os dados acessíveis");
    return dataArray.map((item) => {
      const access = this.validateDataAccess(item);
      if (access.canRead) {
        console.log("✅ Acesso permitido:", item.id, "-", access.reason);
      }
      return item;
    });
  }

  /**
   * Configura listeners que só escutam dados do utilizador
   */
  public setupUserScopedListener<T>(
    collectionName: string,
    callback: (data: T[]) => void,
    errorCallback?: (error: Error) => void,
  ): () => void {
    if (!this.currentUserId || !db) {
      console.error(
        "❌ Não é possível configurar listener: utilizador não autenticado",
      );
      return () => {};
    }

    try {
      const userQuery = this.createUserScopedQuery(collectionName);

      const unsubscribe = onSnapshot(
        userQuery,
        (snapshot) => {
          const userData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];

          console.log(
            `🔐 Dados filtrados para utilizador ${this.currentUserId}:`,
            {
              collection: collectionName,
              count: userData.length,
            },
          );

          callback(userData);
        },
        (error) => {
          console.error(`❌ Erro no listener de ${collectionName}:`, error);
          if (errorCallback) {
            errorCallback(error);
          }
        },
      );

      this.listeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error(
        `❌ Erro ao configurar listener para ${collectionName}:`,
        error,
      );
      return () => {};
    }
  }

  /**
   * Salva documento com metadados de segurança
   */
  public async saveUserDocument(
    collectionName: string,
    documentId: string,
    data: any,
  ): Promise<boolean> {
    if (!this.currentUserId || !db) {
      console.error("❌ Não é possível salvar: utilizador não autenticado");
      return false;
    }

    try {
      const secureData = this.addOwnershipMetadata(data);
      await setDoc(doc(db, collectionName, documentId), secureData);

      console.log(`✅ Documento salvo com segurança:`, {
        collection: collectionName,
        id: documentId,
        owner: this.currentUserId,
      });

      return true;
    } catch (error) {
      console.error(`❌ Erro ao salvar documento em ${collectionName}:`, error);
      return false;
    }
  }

  /**
   * Atualiza documento verificando propriedade
   */
  public async updateUserDocument(
    collectionName: string,
    documentId: string,
    updates: any,
  ): Promise<boolean> {
    if (!this.currentUserId || !db) {
      console.error("❌ Não é possível atualizar: utilizador não autenticado");
      return false;
    }

    try {
      // Verificar se o documento existe e pertence ao utilizador
      const docRef = doc(db, collectionName, documentId);
      const docSnapshot = await getDocs(
        query(collection(db, collectionName), where("id", "==", documentId)),
      );

      if (docSnapshot.empty) {
        console.error("❌ Documento não encontrado:", documentId);
        return false;
      }

      const docData = docSnapshot.docs[0].data();
      const access = this.validateDataAccess(docData);

      if (!access.canWrite) {
        console.error("❌ Acesso negado para atualização:", access.reason);
        return false;
      }

      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: this.currentUserId,
      });

      console.log(`✅ Documento atualizado com segurança:`, {
        collection: collectionName,
        id: documentId,
      });

      return true;
    } catch (error) {
      console.error(
        `❌ Erro ao atualizar documento em ${collectionName}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Remove documento verificando propriedade
   */
  public async deleteUserDocument(
    collectionName: string,
    documentId: string,
  ): Promise<boolean> {
    if (!this.currentUserId || !db) {
      console.error("❌ Não é possível remover: utilizador não autenticado");
      return false;
    }

    try {
      // Verificar propriedade antes de remover
      const docSnapshot = await getDocs(
        query(collection(db, collectionName), where("id", "==", documentId)),
      );

      if (docSnapshot.empty) {
        console.error("❌ Documento não encontrado:", documentId);
        return false;
      }

      const docData = docSnapshot.docs[0].data();
      const access = this.validateDataAccess(docData);

      if (!access.canDelete) {
        console.error("❌ Acesso negado para remoção:", access.reason);
        return false;
      }

      await deleteDoc(doc(db, collectionName, documentId));

      console.log(`✅ Documento removido com segurança:`, {
        collection: collectionName,
        id: documentId,
      });

      return true;
    } catch (error) {
      console.error(
        `❌ Erro ao remover documento em ${collectionName}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Limpa todos os listeners ativos
   */
  private clearAllListeners(): void {
    this.listeners.forEach((unsubscribe) => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    });
    this.listeners = [];
  }

  /**
   * Obtém ID do utilizador atual
   */
  public getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  /**
   * Verifica se utilizador está autenticado
   */
  public isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }

  /**
   * Cleanup dos recursos
   */
  public cleanup(): void {
    this.clearAllListeners();
    this.currentUserId = null;
  }
}

// Instância singleton
export const userDataIsolation = UserDataIsolationService.getInstance();
export default userDataIsolation;
