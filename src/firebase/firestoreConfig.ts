// Passo 3: Configuração Firestore - base de dados na nuvem
import { getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseApp } from "./basicConfig";

// Variável para armazenar a instância do Firestore
let firestoreInstance: Firestore | null = null;

// Função determinística para inicializar Firestore sempre
function initializeFirestore(): Firestore | null {
  try {
    const app = getFirebaseApp();

    if (!app) {
      throw new Error("Firebase App não está disponível para Firestore");
    }

    if (!firestoreInstance) {
      firestoreInstance = getFirestore(app);
      console.log("✅ Firestore: Inicializado com sucesso");
    }

    console.log("🔥 Firestore está sempre ativo - dados sempre sincronizados");
    return firestoreInstance;
  } catch (error) {
    console.error(
      "❌ Firestore: ERRO CRÍTICO na inicialização. Base de dados não disponível:",
      error,
    );
    // Tentar uma segunda vez ap��s um delay
    setTimeout(() => {
      console.log("🔄 Tentando reinicializar Firestore...");
      try {
        const app = getFirebaseApp();
        if (app) {
          firestoreInstance = getFirestore(app);
          console.log(
            "✅ Firestore: Reinicializado com sucesso na segunda tentativa",
          );
        }
      } catch (retryError) {
        console.error(
          "❌ Firestore: Falhou também na segunda tentativa:",
          retryError,
        );
      }
    }, 2000);

    return null;
  }
}

// Função para obter o Firestore
export function getFirebaseFirestore(): Firestore | null {
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
