// Passo 1: Configuração básica do Firebase
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { isPrivateBrowsing } from "../utils/storageUtils";
import { getFirebaseConfig } from "../config/firebaseEnv";

// Configuração do Firebase usando helper centralizado
const firebaseConfig = getFirebaseConfig();

// Variável para armazenar a instância do Firebase
let firebaseApp: FirebaseApp | null = null;
let initializationPromise: Promise<FirebaseApp | null> | null = null;

// Função assíncrona robusta para inicializar Firebase
async function initializeFirebaseBasic(): Promise<FirebaseApp | null> {
  // Se já estamos inicializando, retornar a promise existente
  if (initializationPromise) {
    return initializationPromise;
  }

  // Se já temos uma app válida, retorná-la
  if (firebaseApp) {
    try {
      const apps = getApps();
      if (apps.find((app) => app === firebaseApp)) {
        console.log("✅ Firebase: App existente e válida");
        return firebaseApp;
      }
    } catch (error) {
      console.warn("⚠️ Firebase: App existente inválida, reinicializando");
      firebaseApp = null;
    }
  }

  // Criar promise de inicialização
  initializationPromise = (async () => {
    try {
      // Verificar se estamos em modo privado
      if (isPrivateBrowsing()) {
        console.warn(
          "🔒 Modo privado detectado - Firebase pode ter limitações",
        );
      }

      // Verificar se já existe uma app válida
      const existingApps = getApps();

      if (existingApps.length > 0) {
        // Verificar se a app existente é realmente válida
        const existingApp = existingApps[0];
        try {
          // Teste simples para verificar se a app não foi deletada
          const projectId = existingApp.options?.projectId;
          if (projectId) {
            firebaseApp = existingApp;
            console.log("✅ Firebase: App existente válida reutilizada");
          } else {
            throw new Error("App sem projectId");
          }
        } catch (validationError) {
          console.warn(
            "⚠️ App existente inválida, criando nova:",
            validationError,
          );
          // Criar nova app sem deletar a existente
          firebaseApp = initializeApp(firebaseConfig);
          console.log("✅ Firebase: Nova app criada");
        }
      } else {
        // Criar nova app apenas se não existir nenhuma
        firebaseApp = initializeApp(firebaseConfig);
        console.log("✅ Firebase: Nova app inicializada");
      }

      // Aguardar um pouco para app estar completamente pronta
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("🔥 Firebase sempre ativo - sincronização garantida");
      return firebaseApp;
    } catch (error: any) {
      console.error("❌ Firebase: Erro na inicialização:", error);
      firebaseApp = null;

      // Se for erro de app já existir, tentar usar a existente
      if (error.code === "app/duplicate-app") {
        const apps = getApps();
        if (apps.length > 0) {
          firebaseApp = apps[0];
          console.log("✅ Firebase: App duplicada resolvida, usando existente");
          return firebaseApp;
        }
      }

      return null;
    } finally {
      // Limpar promise após conclusão
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

// Versão síncrona para compatibilidade com código existente
function initializeFirebaseBasicSync(): FirebaseApp | null {
  if (firebaseApp) {
    return firebaseApp;
  }

  // Tentar inicialização assíncrona e retornar null se não estiver pronta
  initializeFirebaseBasic()
    .then((app) => {
      firebaseApp = app;
    })
    .catch((error) => {
      console.error("❌ Firebase: Erro na inicialização assíncrona:", error);
    });

  return firebaseApp;
}

// Função robusta para obter a app Firebase (síncrona)
export function getFirebaseApp(): FirebaseApp | null {
  // Se não temos app, tentar inicializar de forma síncrona
  if (!firebaseApp) {
    return initializeFirebaseBasicSync();
  }

  // Verificar se a app ainda é válida
  try {
    // Teste mais robusto para verificar se a app é válida
    const projectId = firebaseApp.options?.projectId;
    if (!projectId) {
      console.warn("⚠️ Firebase: App sem projectId, considerada inválida");
      firebaseApp = null;
      return initializeFirebaseBasicSync();
    }

    // Verificar se a app está na lista de apps
    const apps = getApps();
    if (!apps.find((app) => app === firebaseApp)) {
      console.warn("⚠️ Firebase: App não encontrada na lista, reinicializando");
      firebaseApp = null;
      return initializeFirebaseBasicSync();
    }

    return firebaseApp;
  } catch (error: any) {
    // Se for erro de app deletada, limpar referência
    if (error.code === "app/app-deleted") {
      console.warn("⚠️ Firebase: App foi deletada, limpando referência");
      firebaseApp = null;
      return initializeFirebaseBasicSync();
    }

    console.warn(
      "⚠️ Firebase: Erro ao verificar app, mas retornando existente:",
      error,
    );
    return firebaseApp; // Retornar a app mesmo com erro de verificação
  }
}

// Função assíncrona para obter a app Firebase
export async function getFirebaseAppAsync(): Promise<FirebaseApp | null> {
  return await initializeFirebaseBasic();
}

// Função para verificar se Firebase está pronto
export function isFirebaseReady(): boolean {
  return firebaseApp !== null;
}

// Inicialização lazy - apenas quando necessário
// initializeFirebaseBasic(); // Removido para evitar conflitos

// Exportações para compatibilidade com código existente
export const app = firebaseApp;

// Função para obter db seguro
export function getDB() {
  try {
    const firestoreInstance = getFirebaseFirestore();
    if (firestoreInstance) {
      return firestoreInstance;
    }
  } catch (error) {
    console.warn("⚠️ Firestore não disponível:", error);
  }
  return null;
}

// Função para verificar se Firestore está disponível antes de usar
export function withFirestore<T>(
  callback: (db: any) => T,
  fallback?: T,
): T | null {
  const firestoreDb = getDB();
  if (firestoreDb) {
    try {
      return callback(firestoreDb);
    } catch (error) {
      console.warn("⚠️ Erro ao executar operação Firestore:", error);
      return fallback ?? null;
    }
  }
  console.warn("⚠️ Firestore não disponível - operação ignorada");
  return fallback ?? null;
}

// Export db como instância (pode ser null)
export const db = getDB();

// Função para obter auth seguro
export function getAuth() {
  try {
    const authInstance = getFirebaseAuth();
    if (authInstance) {
      return authInstance;
    }
  } catch (error) {
    console.warn("⚠️ Firebase Auth não disponível:", error);
  }
  return null;
}

// Export auth como função
export const auth = getAuth();

// Importar Auth do Passo 2
import { getFirebaseAuth, isFirebaseAuthReady } from "./authConfig";
// Importar Firestore do Passo 3
import {
  getFirebaseFirestore,
  isFirestoreReady,
  testFirestore,
} from "./firestoreConfig";
// Importar status do simpleConfig
import { getFirebaseStatus } from "./simpleConfig";

// Funções de compatibilidade
export const getDBAsync = () => Promise.resolve(getFirebaseFirestore());
export const getAuthService = () => Promise.resolve(getFirebaseAuth());
export const attemptFirestoreInit = () =>
  Promise.resolve(getFirebaseFirestore());
export const waitForFirebaseInit = () => Promise.resolve(true);
export const isFirebaseAuthAvailable = () => isFirebaseAuthReady();
export const isFirebaseFirestoreAvailable = () => isFirestoreReady();
export const testFirebaseFirestore = testFirestore;
export { getFirebaseFirestore, isFirestoreReady, getFirebaseStatus };

export default firebaseApp;
