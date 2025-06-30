import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";
import app from "@/lib/firebase";
import { User } from "@shared/types";

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  badge?: string;
  image?: string;
}

class NotificationServiceClass {
  private messaging = getMessaging(app);
  private isSupported = false;
  private isInitialized = false;

  constructor() {
    this.checkSupport();
  }

  private checkSupport() {
    // Verificar se notificações são suportadas
    this.isSupported =
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;

    console.log("🔔 Notificações suportadas:", this.isSupported);
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      console.log("🚀 Inicializando serviço de notificações...");

      // Verificar se é ambiente mobile (Capacitor)
      if (Capacitor.isNativePlatform()) {
        await this.initializeNativeNotifications();
      } else {
        await this.initializeWebNotifications();
      }

      this.isInitialized = true;
      console.log("✅ Serviço de notificações inicializado com sucesso");
      return true;
    } catch (error) {
      console.error("❌ Erro ao inicializar notificações:", error);
      return false;
    }
  }

  private async initializeWebNotifications() {
    console.log("🌐 Inicializando notificações web...");

    // Registrar service worker para FCM
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );
        console.log("✅ Service Worker registrado:", registration);
      } catch (error) {
        console.error("❌ Erro ao registrar Service Worker:", error);
      }
    }

    // Pedir permissão para notificações
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Permissão para notificações concedida");

      // Obter token FCM
      try {
        const token = await getToken(this.messaging, {
          vapidKey:
            "BH8x2EsXxnwIoI8OnPo_j7R1mIm6x9SJfmOSoWGdJbT8xGJhq2M7ZjJ8xSLUCQKnP7VeX2HvYfJ6O9yOz6ZFQGE", // Substituir pela sua VAPID key
        });
        console.log("🔑 Token FCM:", token);

        // Salvar token do usuário
        await this.saveUserToken(token);
      } catch (error) {
        console.error("❌ Erro ao obter token FCM:", error);
      }
    } else {
      console.warn("⚠️ Permissão para notificações negada");
    }

    // Configurar listener para mensagens em primeiro plano
    onMessage(this.messaging, (payload) => {
      console.log("📨 Mensagem recebida em primeiro plano:", payload);
      this.handleForegroundMessage(payload);
    });
  }

  private async initializeNativeNotifications() {
    console.log("📱 Inicializando notificações nativas...");

    // Pedir permissão para notificações push
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      console.warn("⚠️ Permissões para notificações push não concedidas");
      return;
    }

    // Registrar para notificações push
    await PushNotifications.register();

    // Listeners para notificações nativas
    PushNotifications.addListener("registration", (token) => {
      console.log("📱 Token de registro push:", token.value);
      this.saveUserToken(token.value);
    });

    PushNotifications.addListener("registrationError", (error) => {
      console.error("❌ Erro no registro push:", error);
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("📨 Notificação push recebida:", notification);
      },
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("👆 Ação na notificação push:", notification);
        this.handleNotificationClick(notification.notification.data);
      },
    );

    // Pedir permissão para notificações locais
    await LocalNotifications.requestPermissions();
  }

  private async saveUserToken(token: string) {
    try {
      // Buscar usuário atual da chave correta
      const currentUser = JSON.parse(
        localStorage.getItem("leirisonda_user") || "{}",
      );

      console.log("💾 Tentando salvar token para usuário:", {
        hasUser: !!currentUser,
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        token: token.substring(0, 20) + "...",
      });

      if (currentUser.id) {
        // Salvar token no localStorage (pode ser expandido para Firebase)
        const userTokens = JSON.parse(
          localStorage.getItem("userNotificationTokens") || "{}",
        );
        userTokens[currentUser.id] = token;
        localStorage.setItem(
          "userNotificationTokens",
          JSON.stringify(userTokens),
        );

        console.log(
          "✅ Token salvo para usuário:",
          currentUser.id,
          currentUser.name,
        );
        console.log("📋 Tokens atuais:", Object.keys(userTokens));
      } else {
        console.warn("⚠️ Usuário atual não encontrado no localStorage");
      }
    } catch (error) {
      console.error("❌ Erro ao salvar token do usuário:", error);
    }
  }

  private handleForegroundMessage(payload: any) {
    console.log("🎯 Processando mensagem em primeiro plano:", payload);

    // Mostrar notificação no browser se a página estiver ativa
    if (payload.notification) {
      this.showLocalNotification({
        title: payload.notification.title,
        body: payload.notification.body,
        data: payload.data,
        icon: payload.notification.icon || "/leirisonda-icon.svg",
      });
    }
  }

  private handleNotificationClick(data: any) {
    console.log("🎯 Clique na notificação:", data);

    // Navegar para a obra específica se fornecido
    if (data.workId) {
      window.location.href = `/work/${data.workId}`;
    } else if (data.type === "work_assigned") {
      window.location.href = "/dashboard";
    }
  }

  async showLocalNotification(payload: NotificationPayload) {
    try {
      if (Capacitor.isNativePlatform()) {
        // Notificação local nativa
        await LocalNotifications.schedule({
          notifications: [
            {
              title: payload.title,
              body: payload.body,
              id: Date.now(),
              extra: payload.data,
              iconColor: "#007784",
              sound: "default",
              largeIcon: payload.icon || "/leirisonda-icon.svg",
            },
          ],
        });
      } else {
        // Notificação web
        if (this.isSupported && Notification.permission === "granted") {
          const notification = new Notification(payload.title, {
            body: payload.body,
            icon: payload.icon || "/leirisonda-icon.svg",
            badge: payload.badge || "/leirisonda-icon.svg",
            image: payload.image,
            data: payload.data,
            tag: "leirisonda-notification",
            requireInteraction: true,
          });

          notification.onclick = () => {
            this.handleNotificationClick(payload.data || {});
            notification.close();
          };

          // Auto-fechar após 10 segundos
          setTimeout(() => notification.close(), 10000);
        }
      }
    } catch (error) {
      console.error("❌ Erro ao mostrar notificação local:", error);
    }
  }

  async notifyWorkAssigned(work: any, assignedUsers: string[]) {
    console.log("🎯 Enviando notificação de obra atribuída:", {
      work: work.workSheetNumber,
      users: assignedUsers,
    });

    try {
      // Verificar usuário atual para mostrar notificação apenas se estiver atribuído
      const currentUser = JSON.parse(
        localStorage.getItem("leirisonda_user") || "{}",
      );

      console.log("👤 Usuário atual:", {
        currentUserId: currentUser.id,
        currentUserName: currentUser.name,
        assignedUsers: assignedUsers,
        shouldReceiveNotification: assignedUsers.includes(currentUser.id),
      });

      // Só mostrar notificação LOCAL se o usuário atual estiver entre os atribuídos
      if (currentUser.id && assignedUsers.includes(currentUser.id)) {
        const payload: NotificationPayload = {
          title: "🏗️ Nova Obra Atribuída",
          body: `Foi-lhe atribuída a obra ${work.workSheetNumber} - ${work.clientName}`,
          data: {
            type: "work_assigned",
            workId: work.id,
            workSheetNumber: work.workSheetNumber,
            clientName: work.clientName,
          },
          icon: "/leirisonda-icon.svg",
        };

        console.log(
          `📨 Mostrando notificação local para ${currentUser.name}...`,
        );
        await this.showLocalNotification(payload);
        console.log(
          `✅ Notificação exibida para ${currentUser.name} (${currentUser.email})`,
        );
      } else {
        console.log(
          `ℹ️ Usuário atual (${currentUser.name || "Desconhecido"}) não está entre os atribuídos - não mostrar notificação local`,
        );
      }

      // Log para todos os usuários atribuídos (para debug/auditoria)
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const globalUsers = [
        {
          id: "admin_goncalo",
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
          role: "admin" as const,
        },
        {
          id: "user_alexandre",
          email: "alexkamaryta@gmail.com",
          name: "Alexandre Fernandes",
          role: "user" as const,
        },
      ];

      const allUsers = [...storedUsers, ...globalUsers];

      console.log("📋 Auditoria de notificações:");
      for (const userId of assignedUsers) {
        const user = allUsers.find((u: User) => u.id === userId);
        if (user) {
          console.log(
            `👤 ${user.name} (${user.email}) - deve receber notificação quando acessar o sistema`,
          );
        }
      }
    } catch (error) {
      console.error("❌ Erro ao enviar notificações de obra atribuída:", error);
    }
  }

  async notifyWorkStatusChange(
    work: any,
    newStatus: string,
    assignedUsers: string[],
  ) {
    console.log("🔄 Enviando notificação de mudança de status:", {
      work: work.workSheetNumber,
      status: newStatus,
      assignedUsers: assignedUsers,
    });

    try {
      // Verificar usuário atual para mostrar notificação apenas se estiver atribuído
      const currentUser = JSON.parse(
        localStorage.getItem("leirisonda_user") || "{}",
      );

      console.log("👤 Usuário atual para status change:", {
        currentUserId: currentUser.id,
        currentUserName: currentUser.name,
        assignedUsers: assignedUsers,
        shouldReceiveNotification: assignedUsers.includes(currentUser.id),
      });

      // Só mostrar notificação LOCAL se o usuário atual estiver entre os atribuídos
      if (currentUser.id && assignedUsers.includes(currentUser.id)) {
        const statusLabels = {
          pendente: "Pendente",
          em_progresso: "Em Progresso",
          concluida: "Concluída",
        };

        const payload: NotificationPayload = {
          title: "📋 Status da Obra Atualizado",
          body: `Obra ${work.workSheetNumber} agora está: ${statusLabels[newStatus as keyof typeof statusLabels]}`,
          data: {
            type: "work_status_change",
            workId: work.id,
            workSheetNumber: work.workSheetNumber,
            newStatus,
          },
          icon: "/leirisonda-icon.svg",
        };

        console.log(
          `📨 Mostrando notificação de status para ${currentUser.name}...`,
        );
        await this.showLocalNotification(payload);
        console.log(
          `✅ Notificação de status exibida para ${currentUser.name} (${currentUser.email})`,
        );
      } else {
        console.log(
          `ℹ️ Usuário atual (${currentUser.name || "Desconhecido"}) não está entre os atribuídos - não mostrar notificação de status`,
        );
      }

      // Log para auditoria
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const globalUsers = [
        {
          id: "admin_goncalo",
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
          role: "admin" as const,
        },
        {
          id: "user_alexandre",
          email: "alexkamaryta@gmail.com",
          name: "Alexandre Fernandes",
          role: "user" as const,
        },
      ];

      const allUsers = [...storedUsers, ...globalUsers];

      console.log("📋 Auditoria de notificações de status:");
      for (const userId of assignedUsers) {
        const user = allUsers.find((u: User) => u.id === userId);
        if (user) {
          console.log(
            `👤 ${user.name} (${user.email}) - deve receber notificação de status quando acessar o sistema`,
          );
        }
      }
    } catch (error) {
      console.error(
        "❌ Erro ao enviar notificações de mudança de status:",
        error,
      );
    }
  }

  // Método para enviar notificação via servidor FCM (implementar conforme necessário)
  private async sendPushNotification(
    token: string,
    payload: NotificationPayload,
  ) {
    // Implementar envio via servidor FCM
    // Esta funcionalidade requer um servidor backend para enviar as notificações
    console.log("📤 Enviaria notificação push para token:", token, payload);
  }

  getIsSupported(): boolean {
    return this.isSupported;
  }

  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

export const notificationService = new NotificationServiceClass();
