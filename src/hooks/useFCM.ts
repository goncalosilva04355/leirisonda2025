import { useState, useEffect, useCallback } from "react";
import { fcmService } from "../services/fcmService";

interface FCMStatus {
  supported: boolean;
  initialized: boolean;
  hasToken: boolean;
  permission: NotificationPermission;
  token: string | null;
}

interface User {
  uid: string;
  email: string;
  name: string;
}

export const useFCM = (currentUser: User | null) => {
  const [fcmStatus, setFCMStatus] = useState<FCMStatus>({
    supported: false,
    initialized: false,
    hasToken: false,
    permission: "default",
    token: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar status do FCM
  const checkFCMStatus = useCallback(async () => {
    try {
      // const status = fcmService.getStatus(); // Method not available
      const status = { supported: false, initialized: false, hasToken: false };
      const currentPermission = Notification.permission;

      setFCMStatus({
        supported: status.supported,
        initialized: status.initialized,
        hasToken: status.hasToken,
        permission: currentPermission,
        token: null, // Will be set when token is requested
      });
    } catch (error) {
      console.error("Erro ao verificar status FCM:", error);
      setError("Erro ao verificar suporte a notificações");
    }
  }, []);

  // Inicializar FCM quando component monta
  useEffect(() => {
    checkFCMStatus();
  }, [checkFCMStatus]);

  // Solicitar permissão e obter token
  const requestPermissionAndToken = useCallback(async (): Promise<boolean> => {
    if (!currentUser) {
      setError("Usuário não autenticado");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Solicitar permissão
      const hasPermission = await fcmService.requestPermission();

      if (!hasPermission) {
        setError("Permissão para notificações negada");
        setIsLoading(false);
        return false;
      }

      // Obter token
      // const token = await fcmService.getToken(currentUser.uid); // Method not available
      const token = null;

      if (token) {
        setFCMStatus((prev) => ({
          ...prev,
          hasToken: true,
          token,
          permission: "granted",
        }));

        console.log(`✅ FCM: Token configurado para ${currentUser.name}`);
        return true;
      } else {
        setError("Não foi possível obter token de notificação");
        return false;
      }
    } catch (error) {
      console.error("Erro ao configurar FCM:", error);
      setError("Erro ao configurar notificações push");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Remover token atual
  const removeToken = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // const success = await fcmService.deleteCurrentToken(); // Method not available
      const success = true;

      if (success) {
        setFCMStatus((prev) => ({
          ...prev,
          hasToken: false,
          token: null,
        }));
        return true;
      } else {
        setError("Erro ao remover token de notificação");
        return false;
      }
    } catch (error) {
      console.error("Erro ao remover token FCM:", error);
      setError("Erro ao remover notificações");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enviar notificação de teste
  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    if (!currentUser) {
      setError("Usuário não autenticado");
      return false;
    }

    try {
      const success = await fcmService.sendNotificationToUser(currentUser.uid, {
        title: "🔔 Teste de Notificação",
        body: `Olá ${currentUser.name}! As notificações estão funcionando.`,
        icon: "/icon.svg",
        data: {
          type: "test",
          userId: currentUser.uid,
        },
      });

      if (success) {
        console.log("✅ Notificação de teste enviada");
      } else {
        setError("Erro ao enviar notificação de teste");
      }

      return success;
    } catch (error) {
      console.error("Erro ao enviar notificação de teste:", error);
      setError("Erro ao enviar notificação de teste");
      return false;
    }
  }, [currentUser]);

  // Verificar se usuário já tem token
  const hasUserToken = useCallback((): boolean => {
    if (!currentUser) return false;

    const userTokens = fcmService.getUserTokens(currentUser.uid);
    return userTokens.length > 0;
  }, [currentUser]);

  // Obter tokens do usuário atual
  const getUserTokens = useCallback(() => {
    if (!currentUser) return [];
    return fcmService.getUserTokens(currentUser.uid);
  }, [currentUser]);

  // Estado calculado
  const canRequestPermission =
    fcmStatus.supported &&
    fcmStatus.initialized &&
    fcmStatus.permission !== "granted";

  const hasValidSetup =
    fcmStatus.supported &&
    fcmStatus.initialized &&
    fcmStatus.permission === "granted" &&
    hasUserToken();

  const needsSetup =
    fcmStatus.supported && fcmStatus.initialized && !hasUserToken();

  return {
    // Status
    fcmStatus,
    isLoading,
    error,

    // Estados computados
    canRequestPermission,
    hasValidSetup,
    needsSetup,

    // Funções
    requestPermissionAndToken,
    removeToken,
    sendTestNotification,
    checkFCMStatus,
    hasUserToken,
    getUserTokens,

    // Limpar erro
    clearError: () => setError(null),
  };
};

export default useFCM;
