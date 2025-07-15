import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getApps, getApp } from "firebase/app";

export interface NotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: string };
  userId?: string;
  obraId?: string;
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private messaging: any = null;
  private vapidKey =
    "BPqpFk8t8X3k4zC5r7K-8pL9mN0q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l"; // Substitua pela sua VAPID key real
  private isSupported = false;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Verificar se push notifications são suportadas
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        console.warn("⚠️ Push notifications não são suportadas neste browser");
        return false;
      }

      // Verificar se Firebase App está inicializada
      const apps = getApps();
      if (apps.length === 0) {
        console.warn("⚠️ Firebase App não está inicializada");
        return false;
      }

      const app = getApp();
      this.messaging = getMessaging(app);
      this.isSupported = true;

      console.log("✅ Push Notification Service inicializado");
      return true;
    } catch (error) {
      console.error("❌ Erro ao inicializar Push Notification Service:", error);
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      if (!this.isSupported) {
        console.warn("⚠️ Push notifications não suportadas");
        return false;
      }

      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("✅ Permissão para notificações concedida");
        return true;
      } else {
        console.warn("⚠️ Permissão para notificações negada");
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao solicitar permissão:", error);
      return false;
    }
  }

  async getDeviceToken(): Promise<string | null> {
    try {
      if (!this.messaging || !this.isSupported) {
        console.warn("⚠️ Messaging não disponível");
        return null;
      }

      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: this.vapidKey,
      });

      if (token) {
        console.log("✅ Token FCM obtido:", token.substring(0, 20) + "...");
        return token;
      } else {
        console.warn("⚠️ Não foi possível obter token FCM");
        return null;
      }
    } catch (error) {
      console.error("❌ Erro ao obter token:", error);
      return null;
    }
  }

  setupForegroundMessageListener(): void {
    if (!this.messaging || !this.isSupported) return;

    onMessage(this.messaging, (payload) => {
      console.log("📢 Mensagem recebida em foreground:", payload);

      const { title, body } = payload.notification || {};

      if (title && body) {
        this.showLocalNotification(title, body, payload.data);
      }
    });
  }

  private showLocalNotification(title: string, body: string, data?: any): void {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: "/icon.svg",
        badge: "/icon.svg",
        tag: "leirisonda-obra",
        data: data,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();

        // Se há dados sobre a obra, navegar para ela
        if (data?.obraId) {
          console.log("📋 Navegando para obra:", data.obraId);
          // Aqui você pode adicionar lógica de navegação
        }
      };
    }
  }

  async sendNotificationToUser(
    userId: string,
    notification: NotificationPayload,
  ): Promise<boolean> {
    try {
      // Em uma implementação real, isso seria feito através de uma Cloud Function
      // ou servidor backend que tem acesso às chaves de servidor do FCM

      console.log("📤 Simulando envio de notificação para usuário:", userId);
      console.log("📋 Notificação:", notification);

      // Por agora, vamos simular o envio gravando no localStorage
      // para que outros dispositivos do mesmo usuário possam "receber"
      const notifications = JSON.parse(
        localStorage.getItem("pending-notifications") || "[]",
      );
      const newNotification = {
        ...notification,
        userId,
        timestamp: new Date().toISOString(),
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      notifications.push(newNotification);
      localStorage.setItem(
        "pending-notifications",
        JSON.stringify(notifications),
      );

      // Mostrar notificação local se for para o usuário atual
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );
      if (currentUser.id === userId || currentUser.email === userId) {
        this.showLocalNotification(
          notification.title,
          notification.body,
          notification.data,
        );
      }

      console.log('✅ Notificação "enviada" com sucesso');
      return true;
    } catch (error) {
      console.error("❌ Erro ao enviar notificação:", error);
      return false;
    }
  }

  async checkPendingNotifications(): Promise<void> {
    try {
      const notifications = JSON.parse(
        localStorage.getItem("pending-notifications") || "[]",
      );
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );

      if (!currentUser.id && !currentUser.email) return;

      const userNotifications = notifications.filter(
        (notif: any) =>
          notif.userId === currentUser.id || notif.userId === currentUser.email,
      );

      for (const notification of userNotifications) {
        // Mostrar notificação se ainda não foi vista
        if (!notification.seen) {
          this.showLocalNotification(
            notification.title,
            notification.body,
            notification.data,
          );
          notification.seen = true;
        }
      }

      // Atualizar localStorage
      localStorage.setItem(
        "pending-notifications",
        JSON.stringify(notifications),
      );
    } catch (error) {
      console.error("❌ Erro ao verificar notificações pendentes:", error);
    }
  }

  // Método para notificar atribuição de obra
  async notifyObraAssignment(
    obraData: any,
    assignedUserId: string,
  ): Promise<boolean> {
    const notification: NotificationPayload = {
      title: "🏗️ Nova Obra Atribuída",
      body: `Obra "${obraData.workSheetNumber || obraData.title}" foi atribuída a você`,
      data: {
        type: "obra_assignment",
        obraId: obraData.id,
        workSheetNumber: obraData.workSheetNumber || "",
        client: obraData.client || "",
      },
      userId: assignedUserId,
      obraId: obraData.id,
    };

    return await this.sendNotificationToUser(assignedUserId, notification);
  }

  // Método para salvar token do dispositivo
  async saveDeviceToken(userId: string): Promise<boolean> {
    try {
      const token = await this.getDeviceToken();
      if (!token) return false;

      // Salvar token associado ao usuário
      const deviceTokens = JSON.parse(
        localStorage.getItem("device-tokens") || "{}",
      );
      deviceTokens[userId] = {
        token,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      localStorage.setItem("device-tokens", JSON.stringify(deviceTokens));
      console.log("✅ Token do dispositivo salvo para usuário:", userId);
      return true;
    } catch (error) {
      console.error("❌ Erro ao salvar token do dispositivo:", error);
      return false;
    }
  }

  async startNotificationService(): Promise<void> {
    console.log("🚀 Iniciando serviço de notificações...");

    const initialized = await this.initialize();
    if (!initialized) return;

    this.setupForegroundMessageListener();

    // Verificar notificações pendentes periodicamente
    setInterval(() => {
      this.checkPendingNotifications();
    }, 30000); // A cada 30 segundos

    console.log("✅ Serviço de notificações ativo");
  }
}

// Instância singleton
export const pushNotificationService = PushNotificationService.getInstance();

// Auto-inicializar quando importado
if (typeof window !== "undefined") {
  setTimeout(() => {
    pushNotificationService.startNotificationService();
  }, 2000);
}
