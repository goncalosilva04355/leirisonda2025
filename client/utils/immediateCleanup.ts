import {
  detectDuplicateMaintenances,
  cleanAllMaintenanceStorages,
} from "./cleanDuplicates";

/**
 * Remove piscinas com status "não encontrada" ou outros erros a vermelho
 */
function executeTargetedCleanup() {
  console.log(
    "🎯 LIMPEZA ESPECÍFICA: Removendo piscinas 'não encontradas' a vermelho...",
  );

  try {
    const storageKeys = [
      "pool_maintenances",
      "maintenances",
      "leirisonda_maintenances",
      "backup_maintenances",
      "temp_maintenances",
    ];

    let totalRemoved = 0;
    let totalKept = 0;
    const cleanupDetails: any = {};

    storageKeys.forEach((key) => {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return;

        const pools = JSON.parse(stored);
        if (!Array.isArray(pools)) return;

        const originalCount = pools.length;

        // Filtrar apenas piscinas válidas, removendo as com problemas
        const validPools = pools.filter((pool) => {
          // Verificar se tem dados mínimos necessários
          if (!pool.poolName || !pool.clientName || !pool.location) {
            return false;
          }

          // Verificar se o nome contém indicadores de erro
          const poolName = pool.poolName.toLowerCase();
          const errorIndicators = [
            "não encontrada",
            "not found",
            "erro",
            "error",
            "inválida",
            "invalid",
            "inexistente",
            "piscina undefined",
            "undefined pool",
            "null",
            "empty",
          ];

          if (
            errorIndicators.some((indicator) => poolName.includes(indicator))
          ) {
            return false;
          }

          // Verificar se o cliente ou localização contém erros
          const clientName = pool.clientName?.toLowerCase() || "";
          const location = pool.location?.toLowerCase() || "";

          if (
            errorIndicators.some(
              (indicator) =>
                clientName.includes(indicator) || location.includes(indicator),
            )
          ) {
            return false;
          }

          // Verificar se o status indica erro
          if (pool.status && typeof pool.status === "string") {
            const status = pool.status.toLowerCase();
            if (
              errorIndicators.some((indicator) => status.includes(indicator))
            ) {
              return false;
            }
          }

          return true; // Piscina é válida
        });

        const removedFromThisStorage = originalCount - validPools.length;
        totalRemoved += removedFromThisStorage;
        totalKept += validPools.length;

        cleanupDetails[key] = {
          original: originalCount,
          kept: validPools.length,
          removed: removedFromThisStorage,
        };

        // Atualizar storage
        if (validPools.length > 0) {
          localStorage.setItem(key, JSON.stringify(validPools));
          console.log(
            `✅ ${key}: mantidas ${validPools.length} de ${originalCount}`,
          );
        } else {
          localStorage.removeItem(key);
          console.log(
            `🗑️ ${key}: completamente limpo (estava vazio ou só tinha erros)`,
          );
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao processar ${key}:`, error);
        cleanupDetails[key] = { error: error.message };
      }
    });

    // Limpar também chaves individuais com problemas
    const allKeys = Object.keys(localStorage);
    const problematicKeys = allKeys.filter((key) => {
      if (key.startsWith("maintenance_") || key.startsWith("pool_")) {
        try {
          const value = localStorage.getItem(key);
          if (value && value.toLowerCase().includes("não encontrada")) {
            return true;
          }
        } catch (error) {
          return true; // Se não consegue ler, provavelmente está corrompido
        }
      }
      return false;
    });

    problematicKeys.forEach((key) => {
      localStorage.removeItem(key);
      totalRemoved++;
    });

    console.log(`🎯 LIMPEZA ESPECÍFICA CONCLUÍDA:`);
    console.log(`   • Piscinas com erro removidas: ${totalRemoved}`);
    console.log(`   • Piscinas válidas mantidas: ${totalKept}`);
    console.log(`   • Chaves individuais limpas: ${problematicKeys.length}`);
    console.log(`   • Detalhes por storage:`, cleanupDetails);

    if (totalRemoved > 0) {
      localStorage.setItem("targeted_cleanup_done", new Date().toISOString());
      localStorage.setItem(
        "last_cleanup_stats",
        JSON.stringify({
          removed: totalRemoved,
          kept: totalKept,
          details: cleanupDetails,
        }),
      );

      console.log("🔄 Recarregando página para mostrar dados limpos...");
      setTimeout(() => window.location.reload(), 1200);
    } else {
      console.log("✅ Nenhuma piscina problemática encontrada!");
    }

    return true;
  } catch (error) {
    console.error("❌ Erro na limpeza específica:", error);
    return false;
  }
}

// Executar imediatamente quando o script carrega
if (typeof window !== "undefined") {
  // Verificar se já foi executada recentemente (últimos 5 minutos)
  const lastCleaned = localStorage.getItem("targeted_cleanup_done");
  const now = new Date().getTime();
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  let shouldClean = true;

  if (lastCleaned) {
    const lastCleanedTime = new Date(lastCleaned).getTime();
    if (lastCleanedTime > fiveMinutesAgo) {
      console.log(
        "🔄 Limpeza específica já executada recentemente, a ignorar...",
      );
      shouldClean = false;
    }
  }

  if (shouldClean) {
    // Executar imediatamente para limpar piscinas problemáticas
    console.log("🚀 Iniciando limpeza de piscinas 'não encontradas'...");
    setTimeout(executeTargetedCleanup, 600);
  }
}

export { executeTargetedCleanup };
