import { useState, useEffect, useCallback, useRef } from "react";
import { User, Work, PoolMaintenance } from "@shared/types";
import { firebaseService } from "@/services/FirebaseService";
import { useAuth } from "@/components/AuthProvider";

export function useFirebaseSync() {
  const { user } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [maintenances, setMaintenances] = useState<PoolMaintenance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isFirebaseAvailable] = useState(() => {
    const status = firebaseService.getFirebaseStatus();
    return status.isAvailable;
  });

  // Refs para evitar loops infinitos
  const syncInProgress = useRef(false);
  const pendingChanges = useRef<Set<string>>(new Set());
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  // Monitor online status e auto-sync quando volta online
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Dispositivo voltou online - iniciando auto-sync...");
      setIsOnline(true);
      if (user && isFirebaseAvailable) {
        triggerInstantSync("network_restored");
      }
    };

    const handleOffline = () => {
      console.log("📱 Dispositivo offline - modo local ativo");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [user, isFirebaseAvailable]);

  // Sincronização instantânea robusta
  const triggerInstantSync = useCallback(
    async (reason: string = "manual") => {
      if (
        !user ||
        !isFirebaseAvailable ||
        !isOnline ||
        syncInProgress.current
      ) {
        console.log(`🚫 Sync cancelado (${reason}):`, {
          hasUser: !!user,
          firebaseAvailable: isFirebaseAvailable,
          isOnline,
          syncInProgress: syncInProgress.current,
        });
        return;
      }

      syncInProgress.current = true;
      setIsSyncing(true);

      try {
        console.log(`🔄 Sync instantâneo iniciado (${reason})...`);

        // 1. Sincronizar utilizadores globais primeiro
        await firebaseService.syncGlobalUsersFromFirebase();

        // 2. Sincronizar dados locais para Firebase (upload prioritário)
        console.log("📤 Enviando dados locais para Firebase...");
        await firebaseService.syncLocalDataToFirebase();

        // 3. Forçar refresh COMPLETO de dados do Firebase (download)
        console.log("📥 Baixando dados mais recentes do Firebase...");
        const [latestWorks, latestMaintenances, latestUsers] =
          await Promise.all([
            firebaseService.getWorks(),
            firebaseService.getMaintenances(),
            firebaseService.getUsers(),
          ]);

        // 4. Verificar se houve novas obras desde a última sincronização
        const currentWorksCount = works.length;
        const newWorksCount = latestWorks.length;

        if (newWorksCount > currentWorksCount) {
          console.log(
            `🆕 NOVAS OBRAS DETECTADAS: ${currentWorksCount} -> ${newWorksCount}`,
          );

          // Identificar obras específicas que são novas
          const currentWorkIds = new Set(works.map((w) => w.id));
          const newWorks = latestWorks.filter((w) => !currentWorkIds.has(w.id));

          newWorks.forEach((work) => {
            console.log(
              `✨ NOVA OBRA ENCONTRADA: ${work.clientName} (${work.workSheetNumber})`,
              {
                criadaEm: work.createdAt,
                atribuicoes: work.assignedUsers,
              },
            );
          });
        }

        // 5. Atualizar estado local com dados mais recentes
        setWorks(latestWorks);
        setMaintenances(latestMaintenances);
        setUsers(latestUsers);

        setLastSync(new Date());
        pendingChanges.current.clear();

        console.log(
          `✅ Sync instantâneo completo (${reason}): ${latestWorks.length} obras, ${latestMaintenances.length} manutenções`,
        );

        // Log específico para atribuições (debug para o problema relatado)
        const worksWithAssignments = latestWorks.filter(
          (w) => w.assignedUsers && w.assignedUsers.length > 0,
        );
        console.log(
          `🎯 Obras com atribuições após sync: ${worksWithAssignments.length}`,
        );
      } catch (error) {
        console.error(`❌ Erro no sync instantâneo (${reason}):`, error);
        // Fallback para dados locais
        loadLocalDataAsFallback();
      } finally {
        syncInProgress.current = false;
        setIsSyncing(false);
      }
    },
    [user, isFirebaseAvailable, isOnline, works],
  );

  // Carregar dados locais como fallback com consolidação automática
  const loadLocalDataAsFallback = useCallback(() => {
    try {
      // Usar consolidação automática para obras
      const consolidatedWorks =
        firebaseService.consolidateWorksFromAllBackups();

      const localMaintenances = JSON.parse(
        localStorage.getItem("pool_maintenances") || "[]",
      );
      const localUsers = JSON.parse(localStorage.getItem("users") || "[]");

      setWorks(consolidatedWorks);
      setMaintenances(localMaintenances);
      setUsers(localUsers);

      console.log(
        `📱 Dados locais carregados com consolidação: ${consolidatedWorks.length} obras`,
      );
    } catch (error) {
      console.error("❌ Erro ao carregar dados locais:", error);
    }
  }, []);

  // Heartbeat para garantir sincronização contínua
  useEffect(() => {
    if (!user || !isFirebaseAvailable || !isOnline) {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
      return;
    }

    // Sync a cada 30 segundos quando online
    heartbeatInterval.current = setInterval(() => {
      if (pendingChanges.current.size > 0 || Math.random() < 0.1) {
        // 10% chance de sync preventivo
        triggerInstantSync("heartbeat");
      }
    }, 30000);

    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
    };
  }, [user, isFirebaseAvailable, isOnline, triggerInstantSync]);

  // Setup real-time listeners para atualizações instantâneas
  useEffect(() => {
    if (!user) {
      loadLocalDataAsFallback();
      return;
    }

    console.log("🔄 Configurando listeners real-time...");

    // Listener para obras com atualizações instantâneas e consolidação
    const unsubscribeWorks = firebaseService.listenToWorks((updatedWorks) => {
      console.log(`📦 Obras atualizadas via real-time: ${updatedWorks.length}`);

      // Consolidar com dados locais existentes para não perder dados
      const localWorks = firebaseService.consolidateWorksFromAllBackups();

      // Mesclar obras do Firebase com obras locais
      const allWorks = [...updatedWorks, ...localWorks];
      const uniqueWorks = allWorks.filter(
        (work, index, self) =>
          index === self.findIndex((w) => w.id === work.id),
      );

      // Ordenar por data de criação
      uniqueWorks.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      console.log(
        `✅ Obras consolidadas: Firebase(${updatedWorks.length}) + Local(${localWorks.length}) = Total(${uniqueWorks.length})`,
      );

      setWorks(uniqueWorks);
      setLastSync(new Date());

      // Sincronizar para localStorage com backup triplo
      localStorage.setItem("works", JSON.stringify(uniqueWorks));
      localStorage.setItem("leirisonda_works", JSON.stringify(uniqueWorks));
      sessionStorage.setItem("temp_works", JSON.stringify(uniqueWorks));
    });

    // Listener para manutenções com atualizações instantâneas
    const unsubscribeMaintenances = firebaseService.listenToMaintenances(
      (updatedMaintenances) => {
        console.log(
          `🏊 Manutenções atualizadas via real-time: ${updatedMaintenances.length}`,
        );
        setMaintenances(updatedMaintenances);
        setLastSync(new Date());

        // Sincronizar para localStorage imediatamente
        localStorage.setItem(
          "pool_maintenances",
          JSON.stringify(updatedMaintenances),
        );
      },
    );

    // Listener para utilizadores (admin only)
    let unsubscribeUsers: (() => void) | undefined;
    if (user.permissions.canViewUsers) {
      unsubscribeUsers = firebaseService.listenToUsers((updatedUsers) => {
        console.log(
          `👥 Utilizadores atualizados via real-time: ${updatedUsers.length}`,
        );
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      });
    }

    // Sync inicial imediato com logs detalhados
    if (isFirebaseAvailable && isOnline) {
      console.log("🚀 Iniciando sync inicial com Firebase...");
      triggerInstantSync("initial_setup");
    } else {
      console.log("📱 Modo offline: carregando dados locais consolidados...");
      loadLocalDataAsFallback();
    }

    // Cleanup listeners
    return () => {
      console.log("🔄 Limpando listeners real-time");
      unsubscribeWorks();
      unsubscribeMaintenances();
      if (unsubscribeUsers) unsubscribeUsers();
    };
  }, [user, isFirebaseAvailable, isOnline, triggerInstantSync]);

  // Wrapper para operações CRUD com sync instantâneo automático
  const withInstantSync = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      operationType: string,
    ): Promise<T> => {
      try {
        // Executar operação
        const result = await operation();

        // Marcar mudança pendente
        pendingChanges.current.add(operationType);

        // Sync instantâneo automático (se disponível)
        if (isFirebaseAvailable && isOnline) {
          // Aguardar um tick para operação completar
          setTimeout(() => {
            triggerInstantSync(`after_${operationType}`);
          }, 100);
        }

        return result;
      } catch (error) {
        console.error(`❌ Erro em ${operationType}:`, error);
        throw error;
      }
    },
    [isFirebaseAvailable, isOnline, triggerInstantSync],
  );

  // CRUD Operations com sync automático
  const createWork = useCallback(
    async (
      workData: Omit<Work, "id" | "createdAt" | "updatedAt">,
    ): Promise<string> => {
      return withInstantSync(
        () => firebaseService.createWork(workData),
        "create_work",
      );
    },
    [withInstantSync],
  );

  const createMaintenance = useCallback(
    async (
      maintenanceData: Omit<PoolMaintenance, "id" | "createdAt" | "updatedAt">,
    ): Promise<string> => {
      return withInstantSync(
        () => firebaseService.createMaintenance(maintenanceData),
        "create_maintenance",
      );
    },
    [withInstantSync],
  );

  const updateWork = useCallback(
    async (workId: string, updates: Partial<Work>): Promise<void> => {
      return withInstantSync(
        () => firebaseService.updateWork(workId, updates),
        "update_work",
      );
    },
    [withInstantSync],
  );

  const updateMaintenance = useCallback(
    async (
      maintenanceId: string,
      updates: Partial<PoolMaintenance>,
    ): Promise<void> => {
      return withInstantSync(
        () => firebaseService.updateMaintenance(maintenanceId, updates),
        "update_maintenance",
      );
    },
    [withInstantSync],
  );

  const deleteWork = useCallback(
    async (workId: string): Promise<void> => {
      return withInstantSync(
        () => firebaseService.deleteWork(workId),
        "delete_work",
      );
    },
    [withInstantSync],
  );

  const deleteMaintenance = useCallback(
    async (maintenanceId: string): Promise<void> => {
      return withInstantSync(
        () => firebaseService.deleteMaintenance(maintenanceId),
        "delete_maintenance",
      );
    },
    [withInstantSync],
  );

  const createUser = useCallback(
    async (userData: Omit<User, "id" | "createdAt">): Promise<string> => {
      return withInstantSync(
        () => firebaseService.createUser(userData),
        "create_user",
      );
    },
    [withInstantSync],
  );

  const updateUser = useCallback(
    async (userId: string, updates: Partial<User>): Promise<void> => {
      return withInstantSync(
        () => firebaseService.updateUser(userId, updates),
        "update_user",
      );
    },
    [withInstantSync],
  );

  const deleteUser = useCallback(
    async (userId: string): Promise<void> => {
      return withInstantSync(
        () => firebaseService.deleteUser(userId),
        "delete_user",
      );
    },
    [withInstantSync],
  );

  // Sync manual forçado (para casos especiais)
  const syncData = useCallback(async () => {
    await triggerInstantSync("manual_force");
  }, [triggerInstantSync]);

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

    // CRUD Operations (com sync automático instantâneo)
    createWork,
    createMaintenance,
    updateWork,
    updateMaintenance,
    deleteWork,
    deleteMaintenance,

    // User Operations (com sync automático instantâneo)
    createUser,
    updateUser,
    deleteUser,

    // Manual sync (raramente necessário)
    syncData,
  };
}
