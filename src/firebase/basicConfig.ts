// Configuração Firebase básica ativa
import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { getFirebaseEnv } from "../config/firebaseEnv";

// Estado: Firebase ativo
const LOCAL_MODE = false;

// Variável para armazenar a instância do Firebase
let firebaseApp: FirebaseApp | null = null;

// Inicializar Firebase automaticamente
if (!LOCAL_MODE) {
  try {
    const config = getFirebaseEnv();
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
      const config = getFirebaseEnv();
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
      const config = getFirebaseEnv();
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

// Função para obter db seguro (sempre retorna null em modo local)
export function getDB() {
  console.log("💾 Banco de dados: modo local ativo");
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

// Função para obter auth seguro (sempre retorna null em modo local)
export function getAuth() {
  console.log("🔐 Auth: modo local ativo");
  return null;
}

// Export auth como função (sempre null)
export const auth = null;

// Importar funções do Firestore (modo local)
import {
  getFirebaseFirestore,
  isFirestoreReady,
  testFirestore,
} from "./firestoreConfig";

// Status Firebase sempre em modo local

// Funções de compatibilidade (sempre retornam valores seguros)
export const getDBAsync = () => Promise.resolve(null);
export const getAuthService = () => Promise.resolve(null);
export const attemptFirestoreInit = () => Promise.resolve(null);
export const waitForFirebaseInit = () => Promise.resolve(true);
export const isFirebaseAuthAvailable = () => false;
export const isFirebaseFirestoreAvailable = () => false;
export const testFirebaseFirestore = () => Promise.resolve(false);

// Exportações principais
export { getFirebaseFirestore, isFirestoreReady };

// Export app como instância (sempre null)
export const app = null;

export default firebaseApp;
