/**
 * Utilitário para limpar completamente todos os dados de piscinas e manutenções
 */
export function clearAllMaintenanceData(): {
  success: boolean;
  message: string;
  details: any;
} {
  try {
    console.log(
      "🧹 LIMPEZA COMPLETA: Removendo todas as piscinas e manutenções...",
    );

    const storageKeys = [
      // Storages principais
      "pool_maintenances",
      "maintenances",
      "leirisonda_maintenances",

      // Storages de backup
      "backup_maintenances",
      "temp_maintenances",
      "emergency_maintenances",

      // Session storage
      "temp_pool_maintenances",
      "session_maintenances",
    ];

    let removedCount = 0;
    const removedData: any = {};

    // Limpar localStorage
    storageKeys.forEach((key) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            removedData[key] = {
              count: parsed.length,
              items: parsed.map((item: any) => ({
                id: item.id,
                name: item.poolName || item.name || "Unknown",
              })),
            };
            removedCount += parsed.length;

            console.log(`🗑️ Removendo ${parsed.length} itens de ${key}`);
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao limpar ${key}:`, error);
        removedData[key] = { error: error.message };
      }
    });

    // Limpar sessionStorage
    storageKeys.forEach((key) => {
      try {
        if (sessionStorage.getItem(key)) {
          sessionStorage.removeItem(key);
          console.log(`🗑️ SessionStorage ${key} limpo`);
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao limpar sessionStorage ${key}:`, error);
      }
    });

    // Limpar possíveis chaves individuais (maintenance_ID, pool_ID, etc)
    const allLocalStorageKeys = Object.keys(localStorage);
    const maintenanceKeys = allLocalStorageKeys.filter(
      (key) =>
        key.startsWith("maintenance_") ||
        key.startsWith("pool_") ||
        key.startsWith("intervention_"),
    );

    maintenanceKeys.forEach((key) => {
      try {
        localStorage.removeItem(key);
        console.log(`🗑️ Chave individual removida: ${key}`);
      } catch (error) {
        console.warn(`⚠️ Erro ao remover chave ${key}:`, error);
      }
    });

    console.log(
      `✅ LIMPEZA CONCLUÍDA: ${removedCount} piscinas/manutenções removidas`,
    );
    console.log(`🗑️ Chaves individuais removidas: ${maintenanceKeys.length}`);

    const details = {
      totalRemoved: removedCount,
      individualKeysRemoved: maintenanceKeys.length,
      storagesCleaned: storageKeys.length,
      removedData: removedData,
      individualKeys: maintenanceKeys,
    };

    return {
      success: true,
      message: `Limpeza concluída! ${removedCount} piscinas/manutenções removidas de ${storageKeys.length} storages.`,
      details,
    };
  } catch (error) {
    console.error("❌ Erro na limpeza completa:", error);
    return {
      success: false,
      message: `Erro na limpeza: ${error.message}`,
      details: { error: error.message },
    };
  }
}

/**
 * Verificar se existem dados de manutenção para limpar
 */
export function hasMaintenanceData(): boolean {
  const storageKeys = [
    "pool_maintenances",
    "maintenances",
    "leirisonda_maintenances",
  ];

  for (const key of storageKeys) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return true;
        }
      }
    } catch (error) {
      // Ignore parse errors
    }
  }

  return false;
}
