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
        throw new Error(`Service Worker registration failed: ${error}`);
      }
    }

    // Pedir permissão para notificações
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Permissão para notificações concedida");

      // Obter token FCM - tentativa sem VAPID key primeiro (usa chave padrão do Firebase)
      try {
        console.log("🔑 Tentando obter token FCM...");

        // Primeiro tentar sem VAPID key personalizada
        let token;
        try {
          token = await getToken(this.messaging);
          console.log(
            "🔑 Token FCM obtido com configuração padrão:",
            token ? "✅ Sucesso" : "❌ Vazio",
          );
        } catch (defaultError) {
          console.warn(
            "⚠️ Erro com configuração padrão, tentando com VAPID key personalizada:",
            defaultError,
          );

          // Se falhar, tentar com VAPID key personalizada (pode estar incorreta)
          try {
            token = await getToken(this.messaging, {
              vapidKey:
                "BH8x2EsXxnwIoI8OnPo_j7R1mIm6x9SJfmOSoWGdJbT8xGJhq2M7ZjJ8xSLUCQKnP7VeX2HvYfJ6O9yOz6ZFQGE",
            });
            console.log(
              "🔑 Token FCM obtido com VAPID personalizada:",
              token ? "✅ Sucesso" : "❌ Vazio",
            );
          } catch (vapidError) {
            console.error("❌ Erro com VAPID key personalizada:", vapidError);
            console.log(
              "⚠️ PROBLEMA: VAPID key pode estar incorreta ou expirada",
            );
            console.log(
              "💡 SOLUÇÃO: Notificações funcionarão apenas localmente, sem FCM push",
            );
            // Continuar sem token FCM - notificações locais ainda funcionarão
          }
        }

        if (token) {
          console.log("🔑 Token FCM final:", token.substring(0, 20) + "...");
          // Salvar token do usuário
          await this.saveUserToken(token);
        } else {
          console.warn(
            "⚠️ Nenhum token FCM obtido - continuando apenas com notificações locais",
          );
        }
      } catch (error) {
        console.error("❌ Erro geral ao obter token FCM:", error);
        console.log("💡 Continuando com notificações locais apenas");
      }
    } else {
      console.warn("⚠️ Permissão para notificações negada");
      throw new Error(`Notification permission denied: ${permission}`);
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
    } else if (data.type === "pending_works_summary") {
      // Redirecionar para dashboard com foco nas obras atribuídas
      window.location.href = "/dashboard#assigned-works";
    } else if (data.type === "work_status_change") {
      // Redirecionar para a obra específica ou dashboard
      if (data.workId) {
        window.location.href = `/work/${data.workId}`;
      } else {
        window.location.href = "/dashboard";
      }
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

  async checkPendingAssignedWorks(userId: string) {
    console.log(
      "🔍 Verificando obras pendentes atribuídas ao usuário:",
      userId,
    );

    try {
      // Buscar obras do localStorage e Firebase
      const localWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const leirisondaWorks = JSON.parse(
        localStorage.getItem("leirisonda_works") || "[]",
      );

      // Combinar todas as obras e remover duplicatas baseado no ID
      const allWorksMap = new Map();

      [...localWorks, ...leirisondaWorks].forEach((work: any) => {
        if (work.id) {
          allWorksMap.set(work.id, work);
        }
      });

      const allWorks = Array.from(allWorksMap.values());

      // Filtrar obras atribuídas ao usuário atual que estão pendentes ou em progresso
      const pendingAssignedWorks = allWorks.filter((work: any) => {
        const isAssigned =
          work.assignedUsers &&
          Array.isArray(work.assignedUsers) &&
          work.assignedUsers.includes(userId);
        const isPending =
          work.status === "pendente" || work.status === "em_progresso";
        return isAssigned && isPending;
      });

      console.log(
        `📋 Encontradas ${pendingAssignedWorks.length} obras pendentes para ${userId}:`,
        pendingAssignedWorks.map(
          (w: any) => `${w.workSheetNumber} - ${w.clientName} (${w.status})`,
        ),
      );

      // Se há obras pendentes, mostrar notificação de resumo
      if (pendingAssignedWorks.length > 0) {
        const mostRecentWork = pendingAssignedWorks[0]; // Primeira obra encontrada

        const payload: NotificationPayload = {
          title: "🏗️ Obras Atribuídas",
          body:
            pendingAssignedWorks.length === 1
              ? `Nova obra atribuída: ${mostRecentWork.workSheetNumber} - ${mostRecentWork.clientName}`
              : `Tem ${pendingAssignedWorks.length} obras atribuídas (${pendingAssignedWorks.filter((w) => w.status === "pendente").length} pendentes)`,
          data: {
            type: "pending_works_summary",
            count: pendingAssignedWorks.length,
            works: pendingAssignedWorks.map((w: any) => ({
              id: w.id,
              workSheetNumber: w.workSheetNumber,
              clientName: w.clientName,
              status: w.status,
            })),
          },
          icon: "/leirisonda-icon.svg",
        };

        console.log("📨 Mostrando notificação de obras atribuídas...");
        await this.showLocalNotification(payload);
        console.log(
          `✅ Notificação de ${pendingAssignedWorks.length} obras atribuídas exibida`,
        );

        return pendingAssignedWorks;
      } else {
        console.log("ℹ️ Nenhuma obra pendente atribuída ao usuário");
        return [];
      }
    } catch (error) {
      console.error("❌ Erro ao verificar obras pendentes:", error);
      return [];
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

  // Método de diagnóstico completo para debug
  async runDiagnostics(): Promise<{
    environment: string;
    isSupported: boolean;
    isInitialized: boolean;
    permission: NotificationPermission | null;
    serviceWorkerStatus: string;
    fcmTokenStatus: string;
    firebaseStatus: string;
    userTokens: Record<string, string>;
    recommendations: string[];
  }> {
    const diagnostics = {
      environment: Capacitor.isNativePlatform()
        ? "Native (Capacitor)"
        : "Web Browser",
      isSupported: this.isSupported,
      isInitialized: this.isInitialized,
      permission: "Notification" in window ? Notification.permission : null,
      serviceWorkerStatus: "Unknown",
      fcmTokenStatus: "Unknown",
      firebaseStatus: "Unknown",
      userTokens: {},
      recommendations: [] as string[],
    };

    try {
      // Verificar Service Worker
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const fcmSW = registrations.find(
          (reg) =>
            reg.scope.includes("firebase-messaging-sw") ||
            reg.active?.scriptURL.includes("firebase-messaging-sw"),
        );

        if (fcmSW) {
          diagnostics.serviceWorkerStatus = fcmSW.active
            ? "Active"
            : "Inactive";
        } else {
          diagnostics.serviceWorkerStatus = "Not Registered";
          diagnostics.recommendations.push(
            "Service Worker para Firebase não está registrado",
          );
        }
      } else {
        diagnostics.serviceWorkerStatus = "Not Supported";
        diagnostics.recommendations.push(
          "Service Workers não são suportados neste browser",
        );
      }

      // Verificar Firebase status
      try {
        if (this.messaging) {
          diagnostics.firebaseStatus = "Initialized";

          // Tentar obter token
          try {
            const token = await getToken(this.messaging);
            diagnostics.fcmTokenStatus = token
              ? "Success"
              : "Failed - No Token";
            if (!token) {
              diagnostics.recommendations.push(
                "Não foi possível obter token FCM - verifique VAPID key",
              );
            }
          } catch (tokenError) {
            diagnostics.fcmTokenStatus = `Error: ${tokenError}`;
            diagnostics.recommendations.push(
              "Erro ao obter token FCM - possível problema com VAPID key",
            );
          }
        } else {
          diagnostics.firebaseStatus = "Not Initialized";
          diagnostics.recommendations.push(
            "Firebase Messaging não foi inicializado",
          );
        }
      } catch (firebaseError) {
        diagnostics.firebaseStatus = `Error: ${firebaseError}`;
        diagnostics.recommendations.push("Erro na inicialização do Firebase");
      }

      // Carregar tokens salvos
      try {
        diagnostics.userTokens = JSON.parse(
          localStorage.getItem("userNotificationTokens") || "{}",
        );
      } catch (error) {
        diagnostics.recommendations.push(
          "Erro ao carregar tokens de usuários salvos",
        );
      }

      // Verificar permissões
      if (diagnostics.permission !== "granted") {
        diagnostics.recommendations.push(
          "Permissão para notificações não foi concedida",
        );
      }

      // Verificar suporte geral
      if (!diagnostics.isSupported) {
        diagnostics.recommendations.push(
          "Notificações não são suportadas neste dispositivo/browser",
        );
      }

      // Recomendações específicas
      if (diagnostics.recommendations.length === 0) {
        diagnostics.recommendations.push(
          "Sistema aparenta estar funcionando corretamente",
        );
      }
    } catch (error) {
      console.error("❌ Erro durante diagnóstico:", error);
      diagnostics.recommendations.push(`Erro durante diagnóstico: ${error}`);
    }

    console.log("🔍 Diagnóstico completo:", diagnostics);
    return diagnostics;
  }
}

export const notificationService = new NotificationServiceClass();
