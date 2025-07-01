/**
 * LIMPEZA FINAL - Executa uma vez para remover TODOS os dados restantes
 */

console.log("🧹 LIMPEZA FINAL: Removendo TODOS os dados restantes...");

// Lista COMPLETA de todas as chaves possíveis
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
  "sync_cache",
  "firebase_cache",
  "leirisonda_pool_maintenances",
];

// Limpar TUDO do localStorage
allKeys.forEach((key) => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`🗑️ Removido: ${key}`);
  }
});

// Limpar TUDO do sessionStorage
allKeys.forEach((key) => {
  if (sessionStorage.getItem(key)) {
    sessionStorage.removeItem(key);
    console.log(`🗑️ Session removido: ${key}`);
  }
});

// Varredura total por chaves suspeitas
const allLocalKeys = Object.keys(localStorage);
const suspiciousKeys = allLocalKeys.filter((key) => {
  const lowerKey = key.toLowerCase();
  return (
    lowerKey.includes("pool") ||
    lowerKey.includes("piscina") ||
    lowerKey.includes("maintenance") ||
    lowerKey.includes("manutenc") ||
    lowerKey.includes("magnolia") ||
    lowerKey.includes("michel")
  );
});

// Remover chaves suspeitas (exceto dados de usuário)
suspiciousKeys.forEach((key) => {
  if (!["leirisonda_user", "auth_token", "user_session"].includes(key)) {
    localStorage.removeItem(key);
    console.log(`🗑️ Suspeita removida: ${key}`);
  }
});

console.log(
  `🧹 LIMPEZA FINAL CONCLUÍDA: ${allKeys.length + suspiciousKeys.length} itens removidos`,
);

// Marcar que a limpeza final foi feita
localStorage.setItem("final_cleanup_done", new Date().toISOString());

export {};
