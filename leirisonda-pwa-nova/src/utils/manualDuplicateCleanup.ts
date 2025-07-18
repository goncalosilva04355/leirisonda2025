import { cleanupFirestoreDuplicates } from "./cleanupFirestoreDuplicates";

// Função para executar limpeza manual imediatamente
export const executeManualCleanup = async () => {
  console.log("🧹 EXECUTANDO LIMPEZA MANUAL DE DUPLICADOS...");

  try {
    const result = await cleanupFirestoreDuplicates();

    if (result.success) {
      console.log("✅ LIMPEZA MANUAL CONCLUÍDA:", result);

      if (result.cleaned > 0) {
        console.log(`🎉 ${result.cleaned} duplicados foram eliminados!`);
        console.log("🔄 Recarregando página em 2 segundos...");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.log("ℹ️ Nenhum duplicado encontrado para eliminar");
      }

      return result;
    } else {
      console.error("❌ Falha na limpeza manual:", result.error);
      return result;
    }
  } catch (error) {
    console.error("❌ Erro na execução da limpeza manual:", error);
    return { success: false, error: error.message };
  }
};

// Disponibilizar globalmente
(window as any).manualCleanupNow = executeManualCleanup;

console.log(
  "🛠️ LIMPEZA MANUAL: Digite 'manualCleanupNow()' no console para executar agora",
);

// Auto-executar na importação
setTimeout(() => {
  console.log("🚀 INICIANDO LIMPEZA AUTOMÁTICA...");
  executeManualCleanup();
}, 2000);
