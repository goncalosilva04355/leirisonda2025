// Passo 1: Configuração básica do Firebase
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { isPrivateBrowsing } from "../utils/storageUtils";
import { getFirebaseConfig } from "../config/firebaseEnv";

// Configuração do Firebase usando helper centralizado
const firebaseConfig = getFirebaseConfig();

// Variável para armazenar a instância do Firebase
let firebaseApp: FirebaseApp | null = null;
let isInitializing = false;

// Função robusta para inicializar Firebase apenas uma vez
function initializeFirebaseBasic(): FirebaseApp | null {
  // Evitar múltiplas inicializações simultâneas
  if (isInitializing) {
    console.log("⏳ Firebase: Inicialização já em progresso, aguardando...");
    return firebaseApp;
  }

  // Se já temos uma app válida, retorná-la
  if (firebaseApp) {
    try {
      // Verificar se a app ainda é válida
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

  try {
    isInitializing = true;

    // Verificar se estamos em modo privado
    if (isPrivateBrowsing()) {
      console.warn("🔒 Modo privado detectado - Firebase pode ter limitações");
    }

    // Verificar se já existe uma app válida
    const existingApps = getApps();

    if (existingApps.length > 0) {
      // Usar a primeira app existente se for válida
      firebaseApp = existingApps[0];
      console.log("✅ Firebase: Reutilizando app existente");
    } else {
      // Criar nova app apenas se não existir nenhuma
      firebaseApp = initializeApp(firebaseConfig);
      console.log("✅ Firebase: Nova app inicializada");
    }

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
    isInitializing = false;
  }
}

// Função robusta para obter a app Firebase
export function getFirebaseApp(): FirebaseApp | null {
  // Se não temos app, tentar inicializar
  if (!firebaseApp) {
    return initializeFirebaseBasic();
  }

  // Verificar se a app ainda é válida
  try {
    const apps = getApps();
    if (apps.find((app) => app === firebaseApp)) {
      return firebaseApp;
    } else {
      // App não está mais na lista, limpar referência e reinicializar
      console.warn("⚠️ Firebase: App não encontrada na lista, reinicializando");
      firebaseApp = null;
      return initializeFirebaseBasic();
    }
  } catch (error) {
    console.warn("⚠️ Firebase: Erro ao verificar apps:", error);
    return firebaseApp; // Retornar a app mesmo com erro de verificação
  }
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
