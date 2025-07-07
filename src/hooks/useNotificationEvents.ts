import { useCallback } from "react";

interface WorkAssignmentEvent {
  workId: string;
  workTitle: string;
  assignedTo: string;
  assignedBy: string;
  type: "assigned" | "updated" | "cancelled";
  client?: string;
  location?: string;
  startDate?: string;
}

interface UserEvent {
  type: "created" | "updated" | "deleted" | "activated" | "deactivated";
  userName: string;
  userEmail: string;
  performedBy: string;
}

interface SyncEvent {
  type: "sync_started" | "sync_completed" | "sync_failed";
  collection: string;
  recordCount?: number;
  error?: string;
}

export const useNotificationEvents = () => {
  // Disparar evento de atribuição de trabalho
  const notifyWorkAssignment = useCallback((event: WorkAssignmentEvent) => {
    console.log("🔔 Work assignment notification:", event);

    // Evento para RealtimeNotifications
    window.dispatchEvent(
      new CustomEvent("workAssignment", {
        detail: event,
      }),
    );

    // Evento específico para WorkAssignmentNotifications
    window.dispatchEvent(
      new CustomEvent("worksUpdated", {
        detail: {
          type: "assignment",
          workId: event.workId,
          ...event,
        },
      }),
    );
  }, []);

  // Disparar evento de utilizador
  const notifyUserEvent = useCallback((event: UserEvent) => {
    console.log("👤 User event notification:", event);

    window.dispatchEvent(
      new CustomEvent("usersUpdated", {
        detail: event,
      }),
    );
  }, []);

  // Disparar evento de sincronização
  const notifySyncEvent = useCallback((event: SyncEvent) => {
    console.log("🔄 Sync event notification:", event);

    window.dispatchEvent(
      new CustomEvent("firebase-sync", {
        detail: {
          type: event.type,
          collection: event.collection,
          recordCount: event.recordCount,
          error: event.error,
          timestamp: Date.now(),
        },
      }),
    );
  }, []);

  // Disparar notificação personalizada
  const notifyCustom = useCallback(
    (
      title: string,
      message: string,
      type: "success" | "info" | "warning" | "error" = "info",
      autoHide: boolean = true,
    ) => {
      window.dispatchEvent(
        new CustomEvent("customNotification", {
          detail: {
            title,
            message,
            type,
            autoHide,
            timestamp: Date.now(),
          },
        }),
      );
    },
    [],
  );

  // Helper para notificar quando um trabalho é criado com atribuições
  const notifyWorkCreated = useCallback(
    (
      workTitle: string,
      assignedUsers: string[],
      createdBy: string,
      client: string,
      location: string,
      startDate: string,
    ) => {
      assignedUsers.forEach((assignedUser) => {
        notifyWorkAssignment({
          workId: `work-${Date.now()}`,
          workTitle,
          assignedTo: assignedUser,
          assignedBy: createdBy,
          type: "assigned",
          client,
          location,
          startDate,
        });
      });
    },
    [notifyWorkAssignment],
  );

  // Helper para notificar quando um trabalho é atualizado
  const notifyWorkUpdated = useCallback(
    (
      workId: string,
      workTitle: string,
      assignedUsers: string[],
      updatedBy: string,
      changes: string[],
    ) => {
      assignedUsers.forEach((assignedUser) => {
        notifyWorkAssignment({
          workId,
          workTitle,
          assignedTo: assignedUser,
          assignedBy: updatedBy,
          type: "updated",
        });
      });

      // Notificação geral de atualização
      notifyCustom(
        "Trabalho Atualizado",
        `"${workTitle}" foi atualizado: ${changes.join(", ")}`,
        "info",
      );
    },
    [notifyWorkAssignment, notifyCustom],
  );

  // Helper para notificar criação de utilizador
  const notifyUserCreated = useCallback(
    (userName: string, userEmail: string, createdBy: string) => {
      notifyUserEvent({
        type: "created",
        userName,
        userEmail,
        performedBy: createdBy,
      });

      notifyCustom(
        "Novo Utilizador",
        `${userName} foi adicionado ao sistema`,
        "success",
      );
    },
    [notifyUserEvent, notifyCustom],
  );

  // Helper para notificar sincronização bem-sucedida
  const notifySyncSuccess = useCallback(
    (collection: string, recordCount: number) => {
      notifySyncEvent({
        type: "sync_completed",
        collection,
        recordCount,
      });
    },
    [notifySyncEvent],
  );

  return {
    // Eventos básicos
    notifyWorkAssignment,
    notifyUserEvent,
    notifySyncEvent,
    notifyCustom,

    // Helpers específicos
    notifyWorkCreated,
    notifyWorkUpdated,
    notifyUserCreated,
    notifySyncSuccess,
  };
};

export default useNotificationEvents;
