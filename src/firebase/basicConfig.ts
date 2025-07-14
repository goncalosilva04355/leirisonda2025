// Configuração Firebase básica ativa
import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { getFirebaseConfig } from "../config/firebaseEnv";
import { getAuth as getFirebaseAuth } from "firebase/auth";

// Estado: Firebase DESATIVADO em desenvolvimento, ativo só no Netlify
const LOCAL_MODE = import.meta.env.DEV;

// Variável para armazenar a instância do Firebase
let firebaseApp: FirebaseApp | null = null;

// Wrapper para desenvolvimento
if (LOCAL_MODE) {
  console.log("🚫 Firebase DESATIVADO em desenvolvimento");
  console.log("📝 Use apenas localStorage durante desenvolvimento");
  console.log("🚀 Firebase será ativo apenas no Netlify");
}

// Inicializar Firebase automaticamente (apenas em produção)
if (!LOCAL_MODE) {
  try {
    console.log("🔥 Iniciando Firebase com variáveis do Netlify...");
    const config = getFirebaseConfig();
    console.log("🔧 Firebase Project:", config.projectId);

    if (getApps().length === 0) {
      console.log("🎆 Inicializando nova Firebase App...");
      firebaseApp = initializeApp(config);
      console.log("✅ Firebase inicializado com sucesso", firebaseApp.name);
      console.log("🔍 Project ID ativo:", firebaseApp.options.projectId);
    } else {
      firebaseApp = getApp();
      console.log("✅ Firebase já estava inicializado", firebaseApp.name);
    }
  } catch (error: any) {
    console.error("❌ Erro ao inicializar Firebase:", error.message);
    console.error("🔍 Stack trace:", error.stack);
  }
}

// Função robusta para obter a app Firebase
export function getFirebaseApp(): FirebaseApp | null {
  if (LOCAL_MODE) {
    console.log("📱 Firebase App em modo local");
    return null;
  }

  // Tentar inicializar se ainda não foi feito
  if (!firebaseApp) {
    try {
      const config = getFirebaseConfig();
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

// Função assíncrona para obter a app Firebase
export async function getFirebaseAppAsync(): Promise<FirebaseApp | null> {
  if (LOCAL_MODE) {
    console.log("📱 Firebase App em modo local");
    return null;
  }

  // Tentar inicializar se ainda não foi feito
  if (!firebaseApp) {
    try {
      const config = getFirebaseConfig();
      if (getApps().length === 0) {
        firebaseApp = initializeApp(config);
        console.log("✅ Firebase inicializado assincronamente");
      } else {
        firebaseApp = getApp();
      }
    } catch (error: any) {
      console.error("❌ Erro na inicialização assíncrona:", error.message);
    }
  }

  return firebaseApp;
}

// Função para verificar se Firebase está pronto
export function isFirebaseReady(): boolean {
  if (LOCAL_MODE) return false;
  return firebaseApp !== null;
}

// Função para obter db seguro - usar firestoreConfig diretamente
export function getDB() {
  console.log("💾 Use getFirebaseFirestore() diretamente do firestoreConfig");
  return null;
}

// Função para verificar se Firestore está disponível (sempre retorna fallback)
export function withFirestore<T>(
  callback: (db: any) => T,
  fallback?: T,
): T | null {
  console.log("💾 Operação Firestore: usando modo local");
  return fallback ?? null;
}

// Export db como instância (sempre null)
export const db = null;

// Função para obter auth seguro
export function getAuth() {
  if (LOCAL_MODE) {
    console.log("🔐 Auth: modo local ativo");
    return null;
  }

  try {
    if (!firebaseApp) {
      console.error("🔐 Firebase App não inicializada para Auth");
      return null;
    }
    return getFirebaseAuth(firebaseApp);
  } catch (error: any) {
    console.error("🔐 Erro ao obter Auth:", error.message);
    return null;
  }
}

// Export auth como função (sempre null)
export const auth = null;

// Status Firebase sempre em modo local

// Funções de compatibilidade
export const getDBAsync = async () => {
  if (LOCAL_MODE) return null;
  return await getFirebaseFirestoreAsync();
};

export const getAuthService = async () => {
  if (LOCAL_MODE) return null;
  return getAuth();
};

export const attemptFirestoreInit = async () => {
  if (LOCAL_MODE) return null;
  return await getFirebaseFirestoreAsync();
};

export const waitForFirebaseInit = () =>
  Promise.resolve(!LOCAL_MODE && firebaseApp !== null);
export const isFirebaseAuthAvailable = () =>
  !LOCAL_MODE && firebaseApp !== null;
export const isFirebaseFirestoreAvailable = () =>
  !LOCAL_MODE && firebaseApp !== null;
export const testFirebaseFirestore = async () => {
  console.log("💾 Use testFirestore() diretamente do firestoreConfig");
  return false;
};

// Exportações principais - removidas para evitar dependência circular
// Use as funções diretamente do firestoreConfig

// Export app como instância (sempre null)
export const app = null;

export default firebaseApp;
