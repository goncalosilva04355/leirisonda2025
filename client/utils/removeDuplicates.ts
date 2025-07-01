/**
 * Remove duplicados da piscina que acabou de ser criada
 */
export function removeDuplicateMaintenances() {
  try {
    const stored = localStorage.getItem("pool_maintenances");
    if (!stored) return;

    const maintenances = JSON.parse(stored);
    if (!Array.isArray(maintenances)) return;

    // Agrupar por nome da piscina e manter apenas o mais recente
    const uniqueByName = new Map();

    maintenances.forEach((maintenance: any) => {
      const key = maintenance.poolName?.toLowerCase()?.trim();
      if (!key) return;

      const existing = uniqueByName.get(key);
      if (
        !existing ||
        new Date(maintenance.createdAt) > new Date(existing.createdAt)
      ) {
        uniqueByName.set(key, maintenance);
      }
    });

    // Agrupar por ID e manter apenas um por ID
    const uniqueById = new Map();
    Array.from(uniqueByName.values()).forEach((maintenance: any) => {
      uniqueById.set(maintenance.id, maintenance);
    });

    const uniqueMaintenances = Array.from(uniqueById.values());

    if (uniqueMaintenances.length !== maintenances.length) {
      console.log(
        `🧹 Removidos ${maintenances.length - uniqueMaintenances.length} duplicados de piscinas`,
      );
      localStorage.setItem(
        "pool_maintenances",
        JSON.stringify(uniqueMaintenances),
      );

      // Forçar reload para atualizar a UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (error) {
    console.error("❌ Erro ao remover duplicados:", error);
  }
}

// Executar limpeza imediatamente
if (typeof window !== "undefined") {
  removeDuplicateMaintenances();
}
