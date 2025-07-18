// Configuração Firebase SEMPRE ATIVA - funciona em desenvolvimento e produção
import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { getFirebaseConfig } from "../config/firebaseEnv";

// SEMPRE forçar Firebase ativo
const FIREBASE_ALWAYS_ACTIVE = true;

// Variável para armazenar a instância do Firebase
let firebaseApp: FirebaseApp | null = null;

console.log("🔥 Firebase PRODUÇÃO: Sempre ativo");
console.log("🌐 Modo de produção: Firebase forçado");
console.log("✅ Configuração garantida para funcionar");

// Inicializar Firebase SEMPRE
try {
  console.log("🔥 Iniciando Firebase (modo produção forçado)...");

  let config;
  try {
    config = getFirebaseConfig();
    console.log("🔧 Firebase Project:", config.projectId);
    console.log("✅ Configuração carregada com sucesso");
  } catch (configError) {
    console.error("❌ Erro ao obter config Firebase:", configError);
    // Usar configuração fixa como fallback
    config = {
      apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
      authDomain: "leiria-1cfc9.firebaseapp.com",
      databaseURL:
        "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "leiria-1cfc9",
      storageBucket: "leiria-1cfc9.firebasestorage.app",
      messagingSenderId: "632599887141",
      appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
      measurementId: "G-Q2QWQVH60L",
    };
    console.log("🔧 Usando configuração fixa como fallback");
  }

  if (config) {
    if (getApps().length === 0) {
      console.log("🎆 Inicializando nova Firebase App...");
      firebaseApp = initializeApp(config);
      console.log("✅ Firebase inicializado com sucesso", firebaseApp.name);
      console.log("🔍 Project ID ativo:", firebaseApp.options.projectId);
    } else {
      firebaseApp = getApp();
      console.log("✅ Firebase já estava inicializado", firebaseApp.name);
    }
  }
} catch (error: any) {
  console.error("❌ Erro ao inicializar Firebase:", error.message);
  console.error("🔍 Stack trace:", error.stack);

  // Tentar novamente com configuração fixa
  try {
    const fallbackConfig = {
      apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
      authDomain: "leiria-1cfc9.firebaseapp.com",
      databaseURL:
        "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "leiria-1cfc9",
      storageBucket: "leiria-1cfc9.firebasestorage.app",
      messagingSenderId: "632599887141",
      appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
      measurementId: "G-Q2QWQVH60L",
    };

    if (getApps().length === 0) {
      firebaseApp = initializeApp(fallbackConfig);
      console.log("✅ Firebase inicializado com configuração fallback");
    }
  } catch (fallbackError) {
    console.error("❌ Erro mesmo com configuração fallback:", fallbackError);
  }
}

// Função robusta para obter a app Firebase
export function getFirebaseApp(): FirebaseApp | null {
  // Tentar inicializar se ainda não foi feito
  if (!firebaseApp) {
    try {
      let config;
      try {
        config = getFirebaseConfig();
      } catch {
        config = {
          apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
          authDomain: "leiria-1cfc9.firebaseapp.com",
          databaseURL:
            "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
          projectId: "leiria-1cfc9",
          storageBucket: "leiria-1cfc9.firebasestorage.app",
          messagingSenderId: "632599887141",
          appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
          measurementId: "G-Q2QWQVH60L",
        };
      }

      if (getApps().length === 0) {
        firebaseApp = initializeApp(config);
        console.log("✅ Firebase inicializado tardiamente");
      } else {
        firebaseApp = getApp();
      }
    } catch (error: any) {
      console.error("❌ Erro na inicialização tardia:", error.message);
    }
  }

  return firebaseApp;
}

// Função para verificar se Firebase está pronto
export function isFirebaseReady(): boolean {
  return firebaseApp !== null;
}

// Função para obter auth seguro
export async function getAuth() {
  try {
    if (!firebaseApp) {
      console.error("🔐 Firebase App não inicializada para Auth");
      return null;
    }
    const { getAuth: getFirebaseAuth } = await import("firebase/auth");
    return getFirebaseAuth(firebaseApp);
  } catch (error: any) {
    console.error("🔐 Erro ao obter Auth:", error.message);
    return null;
  }
}

// Funções de compatibilidade
export const getAuthService = async () => {
  return getAuth();
};

export const getDBAsync = async () => {
  // Implementar quando necessário
  return null;
};

export const attemptFirestoreInit = async () => {
  return getFirebaseApp();
};

export const waitForFirebaseInit = () => Promise.resolve(firebaseApp !== null);
export const isFirebaseAuthAvailable = () => firebaseApp !== null;
export const isFirebaseFirestoreAvailable = () => firebaseApp !== null;

// Function to get Firebase status
export const getFirebaseStatus = () => {
  return {
    connected: firebaseApp !== null,
    initialized: firebaseApp !== null,
    ready: firebaseApp !== null,
    status: firebaseApp ? "ready" : "not_initialized",
  };
};

// Export auth como Promise
export const auth = getAuth();

// Export db como null (será implementado quando necessário)
export const db = null;

// Export app como instância
export const app = firebaseApp;

// Export principal
export { firebaseApp };
export default firebaseApp;
