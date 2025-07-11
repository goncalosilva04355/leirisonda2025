// Passo 1: Configuração básica do Firebase
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { isPrivateBrowsing } from "../utils/storageUtils";

// Configuração do novo projeto Firebase
const firebaseConfig = {
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

// Export db como função
export const db = getDB();

// Proxy simples para auth (retorna null por enquanto - será implementado no próximo passo)
export const auth = new Proxy(
  {},
  {
    get() {
      console.warn(
        "⚠️ Firebase Auth ainda não configurado - Passo 1 apenas inicializa Firebase App",
      );
      return null;
    },
  },
);

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
export const getDB = () => Promise.resolve(getFirebaseFirestore());
export const getAuthService = () => Promise.resolve(getFirebaseAuth());
export const attemptFirestoreInit = () =>
  Promise.resolve(getFirebaseFirestore());
export const waitForFirebaseInit = () => Promise.resolve(true);
export const isFirebaseAuthAvailable = () => isFirebaseAuthReady();
export const isFirebaseFirestoreAvailable = () => isFirestoreReady();
export const testFirebaseFirestore = testFirestore;
export { getFirebaseFirestore, isFirestoreReady, getFirebaseStatus };

export default firebaseApp;
