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

  console.log("🔍 Firebase Environment Detection:");
  console.log("  - NETLIFY:", import.meta.env.NETLIFY);
  console.log("  - VITE_IS_NETLIFY:", import.meta.env.VITE_IS_NETLIFY);
  console.log("  - Using Netlify vars:", usingNetlifyVars);
  console.log("  - Is Netlify build:", isNetlifyBuild);

  if (usingNetlifyVars && isNetlifyBuild) {
    console.log("✅ Firebase: CONFIGURADO COM VARIÁVEIS DO NETLIFY");
    console.log("🚀 Projeto ativo:", config.projectId);
    console.log("🔑 API Key configurada:", config.apiKey ? "✅" : "❌");
    console.log("🏠 Auth Domain:", config.authDomain);
  } else if (usingNetlifyVars) {
    console.log("⚠️ Firebase: usando variáveis mas não no Netlify");
    console.log("🔄 Projeto:", config.projectId);
  } else {
    console.log("🔄 Firebase: usando fallback local (leiria-1cfc9)");
    console.log("📝 Deploy no Netlify usará as suas variáveis VITE_FIREBASE_*");
    console.log("🎯 Projeto fallback:", config.projectId);
  }

  // Verificar se a configuração é válida
  if (!config.apiKey || !config.projectId || !config.authDomain) {
    console.error("❌ Configuração Firebase inv��lida:", {
      apiKey: !!config.apiKey,
      projectId: !!config.projectId,
      authDomain: !!config.authDomain,
    });
    throw new Error("Configuração Firebase inválida");
  }

  return config;
}

// Exportação padrão
export default LEIRIA_FIREBASE_CONFIG;
