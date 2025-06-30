import { clearAllMaintenanceData } from "./clearMaintenanceData";

/**
 * Executa limpeza imediata de todas as piscinas e manutenções
 */
function executeImmediateCleanup() {
  console.log("🧹 LIMPEZA IMEDIATA: Removendo todas as piscinas existentes...");

  try {
    const result = clearAllMaintenanceData();

    if (result.success) {
      console.log(`✅ ${result.message}`);
      console.log("📊 Detalhes:", result.details);

      // Marcar que a limpeza foi executada
      localStorage.setItem("pools_cleaned", new Date().toISOString());

      return true;
    } else {
      console.error(`❌ Erro na limpeza: ${result.message}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Erro ao executar limpeza:", error);
    return false;
  }
}

// Executar imediatamente quando o script carrega
if (typeof window !== "undefined") {
  // Verificar se já foi executada recentemente (últimos 5 minutos)
  const lastCleaned = localStorage.getItem("pools_cleaned");
  const now = new Date().getTime();
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  let shouldClean = true;

  if (lastCleaned) {
    const lastCleanedTime = new Date(lastCleaned).getTime();
    if (lastCleanedTime > fiveMinutesAgo) {
      console.log("🔄 Limpeza já executada recentemente, a ignorar...");
      shouldClean = false;
    }
  }

  if (shouldClean) {
    // Executar após pequeno delay para garantir que DOM está pronto
    setTimeout(executeImmediateCleanup, 500);
  }
}

export { executeImmediateCleanup };
