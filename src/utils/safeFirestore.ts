// Getter seguro para Firestore que evita erros getImmediate
import {
  getRobustFirestore,
  initializeFirebaseRobust,
  isRobustFirebaseReady,
} from "./firebaseRobustFix";

let cachedFirestore: any = null;
let isInitializing = false;

// Função segura para obter Firestore
export async function getSafeFirestore() {
  // Se já temos uma instância em cache, usar essa
  if (cachedFirestore) {
    return cachedFirestore;
  }

  // Verificar se já está inicializado pela versão robusta
  if (isRobustFirebaseReady()) {
    cachedFirestore = getRobustFirestore();
    return cachedFirestore;
  }

  // Se está a inicializar, aguardar
  if (isInitializing) {
    console.log("⏳ Aguardando inicialização em curso...");

    // Aguardar até 5 segundos pela inicialização
    for (let i = 0; i < 50; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (isRobustFirebaseReady()) {
        cachedFirestore = getRobustFirestore();
        return cachedFirestore;
      }
    }

    console.warn("⚠️ Timeout na inicialização");
    return null;
  }

  // Inicializar se necessário
  console.log("🔧 Inicializando Firestore de forma segura...");
  isInitializing = true;

  try {
    const { firestore } = await initializeFirebaseRobust();

    if (firestore) {
      cachedFirestore = firestore;
      console.log("✅ Firestore seguro inicializado");
    } else {
      console.error("❌ Falha na inicialização segura do Firestore");
    }

    return cachedFirestore;
  } catch (error) {
    console.error("❌ Erro na inicialização segura:", error);
    return null;
  } finally {
    isInitializing = false;
  }
}

// Função que garante que Firestore está disponível antes de usar
export async function withSafeFirestore<T>(
  callback: (db: any) => Promise<T>,
  fallback?: T,
): Promise<T | null> {
  try {
    const db = await getSafeFirestore();

    if (!db) {
      console.warn("⚠️ Firestore não disponível, usando fallback");
      return fallback ?? null;
    }

    return await callback(db);
  } catch (error) {
    console.error("❌ Erro na operação Firestore:", error);
    return fallback ?? null;
  }
}

// Função de verificação rápida
export function isSafeFirestoreReady(): boolean {
  return cachedFirestore !== null || isRobustFirebaseReady();
}

// Reset em caso de problemas
export function resetSafeFirestore() {
  console.log("🔄 Reset do Firestore seguro");
  cachedFirestore = null;
  isInitializing = false;
}
