/**
 * ELIMINAÇÃO DEFINITIVA DAS MAGNÓLIAS
 */

console.log("🌸 CLEAN MAGNOLIA: Eliminando todas as piscinas Magnólia");

function eliminateMagnoliaForever() {
  try {
    const allStorageKeys = [
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
    ];

    let magnoliaCount = 0;

    // Verificar e limpar cada storage
    allStorageKeys.forEach((key) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          if (Array.isArray(data)) {
            // Filtrar e remover qualquer piscina com "magnolia" no nome
            const filtered = data.filter((item: any) => {
              const poolName = item.poolName?.toLowerCase() || "";
              const clientName = item.clientName?.toLowerCase() || "";
              const isMagnolia =
                poolName.includes("magnolia") || poolName.includes("magnólia");

              if (isMagnolia) {
                magnoliaCount++;
                console.log(
                  `🌸 ELIMINADA: ${item.poolName} (${item.clientName})`,
                );
                return false; // Remove da lista
              }
              return true; // Mantém outros itens
            });

            // Salvar lista limpa (ou remover se vazia)
            if (filtered.length > 0) {
              localStorage.setItem(key, JSON.stringify(filtered));
            } else {
              localStorage.removeItem(key);
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao limpar ${key}:`, error);
        // Se há erro, remover completamente
        localStorage.removeItem(key);
      }
    });

    // Limpar sessionStorage também
    allStorageKeys.forEach((key) => {
      try {
        const stored = sessionStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          if (Array.isArray(data)) {
            const filtered = data.filter((item: any) => {
              const poolName = item.poolName?.toLowerCase() || "";
              return (
                !poolName.includes("magnolia") && !poolName.includes("magnólia")
              );
            });

            if (filtered.length > 0) {
              sessionStorage.setItem(key, JSON.stringify(filtered));
            } else {
              sessionStorage.removeItem(key);
            }
          }
        }
      } catch (error) {
        sessionStorage.removeItem(key);
      }
    });

    console.log(
      `🌸 MAGNÓLIA ELIMINADA: ${magnoliaCount} piscinas Magnólia destruídas para sempre`,
    );

    // Marcar limpeza
    localStorage.setItem("magnolia_cleaned", new Date().toISOString());

    return magnoliaCount;
  } catch (error) {
    console.error("❌ Erro na eliminação da Magnólia:", error);
    return 0;
  }
}

// Executar eliminação
const destroyed = eliminateMagnoliaForever();
if (destroyed > 0) {
  console.log(`🎉 VITÓRIA: ${destroyed} Magnólias eliminadas definitivamente!`);
}

export {};
