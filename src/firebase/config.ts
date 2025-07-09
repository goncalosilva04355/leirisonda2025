// Configuração Firebase ultra-segura - evita erros getImmediate
import { initializeApp } from "firebase/app";

// Configuração Firebase oficial
const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

// Inicializar apenas Firebase App (sem serviços)
let app: any = null;
let _db: any = null;
let _auth: any = null;
let _analytics: any = null;
let initializationFailed = false;

// Inicializar Firebase App de forma segura
try {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase App inicializado");
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase App:", error);
  initializationFailed = true;
}

// Função super-segura para inicializar Firestore
const initFirestore = async () => {
  if (initializationFailed || !app) {
    console.warn("⚠️ Firebase App não disponível, usando fallback local");
    return null;
  }

  if (_db) {
    return _db;
  }

  try {
    // Aguardar um pouco antes de tentar inicializar
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { getFirestore } = await import("firebase/firestore");

    // Tentar inicializar com timeout
    const initPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout ao inicializar Firestore"));
      }, 5000);

      try {
        const db = getFirestore(app);
        clearTimeout(timeout);
        resolve(db);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });

    _db = await initPromise;
    console.log("✅ Firestore inicializado com sucesso (após aguardar)");
    return _db;
  } catch (error: any) {
    console.error("❌ Erro ao inicializar Firestore:", error);
    console.log("📱 Usando modo local - Firebase não disponível");
    initializationFailed = true;
    return null;
  }
};

// Função super-segura para inicializar Auth
const initAuth = async () => {
  if (initializationFailed || !app) {
    return null;
  }

  if (_auth) {
    return _auth;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { getAuth } = await import("firebase/auth");
    _auth = getAuth(app);
    console.log("✅ Firebase Auth inicializado");
    return _auth;
  } catch (error) {
    console.error("❌ Erro ao inicializar Auth:", error);
    return null;
  }
};

// Função para verificar se Firebase está pronto (sem forçar inicialização)
export const isFirebaseReady = (): boolean => {
  if (initializationFailed) {
    return false;
  }
  return !!(app && _db && _auth);
};

// Função para aguardar inicialização SEM forçar
export const waitForFirebaseInit = async (): Promise<boolean> => {
  if (initializationFailed) {
    return false;
  }

  try {
    // Não forçar inicialização aqui - apenas verificar se já está pronto
    return isFirebaseReady();
  } catch (error) {
    return false;
  }
};

// Funções para obter serviços (retorna null se não disponível)
export const getDB = async () => {
  if (initializationFailed) {
    return null;
  }
  return await initFirestore();
};

export const getAuthService = async () => {
  if (initializationFailed) {
    return null;
  }
  return await initAuth();
};

// Mock objects que retornam null para evitar erros
const mockDb = new Proxy(
  {},
  {
    get() {
      return null;
    },
  },
);

const mockAuth = new Proxy(
  {},
  {
    get() {
      return null;
    },
  },
);

// Exports seguros - retorna mocks se Firebase falhar
export const db = new Proxy(
  {},
  {
    get(target, prop) {
      if (initializationFailed || !_db) {
        return null;
      }
      return _db?.[prop];
    },
  },
);

export const auth = new Proxy(
  {},
  {
    get(target, prop) {
      if (initializationFailed || !_auth) {
        return null;
      }
      return _auth?.[prop];
    },
  },
);

// Analytics opcional
const initAnalytics = async () => {
  if (initializationFailed || !app) {
    return null;
  }

  try {
    const { getAnalytics } = await import("firebase/analytics");
    _analytics = getAnalytics(app);
    return _analytics;
  } catch (error) {
    // Analytics é opcional - não importa se falhar
    return null;
  }
};

// Inicialização gradual e segura (não bloqueia a app)
setTimeout(async () => {
  if (!initializationFailed) {
    console.log("🔄 Tentando inicializar Firebase services...");

    // Tentar inicializar sem bloquear
    try {
      await initFirestore();
      await initAuth();
      await initAnalytics();

      if (_db && _auth) {
        console.log("🔥 Firebase totalmente inicializado!");
      } else {
        console.log("⚠️ Firebase parcialmente inicializado");
      }
    } catch (error) {
      console.log("📱 App funcionará em modo local");
    }
  }
}, 2000); // Aguardar 2 segundos para app estabilizar

// Exports principais
export { app };
export default app;
