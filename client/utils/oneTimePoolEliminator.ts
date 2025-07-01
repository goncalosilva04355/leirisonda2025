/**
 * ELIMINAÇÃO ÚNICA E DEFINITIVA DE TODAS AS PISCINAS
 * Executa apenas uma vez e apaga TUDO
 */

const EXECUTION_KEY = "pool_elimination_executed";

console.log("🗑️ ONE-TIME ELIMINATOR: Verificando se já foi executado...");

// Verificar se já foi executado
const alreadyExecuted = localStorage.getItem(EXECUTION_KEY);

if (!alreadyExecuted) {
  console.log("💥 ELIMINAÇÃO TOTAL: Executando pela primeira vez...");

  // Lista completa de TODAS as possíveis chaves de piscinas
  const allPoolKeys = [
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
    "old_pools",
    "saved_pools",
    "magnolia",
    "piscina_magnolia",
    "duplicated_pools",
    "pool_cache",
  ];

  let removedCount = 0;

  // Limpar localStorage
  allPoolKeys.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      removedCount++;
      console.log(`🗑️ Removido localStorage: ${key}`);
    }
  });

  // Limpar sessionStorage
  allPoolKeys.forEach((key) => {
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key);
      console.log(`🗑️ Removido sessionStorage: ${key}`);
    }
  });

  // Garantir que a chave principal está vazia
  localStorage.setItem("pool_maintenances", "[]");

  // Marcar como executado para NUNCA mais executar
  localStorage.setItem(EXECUTION_KEY, "true");

  console.log(
    `✅ ELIMINAÇÃO TOTAL CONCLUÍDA: ${removedCount} chaves removidas`,
  );
  console.log("🚫 Sistema configurado - NUNCA mais executará");
} else {
  console.log("✅ Eliminação já foi executada anteriormente - sistema limpo");
}

export {};
