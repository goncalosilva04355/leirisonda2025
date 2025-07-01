/**
 * ELIMINAÇÃO TOTAL DE TODAS AS PISCINAS
 * Remove TUDO para começar do zero
 */

export function eliminateTotalPools() {
  console.log("🗑️ ELIMINAÇÃO TOTAL: Removendo TODAS as piscinas...");

  // TODAS as possíveis chaves de armazenamento de piscinas
  const allKeys = [
    "pool_maintenances",
    "maintenances",
    "leirisonda_maintenances",
    "backup_maintenances",
    "temp_maintenances",
    "cached_maintenances",
    "firebase_maintenances",
    "local_maintenances",
    "piscinas",
    "pools",
    "maintenance_data",
    "leirisonda_pools",
  ];

  let removedCount = 0;

  // Limpar localStorage
  allKeys.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      removedCount++;
      console.log(`🗑️ Removido localStorage: ${key}`);
    }
  });

  // Limpar sessionStorage
  allKeys.forEach((key) => {
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key);
      console.log(`🗑️ Removido sessionStorage: ${key}`);
    }
  });

  // Criar storage vazio limpo
  localStorage.setItem("pool_maintenances", JSON.stringify([]));

  console.log(`✅ ELIMINAÇÃO TOTAL CONCLUÍDA: ${removedCount} storages limpos`);
  console.log("✅ Sistema pronto para novas piscinas");

  return {
    success: true,
    message: "TODAS as piscinas foram eliminadas",
    removed: removedCount,
  };
}

// EXECUTAR IMEDIATAMENTE
console.log("🚀 AUTO-EXECUTANDO ELIMINAÇÃO TOTAL...");
const result = eliminateTotalPools();
console.log("💥 RESULTADO:", result);
