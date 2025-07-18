// CONFIGURAÇÃO FIREBASE PRODUÇÃO - REST API
// Configuração otimizada para produção com Firebase via REST API

export const PRODUCTION_FIREBASE_CONFIG = {
  projectId: "leiria-1cfc9",
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  storageBucket: "leiria-1cfc9.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

// Base URL da REST API do Firestore para produção
export const FIRESTORE_REST_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PRODUCTION_FIREBASE_CONFIG.projectId}/databases/(default)/documents`;

// Configurações de produção
export const PRODUCTION_CONFIG_SETTINGS = {
  enableOfflineMode: true,
  enableAutoSync: true,
  enableRealTimeUpdates: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutos
  retryAttempts: 3,
  maxRetryDelay: 30000, // 30 segundos
  batchSize: 50,
  enableCompression: true,
  enableErrorReporting: true,
  enablePerformanceMonitoring: true,
  enableAnalytics: false, // Configurar se necessário
};

// Configurações de API específicas para produção
export const REST_API_CONFIG = {
  baseUrl: FIRESTORE_REST_BASE_URL,
  apiKey: PRODUCTION_FIREBASE_CONFIG.apiKey,
  timeout: 10000, // 10 segundos
  retries: 3,
  enableCaching: true,
  cacheExpiry: 5 * 60 * 1000, // 5 minutos
  enableBatching: true,
  batchDelay: 100, // 100ms
  enableCompression: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Coleções do Firestore
export const FIRESTORE_COLLECTIONS = {
  obras: "obras",
  piscinas: "piscinas",
  manutencoes: "manutencoes",
  utilizadores: "utilizadores",
  clientes: "clientes",
  localizacoes: "localizacoes",
  notificacoes: "notificacoes",
  system_tests: "system_tests",
  logs: "logs",
};

// Configurações de segurança
export const SECURITY_CONFIG = {
  enableCSP: true,
  enableHTTPSOnly: true,
  enableSecureHeaders: true,
  maxRequestSize: 1024 * 1024, // 1MB
  allowedOrigins: [
    "https://leirisonda.netlify.app",
    "https://leirisonda.vercel.app",
    "https://leiria-1cfc9.web.app",
    "https://leiria-1cfc9.firebaseapp.com",
  ],
};

// Verificar se está em modo produção
export const isProduction = () => {
  return (
    import.meta.env.MODE === "production" ||
    import.meta.env.PROD ||
    import.meta.env.NODE_ENV === "production"
  );
};

// Log de configuração
if (isProduction()) {
  console.log("🚀 Firebase REST API configurado para PRODUÇÃO");
  console.log("📊 Projeto:", PRODUCTION_FIREBASE_CONFIG.projectId);
  console.log("🌐 REST API:", FIRESTORE_REST_BASE_URL);
  console.log("⚡ Modo:", import.meta.env.MODE);
} else {
  console.log("🔧 Firebase REST API configurado para DESENVOLVIMENTO");
}

// Função para obter configuração baseada no ambiente
export const getFirebaseConfig = () => {
  return {
    ...PRODUCTION_FIREBASE_CONFIG,
    restApiUrl: FIRESTORE_REST_BASE_URL,
    settings: PRODUCTION_CONFIG_SETTINGS,
    restApi: REST_API_CONFIG,
    collections: FIRESTORE_COLLECTIONS,
    security: SECURITY_CONFIG,
    isProduction: isProduction(),
  };
};

export default getFirebaseConfig();
