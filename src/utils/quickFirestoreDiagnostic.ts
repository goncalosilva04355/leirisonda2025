// Diagnóstico rápido do estado do Firestore
export async function quickFirestoreDiagnostic() {
  console.log("🔍 === DIAGNÓSTICO RÁPIDO FIRESTORE ===");

  // 1. Verificar variáveis de ambiente
  console.log("📋 Variáveis de Ambiente:");
  console.log("  - DEV mode:", import.meta.env.DEV);
  console.log("  - NETLIFY:", import.meta.env.NETLIFY);
  console.log("  - VITE_IS_NETLIFY:", import.meta.env.VITE_IS_NETLIFY);
  console.log("  - VITE_FORCE_FIREBASE:", import.meta.env.VITE_FORCE_FIREBASE);

  // 2. Verificar configuração Firebase
  console.log("🔥 Configuração Firebase:");
  try {
    const { getFirebaseConfig } = await import("../config/firebaseEnv");
    const config = getFirebaseConfig();
    console.log("  - Project ID:", config.projectId);
    console.log("  - Auth Domain:", config.authDomain);
    console.log("  - API Key configurado:", !!config.apiKey);
  } catch (error: any) {
    console.error("  ❌ Erro ao carregar configuração:", error.message);
  }

  // 3. Verificar estado do Firebase App
  console.log("📱 Estado do Firebase App:");
  try {
    const { getApps } = await import("firebase/app");
    const apps = getApps();
    console.log("  - Apps inicializadas:", apps.length);
    if (apps.length > 0) {
      console.log("  - App principal:", apps[0].name);
      console.log("  - Project ID ativo:", apps[0].options.projectId);
    }
  } catch (error: any) {
    console.error("  ❌ Erro ao verificar Firebase App:", error.message);
  }

  // 4. Verificar instância do Firestore
  console.log("💾 Estado do Firestore:");
  try {
    const { getFirebaseFirestore, isFirestoreReady } = await import(
      "../firebase/firestoreConfig"
    );
    console.log("  - Firestore pronto:", isFirestoreReady());
    const db = getFirebaseFirestore();
    console.log("  - Instância disponível:", !!db);
  } catch (error: any) {
    console.error("  ❌ Erro ao verificar Firestore:", error.message);
  }

  // 5. Verificar localStorage para fallback
  console.log("💾 LocalStorage (fallback):");
  try {
    const storageTest = "firestore_test_" + Date.now();
    localStorage.setItem(storageTest, "test");
    const retrieved = localStorage.getItem(storageTest);
    localStorage.removeItem(storageTest);
    console.log("  - LocalStorage funcional:", retrieved === "test");
  } catch (error: any) {
    console.error("  ❌ LocalStorage com problemas:", error.message);
  }

  // 6. Resumo final
  console.log("📊 RESUMO:");
  const isNetlifyBuild =
    import.meta.env.NETLIFY === "true" ||
    import.meta.env.VITE_IS_NETLIFY === "true";
  const forceFirebase = import.meta.env.VITE_FORCE_FIREBASE === "true";

  if (!isNetlifyBuild && !forceFirebase) {
    console.log("  ⚠️ Firebase DESATIVADO em modo de desenvolvimento");
    console.log("  📝 Usando apenas localStorage como fallback");
    console.log("  💡 Para testar Firebase: adicione VITE_FORCE_FIREBASE=true");
  } else {
    console.log("  🔥 Firebase ATIVO - modo produção/forçado");
    console.log("  💾 Deve estar a usar Firestore para armazenamento");
  }

  console.log("🔍 === FIM DO DIAGNÓSTICO ===");
}

// Executar diagnóstico automaticamente se em modo de desenvolvimento
if (import.meta.env.DEV) {
  setTimeout(async () => {
    await quickFirestoreDiagnostic();
  }, 2000);
}
