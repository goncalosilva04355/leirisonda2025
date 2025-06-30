import {
  detectDuplicateMaintenances,
  cleanAllMaintenanceStorages,
} from "./cleanDuplicates";

/**
 * LIMPEZA TOTAL - Remove TODAS as piscinas para acabar com os erros de uma vez
 */
function executeCompleteCleanup() {
  console.log("💥 LIMPEZA TOTAL: Removendo TODAS as piscinas problemáticas...");

  try {
    // Lista completa de todas as possíveis chaves de storage relacionadas a piscinas
    const allPoolKeys = [
      "pool_maintenances",
      "maintenances",
      "leirisonda_maintenances",
      "backup_maintenances",
      "temp_maintenances",
      "emergency_maintenances",
      "session_maintenances",
      "temp_pool_maintenances",
      "pools",
      "piscinas",
      "maintenance_data",
      "pool_data",
      "sync_maintenances",
    ];

    let totalRemoved = 0;

    // 1. Remover todas as chaves de storage conhecidas
    allPoolKeys.forEach((key) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          if (Array.isArray(data)) {
            totalRemoved += data.length;
          } else {
            totalRemoved += 1;
          }
          localStorage.removeItem(key);
          console.log(`🗑️ Removido: ${key}`);
        }
      } catch (error) {
        // Se houve erro no parse, remove mesmo assim
        localStorage.removeItem(key);
        console.log(`🗑️ Removido (corrompido): ${key}`);
      }
    });

    // 2. Buscar e remover TODAS as chaves que contenham palavras relacionadas a piscinas
    const allLocalStorageKeys = Object.keys(localStorage);
    const poolRelatedKeys = allLocalStorageKeys.filter((key) => {
      const lowerKey = key.toLowerCase();
      return (
        lowerKey.includes("pool") ||
        lowerKey.includes("piscina") ||
        lowerKey.includes("maintenance") ||
        lowerKey.includes("manutenc") ||
        lowerKey.includes("intervention") ||
        lowerKey.includes("interven") ||
        lowerKey.startsWith("maintenance_") ||
        lowerKey.startsWith("pool_") ||
        lowerKey.startsWith("piscina_")
      );
    });

    poolRelatedKeys.forEach((key) => {
      try {
        localStorage.removeItem(key);
        totalRemoved++;
        console.log(`🗑️ Chave individual removida: ${key}`);
      } catch (error) {
        console.warn(`⚠️ Erro ao remover ${key}:`, error);
      }
    });

    // 3. Limpar também sessionStorage
    const sessionKeys = Object.keys(sessionStorage);
    const sessionPoolKeys = sessionKeys.filter((key) => {
      const lowerKey = key.toLowerCase();
      return (
        lowerKey.includes("pool") ||
        lowerKey.includes("piscina") ||
        lowerKey.includes("maintenance") ||
        lowerKey.includes("manutenc")
      );
    });

    sessionPoolKeys.forEach((key) => {
      try {
        sessionStorage.removeItem(key);
        console.log(`🗑️ SessionStorage removido: ${key}`);
      } catch (error) {
        console.warn(`⚠️ Erro ao remover sessionStorage ${key}:`, error);
      }
    });

    // 4. Limpar cache relacionado se existir
    if ("caches" in window) {
      caches
        .keys()
        .then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            if (
              cacheName.includes("pool") ||
              cacheName.includes("maintenance")
            ) {
              caches.delete(cacheName);
              console.log(`🗑️ Cache removido: ${cacheName}`);
            }
          });
        })
        .catch((error) => {
          console.warn("⚠️ Erro ao limpar cache:", error);
        });
    }

    console.log(`💥 LIMPEZA TOTAL CONCLUÍDA:`);
    console.log(`   • Total de itens removidos: ${totalRemoved}`);
    console.log(
      `   • Chaves localStorage removidas: ${allPoolKeys.length + poolRelatedKeys.length}`,
    );
    console.log(
      `   • Chaves sessionStorage removidas: ${sessionPoolKeys.length}`,
    );

    // Marcar que a limpeza total foi feita
    localStorage.setItem("complete_cleanup_done", new Date().toISOString());
    localStorage.setItem(
      "cleanup_stats",
      JSON.stringify({
        totalRemoved,
        timestamp: new Date().toISOString(),
        type: "complete_cleanup",
      }),
    );

    console.log(
      "🔄 Recarregando página em 2 segundos para mostrar sistema limpo...",
    );
    setTimeout(() => {
      window.location.reload();
    }, 2000);

    return true;
  } catch (error) {
    console.error("❌ Erro na limpeza total:", error);
    return false;
  }
}

// Executar imediatamente quando o script carrega
if (typeof window !== "undefined") {
  // Verificar se a limpeza total já foi executada recentemente (últimos 15 minutos)
  const lastCleaned = localStorage.getItem("complete_cleanup_done");
  const now = new Date().getTime();
  const fifteenMinutesAgo = now - 15 * 60 * 1000;

  let shouldClean = true;

  if (lastCleaned) {
    const lastCleanedTime = new Date(lastCleaned).getTime();
    if (lastCleanedTime > fifteenMinutesAgo) {
      console.log(
        "🔄 Limpeza total já executada recentemente, sistema já limpo.",
      );
      shouldClean = false;
    }
  }

  if (shouldClean) {
    // Executar limpeza total imediatamente
    console.log(
      "💥 INICIANDO LIMPEZA TOTAL - Removendo todas as piscinas problemáticas...",
    );
    setTimeout(executeCompleteCleanup, 300);
  }
}

export { executeCompleteCleanup };
