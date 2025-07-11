// Serviço FCM para notificações push
export class FCMService {
  private static instance: FCMService;

  constructor() {
    if (FCMService.instance) {
      return FCMService.instance;
    }
    FCMService.instance = this;
  }

  /**
   * Enviar notificação para um utilizador específico
   */
  async sendNotificationToUser(
    userId: string | number,
    notification: {
      title: string;
      body: string;
      icon?: string;
      clickAction?: string;
      data?: any;
    },
  ): Promise<boolean> {
    try {
      console.log(
        `📱 FCM: Tentando enviar notificação para utilizador ${userId}`,
      );

      // Para já, vamos simular o envio e usar notificações locais
      if ("Notification" in window && Notification.permission === "granted") {
        const localNotification = new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon || "/icon.svg",
          badge: "/icon.svg",
          tag: `work-${userId}`,
          data: notification.data,
          requireInteraction: true,
        });

        // Auto-close após 10 segundos
        setTimeout(() => {
          localNotification.close();
        }, 10000);

        // Handle click
        localNotification.onclick = () => {
          window.focus();
          localNotification.close();
          if (notification.clickAction) {
            window.location.hash = notification.clickAction.replace("/#", "");
          }
        };

        console.log(
          `✅ FCM: Notificação local enviada para utilizador ${userId}`,
        );
        return true;
      } else {
        console.warn(`⚠️ FCM: Permissões de notificação não concedidas`);
        return false;
      }
    } catch (error) {
      console.error(
        `❌ FCM: Erro ao enviar notificação para utilizador ${userId}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Solicitar permissão para notificações
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (!("Notification" in window)) {
        console.warn("⚠️ FCM: Este browser não suporta notificações");
        return false;
      }

      if (Notification.permission === "granted") {
        console.log("✅ FCM: Permissão já concedida");
        return true;
      }

      if (Notification.permission === "denied") {
        console.warn("⚠️ FCM: Permissão negada pelo utilizador");
        return false;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("✅ FCM: Permissão concedida");
        return true;
      } else {
        console.warn("⚠️ FCM: Permissão negada");
        return false;
      }
    } catch (error) {
      console.error("❌ FCM: Erro ao solicitar permissão:", error);
      return false;
    }
  }

  /**
   * Verificar se as notificações estão disponíveis
   */
  isNotificationSupported(): boolean {
    return "Notification" in window;
  }

  /**
   * Obter estado atual da permissão
   */
  getPermissionState(): NotificationPermission {
    if (!("Notification" in window)) {
      return "denied";
    }
    return Notification.permission;
  }

  /**
   * Inicializar o serviço FCM
   */
  async initialize(): Promise<boolean> {
    try {
      console.log("🚀 FCM: Inicializando serviço...");

      if (!this.isNotificationSupported()) {
        console.warn("⚠️ FCM: Notificações não suportadas");
        return false;
      }

      const hasPermission = await this.requestPermission();
      if (hasPermission) {
        console.log("✅ FCM: Serviço inicializado com sucesso");
        return true;
      } else {
        console.warn("⚠️ FCM: Serviço inicializado sem permissões");
        return false;
      }
    } catch (error) {
      console.error("❌ FCM: Erro na inicialização:", error);
      return false;
    }
  }
}

// Exportar instância singleton
export const fcmService = new FCMService();
