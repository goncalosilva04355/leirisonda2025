// Configuração Firebase única - projeto Leiria sempre sincronizado
// Usa variáveis de ambiente do Netlify quando disponíveis

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

// Fun��ão única para obter configuração com validação
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
