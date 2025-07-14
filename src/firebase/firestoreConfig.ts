// Configuração Firestore ativa
import {
  Firestore,
  getFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getFirebaseApp } from "./basicConfig";

// Estado atual: Firestore ativo
const LOCAL_MODE = false;

// Variável para armazenar a instância do Firestore
let firestoreInstance: Firestore | null = null;

// Inicializar Firestore automaticamente
if (!LOCAL_MODE) {
  try {
    const app = getFirebaseApp();
    if (app) {
      firestoreInstance = getFirestore(app);
      console.log("✅ Firestore inicializado com sucesso");
    } else {
      console.warn("⚠️ Firebase App não disponível para inicializar Firestore");
    }
  } catch (error: any) {
    console.error("❌ Erro ao inicializar Firestore:", error.message);
  }
}

// Função principal para obter Firestore
export function getFirebaseFirestore(): Firestore | null {
  if (LOCAL_MODE) {
    console.log("📱 Firestore em modo local - dados guardados no localStorage");
    return null;
  }

  // Tentar inicializar se ainda não foi feito
  if (!firestoreInstance) {
    try {
      const app = getFirebaseApp();
      if (app) {
        firestoreInstance = getFirestore(app);
        console.log("✅ Firestore inicializado tardiamente");
      }
    } catch (error: any) {
      console.error(
        "❌ Erro na inicialização tardia do Firestore:",
        error.message,
      );
    }
  }

  return firestoreInstance;
}

// Função assíncrona para obter Firestore
export async function getFirebaseFirestoreAsync(): Promise<Firestore | null> {
  if (LOCAL_MODE) {
    console.log("📱 Firestore em modo local - dados guardados no localStorage");
    return null;
  }

  // Tentar inicializar se ainda não foi feito
  if (!firestoreInstance) {
    try {
      const app = getFirebaseApp();
      if (app) {
        firestoreInstance = getFirestore(app);
        console.log("✅ Firestore inicializado assincronamente");
      }
    } catch (error: any) {
      console.error(
        "❌ Erro na inicialização assíncrona do Firestore:",
        error.message,
      );
    }
  }

  return firestoreInstance;
}

// Função para verificar se Firestore está pronto
export function isFirestoreReady(): boolean {
  if (LOCAL_MODE) return false;
  return firestoreInstance !== null;
}

// Função de teste simples para Firestore
export async function testFirestore(): Promise<boolean> {
  if (LOCAL_MODE) {
    console.log("📱 Firestore teste: modo local ativo");
    return false;
  }

  try {
    const db = getFirebaseFirestore();
    if (!db) {
      console.error("❌ Firestore não disponível para teste");
      return false;
    }

    // Teste simples de conectividade
    const testDoc = doc(db, "test", "connection");
    await getDoc(testDoc);

    console.log("✅ Teste Firestore: conectividade OK");
    return true;
  } catch (error: any) {
    console.error("❌ Teste Firestore falhou:", error.message);
    return false;
  }
}

// Imports necessários
import { doc, getDoc } from "firebase/firestore";

// Função para forçar inicialização
export async function forceFirestoreInit(): Promise<boolean> {
  if (LOCAL_MODE) {
    console.log("📱 Firestore forçado: modo local ativo");
    return false;
  }

  try {
    const app = getFirebaseApp();
    if (!app) {
      console.error("❌ Firebase App não disponível para forçar Firestore");
      return false;
    }

    firestoreInstance = getFirestore(app);
    console.log("✅ Firestore inicialização forçada com sucesso");
    return true;
  } catch (error: any) {
    console.error("❌ Erro ao forçar inicialização Firestore:", error.message);
    return false;
  }
}

// Função para limpar instância
export function clearFirestoreInstance(): void {
  if (LOCAL_MODE) {
    console.log("🧹 Firestore limpo: modo local ativo");
    return;
  }

  firestoreInstance = null;
  console.log("🧹 Instância Firestore limpa");
}

// Função para ativar modo local (desativada)
export function enableLocalMode(): void {
  console.log("⚠️ Modo local desativado - usando Firebase ativo");
  console.log("🔥 Firebase/Firestore totalmente funcionais");
}

// Exportações
export { firestoreInstance };
export default firestoreInstance;
