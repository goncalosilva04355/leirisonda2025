// Serviço para gravação de dados no Firebase Firestore via REST API
import {
  saveToFirestoreRest,
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "../utils/firestoreRestApi";

// Interface para os dados do formulário de login
interface LoginFormData {
  email: string;
  password?: string; // Opcional por segurança - não gravar senhas
  rememberMe?: boolean;
  timestamp?: Timestamp;
  userId?: string;
}

// Interface genérica para dados do formulário
interface FormData {
  [key: string]: any;
  timestamp?: Timestamp;
}

// Classe principal do serviço usando REST API
export class FirestoreDataService {
  private static instance: FirestoreDataService;
  private warningShown: boolean = false;

  private constructor() {
    // REST API não precisa inicialização
  }

  // Singleton para garantir uma única instância
  public static getInstance(): FirestoreDataService {
    if (!FirestoreDataService.instance) {
      FirestoreDataService.instance = new FirestoreDataService();
    }
    return FirestoreDataService.instance;
  }

  // REST API está sempre disponível
  private async isAvailable(): Promise<boolean> {
    return true; // REST API não depende de inicialização SDK
  }

  // Gravar dados de login (sem senha por segurança)
  async saveLoginData(formData: LoginFormData): Promise<string | null> {
    if (!(await this.isAvailable())) {
      // Silenciosamente retorna null - o aviso já foi mostrado em isAvailable()
      return null;
    }

    try {
      // Preparar dados seguros (sem senha)
      const safeData = {
        email: formData.email,
        rememberMe: formData.rememberMe || false,
        timestamp: serverTimestamp(),
        loginAttempt: true,
        userAgent: navigator.userAgent,
        ip: "unknown", // Pode ser obtido via API externa se necessário
      };

      // Gravar na coleção "login_attempts"
      const docRef = await addDoc(
        collection(this.db, "login_attempts"),
        safeData,
      );

      console.log("✅ Dados de login gravados com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Erro ao gravar dados de login:", error);
      return null;
    }
  }

  // Gravar dados genéricos de formulário
  async saveFormData(
    collectionName: string,
    formData: FormData,
    documentId?: string,
  ): Promise<string | null> {
    if (!(await this.isAvailable())) {
      // Silenciosamente retorna null - fallback para localStorage será usado
      return null;
    }

    try {
      // Adicionar timestamp automático
      const dataWithTimestamp = {
        ...formData,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      let docRef: any;

      if (documentId) {
        // Usar ID específico
        await setDoc(
          doc(this.db, collectionName, documentId),
          dataWithTimestamp,
        );
        docRef = { id: documentId };
        console.log(
          `✅ Dados gravados na coleção "${collectionName}" com ID: ${documentId}`,
        );
      } else {
        // Gerar ID automático
        docRef = await addDoc(
          collection(this.db, collectionName),
          dataWithTimestamp,
        );
        console.log(
          `✅ Dados gravados na coleção "${collectionName}" com ID: ${docRef.id}`,
        );
      }

      return docRef.id;
    } catch (error) {
      console.error(
        `❌ Erro ao gravar dados na coleção "${collectionName}":`,
        error,
      );
      return null;
    }
  }

  // Atualizar documento existente
  async updateFormData(
    collectionName: string,
    documentId: string,
    updates: FormData,
  ): Promise<boolean> {
    if (!this.isAvailable()) {
      console.warn("⚠️ Firestore não disponível - dados não atualizados");
      return false;
    }

    try {
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(this.db, collectionName, documentId), updateData);
      console.log(
        `✅ Documento ${documentId} atualizado na coleção "${collectionName}"`,
      );
      return true;
    } catch (error) {
      console.error(
        `❌ Erro ao atualizar documento na coleção "${collectionName}":`,
        error,
      );
      return false;
    }
  }

  // Ler documento específico
  async getDocument(
    collectionName: string,
    documentId: string,
  ): Promise<any | null> {
    if (!this.isAvailable()) {
      console.warn(
        "⚠️ Firestore não disponível - não foi possível ler documento",
      );
      return null;
    }

    try {
      const docSnap = await getDoc(doc(this.db, collectionName, documentId));

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(
          `✅ Documento ${documentId} lido da coleção "${collectionName}"`,
        );
        return { id: docSnap.id, ...data };
      } else {
        console.log(
          `📭 Documento ${documentId} não encontrado na coleção "${collectionName}"`,
        );
        return null;
      }
    } catch (error) {
      console.error(
        `❌ Erro ao ler documento da coleção "${collectionName}":`,
        error,
      );
      return null;
    }
  }

  // Ler todos os documentos de uma coleção
  async getCollection(collectionName: string): Promise<any[]> {
    if (!this.isAvailable()) {
      console.warn(
        "⚠️ Firestore não disponível - não foi possível ler coleção",
      );
      return [];
    }

    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      const documents: any[] = [];

      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      console.log(
        `✅ ${documents.length} documentos lidos da coleção "${collectionName}"`,
      );
      return documents;
    } catch (error) {
      console.error(`❌ Erro ao ler coleção "${collectionName}":`, error);
      return [];
    }
  }

  // Eliminar documento
  async deleteDocument(
    collectionName: string,
    documentId: string,
  ): Promise<boolean> {
    if (!this.isAvailable()) {
      console.warn("⚠️ Firestore não disponível - documento não eliminado");
      return false;
    }

    try {
      await deleteDoc(doc(this.db, collectionName, documentId));
      console.log(
        `✅ Documento ${documentId} eliminado da coleção "${collectionName}"`,
      );
      return true;
    } catch (error) {
      console.error(
        `❌ Erro ao eliminar documento da coleção "${collectionName}":`,
        error,
      );
      return false;
    }
  }

  // Método de teste para verificar conectividade
  async testConnection(): Promise<boolean> {
    if (!(await this.isAvailable())) {
      // Para teste, mostramos uma mensagem mais detalhada
      console.info(
        "🔍 Firestore não disponível para teste - localStorage está funcionando",
      );
      return false;
    }

    try {
      // Tentar gravar e ler um documento de teste
      const testData = {
        test: true,
        timestamp: serverTimestamp(),
        message: "Teste de conectividade Firestore",
      };

      const docRef = await addDoc(
        collection(this.db, "test_connection"),
        testData,
      );
      console.log("✅ Teste de escrita bem-sucedido, ID:", docRef.id);

      // Ler o documento criado
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("✅ Teste de leitura bem-sucedido");

        // Limpar documento de teste
        await deleteDoc(docRef);
        console.log("✅ Documento de teste eliminado");

        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Teste de conectividade falhou:", error);
      return false;
    }
  }
}

// Export da instância singleton
export const firestoreService = FirestoreDataService.getInstance();

// Funções auxiliares para facilitar o uso
export const saveLoginAttempt = (formData: LoginFormData) => {
  return firestoreService.saveLoginData(formData);
};

export const saveFormToFirestore = (
  collectionName: string,
  formData: FormData,
  documentId?: string,
) => {
  return firestoreService.saveFormData(collectionName, formData, documentId);
};

export const updateFirestoreDocument = (
  collectionName: string,
  documentId: string,
  updates: FormData,
) => {
  return firestoreService.updateFormData(collectionName, documentId, updates);
};

export const getFirestoreDocument = (
  collectionName: string,
  documentId: string,
) => {
  return firestoreService.getDocument(collectionName, documentId);
};

export const getFirestoreCollection = (collectionName: string) => {
  return firestoreService.getCollection(collectionName);
};

export const deleteFirestoreDocument = (
  collectionName: string,
  documentId: string,
) => {
  return firestoreService.deleteDocument(collectionName, documentId);
};

// Função segura para teste de conexão Firestore
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    return await firestoreService.testConnection();
  } catch (error) {
    console.warn("⚠️ Erro no teste de conexão Firestore:", error);
    return false;
  }
};
