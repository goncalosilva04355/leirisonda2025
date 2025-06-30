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

      // Inicializar listener de eventos de broadcast
      this.initializeNotificationListener();

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
        console.log("��� Ação na notificação push:", notification);
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
      const currentUser = JSON.parse(
        localStorage.getItem("leirisonda_user") || "{}",
      );

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

      console.log("👤 Usuário atual:", {
        currentUserId: currentUser.id,
        currentUserName: currentUser.name,
        assignedUsers: assignedUsers,
      });

      // Buscar informações dos usuários
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

      // SALVAR NOTIFICAÇÃO PENDENTE PARA CADA USUÁRIO ATRIBUÍDO
      console.log(
        "💾 Salvando notificações pendentes para sincronização cross-device...",
      );

      const pendingNotifications = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]",
      );

      assignedUsers.forEach((userId) => {
        const user = allUsers.find((u: User) => u.id === userId);
        if (user) {
          const pendingNotification = {
            id: `work_assigned_${work.id}_${userId}_${Date.now()}`,
            userId: userId,
            userName: user.name,
            userEmail: user.email,
            type: "work_assigned",
            title: payload.title,
            body: payload.body,
            data: payload.data,
            icon: payload.icon,
            timestamp: new Date().toISOString(),
            workId: work.id,
            workSheetNumber: work.workSheetNumber,
            clientName: work.clientName,
            delivered: false,
            attempts: 0,
          };

          pendingNotifications.push(pendingNotification);
          console.log(`📋 Notificação pendente salva para ${user.name}`);
        }
      });

      // Salvar lista atualizada de notificações pendentes
      localStorage.setItem(
        "pendingNotifications",
        JSON.stringify(pendingNotifications),
      );

      // TENTAR ENTREGAR NOTIFICAÇÕES PUSH IMEDIATAMENTE
      console.log("📤 Tentando entregar notificações push imediatamente...");

      const pushPromises = assignedUsers.map(async (userId) => {
        const user = allUsers.find((u: User) => u.id === userId);

        if (user) {
          console.log(`📱 Tentando push para ${user.name} (${user.email})...`);

          try {
            const pushSent = await this.sendPushNotification(userId, payload);

            if (pushSent) {
              console.log(`✅ Push enviado com sucesso para ${user.name}`);
              // Marcar notificação como entregue
              this.markNotificationAsDelivered(
                userId,
                work.id,
                "work_assigned",
              );
            } else {
              console.warn(
                `⚠️ Push falhou para ${user.name} - será reentregue quando usuário fizer login`,
              );

              // Fallback: mostrar notificação local apenas se for o usuário atual
              if (currentUser.id === userId) {
                await this.showLocalNotification(payload);
                console.log(
                  `💡 Notificação local mostrada para usuário atual: ${user.name}`,
                );
                this.markNotificationAsDelivered(
                  userId,
                  work.id,
                  "work_assigned",
                );
              }
            }
          } catch (pushError) {
            console.error(`❌ Erro no push para ${user.name}:`, pushError);

            // Fallback: mostrar notificação local apenas se for o usuário atual
            if (currentUser.id === userId) {
              await this.showLocalNotification(payload);
              console.log(`💡 Fallback local para usuário atual: ${user.name}`);
              this.markNotificationAsDelivered(
                userId,
                work.id,
                "work_assigned",
              );
            }
          }
        } else {
          console.warn(`⚠️ Usuário não encontrado: ${userId}`);
        }
      });

      // Aguardar todos os envios de push
      await Promise.allSettled(pushPromises);

      // BROADCAST VIA LOCALSTORAGE PARA COMUNICAÇÃO CROSS-TAB/DEVICE
      console.log(
        "📡 Broadcasting notificação via localStorage para outros dispositivos...",
      );

      const broadcastEvent = {
        type: "LEIRISONDA_WORK_ASSIGNED",
        timestamp: new Date().toISOString(),
        workId: work.id,
        workSheetNumber: work.workSheetNumber,
        clientName: work.clientName,
        assignedUsers: assignedUsers,
        payload: payload,
      };

      // Salvar evento de broadcast
      localStorage.setItem(
        "lastNotificationBroadcast",
        JSON.stringify(broadcastEvent),
      );

      // Tentar disparar evento storage para outros dispositivos/tabs
      try {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "lastNotificationBroadcast",
            newValue: JSON.stringify(broadcastEvent),
            storageArea: localStorage,
          }),
        );
        console.log("📡 Evento de broadcast disparado com sucesso");
      } catch (broadcastError) {
        console.warn("⚠️ Erro no broadcast de evento:", broadcastError);
      }

      console.log(
        "✅ Processo de notificações concluído para todos os usuários atribuídos (com backup para reentrega)",
      );
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
      const currentUser = JSON.parse(
        localStorage.getItem("leirisonda_user") || "{}",
      );

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

      console.log("👤 Usuário atual para status change:", {
        currentUserId: currentUser.id,
        currentUserName: currentUser.name,
        assignedUsers: assignedUsers,
      });

      // Buscar informações dos usuários
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

      // SALVAR NOTIFICAÇÕES PENDENTES PARA CADA USUÁRIO ATRIBUÍDO
      console.log(
        "💾 Salvando notificações pendentes de status para sincronização cross-device...",
      );

      const pendingNotifications = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]",
      );

      assignedUsers.forEach((userId) => {
        const user = allUsers.find((u: User) => u.id === userId);
        if (user) {
          const pendingNotification = {
            id: `work_status_change_${work.id}_${userId}_${Date.now()}`,
            userId: userId,
            userName: user.name,
            userEmail: user.email,
            type: "work_status_change",
            title: payload.title,
            body: payload.body,
            data: payload.data,
            icon: payload.icon,
            timestamp: new Date().toISOString(),
            workId: work.id,
            workSheetNumber: work.workSheetNumber,
            newStatus: newStatus,
            delivered: false,
            attempts: 0,
          };

          pendingNotifications.push(pendingNotification);
          console.log(
            `📋 Notificação de status pendente salva para ${user.name}`,
          );
        }
      });

      // Salvar lista atualizada de notificações pendentes
      localStorage.setItem(
        "pendingNotifications",
        JSON.stringify(pendingNotifications),
      );

      // TENTAR ENTREGAR NOTIFICAÇÕES PUSH IMEDIATAMENTE
      console.log(
        "📤 Tentando entregar notificações push de status imediatamente...",
      );

      const pushPromises = assignedUsers.map(async (userId) => {
        const user = allUsers.find((u: User) => u.id === userId);

        if (user) {
          console.log(
            `📱 Enviando push de status para ${user.name} (${user.email})...`,
          );

          try {
            const pushSent = await this.sendPushNotification(userId, payload);

            if (pushSent) {
              console.log(
                `✅ Push de status enviado com sucesso para ${user.name}`,
              );
              // Marcar notificação como entregue
              this.markNotificationAsDelivered(
                userId,
                work.id,
                "work_status_change",
              );
            } else {
              console.warn(
                `⚠️ Push de status falhou para ${user.name} - será reentregue quando usuário fizer login`,
              );

              // Fallback: mostrar notificação local apenas se for o usuário atual
              if (currentUser.id === userId) {
                await this.showLocalNotification(payload);
                console.log(
                  `💡 Notificação local de status mostrada para usuário atual: ${user.name}`,
                );
                this.markNotificationAsDelivered(
                  userId,
                  work.id,
                  "work_status_change",
                );
              }
            }
          } catch (pushError) {
            console.error(
              `❌ Erro no push de status para ${user.name}:`,
              pushError,
            );

            // Fallback: mostrar notificação local apenas se for o usuário atual
            if (currentUser.id === userId) {
              await this.showLocalNotification(payload);
              console.log(
                `💡 Fallback local de status para usuário atual: ${user.name}`,
              );
              this.markNotificationAsDelivered(
                userId,
                work.id,
                "work_status_change",
              );
            }
          }
        } else {
          console.warn(`⚠️ Usuário não encontrado: ${userId}`);
        }
      });

      // Aguardar todos os envios de push
      await Promise.allSettled(pushPromises);

      // BROADCAST VIA LOCALSTORAGE PARA COMUNICAÇÃO CROSS-TAB/DEVICE
      console.log(
        "📡 Broadcasting mudança de status via localStorage para outros dispositivos...",
      );

      const broadcastEvent = {
        type: "LEIRISONDA_WORK_STATUS_CHANGE",
        timestamp: new Date().toISOString(),
        workId: work.id,
        workSheetNumber: work.workSheetNumber,
        newStatus: newStatus,
        assignedUsers: assignedUsers,
        payload: payload,
      };

      // Salvar evento de broadcast
      localStorage.setItem(
        "lastStatusBroadcast",
        JSON.stringify(broadcastEvent),
      );

      // Tentar disparar evento storage para outros dispositivos/tabs
      try {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "lastStatusBroadcast",
            newValue: JSON.stringify(broadcastEvent),
            storageArea: localStorage,
          }),
        );
        console.log("📡 Evento de broadcast de status disparado com sucesso");
      } catch (broadcastError) {
        console.warn(
          "⚠️ Erro no broadcast de evento de status:",
          broadcastError,
        );
      }

      console.log(
        "✅ Processo de notificações de status concluído para todos os usuários atribuídos (com backup para reentrega)",
      );
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
      // PRIMEIRO: Verificar e processar notificações pendentes não entregues
      await this.processPendingNotifications(userId);

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

      // Filtrar obras atribuídas ao usuário atual que est��o pendentes ou em progresso
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

  // Método para enviar notificação push real via Firebase Cloud Messaging
  private async sendPushNotification(
    userId: string,
    payload: NotificationPayload,
  ) {
    try {
      console.log(
        `📤 Enviando notificação push para usuário ${userId}:`,
        payload,
      );

      // Obter token do usuário de destino
      const userTokens = JSON.parse(
        localStorage.getItem("userNotificationTokens") || "{}",
      );
      const targetToken = userTokens[userId];

      if (!targetToken) {
        console.warn(`⚠️ Token não encontrado para usuário ${userId}`);
        return false;
      }

      // Usar Firebase Admin via endpoint da aplicação
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: targetToken,
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
          icon: payload.icon || "/leirisonda-icon.svg",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Notificação push enviada com sucesso:`, result);
        return true;
      } else {
        const error = await response.text();
        console.error(`❌ Erro no servidor ao enviar push:`, error);
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao enviar notificação push:", error);
      return false;
    }
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

  // Marcar notificação como entregue
  private markNotificationAsDelivered(
    userId: string,
    workId: string,
    type: string,
  ) {
    try {
      const pendingNotifications = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]",
      );

      const updatedNotifications = pendingNotifications.map(
        (notification: any) => {
          if (
            notification.userId === userId &&
            notification.workId === workId &&
            notification.type === type
          ) {
            return {
              ...notification,
              delivered: true,
              deliveredAt: new Date().toISOString(),
            };
          }
          return notification;
        },
      );

      localStorage.setItem(
        "pendingNotifications",
        JSON.stringify(updatedNotifications),
      );
      console.log(
        `✅ Notificação marcada como entregue para ${userId} - obra ${workId}`,
      );
    } catch (error) {
      console.error("❌ Erro ao marcar notificação como entregue:", error);
    }
  }

  // Processar notificações pendentes para um usuário específico
  private async processPendingNotifications(userId: string) {
    try {
      console.log(`🔄 Processando notificações pendentes para ${userId}...`);

      const pendingNotifications = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]",
      );

      // Filtrar notificações não entregues para este usuário
      const userPendingNotifications = pendingNotifications.filter(
        (notification: any) =>
          notification.userId === userId &&
          !notification.delivered &&
          notification.attempts < 3, // Máximo 3 tentativas
      );

      console.log(
        `📋 Encontradas ${userPendingNotifications.length} notificações pendentes para ${userId}`,
      );

      if (userPendingNotifications.length === 0) {
        return;
      }

      // Processar cada notificação pendente
      for (const notification of userPendingNotifications) {
        try {
          console.log(
            `📨 Reentregando notificação: ${notification.title} para ${notification.userName}`,
          );

          // Mostrar notificação local
          await this.showLocalNotification({
            title: notification.title,
            body: notification.body,
            data: notification.data,
            icon: notification.icon,
          });

          // Marcar como entregue
          this.markNotificationAsDelivered(
            notification.userId,
            notification.workId,
            notification.type,
          );

          console.log(
            `✅ Notificação reentregue com sucesso: ${notification.title}`,
          );
        } catch (redeliveryError) {
          console.error(
            `❌ Erro na reentrega de notificação ${notification.id}:`,
            redeliveryError,
          );

          // Incrementar tentativas
          notification.attempts = (notification.attempts || 0) + 1;
          notification.lastAttempt = new Date().toISOString();
        }
      }

      // Salvar notificações atualizadas
      localStorage.setItem(
        "pendingNotifications",
        JSON.stringify(pendingNotifications),
      );

      // Limpar notificações muito antigas (mais de 7 dias) ou com muitas tentativas
      this.cleanupOldNotifications();
    } catch (error) {
      console.error("❌ Erro ao processar notificações pendentes:", error);
    }
  }

  // Limpar notificações antigas
  private cleanupOldNotifications() {
    try {
      const pendingNotifications = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]",
      );

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const cleanedNotifications = pendingNotifications.filter(
        (notification: any) => {
          const notificationDate = new Date(notification.timestamp);
          const isRecent = notificationDate > oneWeekAgo;
          const hasAttemptsLeft = notification.attempts < 3;
          const isDelivered = notification.delivered;

          // Manter se: recente E (tem tentativas OU já foi entregue)
          return isRecent && (hasAttemptsLeft || isDelivered);
        },
      );

      if (cleanedNotifications.length !== pendingNotifications.length) {
        localStorage.setItem(
          "pendingNotifications",
          JSON.stringify(cleanedNotifications),
        );
        console.log(
          `🧹 Limpeza de notificações: removidas ${pendingNotifications.length - cleanedNotifications.length} notificações antigas`,
        );
      }
    } catch (error) {
      console.error("❌ Erro na limpeza de notificações:", error);
    }
  }

  // Inicializar listener para eventos de broadcast de notificações
  initializeNotificationListener() {
    if (typeof window !== "undefined") {
      console.log("📡 Inicializando listener de eventos de notificações...");

      // Listener para eventos de storage (cross-tab/device communication)
      window.addEventListener("storage", (event) => {
        if (event.key === "lastNotificationBroadcast" && event.newValue) {
          try {
            const broadcastEvent = JSON.parse(event.newValue);
            console.log("📡 Recebido evento de broadcast:", broadcastEvent);

            // Verificar se é um evento de obra atribuída
            if (broadcastEvent.type === "LEIRISONDA_WORK_ASSIGNED") {
              this.handleBroadcastWorkAssigned(broadcastEvent);
            }
          } catch (error) {
            console.error("❌ Erro ao processar evento de broadcast:", error);
          }
        }
      });

      console.log("✅ Listener de notificações inicializado");
    }
  }

  // Manipular evento de obra atribuída via broadcast
  private async handleBroadcastWorkAssigned(broadcastEvent: any) {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("leirisonda_user") || "{}",
      );

      // Verificar se o usuário atual está na lista de usuários atribuídos
      if (
        currentUser.id &&
        broadcastEvent.assignedUsers.includes(currentUser.id)
      ) {
        console.log(
          `📨 Processando notificação de broadcast para ${currentUser.name}...`,
        );

        // Mostrar notificação local se ainda não foi entregue
        const pendingNotifications = JSON.parse(
          localStorage.getItem("pendingNotifications") || "[]",
        );

        const alreadyDelivered = pendingNotifications.some(
          (notification: any) =>
            notification.userId === currentUser.id &&
            notification.workId === broadcastEvent.workId &&
            notification.type === "work_assigned" &&
            notification.delivered,
        );

        if (!alreadyDelivered) {
          await this.showLocalNotification(broadcastEvent.payload);

          // Marcar como entregue
          this.markNotificationAsDelivered(
            currentUser.id,
            broadcastEvent.workId,
            "work_assigned",
          );

          console.log("✅ Notificação de broadcast entregue com sucesso");
        } else {
          console.log("ℹ️ Notificação já foi entregue anteriormente");
        }
      }
    } catch (error) {
      console.error("❌ Erro ao processar broadcast de obra atribuída:", error);
    }
  }
}

export const notificationService = new NotificationServiceClass();
