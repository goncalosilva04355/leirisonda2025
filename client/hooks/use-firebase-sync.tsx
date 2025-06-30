import { useState, useEffect, useCallback, useRef } from "react";
import { User, Work, PoolMaintenance } from "@shared/types";
import { firebaseService } from "@/services/FirebaseService";
import { useAuth } from "@/components/AuthProvider";

export function useFirebaseSync() {
  console.log("🔄 useFirebaseSync hook iniciando...");

  // Verificação defensiva ULTRA ROBUSTA do contexto auth
  let authData;
  try {
    authData = useAuth();
    if (!authData) {
      console.warn("⚠️ AuthData é null/undefined, usando fallback");
      authData = { user: null };
    }
    console.log("✅ Auth context carregado no useFirebaseSync:", {
      hasUser: !!authData.user,
    });
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

    // Listener específico para notificações de delete (sem full sync)
    const handleDeleteNotification = (event: CustomEvent) => {
      console.log("🗑️ Delete notification received:", event.detail);
      // Apenas recarregar dados locais sem fazer sync completo do Firebase
      if (user) {
        loadAllData();
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
    window.addEventListener(
      "leirisonda_delete_notification",
      handleDeleteNotification as EventListener,
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(
        "leirisonda_sync_trigger",
        handleCrossTabSync as EventListener,
      );
      window.removeEventListener(
        "leirisonda_delete_notification",
        handleDeleteNotification as EventListener,
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, isFirebaseAvailable]);

  // Sincronização instantânea com retry automático
  const triggerInstantSync = useCallback(
    async (reason: string = "manual", retryCount: number = 0) => {
      if (!user) {
        console.log(`🚫 Sync cancelado (${reason}): usuário não logado`);
        return;
      }

      if (syncInProgress.current && retryCount === 0) {
        console.log(`⏳ Sync já em progresso (${reason}), aguardando...`);
        return;
      }

      syncInProgress.current = true;
      setIsSyncing(true);

      try {
        console.log(
          `🔄 SYNC ROBUSTO INICIADO (${reason}) - retry: ${retryCount}`,
        );

        // 1. Verificar conectividade
        if (!isOnline) {
          throw new Error("Dispositivo offline");
        }

        if (!isFirebaseAvailable) {
          throw new Error("Firebase indisponível");
        }

        // 2. Sincronização em etapas com timeout
        const syncTimeout = (promise: Promise<any>, timeout: number) => {
          return Promise.race([
            promise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), timeout),
            ),
          ]);
        };

        // 3. Sync de utilizadores globais
        console.log("👥 Sincronizando utilizadores...");
        await syncTimeout(firebaseService.syncGlobalUsersFromFirebase(), 10000);

        // 4. Upload dados locais
        console.log("📤 Enviando dados locais...");
        await syncTimeout(firebaseService.syncLocalDataToFirebase(), 15000);

        // 5. Download dados mais recentes
        console.log("📥 Baixando dados do Firebase...");
        const [latestWorks, latestMaintenances, latestUsers] =
          await syncTimeout(
            Promise.all([
              firebaseService.getWorks(),
              firebaseService.getMaintenances(),
              firebaseService.getUsers(),
            ]),
            20000,
          );

        // 6. Verificar novos dados
        const currentWorksCount = works.length;
        const newWorksCount = latestWorks.length;

        if (newWorksCount !== currentWorksCount) {
          console.log(
            `📊 DIFERENÇA DETECTADA: ${currentWorksCount} -> ${newWorksCount} obras`,
          );

          if (newWorksCount > currentWorksCount) {
            const currentWorkIds = new Set(works.map((w) => w.id));
            const newWorks = latestWorks.filter(
              (w) => !currentWorkIds.has(w.id),
            );

            newWorks.forEach((work) => {
              console.log(
                `✨ NOVA OBRA: ${work.clientName} (${work.workSheetNumber})`,
                { atribuições: work.assignedUsers },
              );
            });
          } else if (newWorksCount < currentWorksCount) {
            // Detectar obras eliminadas
            const newWorkIds = new Set(latestWorks.map((w) => w.id));
            const deletedWorks = works.filter((w) => !newWorkIds.has(w.id));

            deletedWorks.forEach((work) => {
              console.log(
                `🗑️ OBRA ELIMINADA: ${work.clientName} (${work.workSheetNumber})`,
              );
            });

            // Se é uma operação de delete, forçar atualização imediata do estado
            if (reason.includes("after_delete_work")) {
              console.log(
                "🔄 Sync após DELETE - Atualizando estado imediatamente",
              );
            }
          }
        }

        // 7. Atualizar estado com dados sincronizados
        setWorks(latestWorks);
        setMaintenances(latestMaintenances);
        setUsers(latestUsers);

        setLastSync(new Date());
        pendingChanges.current.clear();

        // 8. Backup em múltiplas localizações
        localStorage.setItem("works", JSON.stringify(latestWorks));
        localStorage.setItem("leirisonda_works", JSON.stringify(latestWorks));
        localStorage.setItem(
          "pool_maintenances",
          JSON.stringify(latestMaintenances),
        );

        console.log(
          `✅ SYNC CONCLUÍDO (${reason}): ${latestWorks.length} obras, ${latestMaintenances.length} manutenções`,
        );

        // Debug de atribuições
        const worksWithAssignments = latestWorks.filter(
          (w) => w.assignedUsers && w.assignedUsers.length > 0,
        );
        console.log(`🎯 Obras com atribuições: ${worksWithAssignments.length}`);
      } catch (error) {
        console.error(`❌ ERRO SYNC (${reason}):`, error);

        // Sistema de retry automático
        if (retryCount < 2) {
          console.log(`🔄 Retry ${retryCount + 1}/2 em 3 segundos...`);
          setTimeout(() => {
            triggerInstantSync(reason, retryCount + 1);
          }, 3000);
          return;
        }

        // Fallback para dados locais após tentativas
        console.log("📱 Fallback para dados locais após falhas");
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

  // Sistema de sincroniza��ão contínua melhorado
  useEffect(() => {
    if (!user) {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
      console.log("💔 Sincronização pausada - usuário não logado");
      return;
    }

    console.log("💓 SISTEMA DE SINCRONIZA��ÃO ATIVO");

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
        console.log(`🔄 Iniciando operação: ${operationType}`);

        // Executar operação principal
        const result = await operation();
        console.log(`✅ Operação ${operationType} concluída com sucesso`);

        // Marcar mudança pendente
        pendingChanges.current.add(operationType);

        // Sync instantâneo automático (se disponível) - apenas para operações que não são delete
        if (
          isFirebaseAvailable &&
          isOnline &&
          !operationType.includes("delete")
        ) {
          setTimeout(() => {
            try {
              triggerInstantSync(`after_${operationType}`);
            } catch (syncError) {
              console.warn(
                `⚠️ Erro no sync após ${operationType} (operação original bem sucedida):`,
                syncError,
              );
              // Não fazer throw aqui - a operação principal já funcionou
            }
          }, 100);
        }

        // Para operações de delete, usar estratégia diferente sem sync automático
        if (operationType.includes("delete")) {
          console.log(
            `🗑️ Operação de delete - sync manual será executado posteriormente`,
          );

          // Apenas notificar outros dispositivos sem fazer sync completo
          setTimeout(() => {
            try {
              // Apenas atualizar timestamp para notificar outros dispositivos
              localStorage.setItem(
                "leirisonda_last_update",
                new Date().toISOString(),
              );

              // Disparar evento customizado para cross-tab sync (sem triggering completo)
              const event = new CustomEvent("leirisonda_delete_notification", {
                detail: { operationType, timestamp: new Date().toISOString() },
              });
              window.dispatchEvent(event);
            } catch (notifyError) {
              console.warn(`⚠️ Erro na notificação de delete:`, notifyError);
              // Não fazer throw - operação delete já funcionou
            }
          }, 200);
        }

        return result;
      } catch (error) {
        console.error(`❌ Erro em ${operationType}:`, error);

        // Para operações de delete, ser mais tolerante a erros
        if (operationType.includes("delete")) {
          console.warn(
            `⚠️ Erro em operação de delete - verificando se operação local funcionou`,
          );

          // Se é erro de timeout ou rede, verificar se operação local funcionou
          if (
            error instanceof Error &&
            (error.message.includes("Timeout") ||
              error.message.includes("NetworkError") ||
              error.message.includes("Failed to fetch") ||
              error.message.includes("Permission denied") ||
              error.message.includes("Firebase"))
          ) {
            console.log(
              "⚠️ Erro de rede/timeout/Firebase em delete - operação local pode ter funcionado",
            );

            // Não fazer throw para estes tipos de erro em operações delete
            // A verificação será feita no nível superior (handleDelete)
            console.log(
              "🔄 Continuando sem throw para permitir verificação local...",
            );
            return undefined as T; // Retorna undefined para indicar erro não crítico
          }
        }

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

  const deleteWork = useCallback(async (workId: string): Promise<void> => {
    try {
      console.log(`🗑️ DELETE WORK INICIADO via hook: ${workId}`);

      // Marcar operação de delete para ErrorBoundary não forçar logout
      sessionStorage.setItem("deleting_work", "true");

      // ESTRATÉGIA SUPER ROBUSTA: Executar delete com proteção máxima
      await firebaseService.deleteWork(workId);

      console.log(`✅ DELETE WORK COMPLETO via hook: ${workId}`);

      // Limpar dados atuais imediatamente (sync local)
      setWorks((currentWorks) => {
        const filtered = currentWorks.filter((w) => w.id !== workId);
        console.log(
          `🔄 Estado local atualizado: ${currentWorks.length} -> ${filtered.length} obras`,
        );
        return filtered;
      });

      // Notificar outros dispositivos sem sync automático complexo
      setTimeout(() => {
        try {
          localStorage.setItem(
            "leirisonda_last_update",
            new Date().toISOString(),
          );

          // Apenas evento simples para notificar delete
          const event = new CustomEvent("leirisonda_delete_notification", {
            detail: { workId, timestamp: new Date().toISOString() },
          });
          window.dispatchEvent(event);
        } catch (notifyError) {
          console.warn(
            "⚠️ Erro na notificação delete (não crítico):",
            notifyError,
          );
        }
      }, 100);

      // Limpar flag de operação
      setTimeout(() => {
        sessionStorage.removeItem("deleting_work");
      }, 500);
    } catch (error) {
      console.error(`❌ Erro no deleteWork hook:`, error);

      // Limpar flag mesmo com erro
      sessionStorage.removeItem("deleting_work");

      // Para deletes, ser mais tolerante - verificar se a obra ainda existe localmente
      const currentWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const workStillExists = currentWorks.find((w: any) => w.id === workId);

      if (!workStillExists) {
        console.log("✅ Obra foi eliminada localmente apesar do erro");
        // Atualizar estado mesmo com erro
        setWorks((currentWorks) => currentWorks.filter((w) => w.id !== workId));
        return; // Não fazer throw se obra foi eliminada localmente
      }

      // Só fazer throw se realmente houve falha na eliminação
      throw error;
    }
  }, []);

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
