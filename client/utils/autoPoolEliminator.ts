/**
 * ELIMINAÇÃO AUTOMÁTICA DE TODAS AS PISCINAS
 * Executa automaticamente quando a aplicação inicia
 */

console.log(
  "🚨 AUTO ELIMINATOR: Iniciando eliminação automática de todas as piscinas...",
);

// Função para eliminar TUDO
function eliminateAllPools() {
  console.log("🗑️ Eliminando TODAS as piscinas do sistema...");

  // Lista completa de todas as possíveis chaves
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
    "old_pools",
    "saved_pools",
    "magnolia",
    "piscina_magnolia",
    "duplicated_pools",
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

  // Criar storage vazio garantido
  localStorage.setItem("pool_maintenances", "[]");

  console.log(`✅ ELIMINAÇÃO CONCLUÍDA: ${removedCount} chaves removidas`);
  console.log("✅ Sistema limpo - pronto para novas piscinas");

  return { success: true, removed: removedCount };
}

// EXECUTAR IMEDIATAMENTE quando o módulo é carregado
const result = eliminateAllPools();
console.log("💥 RESULTADO AUTO ELIMINATOR:", result);

// Interceptar qualquer tentativa de salvar piscinas pelos próximos 5 segundos
const originalSetItem = localStorage.setItem;
let interceptCount = 0;

localStorage.setItem = function (key: string, value: string) {
  const poolKeys = [
    "pool_maintenances",
    "maintenances",
    "leirisonda_maintenances",
  ];

  if (poolKeys.includes(key)) {
    try {
      const data = JSON.parse(value);
      if (Array.isArray(data) && data.length > 0) {
        interceptCount++;
        console.log(
          `🚫 INTERCEPTADO: Tentativa ${interceptCount} de salvar piscinas em ${key} - BLOQUEADO`,
        );
        // Forçar array vazio
        originalSetItem.call(this, key, "[]");
        return;
      }
    } catch (e) {
      // Se não é JSON válido, permitir
    }
  }

  // Para outras chaves ou arrays vazios, permitir normalmente
  originalSetItem.call(this, key, value);
};

// Restaurar função original após 5 segundos
setTimeout(() => {
  localStorage.setItem = originalSetItem;
  console.log(
    `✅ Interceptor desativado após 5s. Total interceptado: ${interceptCount} tentativas`,
  );
}, 5000);

export {};
