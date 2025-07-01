/**
 * LIMPEZA IMEDIATA PARA PERMITIR CRIAÇÃO
 */

console.log(
  "🧹 CLEAR FOR CREATION: Limpando dados antigos para permitir criação",
);

// Limpar TODOS os dados de piscinas existentes
const storageKeys = [
  "pool_maintenances",
  "maintenances",
  "leirisonda_maintenances",
  "backup_maintenances",
  "temp_maintenances",
  "cached_maintenances",
];

let clearedCount = 0;

storageKeys.forEach((key) => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    clearedCount++;
    console.log(`🗑️ Cleared: ${key}`);
  }

  if (sessionStorage.getItem(key)) {
    sessionStorage.removeItem(key);
    console.log(`🗑️ Session cleared: ${key}`);
  }
});

console.log(
  `✅ CLEAR FOR CREATION: ${clearedCount} storages limpos - pode criar piscinas`,
);

export {};
