import { simpleForceFirestoreService } from "../services/simpleForceFirestore";
import { getSimpleFirestoreStatus } from "./simpleFirestoreFix";

/**
 * Teste SIMPLES para verificar se Firestore está funcionando
 */
export const testSimpleFirestore = async () => {
  console.log("🧪 TESTE SIMPLES: Verificando Firestore");

  try {
    // 1. Status
    const status = getSimpleFirestoreStatus();
    console.log("📊 Status:", status);

    if (!status.hasDB) {
      console.warn("⚠️ Firestore não inicializado ainda");
      return { success: false, message: "Firestore não inicializado" };
    }

    // 2. Teste básico
    console.log("🧪 Testando salvamento...");
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: "Teste simples",
    };

    const docId = await simpleForceFirestoreService.saveData("test", testData);
    console.log("✅ Dados guardados:", docId);

    // 3. Verificar se foi guardado
    const allData = await simpleForceFirestoreService.getData("test");
    const found = allData.find((item) => item.id === docId);

    if (found) {
      console.log("✅ Dados recuperados com sucesso!");

      // Limpar
      await simpleForceFirestoreService.deleteData("test", docId);
      console.log("🧹 Teste limpo");

      return { success: true, message: "Firestore funcionando perfeitamente!" };
    } else {
      return { success: false, message: "Dados não encontrados" };
    }
  } catch (error: any) {
    console.error("❌ Erro no teste:", error.message);
    return { success: false, message: `Erro: ${error.message}` };
  }
};

// Auto-executar
if (typeof window !== "undefined") {
  setTimeout(() => {
    testSimpleFirestore().then((result) => {
      if (result.success) {
        console.log("🎉 FIRESTORE SIMPLES: FUNCIONANDO!");
        console.log("✅", result.message);
      } else {
        console.warn("⚠️ FIRESTORE SIMPLES: PROBLEMA");
        console.warn("⚠️", result.message);
      }
    });
  }, 3000);
}

export default testSimpleFirestore;
