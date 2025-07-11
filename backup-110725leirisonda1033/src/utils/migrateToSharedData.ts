import { realFirebaseService } from "../services/realFirebaseService";
import { get, ref, set, remove } from "firebase/database";
import { db } from "../firebase/config";

interface MigrationResult {
  success: boolean;
  migrated: {
    pools: number;
    works: number;
    maintenance: number;
    clients: number;
  };
  errors: string[];
}

/**
 * Migra dados das coleções antigas (pools, works, maintenance, clients)
 * para as novas coleções globais partilhadas (shared/pools, shared/works, etc.)
 *
 * IMPORTANTE: Isto garante que TODOS os utilizadores veem os MESMOS dados
 */
export const migrateToSharedData = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: false,
    migrated: { pools: 0, works: 0, maintenance: 0, clients: 0 },
    errors: [],
  };

  if (!realFirebaseService.isReady()) {
    result.errors.push("Firebase service not ready");
    return result;
  }

  console.log("🔄 INICIANDO MIGRAÇÃO PARA DADOS GLOBAIS PARTILHADOS...");
  console.log(
    "📢 Após esta migração, TODOS os utilizadores verão os MESMOS dados",
  );

  try {
    // Migrar Pools
    console.log("📊 Migrando pools para dados partilhados...");
    try {
      const oldPoolsRef = ref(realFirebaseService["database"]!, "pools");
      const oldPoolsSnapshot = await get(oldPoolsRef);

      if (oldPoolsSnapshot.exists()) {
        const poolsData = oldPoolsSnapshot.val();
        const poolsArray = Object.values(poolsData) as any[];

        // Mover para shared/pools
        const sharedPoolsRef = ref(
          realFirebaseService["database"]!,
          "shared/pools",
        );
        await set(sharedPoolsRef, poolsData);

        result.migrated.pools = poolsArray.length;
        console.log(
          `✅ ${poolsArray.length} pools migradas para dados partilhados`,
        );

        // Opcional: remover dados antigos (comentado por segurança)
        // await remove(oldPoolsRef);
      }
    } catch (error) {
      result.errors.push(`Erro ao migrar pools: ${error.message}`);
    }

    // Migrar Works
    console.log("🏗️ Migrando works para dados partilhados...");
    try {
      const oldWorksRef = ref(realFirebaseService["database"]!, "works");
      const oldWorksSnapshot = await get(oldWorksRef);

      if (oldWorksSnapshot.exists()) {
        const worksData = oldWorksSnapshot.val();
        const worksArray = Object.values(worksData) as any[];

        // Adicionar metadata de partilha global
        const enhancedWorksData: any = {};
        Object.keys(worksData).forEach((key) => {
          enhancedWorksData[key] = {
            ...worksData[key],
            sharedGlobally: true,
            visibleToAllUsers: true,
            migratedAt: new Date().toISOString(),
          };
        });

        // Mover para shared/works
        const sharedWorksRef = ref(
          realFirebaseService["database"]!,
          "shared/works",
        );
        await set(sharedWorksRef, enhancedWorksData);

        result.migrated.works = worksArray.length;
        console.log(
          `✅ ${worksArray.length} works migradas para dados partilhados`,
        );

        // Opcional: remover dados antigos (comentado por segurança)
        // await remove(oldWorksRef);
      }
    } catch (error) {
      result.errors.push(`Erro ao migrar works: ${error.message}`);
    }

    // Migrar Maintenance
    console.log("🔧 Migrando maintenance para dados partilhados...");
    try {
      const oldMaintenanceRef = ref(
        realFirebaseService["database"]!,
        "maintenance",
      );
      const oldMaintenanceSnapshot = await get(oldMaintenanceRef);

      if (oldMaintenanceSnapshot.exists()) {
        const maintenanceData = oldMaintenanceSnapshot.val();
        const maintenanceArray = Object.values(maintenanceData) as any[];

        // Adicionar metadata de partilha global
        const enhancedMaintenanceData: any = {};
        Object.keys(maintenanceData).forEach((key) => {
          enhancedMaintenanceData[key] = {
            ...maintenanceData[key],
            sharedGlobally: true,
            migratedAt: new Date().toISOString(),
          };
        });

        // Mover para shared/maintenance
        const sharedMaintenanceRef = ref(
          realFirebaseService["database"]!,
          "shared/maintenance",
        );
        await set(sharedMaintenanceRef, enhancedMaintenanceData);

        result.migrated.maintenance = maintenanceArray.length;
        console.log(
          `✅ ${maintenanceArray.length} manutenções migradas para dados partilhados`,
        );

        // Opcional: remover dados antigos (comentado por segurança)
        // await remove(oldMaintenanceRef);
      }
    } catch (error) {
      result.errors.push(`Erro ao migrar maintenance: ${error.message}`);
    }

    // Migrar Clients
    console.log("👥 Migrando clients para dados partilhados...");
    try {
      const oldClientsRef = ref(realFirebaseService["database"]!, "clients");
      const oldClientsSnapshot = await get(oldClientsRef);

      if (oldClientsSnapshot.exists()) {
        const clientsData = oldClientsSnapshot.val();
        const clientsArray = Object.values(clientsData) as any[];

        // Adicionar metadata de partilha global
        const enhancedClientsData: any = {};
        Object.keys(clientsData).forEach((key) => {
          enhancedClientsData[key] = {
            ...clientsData[key],
            sharedGlobally: true,
            migratedAt: new Date().toISOString(),
          };
        });

        // Mover para shared/clients
        const sharedClientsRef = ref(
          realFirebaseService["database"]!,
          "shared/clients",
        );
        await set(sharedClientsRef, enhancedClientsData);

        result.migrated.clients = clientsArray.length;
        console.log(
          `✅ ${clientsArray.length} clientes migrados para dados partilhados`,
        );

        // Opcional: remover dados antigos (comentado por segurança)
        // await remove(oldClientsRef);
      }
    } catch (error) {
      result.errors.push(`Erro ao migrar clients: ${error.message}`);
    }

    // Verificar se a migração foi bem-sucedida
    const totalMigrated =
      result.migrated.pools +
      result.migrated.works +
      result.migrated.maintenance +
      result.migrated.clients;

    if (totalMigrated > 0) {
      result.success = true;
      console.log("🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!");
      console.log("📊 Resumo da migração:", result.migrated);
      console.log("🌐 AGORA TODOS OS UTILIZADORES VEEM OS MESMOS DADOS!");

      // Broadcast migration completion
      window.dispatchEvent(
        new CustomEvent("data-migration-completed", {
          detail: { migrated: result.migrated },
        }),
      );
    } else if (result.errors.length === 0) {
      console.log(
        "ℹ️ Não foram encontrados dados para migrar (já podem estar na estrutura nova)",
      );
      result.success = true;
    }
  } catch (error) {
    result.errors.push(`Erro geral na migração: ${error.message}`);
    console.error("❌ Erro na migração:", error);
  }

  return result;
};

/**
 * Força sincronização imediata após migração
 */
export const forceSyncAfterMigration = async (): Promise<boolean> => {
  try {
    console.log("🔄 Forçando sincronização após migração...");

    // Sync all data from shared collections
    const sharedData = await realFirebaseService.syncAllData();

    if (sharedData) {
      // Update localStorage with new shared data
      localStorage.setItem("migrated-pools", JSON.stringify(sharedData.pools));
      localStorage.setItem("migrated-works", JSON.stringify(sharedData.works));
      localStorage.setItem(
        "migrated-maintenance",
        JSON.stringify(sharedData.maintenance),
      );
      localStorage.setItem(
        "migrated-clients",
        JSON.stringify(sharedData.clients),
      );

      console.log("✅ Sincronização pós-migração concluída");
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Erro na sincronização pós-migração:", error);
    return false;
  }
};

/**
 * Utilitário para verificar se os dados estão na estrutura partilhada
 */
export const checkSharedDataStructure = async (): Promise<{
  hasSharedData: boolean;
  hasOldData: boolean;
  sharedCounts: {
    pools: number;
    works: number;
    maintenance: number;
    clients: number;
  };
  oldCounts: {
    pools: number;
    works: number;
    maintenance: number;
    clients: number;
  };
}> => {
  if (!realFirebaseService.isReady()) {
    return {
      hasSharedData: false,
      hasOldData: false,
      sharedCounts: { pools: 0, works: 0, maintenance: 0, clients: 0 },
      oldCounts: { pools: 0, works: 0, maintenance: 0, clients: 0 },
    };
  }

  try {
    const [
      sharedPoolsSnapshot,
      sharedWorksSnapshot,
      sharedMaintenanceSnapshot,
      sharedClientsSnapshot,
      oldPoolsSnapshot,
      oldWorksSnapshot,
      oldMaintenanceSnapshot,
      oldClientsSnapshot,
    ] = await Promise.all([
      get(ref(realFirebaseService["database"]!, "shared/pools")),
      get(ref(realFirebaseService["database"]!, "shared/works")),
      get(ref(realFirebaseService["database"]!, "shared/maintenance")),
      get(ref(realFirebaseService["database"]!, "shared/clients")),
      get(ref(realFirebaseService["database"]!, "pools")),
      get(ref(realFirebaseService["database"]!, "works")),
      get(ref(realFirebaseService["database"]!, "maintenance")),
      get(ref(realFirebaseService["database"]!, "clients")),
    ]);

    const sharedCounts = {
      pools: sharedPoolsSnapshot.exists()
        ? Object.keys(sharedPoolsSnapshot.val()).length
        : 0,
      works: sharedWorksSnapshot.exists()
        ? Object.keys(sharedWorksSnapshot.val()).length
        : 0,
      maintenance: sharedMaintenanceSnapshot.exists()
        ? Object.keys(sharedMaintenanceSnapshot.val()).length
        : 0,
      clients: sharedClientsSnapshot.exists()
        ? Object.keys(sharedClientsSnapshot.val()).length
        : 0,
    };

    const oldCounts = {
      pools: oldPoolsSnapshot.exists()
        ? Object.keys(oldPoolsSnapshot.val()).length
        : 0,
      works: oldWorksSnapshot.exists()
        ? Object.keys(oldWorksSnapshot.val()).length
        : 0,
      maintenance: oldMaintenanceSnapshot.exists()
        ? Object.keys(oldMaintenanceSnapshot.val()).length
        : 0,
      clients: oldClientsSnapshot.exists()
        ? Object.keys(oldClientsSnapshot.val()).length
        : 0,
    };

    const hasSharedData = Object.values(sharedCounts).some(
      (count) => count > 0,
    );
    const hasOldData = Object.values(oldCounts).some((count) => count > 0);

    return { hasSharedData, hasOldData, sharedCounts, oldCounts };
  } catch (error) {
    console.error("Erro ao verificar estrutura de dados:", error);
    return {
      hasSharedData: false,
      hasOldData: false,
      sharedCounts: { pools: 0, works: 0, maintenance: 0, clients: 0 },
      oldCounts: { pools: 0, works: 0, maintenance: 0, clients: 0 },
    };
  }
};
