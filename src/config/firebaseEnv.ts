// Configurações centralizadas do Firebase usando variáveis de ambiente
// Este ficheiro evita o hardcoding de secrets

// Configuração principal do projeto (Leiria)
export const LEIRIA_FIREBASE_CONFIG = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyC5Pp6xbF4YJjGkJpfG6xXfJR4jBjJJZ4w",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "leiria-1cfc9",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "leiria-1cfc9.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ABCDEFGHIJ",
};

// Configuração legacy do projeto (Leirisonda)
export const LEIRISONDA_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_LEIRISONDA_FIREBASE_API_KEY || "",
  authDomain:
    import.meta.env.VITE_LEIRISONDA_FIREBASE_AUTH_DOMAIN ||
    "leirisonda-16f8b.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_LEIRISONDA_FIREBASE_DATABASE_URL ||
    "https://leirisonda-16f8b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:
    import.meta.env.VITE_LEIRISONDA_FIREBASE_PROJECT_ID || "leirisonda-16f8b",
  storageBucket:
    import.meta.env.VITE_LEIRISONDA_FIREBASE_STORAGE_BUCKET ||
    "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_LEIRISONDA_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_LEIRISONDA_FIREBASE_APP_ID || "",
};

// Função para obter a configuração padrão
export function getDefaultFirebaseConfig() {
  return LEIRIA_FIREBASE_CONFIG;
}

// Função para obter a configuração legacy
export function getLegacyFirebaseConfig() {
  return LEIRISONDA_FIREBASE_CONFIG;
}

// Função para detectar qual configuração usar baseado no ambiente
export function getFirebaseConfig() {
  // Se houver variáveis de ambiente específicas do Leirisonda, usar essas
  if (import.meta.env.VITE_USE_LEIRISONDA_CONFIG === "true") {
    return LEIRISONDA_FIREBASE_CONFIG;
  }
  // Caso contrário, usar a configuração principal
  return LEIRIA_FIREBASE_CONFIG;
}
