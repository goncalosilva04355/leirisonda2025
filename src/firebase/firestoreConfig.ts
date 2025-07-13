// Configuração Firestore simplificada para evitar erros getImmediate
import { getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseApp, getFirebaseAppAsync } from "./basicConfig";

// Variável para armazenar a instância do Firestore
let firestoreInstance: Firestore | null = null;
let initPromise: Promise<Firestore | null> | null = null;

// Função simples para inicializar Firestore sem erros
function safeInitializeFirestore(): Firestore | null {
  try {
    // Verificar se já temos uma instância válida
    if (firestoreInstance) {
      return firestoreInstance;
    }

    // Obter Firebase App
    const app = getFirebaseApp();
    if (!app) {
      console.log("📱 Firebase App não disponível - modo local ativo");
      return null;
    }

    // Tentar inicializar Firestore de forma segura
    firestoreInstance = getFirestore(app);
    console.log("✅ Firestore: Inicializado com sucesso");
    return firestoreInstance;
  } catch (error: any) {
    console.warn("⚠️ Firestore não disponível:", error.message || error);
    return null;
  }
}

// Função assíncrona para inicializar Firestore
async function initializeFirestoreAsync(): Promise<Firestore | null> {
  // Se já estamos inicializando, retornar a promise existente
  if (initPromise) {
    return initPromise;
  }

  // Se já temos instância, retorná-la
  if (firestoreInstance) {
    return firestoreInstance;
  }

  initPromise = (async () => {
    try {
      // Aguardar Firebase App estar pronto
      const app = await getFirebaseAppAsync();
      if (!app) {
        return null;
      }

      // Aguardar um pouco para garantir que a app está estável
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Inicializar Firestore
      firestoreInstance = getFirestore(app);
      console.log("✅ Firestore: Inicializado de forma assíncrona");
      return firestoreInstance;
    } catch (error: any) {
      console.warn("⚠️ Firestore async init failed:", error.message || error);
      return null;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

// Função principal para obter Firestore
export function getFirebaseFirestore(): Firestore | null {
  return safeInitializeFirestore();
}

// Função assíncrona para obter Firestore
export async function getFirebaseFirestoreAsync(): Promise<Firestore | null> {
  return await initializeFirestoreAsync();
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

// Exportações
export { firestoreInstance };
export default firestoreInstance;
