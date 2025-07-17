import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

/**
 * Fix SIMPLES e ROBUSTO para Firestore
 * Evita complexidade desnecessária e foca no que funciona
 */

let isInitialized = false;
let firestoreDB: any = null;
let firebaseApp: any = null;
let initPromise: Promise<any> | null = null;

// Configuração Firebase usando variáveis de ambiente
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: "G-Q2QWQVH60L",
};

export const initializeSimpleFirestore = async (): Promise<any> => {
  // Se já está inicializando, aguardar a promise existente
  if (initPromise) {
    return await initPromise;
  }

  // Se já foi inicializado, retornar imediatamente
  if (isInitialized && firestoreDB) {
    console.log("✅ SimpleFirestore: Já inicializado");
    return firestoreDB;
  }

  // Criar nova promise de inicialização
  initPromise = (async () => {
    try {
      console.log("🚀 SimpleFirestore: Inicializando...");

      // 1. Inicializar Firebase App
      if (getApps().length === 0) {
        console.log("📱 Criando Firebase App...");
        firebaseApp = initializeApp(FIREBASE_CONFIG);
      } else {
        firebaseApp = getApp();
      }
      console.log("✅ Firebase App:", firebaseApp.name);

      // 2. Inicializar Firestore
      console.log("💾 Criando Firestore...");
      firestoreDB = getFirestore(firebaseApp);
      console.log("✅ Firestore criado:", typeof firestoreDB);

      // 3. Teste básico sem operações de rede
      console.log("🧪 Teste básico...");
      const { doc } = await import("firebase/firestore");
      const testRef = doc(firestoreDB, "test", "connection");
      console.log("✅ Referência de teste criada");

      isInitialized = true;
      console.log("🎉 SimpleFirestore: Inicialização completa!");

      return firestoreDB;
    } catch (error: any) {
      console.error("❌ SimpleFirestore: Erro:", {
        message: error.message,
        code: error.code,
        name: error.name,
      });

      isInitialized = false;
      firestoreDB = null;
      initPromise = null;

      throw error;
    }
  })();

  return await initPromise;
};

export const getSimpleFirestore = (): any => {
  if (firestoreDB) {
    return firestoreDB;
  }

  console.warn(
    "⚠️ SimpleFirestore: Não inicializado - use initializeSimpleFirestore()",
  );
  return null;
};

export const ensureSimpleFirestore = async (retries = 3): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 EnsureSimpleFirestore: Tentativa ${i + 1}/${retries}`);

      // Primeiro verificar se já temos
      let db = getSimpleFirestore();
      if (db) {
        console.log(`✅ EnsureSimpleFirestore: Sucesso na tentativa ${i + 1}`);
        return db;
      }

      // Tentar inicializar
      db = await initializeSimpleFirestore();
      if (db) {
        console.log(
          `✅ EnsureSimpleFirestore: Inicializado na tentativa ${i + 1}`,
        );
        return db;
      }

      // Aguardar antes da próxima tentativa
      if (i < retries - 1) {
        const delay = 2000 * (i + 1);
        console.log(`⏳ Aguardando ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error: any) {
      console.error(
        `❌ EnsureSimpleFirestore: Erro na tentativa ${i + 1}:`,
        error.message,
      );

      if (i < retries - 1) {
        const delay = 2000 * (i + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`SimpleFirestore falhou após ${retries} tentativas`);
};

// Status e debug
export const getSimpleFirestoreStatus = () => {
  return {
    isInitialized,
    hasDB: !!firestoreDB,
    hasApp: !!firebaseApp,
    config: FIREBASE_CONFIG.projectId,
  };
};

// Auto-inicializar
if (typeof window !== "undefined") {
  setTimeout(() => {
    initializeSimpleFirestore()
      .then(() => {
        console.log("🎉 SimpleFirestore: Auto-inicialização completa!");

        // Disponibilizar globalmente
        (window as any).simpleFirestore = {
          db: firestoreDB,
          app: firebaseApp,
          status: getSimpleFirestoreStatus,
          init: initializeSimpleFirestore,
        };
      })
      .catch((error) => {
        console.error(
          "❌ SimpleFirestore: Auto-inicialização falhou:",
          error.message,
        );
      });
  }, 100);
}

export default initializeSimpleFirestore;
