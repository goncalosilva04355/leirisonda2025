// Configuração Firebase básica ativa
import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { getFirebaseConfig } from "../config/firebaseEnv";
import { getAuth as getFirebaseAuth } from "firebase/auth";

// Estado: Firebase apenas ativo no Netlify (produção)
const LOCAL_MODE = import.meta.env.DEV;
const IS_NETLIFY_BUILD =
  import.meta.env.NETLIFY === "true" ||
  import.meta.env.VITE_IS_NETLIFY === "true";
const FORCE_FIREBASE_PRODUCTION =
  IS_NETLIFY_BUILD || import.meta.env.VITE_FORCE_FIREBASE;

// Variável para armazenar a instância do Firebase
let firebaseApp: FirebaseApp | null = null;

// Wrapper para desenvolvimento e detecção do Netlify
if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) {
  console.log("🚫 Firebase DESATIVADO - não está no Netlify");
  console.log("📝 Use apenas localStorage durante desenvolvimento");
  console.log("🚀 Firebase será ativo automaticamente após deploy no Netlify");
  console.log("🔍 Para testar Firebase localmente: VITE_FORCE_FIREBASE=true");
} else {
  console.log("🔥 Firebase ATIVO - rodando no Netlify ou forçado");
  console.log("🌐 Ambiente de produção detectado");
}

// Inicializar Firebase apenas no Netlify (produção)
if (FORCE_FIREBASE_PRODUCTION) {
  try {
    console.log("🔥 Iniciando Firebase no ambiente de produção (Netlify)...");
    const config = getFirebaseConfig();
    console.log("🔧 Firebase Project:", config.projectId);
    console.log("🌐 Netlify Build:", IS_NETLIFY_BUILD);

    if (getApps().length === 0) {
      console.log("🎆 Inicializando nova Firebase App...");
      firebaseApp = initializeApp(config);
      console.log(
        "✅ Firebase inicializado com sucesso no Netlify",
        firebaseApp.name,
      );
      console.log("🔍 Project ID ativo:", firebaseApp.options.projectId);
    } else {
      firebaseApp = getApp();
      console.log(
        "✅ Firebase já estava inicializado no Netlify",
        firebaseApp.name,
      );
    }
  } catch (error: any) {
    console.error("❌ Erro ao inicializar Firebase no Netlify:", error.message);
    console.error("🔍 Stack trace:", error.stack);
    console.log("📝 Verifique as variáveis de ambiente do Netlify");
  }
} else {
  console.log(
    "⏸️ Firebase inicialização adiada - aguardando deploy no Netlify",
  );
}

// Função robusta para obter a app Firebase
export function getFirebaseApp(): FirebaseApp | null {
  if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) {
    console.log("📱 Firebase App indisponível - aguardando deploy no Netlify");
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
  if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) {
    console.log("📱 Firebase App indisponível - aguardando deploy no Netlify");
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
  if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) return false;
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
  if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) {
    console.log("🔐 Auth indisponível - aguardando deploy no Netlify");
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
  if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) return null;
  return await getFirebaseFirestoreAsync();
};

export const getAuthService = async () => {
  if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) return null;
  return getAuth();
};

export const attemptFirestoreInit = async () => {
  if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) return null;
  return await getFirebaseFirestoreAsync();
};

export const waitForFirebaseInit = () =>
  Promise.resolve(FORCE_FIREBASE_PRODUCTION && firebaseApp !== null);
export const isFirebaseAuthAvailable = () =>
  FORCE_FIREBASE_PRODUCTION && firebaseApp !== null;
export const isFirebaseFirestoreAvailable = () =>
  FORCE_FIREBASE_PRODUCTION && firebaseApp !== null;
export const testFirebaseFirestore = async () => {
  console.log("💾 Use testFirestore() diretamente do firestoreConfig");
  return false;
};

// Exportações principais - removidas para evitar dependência circular
// Use as funções diretamente do firestoreConfig

// Export app como instância (sempre null)
export const app = null;

export default firebaseApp;
