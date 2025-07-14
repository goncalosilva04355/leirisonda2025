// Diagnóstico Firebase para debug
export async function diagnoseFirebaseSetup() {
  console.log("🔍 DIAGNÓSTICO FIREBASE INICIADO");
  console.log("====================================");

  // 1. Verificar variáveis de ambiente
  console.log("📋 Variáveis de Ambiente:");
  console.log("  VITE_FORCE_FIREBASE:", import.meta.env.VITE_FORCE_FIREBASE);
  console.log(
    "  VITE_FIREBASE_PROJECT_ID:",
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
  );
  console.log(
    "  VITE_FIREBASE_API_KEY:",
    import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Definida" : "❌ Não definida",
  );
  console.log(
    "  VITE_FIREBASE_AUTH_DOMAIN:",
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  );

  // 2. Tentar carregar configuração Firebase
  try {
    const { getFirebaseConfig } = await import("../config/firebaseEnv");
    const config = getFirebaseConfig();
    console.log("🔧 Configuração Firebase carregada:");
    console.log("  Projeto ID:", config.projectId);
    console.log("  Auth Domain:", config.authDomain);
    console.log("  API Key:", config.apiKey ? "✅ OK" : "❌ Faltando");
  } catch (error) {
    console.error("❌ Erro ao carregar configuração Firebase:", error);
  }

  // 3. Tentar inicializar Firebase App
  try {
    const { getApps, getApp, initializeApp } = await import("firebase/app");
    const { getFirebaseConfig } = await import("../config/firebaseEnv");

    let app;
    if (getApps().length === 0) {
      const config = getFirebaseConfig();
      app = initializeApp(config);
      console.log("🚀 Firebase App inicializada:", app.name);
    } else {
      app = getApp();
      console.log("✅ Firebase App já existente:", app.name);
    }

    console.log("📱 Projeto ativo:", app.options.projectId);

    // 4. Tentar verificar Firestore
    try {
      const { getFirestore } = await import("firebase/firestore");
      const db = getFirestore(app);
      console.log("✅ Firestore inicializado com sucesso");

      // 5. Tentar criar uma referência de teste
      const { doc } = await import("firebase/firestore");
      const testRef = doc(db, "diagnostic", "test");
      console.log("✅ Referência de teste criada");

      console.log("🎉 DIAGNÓSTICO: Firestore está FUNCIONAL!");
      return true;
    } catch (firestoreError: any) {
      if (
        firestoreError.message.includes("Service firestore is not available")
      ) {
        console.info(
          "📱 Firestore não habilitado - aplicação funcionando com localStorage",
        );
        console.info(
          `💡 Para habilitar: https://console.firebase.google.com/project/${app.options.projectId}/firestore`,
        );
      } else {
        console.warn(
          "⚠️ Erro inesperado no Firestore:",
          firestoreError.message,
        );
      }

      return false;
    }
  } catch (appError) {
    console.error("❌ Erro na inicialização do Firebase App:", appError);
    return false;
  }
}

// Executar diagnóstico automaticamente em desenvolvimento
if (import.meta.env.VITE_FORCE_FIREBASE) {
  setTimeout(() => {
    diagnoseFirebaseSetup();
  }, 2000);
}
