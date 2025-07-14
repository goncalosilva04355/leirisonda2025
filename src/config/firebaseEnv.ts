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

// Configuração Firebase inteligente
export const LEIRIA_FIREBASE_CONFIG = {
  apiKey: !isPlaceholder(import.meta.env.VITE_FIREBASE_API_KEY)
    ? import.meta.env.VITE_FIREBASE_API_KEY!
    : "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE", // Leirisonda fallback
  authDomain: !isPlaceholder(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN)
    ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!
    : "leirisonda-16f8b.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://leirisonda-16f8b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: !isPlaceholder(import.meta.env.VITE_FIREBASE_PROJECT_ID)
    ? import.meta.env.VITE_FIREBASE_PROJECT_ID!
    : "leirisonda-16f8b",
  storageBucket: !isPlaceholder(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET)
    ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET!
    : "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: !isPlaceholder(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  )
    ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID!
    : "1067024677476",
  appId: !isPlaceholder(import.meta.env.VITE_FIREBASE_APP_ID)
    ? import.meta.env.VITE_FIREBASE_APP_ID!
    : "1:1067024677476:web:a5e5e30ed4b5a64b123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
};

// Função para obter configuração Firebase do Netlify
export function getFirebaseConfig() {
  const config = LEIRIA_FIREBASE_CONFIG;

  // Verificar se as vari��veis de ambiente do Netlify estão configuradas
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
