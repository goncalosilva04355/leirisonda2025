/**
 * Diagnóstico completo do Firebase para identificar por que não está ativo
 */

export async function runFirebaseCompleteDiagnosis() {
  console.log("\n🔍 DIAGNÓSTICO COMPLETO DO FIREBASE");
  console.log("====================================");

  const results = {
    networkConnectivity: false,
    firebaseReachable: false,
    configValid: false,
    appInitialized: false,
    authAvailable: false,
    firestoreAvailable: false,
    rulesAccessible: false,
  };

  try {
    // 1. Teste de conectividade básica
    console.log("\n1️⃣ Testando conectividade de rede...");
    try {
      await fetch("https://www.google.com/favicon.ico", {
        method: "HEAD",
        mode: "no-cors",
      });
      results.networkConnectivity = true;
      console.log("✅ Conectividade de rede: OK");
    } catch (error) {
      console.error("❌ Conectividade de rede: FALHOU", error);
    }

    // 2. Teste de alcance do Firebase
    console.log("\n2️⃣ Testando alcance dos servidores Firebase...");
    try {
      await fetch("https://firebase.googleapis.com/", {
        method: "HEAD",
        mode: "no-cors",
      });
      results.firebaseReachable = true;
      console.log("✅ Servidores Firebase: ACESSÍVEIS");
    } catch (error) {
      console.error("❌ Servidores Firebase: INACESSÍVEIS", error);
    }

    // 3. Validação da configuração
    console.log("\n3️⃣ Validando configuração Firebase...");
    const config = {
      apiKey: import.meta.env.VITE_LEIRISONDA_FIREBASE_API_KEY || "",
      authDomain:
        import.meta.env.VITE_LEIRISONDA_FIREBASE_AUTH_DOMAIN ||
        "leirisonda-16f8b.firebaseapp.com",
      projectId:
        import.meta.env.VITE_LEIRISONDA_FIREBASE_PROJECT_ID ||
        "leirisonda-16f8b",
      storageBucket:
        import.meta.env.VITE_LEIRISONDA_FIREBASE_STORAGE_BUCKET ||
        "leirisonda-16f8b.firebasestorage.app",
      messagingSenderId:
        import.meta.env.VITE_LEIRISONDA_FIREBASE_MESSAGING_SENDER_ID ||
        "540456875574",
      appId: import.meta.env.VITE_LEIRISONDA_FIREBASE_APP_ID || "",
    };

    if (config.apiKey && config.projectId && config.authDomain) {
      results.configValid = true;
      console.log("✅ Configuração Firebase: VÁLIDA");
      console.log("📋 Projeto:", config.projectId);
      console.log("📋 Domínio:", config.authDomain);
    } else {
      console.error("❌ Configuração Firebase: INVÁLIDA");
    }

    // 4. Teste do projeto Firebase
    console.log("\n4️⃣ Testando projeto Firebase específico...");
    try {
      const projectUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`;
      const response = await fetch(projectUrl, {
        method: "HEAD",
        mode: "no-cors",
      });
      console.log("✅ Projeto Firebase: ACESSÍVEL");
    } catch (error) {
      console.warn("⚠️ Não foi possível verificar o projeto:", error);
    }

    // 5. Importar e testar inicialização do Firebase
    console.log("\n5️⃣ Testando inicialização do Firebase App...");
    try {
      const { initializeApp, getApps } = await import("firebase/app");

      const existingApps = getApps();
      if (existingApps.length > 0) {
        console.log("✅ Firebase App: JÁ INICIALIZADO");
        console.log("📋 Apps encontrados:", existingApps.length);
        results.appInitialized = true;
      } else {
        const app = initializeApp(config);
        if (app) {
          results.appInitialized = true;
          console.log("✅ Firebase App: INICIALIZADO COM SUCESSO");
        }
      }
    } catch (error) {
      console.error("❌ Firebase App inicialização: FALHOU", error);
    }

    // 6. Teste do Firebase Auth
    console.log("\n6️⃣ Testando Firebase Auth...");
    try {
      const { getAuth } = await import("firebase/auth");
      const { getApps } = await import("firebase/app");

      const apps = getApps();
      if (apps.length > 0) {
        const auth = getAuth(apps[0]);
        if (auth) {
          results.authAvailable = true;
          console.log("✅ Firebase Auth: DISPONÍVEL");
        }
      }
    } catch (error) {
      console.error("❌ Firebase Auth: FALHOU", error);
    }

    // 7. Teste do Firestore (DISABLED - causing getImmediate errors)
    console.log("\n7️⃣ Testando Firestore... (DESABILITADO)");
    console.log(
      "⚠️ Teste de Firestore desabilitado para evitar erros getImmediate",
    );
    console.log(
      "💡 Use NoGetImmediateFirebase.testConnectivity() para teste seguro",
    );

    // Não fazer teste direto que causa getImmediate
    results.firestoreAvailable = false;

    // 8. Resumo final
    console.log("\n📊 RESUMO DO DIAGNÓSTICO:");
    console.log("==========================");
    console.log(`Rede: ${results.networkConnectivity ? "✅" : "❌"}`);
    console.log(`Firebase Servers: ${results.firebaseReachable ? "✅" : "❌"}`);
    console.log(`Configuração: ${results.configValid ? "✅" : "❌"}`);
    console.log(`App Inicializado: ${results.appInitialized ? "✅" : "❌"}`);
    console.log(`Auth Disponível: ${results.authAvailable ? "✅" : "❌"}`);
    console.log(
      `Firestore Disponível: ${results.firestoreAvailable ? "✅" : "❌"}`,
    );

    const overallStatus =
      results.appInitialized &&
      (results.authAvailable || results.firestoreAvailable);

    if (overallStatus) {
      console.log("\n🎉 FIREBASE ESTÁ FUNCIONANDO!");
    } else {
      console.log("\n⚠️ FIREBASE NÃO ESTÁ ATIVO");
      console.log("\nPossíveis soluções:");

      if (!results.networkConnectivity) {
        console.log("- Verificar conexão com a internet");
      }
      if (!results.firebaseReachable) {
        console.log("- Verificar firewall/proxy bloqueando Firebase");
      }
      if (!results.configValid) {
        console.log("- Verificar configuração do projeto Firebase");
      }
      if (!results.appInitialized) {
        console.log("- Verificar inicialização do Firebase App");
      }
      if (!results.authAvailable && !results.firestoreAvailable) {
        console.log("- Verificar regras de segurança do Firebase");
        console.log("- Verificar quota do projeto Firebase");
      }
    }

    return results;
  } catch (error) {
    console.error("❌ Erro durante diagnóstico:", error);
    return results;
  }
}

// Executar automaticamente em modo desenvolvimento
if (typeof window !== "undefined" && import.meta.env.DEV) {
  setTimeout(() => {
    runFirebaseCompleteDiagnosis();
  }, 4000);
}
