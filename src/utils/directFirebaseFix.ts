import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFirebaseConfig } from "../config/firebaseEnv";

/**
 * Fix direto para garantir que Firebase/Firestore seja inicializado
 */

let firebaseApp: any = null;
let firestoreDB: any = null;

export const directFirebaseInit = async () => {
  console.log("🚀 DIRECT FIREBASE INIT: Inicializando Firebase diretamente");

  try {
    // 1. Obter configuração
    const config = getFirebaseConfig();
    console.log("🔧 Config obtida:", {
      projectId: config.projectId,
      hasApiKey: !!config.apiKey,
      authDomain: config.authDomain,
    });

    // 2. Inicializar Firebase App se necessário
    if (getApps().length === 0) {
      console.log("📱 Inicializando Firebase App...");
      firebaseApp = initializeApp(config);
      console.log("✅ Firebase App inicializada:", firebaseApp.name);
    } else {
      firebaseApp = getApp();
      console.log("✅ Firebase App já existia:", firebaseApp.name);
    }

    // 3. Inicializar Firestore
    if (!firestoreDB) {
      console.log("💾 Inicializando Firestore...");
      firestoreDB = getFirestore(firebaseApp);
      console.log("✅ Firestore inicializado:", typeof firestoreDB);

      // 4. Teste básico
      try {
        console.log("🧪 Testando Firestore...");
        // Apenas criar uma referência - não fazer operação real
        const { doc } = await import("firebase/firestore");
        const testRef = doc(firestoreDB, "test", "connectivity");
        console.log("✅ Firestore test ref criada:", !!testRef);
      } catch (testError: any) {
        console.warn(
          "⚠️ Teste Firestore falhou:",
          testError?.message || String(testError),
        );
        console.warn("🔍 Detalhes do teste:", testError);
      }
    }

    return {
      app: firebaseApp,
      db: firestoreDB,
      ready: true,
    };
  } catch (error: any) {
    console.error(
      "❌ Erro no Direct Firebase Init:",
      error?.message || String(error),
    );
    console.error("🔍 Detalhes do erro:", {
      message: error?.message || "Mensagem não disponível",
      code: error?.code || "Código não disponível",
      name: error?.name || "Nome não disponível",
      stack: error?.stack || "Stack não disponível",
      toString: String(error),
    });

    return {
      app: null,
      db: null,
      ready: false,
      error: error.message,
    };
  }
};

export const getDirectFirestore = () => {
  return firestoreDB;
};

export const getDirectFirebaseApp = () => {
  return firebaseApp;
};

// Auto-inicializar
if (typeof window !== "undefined") {
  setTimeout(() => {
    directFirebaseInit().then((result) => {
      if (result.ready) {
        console.log("🎉 Direct Firebase Init: SUCESSO!");

        // Disponibilizar globalmente para debug
        (window as any).directFirebase = {
          app: result.app,
          db: result.db,
          init: directFirebaseInit,
        };
      } else {
        console.error("❌ Direct Firebase Init: FALHOU!", result.error);
      }
    });
  }, 500);
}

export default directFirebaseInit;
