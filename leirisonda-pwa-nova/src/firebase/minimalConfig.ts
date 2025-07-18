// Configuração Firebase mínima sem Firestore para evitar erros
// Esta configuração evita completamente os problemas de getImmediate

let firebaseDisabled = false;

// Função para desativar Firebase completamente
export function disableFirebase(): void {
  firebaseDisabled = true;
  console.log("🚫 Firebase desativado para evitar erros");
}

// Função para verificar se Firebase está desativado
export function isFirebaseDisabled(): boolean {
  return firebaseDisabled;
}

// Funções de stub que retornam null (modo local)
export function getFirebaseFirestore() {
  if (firebaseDisabled) {
    return null;
  }
  console.log("📱 Firestore não disponível - modo local ativo");
  return null;
}

export async function getFirebaseFirestoreAsync() {
  if (firebaseDisabled) {
    return null;
  }
  console.log("📱 Firestore não disponível - modo local ativo");
  return null;
}

export function isFirestoreReady(): boolean {
  return false;
}

export async function testFirestore(): Promise<boolean> {
  console.log("📱 Firestore teste: modo local ativo");
  return false;
}

export function getFirebaseApp() {
  if (firebaseDisabled) {
    return null;
  }
  console.log("📱 Firebase App não disponível - modo local ativo");
  return null;
}

export async function getFirebaseAppAsync() {
  if (firebaseDisabled) {
    return null;
  }
  console.log("📱 Firebase App não disponível - modo local ativo");
  return null;
}

export function isFirebaseReady(): boolean {
  return false;
}

// Exportações para compatibilidade
export const firestoreInstance = null;
export const db = null;
export const auth = null;
export const app = null;

// Função para inicializar modo local
export function initializeLocalMode(): void {
  disableFirebase();
  console.log("✅ Modo local inicializado - aplicação funciona sem Firebase");
  console.log("💾 Todos os dados serão guardados no localStorage");
}

export default {
  getFirebaseFirestore,
  getFirebaseFirestoreAsync,
  isFirestoreReady,
  testFirestore,
  getFirebaseApp,
  getFirebaseAppAsync,
  isFirebaseReady,
  initializeLocalMode,
  disableFirebase,
  isFirebaseDisabled,
};
