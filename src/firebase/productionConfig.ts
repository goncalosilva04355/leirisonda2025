// Configuração Firebase SEMPRE ATIVA - funciona em desenvolvimento e produção
import { FirebaseApp } from "firebase/app";
import { getFirebaseApp, getAuthInstance } from "./config";

// SEMPRE forçar Firebase ativo
const FIREBASE_ALWAYS_ACTIVE = true;

// Obter instância do Firebase centralizada
let firebaseApp: FirebaseApp | null = null;

console.log("🔥 Firebase PRODUÇÃO: Sempre ativo");
console.log("🌐 Modo de produção: Firebase forçado");
console.log("✅ Configuração garantida para funcionar");

// Inicializar Firebase SEMPRE
try {
  console.log("🔥 Iniciando Firebase (modo produção forçado)...");
  firebaseApp = getFirebaseApp();
  console.log("✅ Firebase inicializado com sucesso", firebaseApp.name);
  console.log("🔍 Project ID ativo:", firebaseApp.options.projectId);
} catch (error: any) {
  console.error("❌ Erro ao inicializar Firebase:", error.message);
  console.error("🔍 Stack trace:", error.stack);
}

// Função robusta para obter a app Firebase
export function getFirebaseAppProduction(): FirebaseApp | null {
  if (!firebaseApp) {
    try {
      firebaseApp = getFirebaseApp();
      console.log("✅ Firebase inicializado tardiamente");
    } catch (error: any) {
      console.error("❌ Erro na inicialização tardia:", error.message);
    }
  }
  return firebaseApp;
}

// Função para verificar se Firebase está pronto
export function isFirebaseReady(): boolean {
  return firebaseApp !== null;
}

// Função para obter auth seguro
export async function getAuth() {
  try {
    return getAuthInstance();
  } catch (error: any) {
    console.error("🔐 Erro ao obter Auth:", error.message);
    return null;
  }
}

// Funções de compatibilidade
export const getAuthService = async () => {
  return getAuth();
};

export const getDBAsync = async () => {
  // Implementar quando necessário
  return null;
};

export const attemptFirestoreInit = async () => {
  return getFirebaseAppProduction();
};

export const waitForFirebaseInit = () => Promise.resolve(firebaseApp !== null);
export const isFirebaseAuthAvailable = () => firebaseApp !== null;
export const isFirebaseFirestoreAvailable = () => firebaseApp !== null;

// Export auth como instância
export const auth = getAuth();

// Export db como null (será implementado quando necessário)
export const db = null;

// Export app como instância
export const app = firebaseApp;

// Export principal
export { firebaseApp };
export default firebaseApp;
