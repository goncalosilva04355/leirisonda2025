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

  // Load local data on mount
  useEffect(() => {
    if (!user) return;

    console.log("📱 Carregando dados locais...");

    try {
      // Load works
      const localWorks = JSON.parse(localStorage.getItem("works") || "[]");
      setWorks(localWorks);

      // Load maintenances (always empty for now)
      setMaintenances([]);

      // Load users
      const localUsers = JSON.parse(localStorage.getItem("users") || "[]");
      setUsers(localUsers);

      console.log(
        `✅ Dados carregados: ${localWorks.length} works, 0 maintenances, ${localUsers.length} users`,
      );
    } catch (error) {
      console.error("❌ Erro ao carregar dados locais:", error);
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
    return await firebaseService.createMaintenance(maintenanceData);
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
