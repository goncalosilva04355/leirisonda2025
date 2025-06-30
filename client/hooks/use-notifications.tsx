import { useState, useEffect, useCallback } from "react";
import { notificationService } from "@/services/NotificationService";
import { useAuth } from "@/components/AuthProvider";

export interface NotificationStatus {
  isSupported: boolean;
  isEnabled: boolean;
  isInitialized: boolean;
  permission: NotificationPermission | null;
  hasToken: boolean;
}

export function useNotifications() {
  const { user } = useAuth();
  const [status, setStatus] = useState<NotificationStatus>({
    isSupported: false,
    isEnabled: false,
    isInitialized: false,
    permission: null,
    hasToken: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Verificar status das notificações
  const checkNotificationStatus = useCallback(async () => {
    try {
      const isSupported = notificationService.getIsSupported();
      const permission =
        "Notification" in window ? Notification.permission : null;
      const isEnabled = permission === "granted";
      const isInitialized = notificationService.getIsInitialized();

      // Verificar se há token salvo para o usuário atual
      const userTokens = JSON.parse(
        localStorage.getItem("userNotificationTokens") || "{}",
      );
      const hasToken = user ? !!userTokens[user.id] : false;

      setStatus({
        isSupported,
        isEnabled,
        isInitialized,
        permission,
        hasToken,
      });

      console.log("🔔 Status das notificações:", {
        isSupported,
        isEnabled,
        isInitialized,
        permission,
        hasToken,
      });
    } catch (error) {
      console.error("❌ Erro ao verificar status das notificações:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Inicializar notificações
  const initializeNotifications = useCallback(async (): Promise<boolean> => {
    if (!notificationService.getIsSupported()) {
      console.warn("⚠️ Notificações não são suportadas neste dispositivo");
      return false;
    }

    try {
      setIsLoading(true);
      console.log("🚀 Inicializando notificações...");

      const success = await notificationService.initialize();

      if (success) {
        console.log("✅ Notificações inicializadas com sucesso");
        await checkNotificationStatus();
        return true;
      } else {
        console.error("❌ Falha ao inicializar notificações");
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao inicializar notificações:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkNotificationStatus]);

  // Pedir permissão para notificações
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.warn("⚠️ Notificações não são suportadas");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("✅ Permissão para notificações concedida");
        await initializeNotifications();
        return true;
      } else {
        console.warn("⚠️ Permissão para notificações negada");
        await checkNotificationStatus();
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao pedir permissão para notificações:", error);
      return false;
    }
  }, [initializeNotifications, checkNotificationStatus]);

  // Enviar notificação de obra atribuída
  const notifyWorkAssigned = useCallback(
    async (work: any, assignedUsers: string[]) => {
      if (!status.isEnabled || !status.isInitialized) {
        console.warn("⚠️ Notificações não estão habilitadas");
        return;
      }

      try {
        await notificationService.notifyWorkAssigned(work, assignedUsers);
      } catch (error) {
        console.error(
          "❌ Erro ao enviar notificação de obra atribuída:",
          error,
        );
      }
    },
    [status],
  );

  // Enviar notificação de mudança de status
  const notifyWorkStatusChange = useCallback(
    async (work: any, newStatus: string, assignedUsers: string[]) => {
      if (!status.isEnabled || !status.isInitialized) {
        console.warn("⚠️ Notificações não estão habilitadas");
        return;
      }

      try {
        await notificationService.notifyWorkStatusChange(
          work,
          newStatus,
          assignedUsers,
        );
      } catch (error) {
        console.error(
          "❌ Erro ao enviar notificação de mudança de status:",
          error,
        );
      }
    },
    [status],
  );

  // Mostrar notificação local personalizada
  const showNotification = useCallback(
    async (title: string, body: string, data?: any) => {
      if (!status.isEnabled || !status.isInitialized) {
        console.warn("⚠️ Notificações não estão habilitadas");
        return;
      }

      try {
        await notificationService.showLocalNotification({
          title,
          body,
          data,
          icon: "/leirisonda-icon.svg",
        });
      } catch (error) {
        console.error("❌ Erro ao mostrar notificação:", error);
      }
    },
    [status],
  );

  // Verificar obras pendentes atribuídas ao usuário
  const checkPendingWorks = useCallback(async () => {
    if (!user || !status.isInitialized) {
      console.warn("⚠️ Usuário ou notificações não inicializadas");
      return [];
    }

    try {
      return await notificationService.checkPendingAssignedWorks(user.id);
    } catch (error) {
      console.error("❌ Erro ao verificar obras pendentes:", error);
      return [];
    }
  }, [user, status.isInitialized]);

  // Desabilitar notificações
  const disableNotifications = useCallback(async () => {
    try {
      // Remover token do usuário atual
      if (user) {
        const userTokens = JSON.parse(
          localStorage.getItem("userNotificationTokens") || "{}",
        );
        delete userTokens[user.id];
        localStorage.setItem(
          "userNotificationTokens",
          JSON.stringify(userTokens),
        );
      }

      await checkNotificationStatus();
      console.log("🔕 Notificações desabilitadas");
    } catch (error) {
      console.error("❌ Erro ao desabilitar notificações:", error);
    }
  }, [user, checkNotificationStatus]);

  // Verificar status na montagem do componente
  useEffect(() => {
    checkNotificationStatus();
  }, [checkNotificationStatus]);

  // Auto-inicializar se permissão já foi concedida
  useEffect(() => {
    if (
      status.isSupported &&
      status.permission === "granted" &&
      !status.isInitialized
    ) {
      initializeNotifications();
    }
  }, [
    status.isSupported,
    status.permission,
    status.isInitialized,
    initializeNotifications,
  ]);

  return {
    status,
    isLoading,
    initializeNotifications,
    requestPermission,
    notifyWorkAssigned,
    notifyWorkStatusChange,
    showNotification,
    disableNotifications,
    checkStatus: checkNotificationStatus,
  };
}
