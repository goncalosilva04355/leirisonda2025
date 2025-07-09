/**
 * Teste simples de conectividade Firebase
 */

export async function testFirebaseConnection(): Promise<{
  success: boolean;
  details: string;
  issues: string[];
}> {
  console.log("🧪 Testando conectividade Firebase...");

  const issues: string[] = [];

  try {
    // 1. Testar se Firebase config está carregado
    const { isFirebaseReady, getDB, getAuthService } = await import(
      "../firebase/config"
    );

    // 2. Verificar se Firebase está ready
    const ready = isFirebaseReady();
    if (!ready) {
      issues.push("❌ Firebase não está ready");
    }

    // 3. Testar Firestore
    const db = await getDB();
    if (!db) {
      issues.push("❌ Firestore não inicializou");
    } else {
      console.log("✅ Firestore disponível");

      // Teste básico de read
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const testDoc = doc(db, "__test__", "connectivity");
        await getDoc(testDoc);
        console.log("✅ Firestore read test OK");
      } catch (readError: any) {
        issues.push(
          `❌ Firestore read failed: ${readError.code || readError.message}`,
        );
      }
    }

    // 4. Testar Auth
    const auth = await getAuthService();
    if (!auth) {
      issues.push("❌ Firebase Auth não inicializou");
    } else {
      console.log("✅ Firebase Auth disponível");
    }

    // 5. Resumo
    if (issues.length === 0) {
      return {
        success: true,
        details: "✅ Firebase funcionando corretamente!",
        issues: [],
      };
    } else {
      return {
        success: false,
        details: `❌ ${issues.length} problemas encontrados`,
        issues,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      details: `❌ Erro no teste: ${error.message}`,
      issues: [`Erro geral: ${error.message}`],
    };
  }
}

// Executar teste automaticamente
testFirebaseConnection().then((result) => {
  console.log("🧪 RESULTADO DO TESTE FIREBASE:");
  console.log("Success:", result.success);
  console.log("Details:", result.details);
  if (result.issues.length > 0) {
    console.log("Issues:", result.issues);
  }
});
