// Configuração Firebase única - projeto Leiria sempre sincronizado
// Usa variáveis de ambiente do Netlify quando disponíveis

// Configuração real do projeto Leiria com fallback para variáveis de ambiente
export const LEIRIA_FIREBASE_CONFIG = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
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
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "632599887141",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Q2QWQVH60L",
};

// Função única para obter configuração com validação
export function getFirebaseConfig() {
  // Validar configuração antes de retornar
  const config = LEIRIA_FIREBASE_CONFIG;

  // Verificar se todos os campos essenciais estão presentes
  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];
  const missingFields = requiredFields.filter(
    (field) => !config[field as keyof typeof config],
  );

  if (missingFields.length > 0) {
    console.error(
      "❌ Firebase Config: Campos obrigatórios em falta:",
      missingFields,
    );
    throw new Error(
      `Firebase config inválida: campos em falta - ${missingFields.join(", ")}`,
    );
  }

  // Verificar se projectId é válido
  if (!config.projectId || config.projectId.length < 3) {
    console.error("❌ Firebase Config: projectId inválido:", config.projectId);
    throw new Error("Firebase config inválida: projectId inválido");
  }

  console.log("✅ Firebase Config validada:", config.projectId);
  return config;
}

// Exportação padrão
export default LEIRIA_FIREBASE_CONFIG;
