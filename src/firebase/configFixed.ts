// Configuração Firebase corrigida - evita completamente erro getImmediate
import { initializeApp, getApps, getApp } from "firebase/app";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:6027bf35a9d908b264eecc",
  measurementId: "G-51GLBMB6JQ",
};

// Inicialização segura do Firebase App
let app: any = null;

try {
  // Verificar se já existe uma app inicializada
  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
    console.log("✅ Firebase App já inicializado:", app.name);
  } else {
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase App inicializado com sucesso:", app.name);
  }
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase App:", error);
  app = null;
}

// Funções seguras para obter serviços (evitam getImmediate)
export const getFirebaseApp = () => {
  try {
    const apps = getApps();
    return apps.length > 0 ? apps[0] : null;
  } catch (error) {
    console.error("Erro ao obter Firebase App:", error);
    return null;
  }
};

export const getAuthSafe = async () => {
  try {
    const app = getFirebaseApp();
    if (!app) return null;

    const { getAuth } = await import("firebase/auth");
    return getAuth(app);
  } catch (error) {
    console.warn("Auth não disponível:", error);
    return null;
  }
};

export const getFirestoreSafe = async () => {
  try {
    const app = getFirebaseApp();
    if (!app) {
      console.warn("Firebase App not available for Firestore");
      return null;
    }

    console.log("🔥 Getting Firestore for app:", app.name);

    const { getFirestore, connectFirestoreEmulator } = await import(
      "firebase/firestore"
    );

    // Simple direct initialization
    const db = getFirestore(app);

    if (db) {
      console.log("✅ Firestore instance obtained successfully");
      return db;
    } else {
      console.warn("❌ Failed to get Firestore instance");
      return null;
    }
  } catch (error: any) {
    console.error("❌ Firestore initialization error:", error.message);
    return null;
  }
};

export const getStorageSafe = async () => {
  try {
    const app = getFirebaseApp();
    if (!app) return null;

    const { getStorage } = await import("firebase/storage");
    return getStorage(app);
  } catch (error) {
    console.warn("Storage não disponível:", error);
    return null;
  }
};

// Verificações de status seguras
export const isFirebaseReady = (): boolean => {
  try {
    const app = getFirebaseApp();
    return !!app;
  } catch (error) {
    return false;
  }
};

export const getFirebaseStatus = async (): Promise<{
  app: boolean;
  auth: boolean;
  firestore: boolean;
  storage: boolean;
}> => {
  const status = {
    app: false,
    auth: false,
    firestore: false,
    storage: false,
  };

  try {
    // Test App
    status.app = isFirebaseReady();

    if (status.app) {
      // Test Auth
      const auth = await getAuthSafe();
      status.auth = !!auth;

      // Test Firestore
      const firestore = await getFirestoreSafe();
      status.firestore = !!firestore;

      // Test Storage
      const storage = await getStorageSafe();
      status.storage = !!storage;
    }
  } catch (error) {
    console.error("Erro ao verificar status Firebase:", error);
  }

  return status;
};

// Export da app principal
export { app };
export default app;

// Informações de debug
if (app) {
  console.log("🔥 Firebase Config Fixed inicializado:", {
    projectId: app.options.projectId,
    authDomain: app.options.authDomain,
    storageBucket: app.options.storageBucket,
  });
} else {
  console.error("❌ Firebase Config Fixed falhou na inicialização");
}
