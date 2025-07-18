// Serviço Firestore simplificado usando REST API
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
  timestamp?: string;
  userId?: string;
}

// Classe simplificada usando REST API
export class FirestoreDataServiceRest {
  private static instance: FirestoreDataServiceRest;

  private constructor() {
    // REST API não precisa inicialização
  }

  // Singleton para garantir uma única instância
  public static getInstance(): FirestoreDataServiceRest {
    if (!FirestoreDataServiceRest.instance) {
      FirestoreDataServiceRest.instance = new FirestoreDataServiceRest();
    }
    return FirestoreDataServiceRest.instance;
  }

  // Salvar dados de login (sem senha por segurança)
  async saveLoginData(formData: LoginFormData): Promise<string | null> {
    try {
      // Preparar dados seguros (sem senha)
      const safeData = {
        email: formData.email,
        rememberMe: formData.rememberMe || false,
        timestamp: new Date().toISOString(),
        loginAttempt: true,
        userAgent: navigator.userAgent,
        ip: "unknown",
      };

      const docId = await saveToFirestoreRest("login_attempts", safeData);

      if (docId) {
        console.log("✅ Login data salva no Firestore via REST:", docId);
        return docId;
      } else {
        console.warn("⚠️ Não foi possível salvar login data via REST");
        return null;
      }
    } catch (error) {
      console.warn("⚠️ Erro ao salvar login data via REST:", error);
      return null;
    }
  }

  // Teste de conexão simples
  async testConnection(): Promise<boolean> {
    try {
      // Tentar ler uma coleção de teste
      const testData = await readFromFirestoreRest("system_tests");
      console.log("✅ Conexão REST API Firestore funcionando");
      return true;
    } catch (error) {
      console.warn("⚠️ Teste de conexão REST API falhou:", error);
      return false;
    }
  }
}

// Instância singleton
const firestoreServiceRest = FirestoreDataServiceRest.getInstance();

// Funções de conveniência
export const saveLoginAttempt = (formData: LoginFormData) => {
  return firestoreServiceRest.saveLoginData(formData);
};

export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    return await firestoreServiceRest.testConnection();
  } catch (error) {
    console.warn("⚠️ Erro no teste de conexão Firestore:", error);
    return false;
  }
};

// Export da instância
export { firestoreServiceRest };
