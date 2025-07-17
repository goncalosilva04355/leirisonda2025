// Helper centralizado para configuração Firebase com fallbacks seguros
// Usado por todos os componentes e serviços para garantir configuração consistente

// Função para detectar ambiente de desenvolvimento
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || import.meta.env.NODE_ENV !== "production";
};

// Configuração de desenvolvimento segura (apenas para desenvolvimento local)
const DEV_CONFIG = {
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

// Função para obter configuração Firebase com fallbacks apropriados
export const getFirebaseConfig = () => {
  const isDevMode = isDevelopment();

  const config = {
    apiKey:
      import.meta.env.VITE_FIREBASE_API_KEY ||
      (isDevMode ? DEV_CONFIG.apiKey : ""),
    authDomain:
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
      (isDevMode ? DEV_CONFIG.authDomain : ""),
    databaseURL:
      import.meta.env.VITE_FIREBASE_DATABASE_URL ||
      (isDevMode ? DEV_CONFIG.databaseURL : ""),
    projectId:
      import.meta.env.VITE_FIREBASE_PROJECT_ID ||
      (isDevMode ? DEV_CONFIG.projectId : ""),
    storageBucket:
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
      (isDevMode ? DEV_CONFIG.storageBucket : ""),
    messagingSenderId:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
      (isDevMode ? DEV_CONFIG.messagingSenderId : ""),
    appId:
      import.meta.env.VITE_FIREBASE_APP_ID ||
      (isDevMode ? DEV_CONFIG.appId : ""),
    measurementId:
      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
      (isDevMode ? DEV_CONFIG.measurementId : ""),
  };

  // Log da configuração atual
  if (isDevMode) {
    console.log("🔧 Firebase: Modo desenvolvimento com fallbacks");
    console.log("📍 Project ID:", config.projectId);
    console.log("🔑 Using env vars:", !!import.meta.env.VITE_FIREBASE_API_KEY);
  }

  return config;
};

// Função para validar se a configuração está completa
export const validateFirebaseConfig = (config: any): boolean => {
  const required = ["apiKey", "authDomain", "projectId"];
  const missing = required.filter((field) => !config[field]);

  if (missing.length > 0) {
    console.error("❌ Configuração Firebase incompleta:", missing);
    return false;
  }

  return true;
};

// Exportação da configuração padrão
export default getFirebaseConfig();
