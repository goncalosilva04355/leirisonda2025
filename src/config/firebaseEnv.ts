// Configuração Firebase que prioriza Netlify mas funciona localmente

// Função para verificar se uma variável é um placeholder
function isPlaceholder(value: string | undefined): boolean {
  return (
    !value ||
    value.includes("your_") ||
    value.includes("_here") ||
    value.length < 10
  );
}

// Função para detectar ambiente de desenvolvimento
function isDevelopment(): boolean {
  return import.meta.env.DEV || import.meta.env.NODE_ENV !== "production";
}

// Configuração Firebase com fallbacks para desenvolvimento
export const LEIRIA_FIREBASE_CONFIG = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    (isDevelopment() ? "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw" : ""),
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    (isDevelopment() ? "leiria-1cfc9.firebaseapp.com" : ""),
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    (isDevelopment()
      ? "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app"
      : ""),
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    (isDevelopment() ? "leiria-1cfc9" : ""),
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    (isDevelopment() ? "leiria-1cfc9.firebasestorage.app" : ""),
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    (isDevelopment() ? "632599887141" : ""),
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    (isDevelopment() ? "1:632599887141:web:1290b471d41fc3ad64eecc" : ""),
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
    (isDevelopment() ? "G-Q2QWQVH60L" : ""),
};

// Função para obter configuração Firebase
export function getFirebaseConfig() {
  const config = LEIRIA_FIREBASE_CONFIG;

  // Determinar se está usando variáveis do Netlify ou fallback
  const usingNetlifyVars = !isPlaceholder(
    import.meta.env.VITE_FIREBASE_API_KEY,
  );
  const isNetlifyBuild =
    import.meta.env.NETLIFY === "true" ||
    import.meta.env.VITE_IS_NETLIFY === "true";
  const isDevMode = isDevelopment();

  console.log("🔍 Firebase Environment Detection:");
  console.log("  - Development Mode:", isDevMode);
  console.log("  - NETLIFY:", import.meta.env.NETLIFY);
  console.log("  - Using Netlify vars:", usingNetlifyVars);
  console.log("  - Is Netlify build:", isNetlifyBuild);

  if (usingNetlifyVars && isNetlifyBuild) {
    console.log("✅ Firebase: CONFIGURADO COM VARIÁVEIS DO NETLIFY (PRODUÇÃO)");
    console.log("🚀 Projeto ativo:", config.projectId);
    console.log("🔑 API Key configurada:", config.apiKey ? "✅" : "❌");
  } else if (isDevMode) {
    console.log("🔧 Firebase: MODO DESENVOLVIMENTO com fallbacks");
    console.log("🎯 Projeto dev:", config.projectId);
    console.log("📝 Produção usará variáveis VITE_FIREBASE_* do Netlify");
  } else {
    console.log("⚠️ Firebase: Modo desconhecido - verificar configuração");
  }

  // Verificar se a configuração é válida
  const isValidConfig =
    config.apiKey &&
    config.projectId &&
    config.authDomain &&
    config.databaseURL;

  if (!isValidConfig) {
    console.error("❌ Configuração Firebase inválida:");
    console.error("  - API Key:", config.apiKey ? "✅ OK" : "❌ FALTANDO");
    console.error(
      "  - Project ID:",
      config.projectId ? "✅ OK" : "❌ FALTANDO",
    );
    console.error(
      "  - Auth Domain:",
      config.authDomain ? "✅ OK" : "❌ FALTANDO",
    );
    console.error(
      "  - Database URL:",
      config.databaseURL ? "✅ OK" : "❌ FALTANDO",
    );

    if (!isDevMode) {
      throw new Error(
        "Firebase configuration is invalid and not in development mode",
      );
    }
    console.warn(
      "⚠️ Prosseguindo com configuração incompleta em desenvolvimento",
    );
  }

  return config;
}

// Exportação padrão
export default LEIRIA_FIREBASE_CONFIG;
