// Configuração Firebase única - apenas variáveis de ambiente do Netlify
// SEM fallbacks de desenvolvimento

// Configuração Firebase direta do Netlify (produção)
export const LEIRIA_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: import.meta.env.VITE_FIREBASE_APP_ID!,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Função para obter configuração Firebase do Netlify
export function getFirebaseConfig() {
  const config = LEIRIA_FIREBASE_CONFIG;

  // Verificar se as variáveis de ambiente do Netlify estão configuradas
  if (!config.apiKey || !config.projectId || !config.authDomain) {
    console.error("❌ Variáveis Firebase não configuradas:");
    console.error("VITE_FIREBASE_API_KEY:", config.apiKey ? "✅" : "❌");
    console.error("VITE_FIREBASE_PROJECT_ID:", config.projectId ? "✅" : "❌");
    console.error(
      "VITE_FIREBASE_AUTH_DOMAIN:",
      config.authDomain ? "✅" : "❌",
    );

    throw new Error(
      "Variáveis de ambiente Firebase não configuradas no Netlify. Configure VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_AUTH_DOMAIN no Netlify.",
    );
  }

  console.log("✅ Firebase configurado para produção:", config.projectId);
  return config;
}

// Exportação padrão
export default LEIRIA_FIREBASE_CONFIG;
