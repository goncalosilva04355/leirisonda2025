/**
 * LIMPEZA DE EMERGÊNCIA - Remove TUDO imediatamente
 */

// Executar limpeza de emergência assim que o script carrega
console.log("🚨 LIMPEZA DE EMERGÊNCIA INICIADA");

// 1. Limpar TODOS os storages possíveis
const allPossibleKeys = [
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

// Limpar localStorage
allPossibleKeys.forEach((key) => {
  try {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`🗑️ Removido localStorage: ${key}`);
    }
  } catch (error) {
    console.warn(`⚠️ Erro ao remover ${key}:`, error);
  }
});

// Limpar sessionStorage
allPossibleKeys.forEach((key) => {
  try {
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key);
      console.log(`🗑️ Removido sessionStorage: ${key}`);
    }
  } catch (error) {
    console.warn(`⚠️ Erro ao remover sessionStorage ${key}:`, error);
  }
});

// Limpar todas as chaves que contenham palavras suspeitas
try {
  const allLocalKeys = Object.keys(localStorage);
  const suspiciousKeys = allLocalKeys.filter((key) => {
    const lowerKey = key.toLowerCase();
    return (
      lowerKey.includes("pool") ||
      lowerKey.includes("piscina") ||
      lowerKey.includes("maintenance") ||
      lowerKey.includes("manutenc")
    );
  });

  suspiciousKeys.forEach((key) => {
    // Preservar apenas dados essenciais do usuário
    if (!["leirisonda_user", "auth_token", "user_session"].includes(key)) {
      localStorage.removeItem(key);
      console.log(`🗑️ Removido suspeita: ${key}`);
    }
  });
} catch (error) {
  console.warn("⚠️ Erro na varredura de chaves suspeitas:", error);
}

// Interceptar qualquer tentativa de definir dados de piscinas
const originalSetItem = localStorage.setItem;
localStorage.setItem = function (key: string, value: string) {
  const lowerKey = key.toLowerCase();
  if (
    lowerKey.includes("pool") ||
    lowerKey.includes("piscina") ||
    lowerKey.includes("maintenance") ||
    lowerKey.includes("manutenc")
  ) {
    console.log(`🚫 INTERCEPTADO: Tentativa de salvar ${key} - BLOQUEADO`);
    return; // Não salvar
  }
  return originalSetItem.call(this, key, value);
};

console.log("🚨 LIMPEZA DE EMERGÊNCIA CONCLUÍDA - TUDO REMOVIDO");

export {};
