// Configuração Firebase básica ativa
import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { getFirebaseConfig } from "../config/firebaseEnv";
import { getAuth as getFirebaseAuth } from "firebase/auth";

// Estado: Firebase sempre ativo (produção e desenvolvimento)
const LOCAL_MODE = import.meta.env.DEV;
const IS_NETLIFY_BUILD =
  import.meta.env.NETLIFY === "true" ||
  import.meta.env.VITE_IS_NETLIFY === "true" ||
  !import.meta.env.DEV; // Considera produção se não for DEV
const FORCE_FIREBASE_PRODUCTION = false; // TEMPORARIAMENTE DESATIVADO para resolver problemas de produção

// Variável para armazenar a instância do Firebase
let firebaseApp: FirebaseApp | null = null;

// Wrapper para desenvolvimento e detecção do Netlify
console.log("🔍 Environment Check:");
console.log("  - LOCAL_MODE (DEV):", LOCAL_MODE);
console.log("  - NETLIFY:", import.meta.env.NETLIFY);
console.log("  - VITE_IS_NETLIFY:", import.meta.env.VITE_IS_NETLIFY);
console.log("  - IS_NETLIFY_BUILD:", IS_NETLIFY_BUILD);
console.log("  - VITE_FORCE_FIREBASE:", import.meta.env.VITE_FORCE_FIREBASE);
console.log("  - FORCE_FIREBASE_PRODUCTION:", FORCE_FIREBASE_PRODUCTION);

if (!IS_NETLIFY_BUILD && import.meta.env.VITE_FORCE_FIREBASE !== "true") {
  console.log("🚫 Firebase DESATIVADO - não está no Netlify");
  console.log("📝 Usar apenas localStorage durante desenvolvimento");
  console.log("��� Firebase será ativo automaticamente após deploy no Netlify");
  console.log("🔍 Para testar Firebase localmente: VITE_FORCE_FIREBASE=true");
} else {
  console.log("🔥 Firebase ATIVO - rodando no Netlify ou forçado");
  console.log("🌐 Ambiente de produção detectado");
  console.log("✅ Suas variáveis VITE_FIREBASE_* do Netlify serão usadas");
}

// Safety check - prevent Firebase from blocking app initialization
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    if (
      event.error &&
      event.error.message &&
      event.error.message.includes("firebase")
    ) {
      console.warn(
        "⚠️ Firebase error caught, continuing with localStorage:",
        event.error.message,
      );
      event.preventDefault();
    }
  });
}

// Inicializar Firebase apenas em produção (Netlify) ou se forçado
if (FORCE_FIREBASE_PRODUCTION) {
  try {
    console.log("🔥 Iniciando Firebase no ambiente de produção (Netlify)...");

    let config;
    try {
      config = getFirebaseConfig();
      console.log("🔧 Firebase Project:", config.projectId);
      console.log("🌐 Netlify Build:", IS_NETLIFY_BUILD);
    } catch (configError) {
      console.error("❌ Erro ao obter config Firebase:", configError);
      console.log(
        "📝 Continuando sem Firebase - app funcionará com localStorage",
      );
      config = null; // Signal that config failed
    }

    if (config && getApps().length === 0) {
      console.log("🎆 Inicializando nova Firebase App...");
      firebaseApp = initializeApp(config);
      console.log(
        "✅ Firebase inicializado com sucesso no Netlify",
        firebaseApp.name,
      );
      console.log("🔍 Project ID ativo:", firebaseApp.options.projectId);
    } else if (config) {
      firebaseApp = getApp();
      console.log(
        "✅ Firebase já estava inicializado no Netlify",
        firebaseApp.name,
      );
    } else {
      console.log("⏸️ Firebase initialization skipped - no valid config");
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
  // SEMPRE disponível - Firebase forçado ativo

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
  // SEMPRE disponível - Firebase forçado ativo

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
  return FORCE_FIREBASE_PRODUCTION && firebaseApp !== null;
}

// Função para obter db seguro - usar firestoreConfig diretamente
export function getDB() {
  console.log("��� Use getFirebaseFirestore() diretamente do firestoreConfig");
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
  // SEMPRE disponível - Firebase forçado ativo

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

// Export auth como funç��o (sempre null)
export const auth = null;

// Status Firebase sempre em modo local

// Funções de compatibilidade
export const getDBAsync = async () => {
  if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) return null;
  return await testFirebaseFirestore();
};

export const getAuthService = async () => {
  if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) return null;
  return getAuth();
};

export const attemptFirestoreInit = async () => {
  if (!IS_NETLIFY_BUILD && !import.meta.env.VITE_FORCE_FIREBASE) return null;
  return await testFirebaseFirestore();
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
