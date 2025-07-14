// Configuração Firebase única - projeto Leiria sempre sincronizado
// Usa variáveis de ambiente do Netlify quando disponíveis

// Configuração que prioriza variáveis do Netlify
export const LEIRIA_FIREBASE_CONFIG = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    import.meta.env.VITE_LEIRISONDA_FIREBASE_API_KEY ||
    "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    import.meta.env.VITE_LEIRISONDA_FIREBASE_AUTH_DOMAIN ||
    "leirisonda-16f8b.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    import.meta.env.VITE_LEIRISONDA_FIREBASE_DATABASE_URL ||
    "https://leirisonda-16f8b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    import.meta.env.VITE_LEIRISONDA_FIREBASE_PROJECT_ID ||
    "leirisonda-16f8b",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    import.meta.env.VITE_LEIRISONDA_FIREBASE_STORAGE_BUCKET ||
    "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    import.meta.env.VITE_LEIRISONDA_FIREBASE_MESSAGING_SENDER_ID ||
    "1067024677476",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    import.meta.env.VITE_LEIRISONDA_FIREBASE_APP_ID ||
    "1:1067024677476:web:a5e5e30ed4b5a64b123456",
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
    import.meta.env.VITE_LEIRISONDA_FIREBASE_MEASUREMENT_ID ||
    "G-XXXXXXXXXX",
};

// Função única para obter configuração com validação
export function getFirebaseConfig() {
  // Log das variáveis de ambiente para verificar se Netlify está funcionando
  console.log("🔍 Verificando variáveis de ambiente do Netlify:");
  console.log(
    "VITE_FIREBASE_API_KEY:",
    import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Presente" : "❌ Ausente",
  );
  console.log(
    "VITE_FIREBASE_PROJECT_ID:",
    import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✅ Presente" : "❌ Ausente",
  );
  console.log(
    "VITE_FIREBASE_AUTH_DOMAIN:",
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? "✅ Presente" : "❌ Ausente",
  );
  console.log(
    "VITE_LEIRISONDA_FIREBASE_API_KEY:",
    import.meta.env.VITE_LEIRISONDA_FIREBASE_API_KEY
      ? "✅ Presente"
      : "❌ Ausente",
  );
  console.log(
    "VITE_LEIRISONDA_FIREBASE_PROJECT_ID:",
    import.meta.env.VITE_LEIRISONDA_FIREBASE_PROJECT_ID
      ? "✅ Presente"
      : "❌ Ausente",
  );

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
  console.log("🔍 Configuração final a ser usada:");
  console.log("- projectId:", config.projectId);
  console.log("- authDomain:", config.authDomain);
  console.log("- apiKey:", config.apiKey.substring(0, 20) + "...");
  console.log("- storageBucket:", config.storageBucket);

  return config;
}

// Exportação padrão
export default LEIRIA_FIREBASE_CONFIG;
