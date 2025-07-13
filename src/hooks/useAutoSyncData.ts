import { useCallback } from "react";
import { useGlobalSync } from "../components/InstantSyncManager";
import { useDataMutationWithInstantSync } from "./useInstantSync";

/**
 * Hook para componentes que precisam de dados sincronizados automaticamente
 * Fornece dados em tempo real e métodos para modificação com auto-sync
 */
export function useAutoSyncData() {
  const { data, loading, error, services, forceSync, isFullySynced } =
    useGlobalSync();
  const { withInstantSync } = useDataMutationWithInstantSync();

  // Enhanced service methods that automatically trigger sync
  const enhancedServices = {
    users: {
      ...services.users,
      addUser: withInstantSync(services.users.addUser),
      updateUser: withInstantSync(services.users.updateUser),
      deleteUser: withInstantSync(services.users.deleteUser),
    },
    pools: {
      ...services.pools,
      addPool: withInstantSync(services.pools.addPool),
      updatePool: withInstantSync(services.pools.updatePool),
      deletePool: withInstantSync(services.pools.deletePool),
    },
    maintenance: {
      ...services.maintenance,
      addMaintenance: withInstantSync(services.maintenance.addMaintenance),
      updateMaintenance: withInstantSync(
        services.maintenance.updateMaintenance,
      ),
      deleteMaintenance: withInstantSync(
        services.maintenance.deleteMaintenance,
      ),
    },
    works: {
      ...services.works,
      addWork: withInstantSync(services.works.addWork),
      updateWork: withInstantSync(services.works.updateWork),
      deleteWork: withInstantSync(services.works.deleteWork),
    },
  };

  // Helper functions for common operations
  const helpers = {
    // Refresh all data
    refreshData: useCallback(async () => {
      console.log("🔄 Refrescando todos os dados...");
      await forceSync("manual-refresh");
    }, [forceSync]),

    // Get specific data by ID
    getUserById: useCallback(
      (id: string) => {
        return data.users.find((user) => user.id === id);
      },
      [data.users],
    ),

    getPoolById: useCallback(
      (id: string) => {
        return data.pools.find((pool) => pool.id === id);
      },
      [data.pools],
    ),

    getMaintenanceById: useCallback(
      (id: string) => {
        return data.maintenance.find((maintenance) => maintenance.id === id);
      },
      [data.maintenance],
    ),

    getWorkById: useCallback(
      (id: string) => {
        return data.works.find((work) => work.id === id);
      },
      [data.works],
    ),

    // Get filtered data
    getMaintenanceByPoolId: useCallback(
      (poolId: string) => {
        return data.maintenance.filter(
          (maintenance) => maintenance.poolId === poolId,
        );
      },
      [data.maintenance],
    ),

    getWorksByStatus: useCallback(
      (status: string) => {
        return data.works.filter((work) => work.status === status);
      },
      [data.works],
    ),

    getMaintenanceByStatus: useCallback(
      (status: string) => {
        return data.maintenance.filter(
          (maintenance) => maintenance.status === status,
        );
      },
      [data.maintenance],
    ),

    // Get counts
    getCounts: useCallback(
      () => ({
        users: data.users.length,
        pools: data.pools.length,
        maintenance: data.maintenance.length,
        futureMaintenance: data.futureMaintenance.length,
        works: data.works.length,
        pendingMaintenance: data.maintenance.filter(
          (m) => m.status === "pending",
        ).length,
        pendingWorks: data.works.filter((w) => w.status === "pending").length,
      }),
      [data],
    ),

    // Validate data integrity
    validateData: useCallback(() => {
      const issues = [];

      // Check for orphaned maintenance (maintenance without valid pool)
      const poolIds = new Set(data.pools.map((p) => p.id));
      const orphanedMaintenance = data.maintenance.filter(
        (m) => !poolIds.has(m.poolId),
      );
      if (orphanedMaintenance.length > 0) {
        issues.push(
          `${orphanedMaintenance.length} manutenções órfãs encontradas`,
        );
      }

      // Check for users without proper permissions
      const usersWithoutPermissions = data.users.filter((u) => !u.permissions);
      if (usersWithoutPermissions.length > 0) {
        issues.push(
          `${usersWithoutPermissions.length} usuários sem permissões`,
        );
      }

      return {
        isValid: issues.length === 0,
        issues,
      };
    }, [data]),
  };

  return {
    // Raw data
    data,
    loading,
    error,
    isFullySynced,

    // Enhanced services with auto-sync
    services: enhancedServices,

    // Helper functions
    ...helpers,

    // Utility functions
    forceSync,
  };
}

/**
 * Hook especializado para componentes que só precisam de dados específicos
 */
export function useAutoSyncUsers() {
  const { data, services, loading, error } = useAutoSyncData();

  return {
    users: data.users,
    loading,
    error,
    addUser: services.users.addUser,
    updateUser: services.users.updateUser,
    deleteUser: services.users.deleteUser,
  };
}

export function useAutoSyncPools() {
  const { data, services, loading, error } = useAutoSyncData();

  return {
    pools: data.pools,
    loading,
    error,
    addPool: services.pools.addPool,
    updatePool: services.pools.updatePool,
    deletePool: services.pools.deletePool,
  };
}

export function useAutoSyncMaintenance() {
  const { data, services, loading, error } = useAutoSyncData();

  return {
    maintenance: data.maintenance,
    futureMaintenance: data.futureMaintenance,
    loading,
    error,
    addMaintenance: services.maintenance.addMaintenance,
    updateMaintenance: services.maintenance.updateMaintenance,
    deleteMaintenance: services.maintenance.deleteMaintenance,
  };
}

export function useAutoSyncWorks() {
  const { data, services, loading, error } = useAutoSyncData();

  return {
    works: data.works,
    loading,
    error,
    addWork: services.works.addWork,
    updateWork: services.works.updateWork,
    deleteWork: services.works.deleteWork,
  };
}
