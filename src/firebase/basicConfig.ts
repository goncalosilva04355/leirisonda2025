// Passo 1: Configuração básica do Firebase
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { isPrivateBrowsing } from "../utils/storageUtils";

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "leiria-1cfc9",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "leiria-1cfc9.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "632599887141",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Q2QWQVH60L",
};

// Variável para armazenar a instância do Firebase
let firebaseApp: FirebaseApp | null = null;

// Função simples para inicializar Firebase
function initializeFirebaseBasic(): FirebaseApp | null {
  try {
    // Verificar se estamos em modo privado
    if (isPrivateBrowsing()) {
      console.warn(
        "🔒 Modo privado detectado - Firebase pode ter funcionalidades limitadas",
      );
      console.log(
        "💡 Sistema funcionará em modo local com funcionalidades reduzidas",
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

    return firebaseApp;
  } catch (error) {
    console.warn(
      "⚠️ Firebase: Problema na inicialização, mas app pode funcionar em modo local",
    );
    console.log("💡 Sistema continua funcional com autenticação local");
    firebaseApp = null;
    return null;
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
