// Passo 3: Configuração Firestore - base de dados na nuvem
import { getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseApp } from "./basicConfig";

// Variável para armazenar a instância do Firestore
let firestoreInstance: Firestore | null = null;

// Função robusta para inicializar Firestore com verificações de estado
function initializeFirestore(): Firestore | null {
  try {
    // Verificar se já temos uma instância válida
    if (firestoreInstance) {
      console.log("✅ Firestore: Instância existente válida");
      return firestoreInstance;
    }

    const app = getFirebaseApp();

    if (!app) {
      console.warn("⚠️ Firebase App não disponível ainda para Firestore");
      return null;
    }

    // Verificar se a app não foi deletada
    try {
      // Teste simples para verificar se a app é válida
      const projectId = app.options.projectId;
      if (!projectId) {
        console.warn("⚠️ Firebase App inválida (sem projectId)");
        return null;
      }
    } catch (appError) {
      console.warn("⚠️ Firebase App não é válida:", appError);
      return null;
    }

    // Inicializar Firestore apenas se a app for válida
    try {
      firestoreInstance = getFirestore(app);
      console.log("✅ Firestore: Inicializado com sucesso");
      console.log("🔥 Firestore sempre ativo - dados sincronizados");
      return firestoreInstance;
    } catch (firestoreError: any) {
      console.error(
        "❌ Firestore: Erro específico na inicialização:",
        firestoreError,
      );

      // Se for erro de app deletada, limpar referência
      if (firestoreError.code === "app/app-deleted") {
        console.log("🧹 Firestore: App foi deletada, limpando referência");
        firestoreInstance = null;
      }

      return null;
    }
  } catch (error: any) {
    console.error("❌ Firestore: Erro geral na inicialização:", error);
    return null;
  }
}

// Função para obter o Firestore
export function getFirebaseFirestore(): Firestore | null {
  if (!firestoreInstance) {
    return initializeFirestore();
  }
  return firestoreInstance;
}

// Função para verificar se Firestore está pronto
export function isFirestoreReady(): boolean {
  return firestoreInstance !== null;
}

// Função de teste simples para Firestore
export async function testFirestore(): Promise<boolean> {
  try {
    const db = getFirebaseFirestore();
    if (!db) {
      console.log("📱 Firestore não disponível - modo local ativo");
      return false;
    }

    console.log("✅ Firestore disponível e pronto para uso");
    return true;
  } catch (error) {
    console.warn("⚠️ Teste Firestore falhou:", error);
    return false;
  }
}

// Inicializar Firestore automaticamente após um pequeno delay
setTimeout(() => {
  initializeFirestore();
}, 800);

// Exportações
export { firestoreInstance };
export default firestoreInstance;
