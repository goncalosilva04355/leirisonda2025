/**
 * Firebase Status Checker - Diagnóstico completo
 */

import {
  getFirebaseDB,
  getFirebaseAuth,
  getFirebaseStatus,
} from "../firebase/simpleConfig";

export async function checkFirebaseStatus() {
  console.log("🔍 VERIFICANDO STATUS DO FIREBASE");
  console.log("===============================");

  try {
    // 1. Verificar status geral
    const status = getFirebaseStatus();
    console.log("📊 Status Geral:", status);

    // 2. Tentar obter Firestore
    console.log("\n🔄 Testando Firestore...");
    const db = await getFirebaseDB();
    console.log(
      "Firestore result:",
      db ? "✅ DISPONÍVEL" : "❌ NÃO DISPONÍVEL",
    );

    // 3. Tentar obter Auth
    console.log("\n🔐 Testando Auth...");
    const auth = await getFirebaseAuth();
    console.log("Auth result:", auth ? "✅ DISPONÍVEL" : "❌ NÃO DISPONÍVEL");

    // 4. Verificar conectividade
    console.log("\n🌐 Testando conectividade Firebase...");
    try {
      const response = await fetch("https://firebase.googleapis.com/", {
        method: "HEAD",
        mode: "no-cors",
      });
      console.log("Conectividade:", "✅ OK");
    } catch (error) {
      console.log("Conectividade:", "❌ FALHOU", error);
    }

    // 5. Resumo final
    console.log("\n📋 RESUMO:");
    if (status.ready) {
      console.log("🎉 Firebase está ATIVO e funcionando!");
    } else {
      console.log("⚠️ Firebase NÃO está ativo");
      console.log("Possíveis causas:");
      console.log("- Configuração incorreta");
      console.log("- Problemas de rede");
      console.log("- Erro na inicialização");
      console.log("- Projeto Firebase inativo");
    }

    return status;
  } catch (error) {
    console.error("❌ Erro ao verificar Firebase:", error);
    return { ready: false, error: error };
  }
}

// Verificar automaticamente em desenvolvimento
if (typeof window !== "undefined") {
  // Aguardar um pouco para a app inicializar
  setTimeout(() => {
    checkFirebaseStatus();
  }, 3000);
}
