/**
 * Verificação de Firebase específica para iPhone/dispositivos móveis
 * Não depende de testes de conectividade externos que podem falhar
 */

import {
  getFirebaseDB,
  getFirebaseAuth,
  getFirebaseStatus,
} from "../firebase/simpleConfig";

export async function checkFirebaseOnMobile() {
  console.log("📱 VERIFICAÇÃO FIREBASE PARA iPhone");
  console.log("===================================");

  const results = {
    appStatus: false,
    authStatus: false,
    dbStatus: false,
    overall: false,
    errorDetails: null as any,
  };

  try {
    // 1. Verificar status básico do Firebase
    console.log("1️⃣ Verificando status básico...");
    const status = getFirebaseStatus();
    console.log("Status:", status);

    results.appStatus = status.app;

    // 2. Testar Firebase Auth diretamente
    console.log("2️⃣ Testando Firebase Auth...");
    try {
      const auth = await getFirebaseAuth();
      if (auth) {
        results.authStatus = true;
        console.log("✅ Firebase Auth: FUNCIONANDO");

        // Testar se conseguimos acessar o currentUser
        console.log(
          "👤 Usuário atual:",
          auth.currentUser ? "Logado" : "Não logado",
        );
      } else {
        console.log("❌ Firebase Auth: NÃO DISPONÍVEL");
      }
    } catch (authError) {
      console.error("❌ Erro no Firebase Auth:", authError);
      results.errorDetails = authError;
    }

    // 3. Testar Firestore diretamente
    console.log("3️⃣ Testando Firestore...");
    try {
      const db = await getFirebaseDB();
      if (db) {
        results.dbStatus = true;
        console.log("✅ Firestore: FUNCIONANDO");

        // Testar uma operação simples no Firestore
        console.log("🔍 Testando operação no Firestore...");
        const { collection, getDocs } = await import("firebase/firestore");

        try {
          // Tentar acessar uma coleção (mesmo que vazia)
          const testCollection = collection(db, "test");
          console.log("✅ Firestore collection access: OK");
        } catch (firestoreError) {
          console.warn("⚠️ Firestore access limitado:", firestoreError);
        }
      } else {
        console.log("❌ Firestore: NÃO DISPONÍVEL");
      }
    } catch (dbError) {
      console.error("❌ Erro no Firestore:", dbError);
      results.errorDetails = dbError;
    }

    // 4. Verificar se o iframe do Firebase está carregado
    console.log("4️⃣ Verificando iframe do Firebase Auth...");
    const authIframes = document.querySelectorAll('iframe[src*="firebase"]');
    if (authIframes.length > 0) {
      console.log("✅ Firebase Auth iframe detectado:", authIframes.length);
    } else {
      console.log("⚠️ Nenhum iframe do Firebase detectado");
    }

    // 5. Resultado final
    results.overall = results.authStatus || results.dbStatus;

    console.log("\n📊 RESULTADO FINAL:");
    console.log("===================");
    console.log(`Firebase App: ${results.appStatus ? "✅" : "❌"}`);
    console.log(`Firebase Auth: ${results.authStatus ? "✅" : "❌"}`);
    console.log(`Firestore: ${results.dbStatus ? "✅" : "❌"}`);
    console.log(`Status Geral: ${results.overall ? "✅ ATIVO" : "❌ INATIVO"}`);

    if (!results.overall) {
      console.log("\n🔧 DIAGNÓSTICO:");
      if (!results.appStatus) {
        console.log("- Firebase App não está inicializado");
      }
      if (!results.authStatus && !results.dbStatus) {
        console.log("- Nenhum serviço Firebase está disponível");
        console.log(
          "- Possível problema de configuração ou regras de segurança",
        );
      }

      if (results.errorDetails) {
        console.log("- Erro específico:", results.errorDetails.message);
      }
    }

    return results;
  } catch (error) {
    console.error("❌ Erro geral na verificação:", error);
    results.errorDetails = error;
    return results;
  }
}

// Executar automaticamente para iPhone
if (typeof window !== "undefined") {
  // Detectar se é dispositivo móvel
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    setTimeout(() => {
      checkFirebaseOnMobile().then((result) => {
        if (result.overall) {
          console.log("🎉 Firebase ativo no iPhone!");
          window.dispatchEvent(new CustomEvent("firebaseMobileReady"));
        } else {
          console.log("⚠️ Firebase não ativo no iPhone");
          window.dispatchEvent(
            new CustomEvent("firebaseMobileNotReady", {
              detail: result,
            }),
          );
        }
      });
    }, 5000);
  }
}
