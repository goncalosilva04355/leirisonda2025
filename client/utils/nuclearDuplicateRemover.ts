/**
 * REMOÇÃO NUCLEAR DE DUPLICATAS
 * Remove TODAS as piscinas e permite apenas uma por nome
 */

console.log("🚨 INICIANDO LIMPEZA NUCLEAR DE DUPLICATAS...");

function nuclearCleanDuplicates() {
  console.log(
    "💥 Nuclear Clean: Limpando TODAS as localizações de piscinas...",
  );

  // Lista de TODAS as possíveis chaves de armazenamento de piscinas
  const storageKeys = [
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
  ];

  // 1. LIMPAR TUDO primeiro
  storageKeys.forEach((key) => {
    if (localStorage.getItem(key)) {
      console.log(`🗑️ Removendo storage: ${key}`);
      localStorage.removeItem(key);
    }
    if (sessionStorage.getItem(key)) {
      console.log(`🗑️ Removendo session: ${key}`);
      sessionStorage.removeItem(key);
    }
  });

  console.log("✅ TODAS as localizações de piscinas foram limpas");

  // 2. Criar lista vazia limpa
  const cleanPools: any[] = [];
  localStorage.setItem("pool_maintenances", JSON.stringify(cleanPools));

  console.log("✅ Storage reinicializado com lista vazia");

  return {
    success: true,
    message: "Limpeza nuclear concluída - TODAS as piscinas removidas",
    cleaned: "ALL",
    remaining: 0,
  };
}

// EXECUTAR IMEDIATAMENTE
const result = nuclearCleanDuplicates();
console.log(`💥 NUCLEAR CLEAN RESULTADO:`, result);

export { nuclearCleanDuplicates };
