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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);

// Função para verificar se Firebase está pronto
export const isFirebaseReady = (): boolean => {
  return !!(app && db && auth);
};

// Função para aguardar inicialização (compatibilidade)
export const waitForFirebaseInit = async (): Promise<boolean> => {
  return isFirebaseReady();
};

// Funções para obter serviços (compatibilidade)
export const getDB = async () => {
  return db;
};

export const getAuthService = async () => {
  return auth;
};

// Exports
export { app, analytics };
export default app;
