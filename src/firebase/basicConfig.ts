// Configuração Firebase básica ativa
import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { getFirebaseConfig } from "../config/firebaseEnv";

// Estado: Firebase ativo
const LOCAL_MODE = false;

// Variável para armazenar a instância do Firebase
let firebaseApp: FirebaseApp | null = null;

// Inicializar Firebase automaticamente
if (!LOCAL_MODE) {
  try {
    const config = getFirebaseConfig();
    if (getApps().length === 0) {
      firebaseApp = initializeApp(config);
      console.log("✅ Firebase inicializado com sucesso");
    } else {
      firebaseApp = getApp();
      console.log("✅ Firebase já estava inicializado");
    }
  } catch (error: any) {
    console.error("❌ Erro ao inicializar Firebase:", error.message);
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

// Função para obter db seguro
export function getDB() {
  if (LOCAL_MODE) {
    console.log("💾 Banco de dados: modo local ativo");
    return null;
  }

  // Usar lazy import para evitar dependência circular
  try {
    return getFirebaseFirestore();
  } catch (error: any) {
    console.error("💾 Erro ao obter DB:", error.message);
    return null;
  }
}

// Import necessário para getFirebaseFirestore
import { getFirebaseFirestore } from "./firestoreConfig";

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

// Import necessário para getAuth
import { getAuth as getFirebaseAuth } from "firebase/auth";

// Export auth como função (sempre null)
export const auth = null;

// Importar funções do Firestore (modo local)
import {
  getFirebaseFirestore,
  isFirestoreReady,
  testFirestore,
} from "./firestoreConfig";

// Status Firebase sempre em modo local

// Funções de compatibilidade
export const getDBAsync = async () => {
  if (LOCAL_MODE) return null;
  const { getFirebaseFirestoreAsync } = require("./firestoreConfig");
  return await getFirebaseFirestoreAsync();
};

export const getAuthService = async () => {
  if (LOCAL_MODE) return null;
  return getAuth();
};

export const attemptFirestoreInit = async () => {
  if (LOCAL_MODE) return null;
  const { getFirebaseFirestoreAsync } = require("./firestoreConfig");
  return await getFirebaseFirestoreAsync();
};

export const waitForFirebaseInit = () =>
  Promise.resolve(!LOCAL_MODE && firebaseApp !== null);
export const isFirebaseAuthAvailable = () =>
  !LOCAL_MODE && firebaseApp !== null;
export const isFirebaseFirestoreAvailable = () =>
  !LOCAL_MODE && firebaseApp !== null;
export const testFirebaseFirestore = async () => {
  if (LOCAL_MODE) return false;
  const { testFirestore } = require("./firestoreConfig");
  return await testFirestore();
};

// Exportações principais
export { getFirebaseFirestore, isFirestoreReady };

// Export app como instância (sempre null)
export const app = null;

export default firebaseApp;
