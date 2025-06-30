import { useState, useEffect, useCallback, useRef } from "react";
import { User, Work, PoolMaintenance } from "@shared/types";
import { firebaseService } from "@/services/FirebaseService";
import { useAuth } from "@/components/AuthProvider";

export function useFirebaseSync() {
  // Verificação defensiva do contexto auth
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    console.error("❌ Erro no useFirebaseSync ao acessar auth:", error);
    authData = { user: null };
  }

  const { user } = authData;
  const [works, setWorks] = useState<Work[]>([]);
  const [maintenances, setMaintenances] = useState<PoolMaintenance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isFirebaseAvailable] = useState(() => {
    try {
      const status = firebaseService.getFirebaseStatus();
      return status.isAvailable;
    } catch (error) {
      console.error("❌ Erro ao verificar status Firebase:", error);
      return false;
    }
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

    // Custom event listener para cross-tab synchronization
    const handleCrossTabSync = (event: CustomEvent) => {
      console.log("🔄 Cross-tab sync triggered:", event.detail);
      if (user && isFirebaseAvailable) {
        triggerInstantSync("cross_tab_trigger");
      }
    };

    // Listen for visibility changes to trigger sync when tab becomes active
    const handleVisibilityChange = () => {
      if (!document.hidden && user && isFirebaseAvailable && isOnline) {
        console.log("👁️ Tab became visible - triggering sync...");
        triggerInstantSync("tab_visible");
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener(
      "leirisonda_sync_trigger",
      handleCrossTabSync as EventListener,
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(
        "leirisonda_sync_trigger",
        handleCrossTabSync as EventListener,
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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

  // Sistema de sincronização contínua melhorado
  useEffect(() => {
    if (!user) {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
      console.log("💔 Sincronização pausada - usuário não logado");
      return;
    }

    console.log("💓 SISTEMA DE SINCRONIZAÇÃO ATIVO");

    // Sync inteligente a cada 15 segundos
    heartbeatInterval.current = setInterval(async () => {
      // Se offline, apenas logs
      if (!isOnline) {
        console.log("📱 Offline - heartbeat em standby");
        return;
      }

      // Se Firebase indisponível, tentar reconectar
      if (!isFirebaseAvailable) {
        console.log("�� Firebase indisponível - tentando reconectar...");
        return;
      }

      // Sincronização inteligente
      const hasPendingChanges = pendingChanges.current.size > 0;
      const shouldForceSync = Math.random() < 0.3; // 30% chance de sync preventivo

      if (hasPendingChanges || shouldForceSync) {
        console.log(
          `💓 HEARTBEAT SYNC: pending=${hasPendingChanges}, force=${shouldForceSync}`,
        );
        await triggerInstantSync("heartbeat_smart");
      } else {
        console.log("💓 Heartbeat standby - tudo sincronizado");
      }
    }, 15000); // 15 segundos

    // Sync de recuperação a cada 2 minutos para garantir consistência
    const recoveryInterval = setInterval(async () => {
      if (isOnline && isFirebaseAvailable) {
        console.log("🔄 RECOVERY SYNC: Verificação completa de dados...");
        await triggerInstantSync("recovery_check");
      }
    }, 120000); // 2 minutos

    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
      clearInterval(recoveryInterval);
      console.log("💔 Sistema de sincronização limpo");
    };
  }, [user, isFirebaseAvailable, isOnline]);

  // Setup real-time listeners para atualizações instantâneas
  useEffect(() => {
    if (!user) {
      loadLocalDataAsFallback();
      return;
    }

    console.log("🔄 CONFIGURANDO SISTEMA DE SINCRONIZAÇÃO ROBUSTO...");

    let unsubscribeWorks: (() => void) | undefined;
    let unsubscribeMaintenances: (() => void) | undefined;
    let unsubscribeUsers: (() => void) | undefined;

    const setupRealTimeSync = async () => {
      try {
        // 1. SYNC INICIAL FORÇADO antes dos listeners
        if (isFirebaseAvailable && isOnline) {
          console.log("🚀 SYNC INICIAL: Carregando dados mais recentes...");
          await triggerInstantSync("initial_full_sync");
        }

        // 2. Setup listeners real-time APÓS sync inicial
        console.log("📡 Configurando listeners real-time...");

        // Listener para obras com consolidação robusta
        unsubscribeWorks = firebaseService.listenToWorks((firebaseWorks) => {
          console.log(
            `📦 REAL-TIME: ${firebaseWorks.length} obras do Firebase`,
          );

          // Mesclar com dados locais de forma inteligente
          const localWorks = firebaseService.consolidateWorksFromAllBackups();
          const allWorksMap = new Map();

          // Primeiro adicionar obras do Firebase (prioridade)
          firebaseWorks.forEach((work) => allWorksMap.set(work.id, work));

          // Depois adicionar obras locais que não existem no Firebase
          localWorks.forEach((work) => {
            if (!allWorksMap.has(work.id)) {
              allWorksMap.set(work.id, work);
            }
          });

          const consolidatedWorks = Array.from(allWorksMap.values()).sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          console.log(
            `✅ REAL-TIME CONSOLIDADO: Firebase(${firebaseWorks.length}) + Local(${localWorks.length}) = Total(${consolidatedWorks.length})`,
          );

          setWorks(consolidatedWorks);
          setLastSync(new Date());

          // Backup em m��ltiplas localização
          localStorage.setItem("works", JSON.stringify(consolidatedWorks));
          localStorage.setItem(
            "leirisonda_works",
            JSON.stringify(consolidatedWorks),
          );
          sessionStorage.setItem(
            "temp_works",
            JSON.stringify(consolidatedWorks),
          );
        });

        // Listener para manutenções
        unsubscribeMaintenances = firebaseService.listenToMaintenances(
          (updatedMaintenances) => {
            console.log(
              `🏊 REAL-TIME: ${updatedMaintenances.length} manutenções`,
            );
            setMaintenances(updatedMaintenances);
            setLastSync(new Date());
            localStorage.setItem(
              "pool_maintenances",
              JSON.stringify(updatedMaintenances),
            );
          },
        );

        // Listener para utilizadores (admins)
        if (user.permissions?.canViewUsers) {
          unsubscribeUsers = firebaseService.listenToUsers((updatedUsers) => {
            console.log(`👥 REAL-TIME: ${updatedUsers.length} utilizadores`);
            setUsers(updatedUsers);
            localStorage.setItem("users", JSON.stringify(updatedUsers));
          });
        }

        console.log("✅ SISTEMA DE SINCRONIZAÇÃO CONFIGURADO COM SUCESSO");
      } catch (error) {
        console.error("❌ ERRO na configuração de sincronização:", error);
        // Fallback para dados locais
        loadLocalDataAsFallback();
      }
    };

    setupRealTimeSync();

    // Cleanup listeners
    return () => {
      console.log("🔄 Limpando listeners real-time");
      unsubscribeWorks?.();
      unsubscribeMaintenances?.();
      unsubscribeUsers?.();
    };
  }, [user, isFirebaseAvailable, isOnline]);

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
