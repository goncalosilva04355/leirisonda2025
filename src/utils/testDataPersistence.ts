// Teste simples do sistema de diagnóstico de persistência
import { dataPersistenceManager } from "./dataPersistenceFix";

export const runDataPersistenceTest = async (): Promise<void> => {
  console.log("🧪 Iniciando teste do sistema de persistência...");

  try {
    // Teste 1: Diagnóstico básico
    console.log("📊 Passo 1: Executando diagnóstico...");
    const status = await dataPersistenceManager.diagnoseDataPersistence();

    console.log("📊 Resultado do diagnóstico:", {
      localStorage: status.localStorage ? "✅" : "❌",
      firestore: status.firestore ? "✅" : "❌",
      working: status.working ? "✅" : "❌",
      issues: status.issues.length,
      recommendations: status.recommendations.length,
    });

    // Teste 2: Verificação de integridade
    console.log("🔍 Passo 2: Verificando integridade dos dados...");
    const integrity = await dataPersistenceManager.checkDataIntegrity();

    console.log("🔍 Integridade dos dados:", {
      localCount: integrity.localCount,
      firestoreCount: integrity.firestoreCount,
      synced: integrity.synced ? "✅" : "❌",
      missing: integrity.missing.length,
    });

    // Teste 3: Teste de persistência
    console.log("💾 Passo 3: Testando persistência...");
    const testData = {
      id: "test-" + Date.now(),
      type: "persistence_test",
      timestamp: new Date().toISOString(),
      message: "Teste de persistência de dados",
    };

    const persistenceSuccess =
      await dataPersistenceManager.ensureDataPersistence(
        testData,
        "system_tests",
        "test-data",
      );

    console.log(
      "💾 Resultado da persistência:",
      persistenceSuccess ? "✅" : "❌",
    );

    // Limpeza do teste
    try {
      const testDataStr = localStorage.getItem("test-data");
      if (testDataStr) {
        const testArray = JSON.parse(testDataStr);
        const cleanedArray = testArray.filter(
          (item: any) => !item.id?.startsWith("test-"),
        );
        localStorage.setItem("test-data", JSON.stringify(cleanedArray));
      }
    } catch (error) {
      console.warn("⚠️ Erro na limpeza do teste:", error);
    }

    // Resultado final
    if (status.working && persistenceSuccess) {
      console.log(
        "🎉 TESTE CONCLUÍDO COM SUCESSO: Sistema de persistência está funcional!",
      );
      return;
    } else {
      console.warn(
        "⚠️ TESTE FALHOU: Problemas detectados no sistema de persistência",
      );

      if (!status.working) {
        console.error("❌ Nenhum sistema de persistência está funcional");
        console.log("💡 Soluções possíveis:");
        status.recommendations.forEach((rec, index) => {
          console.log(`   ${index + 1}. ${rec}`);
        });
      }
    }
  } catch (error) {
    console.error("❌ ERRO NO TESTE:", error);
    console.log("🚨 O sistema de persistência pode ter problemas graves");
  }
};

// Auto-executar teste em desenvolvimento
if (process.env.NODE_ENV === "development") {
  // Aguardar um pouco antes de executar
  setTimeout(() => {
    runDataPersistenceTest();
  }, 2000);
}
