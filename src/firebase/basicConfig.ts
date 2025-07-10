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

// Proxy inteligente para db que usa Firestore real quando disponível
export const db = new Proxy(
  {},
  {
    get(target, prop) {
      const firestoreInstance = getFirebaseFirestore();

      // Se Firestore está disponível, usar instância real
      if (firestoreInstance) {
        try {
          return (firestoreInstance as any)[prop];
        } catch (error) {
          console.warn("⚠️ Erro ao acessar Firestore:", error);
          return null;
        }
      }

      // Fallback para propriedades especiais
      if (prop === "type" || prop === "app" || prop === "toJSON") {
        return undefined;
      }

      console.warn("⚠️ Firestore não disponível - usando fallback local");
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

// Importar Auth do Passo 2
import { getFirebaseAuth, isFirebaseAuthReady } from "./authConfig";
// Importar Firestore do Passo 3
import {
  getFirebaseFirestore,
  isFirestoreReady,
  testFirestore,
} from "./firestoreConfig";

// Funções de compatibilidade
export const getDB = () => Promise.resolve(getFirebaseFirestore());
export const getAuthService = () => Promise.resolve(getFirebaseAuth());
export const attemptFirestoreInit = () =>
  Promise.resolve(getFirebaseFirestore());
export const waitForFirebaseInit = () => Promise.resolve(true);
export const isFirebaseAuthAvailable = () => isFirebaseAuthReady();
export const isFirebaseFirestoreAvailable = () => isFirestoreReady();
export const testFirebaseFirestore = testFirestore;

export default firebaseApp;
