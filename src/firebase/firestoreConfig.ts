// Passo 3: Configuração Firestore - base de dados na nuvem
import { getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseApp } from "./basicConfig";
import {
  getGlobalFirestore,
  forceInitializeFirestore,
} from "../utils/firebaseInitFix";

// Variável para armazenar a instância do Firestore
let firestoreInstance: Firestore | null = null;

// Função simples para inicializar Firestore
function initializeFirestore(): Firestore | null {
  try {
    const app = getFirebaseApp();

    if (!app) {
      console.log(
        "⚠️ Firebase App não disponível, Firestore não pode ser inicializado",
      );
      return null;
    }

    if (!firestoreInstance) {
      firestoreInstance = getFirestore(app);
      console.log("✅ Firestore: Inicializado com sucesso");
    }

    return firestoreInstance;
  } catch (error) {
    console.warn(
      "��️ Firestore: Problema na inicialização, mantendo modo local",
    );
    console.log("💡 Dados continuam funcionais em localStorage");
    return null;
  }
}

// Função para obter o Firestore
export function getFirebaseFirestore(): Firestore | null {
  // Tentar primeiro com instância global corrigida
  const globalInstance = getGlobalFirestore();
  if (globalInstance) {
    firestoreInstance = globalInstance;
    return globalInstance;
  }

  // Fallback para inicialização local
  if (!firestoreInstance) {
    return initializeFirestore();
  }
  return firestoreInstance;
}

// Função para verificar se Firestore está pronto
export function isFirestoreReady(): boolean {
  return firestoreInstance !== null;
}

// Função de teste simples para Firestore
export async function testFirestore(): Promise<boolean> {
  try {
    const db = getFirebaseFirestore();
    if (!db) {
      console.log("📱 Firestore não disponível - modo local ativo");
      return false;
    }

    console.log("✅ Firestore disponível e pronto para uso");
    return true;
  } catch (error) {
    console.warn("⚠️ Teste Firestore falhou:", error);
    return false;
  }
}

// Inicializar Firestore automaticamente após um pequeno delay
setTimeout(() => {
  initializeFirestore();
}, 800);

// Exportações
export { firestoreInstance };
export default firestoreInstance;
