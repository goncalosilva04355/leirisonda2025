/**
 * LIMPEZA AGRESSIVA - Remove TODOS os dados de piscinas quadriplicados
 */

console.log("🚨 LIMPEZA AGRESSIVA: Removendo TODAS as piscinas quadriplicadas");

// Função para limpar completamente
function executeAggressiveCleanup() {
  try {
    // 1. Limpar TODOS os possíveis storages
    const allKeys = [
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
      "poolMaintenances",
      "maintenance_data",
      "pool_data",
      "sync_maintenances",
      "firebase_maintenances",
      "cached_maintenances",
      "local_maintenances",
      "stored_pools",
      "poolList",
      "maintenanceList",
      "sync_data",
      "firebase_data",
      "leirisonda_data",
      "pool_cache",
      "maintenance_cache",
    ];

    let totalRemoved = 0;

    // Limpar localStorage
    allKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        totalRemoved++;
        console.log(`🗑️ Removido localStorage: ${key}`);
      }
    });

    // Limpar sessionStorage
    allKeys.forEach((key) => {
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
        totalRemoved++;
        console.log(`🗑️ Removido sessionStorage: ${key}`);
      }
    });

    // Varredura completa de chaves suspeitas
    Object.keys(localStorage).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("pool") ||
        lowerKey.includes("piscina") ||
        lowerKey.includes("maintenance") ||
        lowerKey.includes("manutenc")
      ) {
        // Preservar apenas dados essenciais do usuário
        if (!["leirisonda_user", "auth_token", "user_session"].includes(key)) {
          localStorage.removeItem(key);
          totalRemoved++;
          console.log(`🗑️ Removido suspeita: ${key}`);
        }
      }
    });

    console.log(
      `🧹 LIMPEZA AGRESSIVA CONCLUÍDA: ${totalRemoved} itens removidos`,
    );

    // Marcar limpeza
    localStorage.setItem("aggressive_cleanup_done", new Date().toISOString());

    return true;
  } catch (error) {
    console.error("❌ Erro na limpeza agressiva:", error);
    return false;
  }
}

// Executar imediatamente
executeAggressiveCleanup();

// Interceptar qualquer tentativa de salvar dados de piscinas
const originalSetItem = localStorage.setItem;
localStorage.setItem = function (key: string, value: string) {
  const lowerKey = key.toLowerCase();
  if (
    lowerKey.includes("pool") ||
    lowerKey.includes("piscina") ||
    lowerKey.includes("maintenance") ||
    lowerKey.includes("manutenc")
  ) {
    console.log(
      `🚫 BLOQUEADO: Tentativa de salvar ${key} - Sistema em limpeza`,
    );
    return; // Não salvar nada relacionado a piscinas
  }
  return originalSetItem.call(this, key, value);
};

console.log("🔒 Sistema bloqueado para salvar dados de piscinas");

export {};
