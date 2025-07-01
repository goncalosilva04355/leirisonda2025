import { useState, useEffect } from "react";
import { User, Work, PoolMaintenance } from "@shared/types";
import { firebaseService } from "@/services/FirebaseService";
import { useAuth } from "@/components/AuthProvider";

export function useFirebaseSync() {
  console.log("🔄 useFirebaseSync hook iniciando (versão simples)...");

  const { user } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [maintenances, setMaintenances] = useState<PoolMaintenance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isOnline] = useState(navigator.onLine);
  const [isSyncing] = useState(false);
  const [lastSync] = useState<Date | null>(null);
  const [isFirebaseAvailable] = useState(false);

  // Load global shared data on mount
  useEffect(() => {
    if (!user) return;

    console.log("🌐 Carregando dados globais partilhados...");

    try {
      // Load works
      const localWorks = JSON.parse(localStorage.getItem("works") || "[]");
      setWorks(localWorks);

      // Load global shared maintenances
      const sharedData = localStorage.getItem("shared_pool_data");
      let maintenancesToLoad = [];

      if (sharedData) {
        const parsed = JSON.parse(sharedData);
        if (parsed.pools && Array.isArray(parsed.pools)) {
          maintenancesToLoad = parsed.pools;
          console.log(
            `🌐 Carregadas ${maintenancesToLoad.length} piscinas partilhadas`,
          );
        }
      }

      // Fallback para dados locais
      if (maintenancesToLoad.length === 0) {
        const localMaintenances = JSON.parse(
          localStorage.getItem("pool_maintenances") || "[]",
        );
        const globalMaintenances = JSON.parse(
          localStorage.getItem("global_pool_maintenances") || "[]",
        );

        maintenancesToLoad =
          globalMaintenances.length > localMaintenances.length
            ? globalMaintenances
            : localMaintenances;
      }

      setMaintenances(maintenancesToLoad);

      // Load users
      const localUsers = JSON.parse(localStorage.getItem("users") || "[]");
      setUsers(localUsers);

      console.log(
        `✅ Dados globais carregados: ${localWorks.length} works, ${maintenancesToLoad.length} maintenances, ${localUsers.length} users`,
      );
    } catch (error) {
      console.error("❌ Erro ao carregar dados globais:", error);
    }
  }, [user]);

  // Simple CRUD operations
  const createWork = async (workData: any) => {
    console.log("🔨 Criando obra...");
    return await firebaseService.createWork(workData);
  };

  const updateWork = async (workId: string, updates: any) => {
    console.log("📝 Atualizando obra...");
    return await firebaseService.updateWork(workId, updates);
  };

  const deleteWork = async (workId: string) => {
    console.log("🗑️ Eliminando obra...");
    return await firebaseService.deleteWork(workId);
  };

  const createMaintenance = async (maintenanceData: any) => {
    console.log("🏊 Criando piscina...");
    const result = await firebaseService.createMaintenance(maintenanceData);

    // Recarregar dados após criar
    try {
      const localMaintenances = JSON.parse(
        localStorage.getItem("pool_maintenances") || "[]",
      );
      setMaintenances(localMaintenances);
      console.log(
        `🔄 Dados recarregados: ${localMaintenances.length} piscinas`,
      );
    } catch (error) {
      console.error("❌ Erro ao recarregar dados:", error);
    }

    return result;
  };

  const updateMaintenance = async (maintenanceId: string, updates: any) => {
    console.log("📝 Atualizando piscina...");
    return await firebaseService.updateMaintenance(maintenanceId, updates);
  };

  const deleteMaintenance = async (maintenanceId: string) => {
    console.log("🗑️ Eliminando piscina...");
    return await firebaseService.deleteMaintenance(maintenanceId);
  };

  const createUser = async (userData: any) => {
    console.log("👤 Criando utilizador...");
    return await firebaseService.createUser(userData);
  };

  const updateUser = async (userId: string, updates: any) => {
    console.log("📝 Atualizando utilizador...");
    return await firebaseService.updateUser(userId, updates);
  };

  const deleteUser = async (userId: string) => {
    console.log("🗑️ Eliminando utilizador...");
    return await firebaseService.deleteUser(userId);
  };

  const syncData = async () => {
    console.log("🔄 Manual sync (simplified)");
  };

  return {
    // Data
    works,
    maintenances,
    users,

    // Status
    isOnline,
    isSyncing,
    lastSync,
    isFirebaseAvailable,

    // CRUD Operations
    createWork,
    createMaintenance,
    updateWork,
    updateMaintenance,
    deleteWork,
    deleteMaintenance,

    // User Operations
    createUser,
    updateUser,
    deleteUser,

    // Manual sync
    syncData,
  };
}
