// Configuração Firebase limpa - baseada na configuração oficial
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

// Inicializar Firebase App
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Variables para lazy loading
let _db: any = null;
let _auth: any = null;

// Inicializar Firestore de forma lazy
const initFirestore = () => {
  if (!_db) {
    try {
      _db = getFirestore(app);
      console.log("✅ Firestore inicializado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar Firestore:", error);
      return null;
    }
  }
  return _db;
};

// Inicializar Auth de forma lazy
const initAuth = () => {
  if (!_auth) {
    try {
      _auth = getAuth(app);
      console.log("✅ Firebase Auth inicializado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar Auth:", error);
      return null;
    }
  }
  return _auth;
};

// Função para verificar se Firebase está pronto
export const isFirebaseReady = (): boolean => {
  return !!(app && initFirestore() && initAuth());
};

// Função para aguardar inicialização (compatibilidade)
export const waitForFirebaseInit = async (): Promise<boolean> => {
  try {
    initFirestore();
    initAuth();
    return !!(_db && _auth);
  } catch (error) {
    console.error("Erro na inicialização:", error);
    return false;
  }
};

// Funções para obter serviços (compatibilidade)
export const getDB = async () => {
  return initFirestore();
};

export const getAuthService = async () => {
  return initAuth();
};

// Getter functions que garantem inicialização
export const getDbInstance = () => initFirestore();
export const getAuthInstance = () => initAuth();

// Exports diretos com lazy loading (para compatibilidade)
Object.defineProperty(exports, "db", {
  get: () => initFirestore(),
});

Object.defineProperty(exports, "auth", {
  get: () => initAuth(),
});

// Export direto das variáveis (backup method)
export { db, auth };

// Exports principais
export { app, analytics };
export default app;
