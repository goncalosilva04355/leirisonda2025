// Configuração Firebase básica simplificada para evitar erros
import { FirebaseApp } from "firebase/app";

// Estado: modo local ativo para evitar erros
const LOCAL_MODE = true;

// Variável para armazenar a instância do Firebase (sempre null em modo local)
let firebaseApp: FirebaseApp | null = null;

// Função robusta para obter a app Firebase (sempre retorna null em modo local)
export function getFirebaseApp(): FirebaseApp | null {
  if (LOCAL_MODE) {
    console.log("📱 Firebase App em modo local");
    return null;
  }
  return firebaseApp;
}

// Função assíncrona para obter a app Firebase (sempre retorna null em modo local)
export async function getFirebaseAppAsync(): Promise<FirebaseApp | null> {
  if (LOCAL_MODE) {
    console.log("📱 Firebase App em modo local");
    return null;
  }
  return firebaseApp;
}

// Função para verificar se Firebase está pronto (sempre false em modo local)
export function isFirebaseReady(): boolean {
  return false;
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
