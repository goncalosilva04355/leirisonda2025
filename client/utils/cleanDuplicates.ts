import { PoolMaintenance } from "@shared/types";

export interface DuplicateInfo {
  poolName: string;
  count: number;
  duplicateIds: string[];
  originalId: string;
}

/**
 * Detecta piscinas duplicadas baseado no nome da piscina
 */
export function detectDuplicateMaintenances(
  maintenances: PoolMaintenance[],
): DuplicateInfo[] {
  const poolGroups: { [poolName: string]: PoolMaintenance[] } = {};

  // Agrupar por nome da piscina (case insensitive)
  maintenances.forEach((maintenance) => {
    const poolName = maintenance.poolName.toLowerCase().trim();
    if (!poolGroups[poolName]) {
      poolGroups[poolName] = [];
    }
    poolGroups[poolName].push(maintenance);
  });

  // Identificar duplicados
  const duplicates: DuplicateInfo[] = [];

  Object.entries(poolGroups).forEach(([poolName, group]) => {
    if (group.length > 1) {
      // Ordenar por data de criação para manter o original
      const sorted = group.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime(),
      );

      duplicates.push({
        poolName: group[0].poolName, // Nome original (com capitalização)
        count: group.length,
        duplicateIds: sorted.slice(1).map((m) => m.id), // Todos exceto o primeiro
        originalId: sorted[0].id,
      });
    }
  });

  return duplicates;
}

/**
 * Remove piscinas duplicadas mantendo apenas a mais antiga
 */
export function removeDuplicateMaintenances(maintenances: PoolMaintenance[]): {
  cleaned: PoolMaintenance[];
  removed: string[];
  duplicatesInfo: DuplicateInfo[];
} {
  const duplicates = detectDuplicateMaintenances(maintenances);

  // IDs para remover
  const idsToRemove = new Set<string>();
  duplicates.forEach((dup) => {
    dup.duplicateIds.forEach((id) => idsToRemove.add(id));
  });

  // Filtrar mantendo apenas os originais
  const cleaned = maintenances.filter((m) => !idsToRemove.has(m.id));

  return {
    cleaned,
    removed: Array.from(idsToRemove),
    duplicatesInfo: duplicates,
  };
}

/**
 * Limpa duplicados de todos os storages
 */
export function cleanAllMaintenanceStorages(): {
  success: boolean;
  message: string;
  details: any;
} {
  try {
    console.log("🧹 Iniciando limpeza de duplicados de piscinas...");

    // 1. Carregar de todos os storages
    const sources = [
      { key: "pool_maintenances", name: "Pool Maintenances" },
      { key: "maintenances", name: "Maintenances" },
      { key: "leirisonda_maintenances", name: "Leirisonda Maintenances" },
    ];

    const allMaintenances: PoolMaintenance[] = [];
    const sourceDetails: any = {};

    sources.forEach((source) => {
      try {
        const stored = localStorage.getItem(source.key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            console.log(`📋 ${source.name}: ${parsed.length} piscinas`);
            sourceDetails[source.key] = {
              before: parsed.length,
              items: parsed.map((m: any) => ({ id: m.id, name: m.poolName })),
            };

            // Adicionar ao array consolidado evitando duplicados por ID
            parsed.forEach((maintenance: PoolMaintenance) => {
              if (
                !allMaintenances.find(
                  (existing) => existing.id === maintenance.id,
                )
              ) {
                allMaintenances.push(maintenance);
              }
            });
          }
        } else {
          sourceDetails[source.key] = { before: 0, items: [] };
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao carregar ${source.name}:`, error);
        sourceDetails[source.key] = { error: error.message };
      }
    });

    console.log(`📊 Total consolidado: ${allMaintenances.length} piscinas`);

    // 2. Detectar duplicados
    const duplicates = detectDuplicateMaintenances(allMaintenances);
    console.log(`🔍 Duplicados encontrados: ${duplicates.length} grupos`);

    duplicates.forEach((dup) => {
      console.log(
        `  • ${dup.poolName}: ${dup.count} cópias (IDs: ${dup.duplicateIds.join(", ")})`,
      );
    });

    // 3. Limpar duplicados
    const { cleaned, removed } = removeDuplicateMaintenances(allMaintenances);
    console.log(
      `✅ Limpeza concluída: ${allMaintenances.length} -> ${cleaned.length} piscinas`,
    );
    console.log(`🗑️ Removidos: ${removed.length} duplicados`);

    // 4. Salvar dados limpos em todos os storages
    sources.forEach((source) => {
      try {
        localStorage.setItem(source.key, JSON.stringify(cleaned));
        sourceDetails[source.key].after = cleaned.length;
        console.log(`💾 ${source.name} atualizado: ${cleaned.length} piscinas`);
      } catch (error) {
        console.error(`❌ Erro ao salvar ${source.name}:`, error);
        sourceDetails[source.key].saveError = error.message;
      }
    });

    // 5. Limpar possíveis chaves individuais duplicadas
    removed.forEach((id) => {
      try {
        localStorage.removeItem(`maintenance_${id}`);
        localStorage.removeItem(`pool_${id}`);
      } catch (error) {
        console.warn(`⚠️ Erro ao limpar chave individual ${id}:`, error);
      }
    });

    const details = {
      totalBefore: allMaintenances.length,
      totalAfter: cleaned.length,
      duplicatesRemoved: removed.length,
      duplicateGroups: duplicates,
      sources: sourceDetails,
    };

    return {
      success: true,
      message: `Limpeza concluída! Removidos ${removed.length} duplicados de ${duplicates.length} grupos. Total: ${allMaintenances.length} -> ${cleaned.length} piscinas.`,
      details,
    };
  } catch (error) {
    console.error("❌ Erro na limpeza de duplicados:", error);
    return {
      success: false,
      message: `Erro na limpeza: ${error.message}`,
      details: { error: error.message },
    };
  }
}
