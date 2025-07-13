// Passo 1: Configuração básica do Firebase
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { isPrivateBrowsing } from "../utils/storageUtils";
import { getFirebaseConfig } from "../config/firebaseEnv";

// Configuração do Firebase usando helper centralizado
const firebaseConfig = getFirebaseConfig();

// Variável para armazenar a instância do Firebase
let firebaseApp: FirebaseApp | null = null;

// Função determinística para inicializar Firebase sempre
function initializeFirebaseBasic(): FirebaseApp | null {
  try {
    // Verificar se estamos em modo privado
    if (isPrivateBrowsing()) {
      console.warn(
        "🔒 Modo privado detectado - tentando inicializar Firebase mesmo assim",
      );
    }

    // Verificar se já existe uma app
    const existingApps = getApps();

    if (existingApps.length > 0) {
      firebaseApp = existingApps[0];
      console.log("✅ Firebase: Usando app existente");
    } else {
      firebaseApp = initializeApp(firebaseConfig);
      console.log("✅ Firebase: App inicializada com sucesso");
    }

    // Verificar se a inicialização foi bem-sucedida
    if (!firebaseApp) {
      throw new Error("Firebase app não foi inicializada");
    }

    console.log("🔥 Firebase está sempre ativo - sincronização garantida");
    return firebaseApp;
  } catch (error) {
    console.error(
      "❌ Firebase: ERRO CRÍTICO na inicialização. Sincronização não disponível:",
      error,
    );
    firebaseApp = null;
    // Não retornar null silenciosamente - mostrar erro claro
    throw new Error(`Firebase não conseguiu inicializar: ${error}`);
  }
}

// Função para obter a app Firebase
export function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseApp) {
    return initializeFirebaseBasic();
  }
  return firebaseApp;
}

// Função para verificar se Firebase está pronto
export function isFirebaseReady(): boolean {
  return firebaseApp !== null;
}

// Inicializar automaticamente quando o módulo é carregado
initializeFirebaseBasic();

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
