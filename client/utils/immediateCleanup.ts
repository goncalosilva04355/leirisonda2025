import {
  detectDuplicateMaintenances,
  cleanAllMaintenanceStorages,
} from "./cleanDuplicates";

/**
 * Remove apenas piscinas duplicadas ou não existentes, mantendo as válidas
 */
function executeSmartCleanup() {
  console.log(
    "🔍 LIMPEZA INTELIGENTE: Removendo apenas piscinas não existentes/duplicadas...",
  );

  try {
    // Buscar todas as piscinas dos storages
    const storageKeys = [
      "pool_maintenances",
      "maintenances",
      "leirisonda_maintenances",
    ];

    let allPools: any[] = [];
    let removedCount = 0;

    // Coletar todas as piscinas
    storageKeys.forEach((key) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            allPools = allPools.concat(
              parsed.map((p) => ({ ...p, source: key })),
            );
          }
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao ler ${key}:`, error);
      }
    });

    if (allPools.length === 0) {
      console.log("✅ Nenhuma piscina encontrada para limpar");
      return true;
    }

    // Detectar duplicados por nome
    const poolsByName = new Map();
    const duplicates: any[] = [];

    allPools.forEach((pool) => {
      const name = pool.poolName?.toLowerCase().trim();
      if (!name) {
        duplicates.push(pool); // Pools sem nome são inválidos
        return;
      }

      if (poolsByName.has(name)) {
        duplicates.push(pool); // É um duplicado
      } else {
        poolsByName.set(name, pool);
      }
    });

    // Criar nova lista apenas com pools únicos válidos
    const validPools = Array.from(poolsByName.values());

    // Atualizar cada storage com apenas os pools válidos
    const validPoolsForStorage = validPools.filter(
      (pool) => pool.poolName && pool.clientName && pool.location,
    );

    // Limpar e recriar storages com apenas pools válidos
    storageKeys.forEach((key) => {
      try {
        if (validPoolsForStorage.length > 0) {
          localStorage.setItem(key, JSON.stringify(validPoolsForStorage));
        } else {
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao atualizar ${key}:`, error);
      }
    });

    removedCount = allPools.length - validPoolsForStorage.length;

    console.log(`✅ LIMPEZA CONCLUÍDA:`);
    console.log(`   • Total encontradas: ${allPools.length}`);
    console.log(`   • Duplicados/inválidos removidos: ${removedCount}`);
    console.log(
      `   • Piscinas válidas mantidas: ${validPoolsForStorage.length}`,
    );

    if (removedCount > 0) {
      console.log("🔄 Recarregando página para atualizar dados...");
      localStorage.setItem("smart_cleanup_done", new Date().toISOString());
      setTimeout(() => window.location.reload(), 1000);
    }

    return true;
  } catch (error) {
    console.error("❌ Erro na limpeza inteligente:", error);
    return false;
  }
}

// Executar imediatamente quando o script carrega
if (typeof window !== "undefined") {
  // Verificar se já foi executada recentemente (últimos 10 minutos)
  const lastCleaned = localStorage.getItem("smart_cleanup_done");
  const now = new Date().getTime();
  const tenMinutesAgo = now - 10 * 60 * 1000;

  let shouldClean = true;

  if (lastCleaned) {
    const lastCleanedTime = new Date(lastCleaned).getTime();
    if (lastCleanedTime > tenMinutesAgo) {
      console.log(
        "🔄 Limpeza inteligente já executada recentemente, a ignorar...",
      );
      shouldClean = false;
    }
  }

  if (shouldClean) {
    // Executar após pequeno delay para garantir que DOM está pronto
    setTimeout(executeSmartCleanup, 800);
  }
}

export { executeSmartCleanup };
