import { enhancedDebugDuplicates } from "./enhancedDebugDuplicates";
import { forceRemoveSpecificDuplicates } from "./forcedDuplicateRemoval";

let startupCheckExecuted = false;

export const startupDuplicateCheck = async () => {
  if (startupCheckExecuted) {
    console.log("🔄 Verificação de startup já executada, ignorando...");
    return;
  }

  startupCheckExecuted = true;

  console.log("🚀 VERIFICAÇÃO DE STARTUP - Checando duplicados...");

  try {
    // Aguardar um pouco para o sistema estabilizar
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Executar debug melhorado
    const debugResult = await enhancedDebugDuplicates();

    if (debugResult.hasDuplicates && debugResult.duplicateIds.length > 0) {
      console.warn("🚨 DUPLICADOS DETECTADOS NO STARTUP!");
      console.log("🔧 Iniciando limpeza automática...");

      // Executar limpeza forçada
      const cleanupResult = await forceRemoveSpecificDuplicates();

      if (cleanupResult.success && cleanupResult.removed > 0) {
        console.log("✅ LIMPEZA DE STARTUP CONCLUÍDA!");
        console.log("🔄 Sistema será recarregado para aplicar mudanças...");

        // Aguardar e recarregar
        setTimeout(() => {
          window.location.reload();
        }, 2000);

        return {
          action: "cleaned_and_reloading",
          duplicatesFound: debugResult.duplicateIds.length,
          duplicatesRemoved: cleanupResult.removed,
        };
      } else {
        console.warn("⚠️ Falha na limpeza de startup");
        return {
          action: "cleanup_failed",
          duplicatesFound: debugResult.duplicateIds.length,
          duplicatesRemoved: 0,
        };
      }
    } else {
      console.log("✅ STARTUP CHECK: Sistema limpo, sem duplicados!");
      return {
        action: "no_duplicates_found",
        duplicatesFound: 0,
        duplicatesRemoved: 0,
      };
    }
  } catch (error) {
    console.error("❌ ERRO na verificação de startup:", error);
    return {
      action: "error",
      error: error.message,
    };
  }
};

// Auto-executar após carregamento da página
if (typeof window !== "undefined") {
  console.log("🔧 Startup Duplicate Check carregado");

  // Executar após todos os outros sistemas iniciarem
  setTimeout(() => {
    startupDuplicateCheck();
  }, 5000); // Aguardar 5 segundos

  // Disponibilizar globalmente
  (window as any).startupDuplicateCheck = startupDuplicateCheck;
}

export default startupDuplicateCheck;
