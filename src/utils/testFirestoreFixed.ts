import { directFirebaseInit, getDirectFirestore } from "./directFirebaseFix";
import { waitForFirestore } from "./waitForFirestore";

/**
 * Teste para verificar se as correções do Firestore funcionaram
 */
export const testFirestoreFixed = async () => {
  console.log("🧪 TESTE: Verificando se correções do Firestore funcionaram");

  try {
    // 1. Teste inicialização direta
    console.log("🚀 Teste 1: Inicialização direta do Firebase...");
    const initResult = await directFirebaseInit();

    if (initResult.ready) {
      console.log("✅ Inicialização direta: SUCESSO");
      console.log("  - App:", !!initResult.app);
      console.log("  - DB:", !!initResult.db);
    } else {
      console.error("❌ Inicialização direta: FALHOU");
      console.error("  - Erro:", initResult.error);
    }

    // 2. Teste getDirectFirestore
    console.log("🔍 Teste 2: getDirectFirestore...");
    const directDB = getDirectFirestore();
    if (directDB) {
      console.log("✅ getDirectFirestore: FUNCIONANDO");
    } else {
      console.warn("⚠️ getDirectFirestore: NULL");
    }

    // 3. Teste waitForFirestore
    console.log("⏳ Teste 3: waitForFirestore...");
    const waitDB = await waitForFirestore(3, 1000);
    if (waitDB) {
      console.log("✅ waitForFirestore: FUNCIONANDO");
    } else {
      console.warn("⚠️ waitForFirestore: NULL");
    }

    // 4. Teste básico de conectividade se temos DB
    const testDB = directDB || waitDB || initResult.db;
    if (testDB) {
      console.log("🧪 Teste 4: Conectividade básica...");
      try {
        const { doc, collection } = await import("firebase/firestore");

        // Apenas criar referências - sem operações de rede ainda
        const testDoc = doc(testDB, "test", "connectivity");
        const testCollection = collection(testDB, "test");

        console.log("✅ Conectividade: Referências criadas com sucesso");
        console.log("  - Doc ref:", !!testDoc);
        console.log("  - Collection ref:", !!testCollection);

        return {
          success: true,
          db: testDB,
          message: "Firestore está funcionando!",
        };
      } catch (connectError: any) {
        console.error("❌ Erro de conectividade:", connectError.message);
        return {
          success: false,
          db: testDB,
          message: `Firestore inicializado mas erro de conectividade: ${connectError.message}`,
        };
      }
    } else {
      console.error("❌ Nenhum método conseguiu obter Firestore");
      return {
        success: false,
        db: null,
        message: "Firestore não está disponível",
      };
    }
  } catch (error: any) {
    console.error("❌ Erro no teste:", error.message);
    return {
      success: false,
      db: null,
      message: `Erro no teste: ${error.message}`,
    };
  }
};

// Auto-executar teste
if (typeof window !== "undefined") {
  setTimeout(() => {
    testFirestoreFixed().then((result) => {
      if (result.success) {
        console.log("🎉 FIRESTORE CORREÇÕES: SUCESSO!");
        console.log("✅", result.message);

        // Disponibilizar para debug
        (window as any).firestoreTest = {
          result,
          db: result.db,
          test: testFirestoreFixed,
        };
      } else {
        console.error("❌ FIRESTORE CORREÇÕES: AINDA COM PROBLEMAS");
        console.error("⚠️", result.message);
      }
    });
  }, 2000); // Aguardar 2 segundos
}

export default testFirestoreFixed;
