/**
 * LIMPEZA IMEDIATA DE PISCINAS DUPLICADAS
 */

export function cleanPoolDuplicates() {
  console.log("🧹 Iniciando limpeza de piscinas duplicadas...");

  try {
    // Buscar todas as piscinas do localStorage
    const poolsStr = localStorage.getItem("pool_maintenances");
    if (!poolsStr) {
      console.log("✅ Nenhuma piscina encontrada - nada para limpar");
      return { success: true, cleaned: 0, remaining: 0 };
    }

    const pools = JSON.parse(poolsStr);
    const originalCount = pools.length;

    if (!Array.isArray(pools) || pools.length === 0) {
      console.log("✅ Lista de piscinas vazia ou inválida");
      return { success: true, cleaned: 0, remaining: 0 };
    }

    console.log(`📊 Encontradas ${originalCount} piscinas antes da limpeza`);

    // Criar um Map para rastrear piscinas únicas
    const uniquePools = new Map();
    const seenNames = new Set();

    // Filtrar duplicadas por ID e nome
    pools.forEach((pool: any, index: number) => {
      if (!pool || !pool.poolName) {
        console.log(`⚠️ Piscina inválida no índice ${index}:`, pool);
        return;
      }

      const normalizedName = pool.poolName.toLowerCase().trim();
      const key = pool.id || `temp_${normalizedName}`;

      // Verificar se já existe pool com mesmo ID ou nome
      if (!uniquePools.has(key) && !seenNames.has(normalizedName)) {
        uniquePools.set(key, pool);
        seenNames.add(normalizedName);
        console.log(`✓ Mantendo piscina: ${pool.poolName} (${key})`);
      } else {
        console.log(`🗑️ Removendo duplicada: ${pool.poolName} (${key})`);
      }
    });

    // Converter Map de volta para array
    const cleanedPools = Array.from(uniquePools.values());
    const finalCount = cleanedPools.length;
    const removedCount = originalCount - finalCount;

    // Salvar lista limpa
    localStorage.setItem("pool_maintenances", JSON.stringify(cleanedPools));

    console.log(`✅ Limpeza concluída:`);
    console.log(`  • Piscinas originais: ${originalCount}`);
    console.log(`  • Piscinas removidas: ${removedCount}`);
    console.log(`  • Piscinas restantes: ${finalCount}`);

    // Log das piscinas finais
    cleanedPools.forEach((pool: any, index: number) => {
      console.log(`  ${index + 1}. ${pool.poolName} (${pool.id})`);
    });

    return {
      success: true,
      cleaned: removedCount,
      remaining: finalCount,
      pools: cleanedPools,
    };
  } catch (error) {
    console.error("❌ Erro na limpeza de duplicadas:", error);
    return { success: false, error: error.message };
  }
}

// Executar limpeza automaticamente quando o módulo for importado
console.log("🚀 Executando limpeza automática de duplicadas...");
const result = cleanPoolDuplicates();
if (result.success) {
  console.log(
    `✅ Auto-limpeza: ${result.cleaned} duplicadas removidas, ${result.remaining} piscinas restantes`,
  );
} else {
  console.error(`❌ Auto-limpeza falhou: ${result.error}`);
}

export {};
