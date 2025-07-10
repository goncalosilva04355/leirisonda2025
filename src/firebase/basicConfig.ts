// Passo 1: Configuração básica do Firebase
import { initializeApp, getApps, FirebaseApp } from "firebase/app";

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
    console.error("❌ Firebase: Erro na inicialização:", error);
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

// Proxy simples para db (retorna null por enquanto - será implementado no próximo passo)
export const db = new Proxy(
  {},
  {
    get() {
      console.warn(
        "⚠️ Firestore ainda não configurado - Passo 1 apenas inicializa Firebase App",
      );
      return null;
    },
  },
);

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

// Funções de compatibilidade
export const getDB = () => Promise.resolve(null);
export const getAuthService = () => Promise.resolve(null);
export const attemptFirestoreInit = () => Promise.resolve(null);
export const waitForFirebaseInit = () => Promise.resolve(true);

export default firebaseApp;
