// Correção forçada para inicialização Firebase/Firestore
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Configuração do projeto Firebase (leiria-1cfc9)
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

let globalFirebaseApp: FirebaseApp | null = null;
let globalFirestore: Firestore | null = null;

// Função para forçar inicialização do Firebase
export function forceInitializeFirebase(): FirebaseApp | null {
  try {
    console.log("🔧 Forçando inicialização do Firebase...");

    // Limpar apps existentes se houver problemas
    const existingApps = getApps();
    console.log(`📱 Apps Firebase existentes: ${existingApps.length}`);

    if (existingApps.length > 0) {
      globalFirebaseApp = existingApps[0];
      console.log("✅ Usando app Firebase existente");
    } else {
      globalFirebaseApp = initializeApp(firebaseConfig);
      console.log("✅ Nova app Firebase inicializada");
    }

    console.log("✅ Firebase App configurada:", globalFirebaseApp.name);
    return globalFirebaseApp;
  } catch (error) {
    console.error("❌ Erro ao inicializar Firebase:", error);
    return null;
  }
}

// Função para forçar inicialização do Firestore
export function forceInitializeFirestore(): Firestore | null {
  try {
    console.log("🔧 Forçando inicialização do Firestore...");

    if (!globalFirebaseApp) {
      globalFirebaseApp = forceInitializeFirebase();
    }

    if (!globalFirebaseApp) {
      console.error("❌ Firebase App não disponível para Firestore");
      return null;
    }

    if (!globalFirestore) {
      globalFirestore = getFirestore(globalFirebaseApp);
      console.log("✅ Firestore inicializado com sucesso");
      console.log(
        "📊 Projeto Firestore:",
        globalFirestore.app.options.projectId,
      );
    }

    return globalFirestore;
  } catch (error) {
    console.error("❌ Erro ao inicializar Firestore:", error);
    return null;
  }
}

// Função de teste completo
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    console.log("🧪 Testando conexão Firebase completa...");

    // Testar Firebase App
    const app = forceInitializeFirebase();
    if (!app) {
      console.error("❌ Firebase App falhou");
      return false;
    }

    // Testar Firestore
    const db = forceInitializeFirestore();
    if (!db) {
      console.error("❌ Firestore falhou");
      return false;
    }

    // Testar operação simples
    const { doc, getDoc } = await import("firebase/firestore");
    const testDoc = doc(db, "test", "connection");

    try {
      await getDoc(testDoc);
      console.log("✅ Teste de leitura Firestore: OK");
    } catch (readError) {
      console.warn("⚠️ Teste de leitura Firestore falhou:", readError);
      console.log("💡 Pode ser problema de regras de segurança");
    }

    console.log("✅ Firebase/Firestore inicializado e testado");
    return true;
  } catch (error) {
    console.error("❌ Teste de conexão falhou:", error);
    return false;
  }
}

// Getters globais
export function getGlobalFirebaseApp(): FirebaseApp | null {
  return globalFirebaseApp || forceInitializeFirebase();
}

export function getGlobalFirestore(): Firestore | null {
  return globalFirestore || forceInitializeFirestore();
}

// Auto-executar inicialização
setTimeout(() => {
  testFirebaseConnection();
}, 500);

// Executar novamente após 2 segundos para garantir
setTimeout(() => {
  if (!globalFirestore) {
    console.log("🔄 Retry: Tentando inicializar Firestore novamente...");
    testFirebaseConnection();
  }
}, 2000);
