// Helper para inicialização robusta do Firebase e Firestore
import { getFirebaseAppAsync } from "./basicConfig";
import { getFirebaseFirestoreAsync } from "./firestoreConfig";

// Status da inicialização
interface InitializationStatus {
  firebase: boolean;
  firestore: boolean;
  error?: string;
}

let initializationStatus: InitializationStatus = {
  firebase: false,
  firestore: false,
};

let initializationPromise: Promise<InitializationStatus> | null = null;

// Função para inicializar Firebase e Firestore de forma sequencial e robusta
export async function initializeFirebaseComplete(): Promise<InitializationStatus> {
  // Se já estamos inicializando, retornar a promise existente
  if (initializationPromise) {
    return initializationPromise;
  }

  // Se já está inicializado, retornar status
  if (initializationStatus.firebase && initializationStatus.firestore) {
    return initializationStatus;
  }

  initializationPromise = (async () => {
    try {
      console.log("🚀 Iniciando inicialização completa do Firebase...");

      // Passo 1: Inicializar Firebase App
      console.log("📱 Passo 1: Inicializando Firebase App...");
      const firebaseApp = await getFirebaseAppAsync();

      if (!firebaseApp) {
        console.error("❌ Firebase App não conseguiu ser inicializada");
        initializationStatus = {
          firebase: false,
          firestore: false,
          error: "Firebase App falhou na inicialização",
        };
        return initializationStatus;
      }

      console.log("✅ Passo 1: Firebase App inicializada com sucesso");
      initializationStatus.firebase = true;

      // Aguardar um pouco para garantir estabilidade
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Passo 2: Inicializar Firestore
      console.log("🔥 Passo 2: Inicializando Firestore...");
      const firestore = await getFirebaseFirestoreAsync();

      if (!firestore) {
        console.error("❌ Firestore não conseguiu ser inicializado");
        initializationStatus = {
          firebase: true,
          firestore: false,
          error: "Firestore falhou na inicialização",
        };
        return initializationStatus;
      }

      console.log("✅ Passo 2: Firestore inicializado com sucesso");
      initializationStatus.firestore = true;

      console.log(
        "🎉 Inicialização completa do Firebase concluída com sucesso!",
      );

      // Status final
      initializationStatus = {
        firebase: true,
        firestore: true,
      };

      return initializationStatus;
    } catch (error: any) {
      console.error("❌ Erro na inicialização completa do Firebase:", error);
      initializationStatus = {
        firebase: false,
        firestore: false,
        error: error.message || "Erro desconhecido na inicialização",
      };
      return initializationStatus;
    } finally {
      // Limpar promise
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

// Função para obter status atual
export function getInitializationStatus(): InitializationStatus {
  return initializationStatus;
}

// Função para verificar se está pronto para uso
export function isFirebaseCompletelyReady(): boolean {
  return initializationStatus.firebase && initializationStatus.firestore;
}

// Função para aguardar inicialização completa
export async function waitForFirebaseReady(
  maxWaitTime: number = 30000,
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    if (isFirebaseCompletelyReady()) {
      return true;
    }

    // Se não está inicializando, tentar inicializar
    if (!initializationPromise) {
      initializeFirebaseComplete();
    }

    // Aguardar um pouco antes de verificar novamente
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.warn("⚠️ Timeout aguardando Firebase estar pronto");
  return false;
}

// Auto-inicialização quando o módulo é importado
setTimeout(() => {
  initializeFirebaseComplete().catch((error) => {
    console.error("❌ Erro na auto-inicialização do Firebase:", error);
  });
}, 1000);
