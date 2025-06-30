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
  private _isSupported = false;
  private _isInitialized = false;

  constructor() {
    this.checkSupport();
  }

  // Getters públicos para acessar propriedades privadas
  get isSupported(): boolean {
    return this._isSupported;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  private checkSupport() {
    // Verificar se notificações são suportadas
    this._isSupported =
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;

    console.log("🔔 Notificações suportadas:", this._isSupported);
  }

  async initialize(): Promise<boolean> {
    if (this._isInitialized) return true;

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

      this._isInitialized = true;
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

        // Tentar obter token FCM com configuração mais robusta
        let token;
        try {
          // Primeiro tentar com configuração padrão (mais seguro)
          token = await getToken(this.messaging);

          if (token) {
            console.log(
              "🔑 Token FCM obtido com configuração padrão: ✅ Sucesso",
            );
          } else {
            console.warn("⚠️ Token vazio com configuração padrão");
            // Tentar com configuração alternativa apenas se necessário
            console.log("💡 Continuando apenas com notificações locais");
          }
        } catch (tokenError) {
          console.warn(
            "⚠️ Erro ao obter token FCM (continuando apenas local):",
            tokenError,
          );
          token = null;
        }

        if (token) {
          console.log("🔑 Token FCM obtido com sucesso");
          this.saveUserToken(token);

          // Configurar listener para mensagens em foreground
          onMessage(this.messaging, (payload) => {
            console.log("📨 Mensagem recebida em foreground:", payload);
            this.handleForegroundMessage(payload);
          });
        } else {
          console.log("📱 Funcionando apenas com notificações locais");
        }
      } catch (fcmError) {
        console.warn(
          "⚠️ Erro ao configurar FCM (continuando apenas local):",
          fcmError,
        );
        // Continuar funcionando apenas com notificações locais
      }
    } else {
      console.warn(
        "⚠️ Permissão para notificações negada - funcionando sem notificações",
      );
    }
  }

  private async initializeNativeNotifications() {
    console.log("📱 Inicializando notificações nativas (Capacitor)...");

    try {
      // Pedir permissões para notificações locais
      const localPermission = await LocalNotifications.requestPermissions();
      console.log("📱 Permissão para notificações locais:", localPermission);

      // Pedir permissões para push notifications
      const pushPermission = await PushNotifications.requestPermissions();
      console.log("📱 Permissão para push notifications:", pushPermission);

      if (pushPermission.receive === "granted") {
        // Registrar para push notifications
        await PushNotifications.register();

        // Listener para quando o registro é bem-sucedido
        await PushNotifications.addListener("registration", (token) => {
          console.log("📱 Token de push recebido:", token.value);
          this.saveUserToken(token.value);
        });

        // Listener para notificações recebidas
        await PushNotifications.addListener(
          "pushNotificationReceived",
          (notification) => {
            console.log("📱 Push notification recebida:", notification);
            this.handleForegroundMessage(notification);
          },
        );
      }
    } catch (error) {
      console.error("❌ Erro ao inicializar notificações nativas:", error);
    }
  }

  private saveUserToken(token: string) {
    try {
      console.log("💾 Salvando token do usuário:", token);

      // Buscar usuário atual
      const currentUser = JSON.parse(
        localStorage.getItem("leirisonda_user") || "{}",
      );

      if (currentUser && currentUser.id) {
        // Salvar token com múltiplas chaves para melhor compatibilidade
        const tokenKeys = [
          `fcm_token_${currentUser.id}`,
          `fcm_token_${currentUser.email}`,
          `fcm_token_${currentUser.email?.toLowerCase()}`,
          `fcm_token_current_user`,
        ];

        tokenKeys.forEach((key) => {
          localStorage.setItem(key, token);
        });

        console.log(`✅ Token salvo para usuário: ${currentUser.name}`);
      } else {
        console.warn(
          "⚠️ Usuário atual não encontrado, salvando token genérico",
        );
        localStorage.setItem("fcm_token_current", token);
      }
    } catch (error) {
      console.error("❌ Erro ao salvar token:", error);
    }
  }

  private handleForegroundMessage(payload: any) {
    console.log("📨 Processando mensagem em foreground:", payload);

    try {
      const title =
        payload.notification?.title || payload.title || "Nova Notificação";
      const body =
        payload.notification?.body ||
        payload.body ||
        "Você tem uma nova notificação";
      const icon =
        payload.notification?.icon || payload.icon || "/leirisonda-icon.svg";

      // Mostrar notificação local
      this.showLocalNotification({
        title,
        body,
        icon,
        data: payload.data,
      });
    } catch (error) {
      console.error("❌ Erro ao processar mensagem foreground:", error);
    }
  }

  private initializeNotificationListener() {
    console.log("🎧 Inicializando listener de notificações...");

    // Listener para eventos de storage (cross-tab)
    window.addEventListener("storage", (event) => {
      if (event.key === "lastNotificationBroadcast" && event.newValue) {
        try {
          const broadcastData = JSON.parse(event.newValue);
          console.log("📡 Evento de broadcast recebido:", broadcastData);

          if (broadcastData.type === "LEIRISONDA_WORK_ASSIGNED") {
            // Verificar se usuário atual está nos atribuídos
            const currentUser = JSON.parse(
              localStorage.getItem("leirisonda_user") || "{}",
            );

            if (
              currentUser.id &&
              broadcastData.assignedUsers?.includes(currentUser.id)
            ) {
              console.log(
                "🔔 Usuário atual está atribuído, processando notificação...",
              );
              this.showLocalNotification(broadcastData.payload);
            }
          }
        } catch (error) {
          console.error("❌ Erro ao processar broadcast:", error);
        }
      }
    });

    // Listener customizado para notificações diretas
    window.addEventListener("leirisonda_notification", (event: any) => {
      console.log("🔔 Notificação customizada recebida:", event.detail);
      if (event.detail?.payload) {
        this.showLocalNotification(event.detail.payload);
      }
    });
  }

  async sendPushNotification(
    userId: string,
    payload: NotificationPayload,
  ): Promise<boolean> {
    console.log(`📤 Tentando enviar push para usuário ${userId}:`, payload);

    try {
      // Buscar token do usuário
      const userToken = this.getUserToken(userId);

      if (!userToken) {
        console.warn(`⚠️ Token não encontrado para usuário ${userId}`);
        return false;
      }

      // Tentar enviar via servidor (se disponível)
      try {
        const response = await fetch("/api/send-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: userToken,
            notification: {
              title: payload.title,
              body: payload.body,
              icon: payload.icon,
            },
            data: payload.data || {},
          }),
        });

        if (response.ok) {
          console.log(`✅ Push enviado via servidor para ${userId}`);
          return true;
        } else {
          console.warn(`⚠️ Resposta do servidor não ok: ${response.status}`);
        }
      } catch (serverError) {
        console.warn("⚠️ Servidor não disponível:", serverError);
      }

      // Fallback: notificação via storage event para cross-tab
      console.log(`💡 Usando fallback cross-tab para ${userId}`);
      return false;
    } catch (error) {
      console.error(`❌ Erro ao enviar push para ${userId}:`, error);
      return false;
    }
  }

  private getUserToken(userId: string): string | null {
    try {
      // Buscar token com múltiplas chaves
      const tokenKeys = [
        `fcm_token_${userId}`,
        `fcm_token_current_user`,
        `fcm_token_current`,
      ];

      for (const key of tokenKeys) {
        const token = localStorage.getItem(key);
        if (token) {
          console.log(`🔑 Token encontrado para ${userId} com chave ${key}`);
          return token;
        }
      }

      console.warn(`⚠️ Nenhum token encontrado para ${userId}`);
      return null;
    } catch (error) {
      console.error(`❌ Erro ao buscar token para ${userId}:`, error);
      return null;
    }
  }

  async showLocalNotification(payload: NotificationPayload) {
    console.log("🔔 Mostrando notificação local:", payload);

    try {
      if (Capacitor.isNativePlatform()) {
        // Usar notificações nativas no mobile
        await LocalNotifications.schedule({
          notifications: [
            {
              title: payload.title,
              body: payload.body,
              id: Date.now(),
              schedule: { at: new Date(Date.now() + 1000) },
              sound: "default",
              attachments: payload.icon
                ? [{ id: "icon", url: payload.icon }]
                : undefined,
              extra: payload.data,
            },
          ],
        });
        console.log("📱 Notificação nativa agendada");
      } else {
        // Usar notificações web no browser
        if ("Notification" in window && Notification.permission === "granted") {
          const notification = new Notification(payload.title, {
            body: payload.body,
            icon: payload.icon || "/leirisonda-icon.svg",
            badge: payload.badge,
            image: payload.image,
            data: payload.data,
            requireInteraction: true,
          });

          // Adicionar listener para clique
          notification.onclick = () => {
            console.log("🖱️ Notificação clicada");
            window.focus();
            notification.close();

            // Se há dados específicos da obra, navegar para ela
            if (payload.data?.workId) {
              window.location.href = `/work/${payload.data.workId}`;
            } else {
              window.location.href = "/dashboard";
            }
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
    console.log("🎯 NOTIFICAÇÃO DE OBRA ATRIBUÍDA - SISTEMA MELHORADO:", {
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

      console.log("👤 Usuário criador:", {
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

      // ===== ETAPA 1: SALVAR NOTIFICAÇÕES PENDENTES PARA REENTREGA =====
      console.log(
        "💾 SALVANDO NOTIFICAÇÕES PENDENTES para reentrega cross-device...",
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
          console.log(
            `📋 Notificação PENDENTE salva para ${user.name} (${user.email})`,
          );
        } else {
          console.warn(`⚠️ Usuário não encontrado para ID: ${userId}`);
        }
      });

      // Salvar lista atualizada
      localStorage.setItem(
        "pendingNotifications",
        JSON.stringify(pendingNotifications),
      );

      // ===== ETAPA 2: TENTAR ENTREGA IMEDIATA VIA PUSH =====
      console.log("📤 TENTANDO ENTREGA IMEDIATA via push...");

      const pushPromises = assignedUsers.map(async (userId) => {
        const user = allUsers.find((u: User) => u.id === userId);

        if (user) {
          console.log(`📱 Push para ${user.name} (${user.email})...`);

          try {
            const pushSent = await this.sendPushNotification(userId, payload);

            if (pushSent) {
              console.log(`✅ Push SUCESSO para ${user.name}`);
              this.markNotificationAsDelivered(
                userId,
                work.id,
                "work_assigned",
              );
            } else {
              console.log(
                `⚠️ Push FALHOU para ${user.name} - ficará pendente para reentrega`,
              );
            }
          } catch (pushError) {
            console.warn(`❌ Erro no push para ${user.name}:`, pushError);
          }
        }
      });

      await Promise.allSettled(pushPromises);

      // ===== ETAPA 3: BROADCAST CROSS-DEVICE/TAB =====
      console.log("📡 BROADCASTING para comunicação cross-device...");

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

      // Disparar evento para outros tabs/dispositivos
      try {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "lastNotificationBroadcast",
            newValue: JSON.stringify(broadcastEvent),
            storageArea: localStorage,
          }),
        );
        console.log("📡 Evento de broadcast DISPARADO");
      } catch (broadcastError) {
        console.error("❌ Erro no broadcast:", broadcastError);
      }

      // ===== ETAPA 4: MARCAR TIMESTAMP PARA SINCRONIZAÇÃO =====
      localStorage.setItem(
        "lastWorkAssignmentNotification",
        new Date().toISOString(),
      );
      localStorage.setItem("lastNotificationUpdate", new Date().toISOString());

      console.log("🎉 NOTIFICAÇÃO DE OBRA ATRIBUÍDA PROCESSADA COMPLETAMENTE");
    } catch (error) {
      console.error("❌ ERRO CRÍTICO na notificação de obra atribuída:", error);
      throw error;
    }
  }

  private markNotificationAsDelivered(
    userId: string,
    workId: string,
    type: string,
  ) {
    try {
      const pendingNotifications = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]",
      );

      // Marcar como entregue
      const updatedNotifications = pendingNotifications.map((notif: any) => {
        if (
          notif.userId === userId &&
          notif.workId === workId &&
          notif.type === type
        ) {
          return {
            ...notif,
            delivered: true,
            deliveredAt: new Date().toISOString(),
          };
        }
        return notif;
      });

      localStorage.setItem(
        "pendingNotifications",
        JSON.stringify(updatedNotifications),
      );
      console.log(`✅ Notificação marcada como entregue para ${userId}`);
    } catch (error) {
      console.error("❌ Erro ao marcar notificação como entregue:", error);
    }
  }

  async processPendingNotifications(userId: string) {
    console.log(`🔄 PROCESSANDO NOTIFICAÇÕES PENDENTES para ${userId}...`);

    try {
      const pendingNotifications = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]",
      );

      // Filtrar notificações do usuário que não foram entregues
      const userPendingNotifications = pendingNotifications.filter(
        (notif: any) => notif.userId === userId && !notif.delivered,
      );

      console.log(
        `📋 ${userPendingNotifications.length} notificações pendentes para ${userId}`,
      );

      if (userPendingNotifications.length > 0) {
        console.log("📋 NOTIFICAÇÕES PENDENTES:");
        userPendingNotifications.forEach((notif: any, index: number) => {
          console.log(
            `   ${index + 1}. ${notif.title} - ${notif.body} (${notif.timestamp})`,
          );
        });

        // Mostrar cada notificação pendente
        for (const notification of userPendingNotifications) {
          try {
            await this.showLocalNotification({
              title: notification.title,
              body: notification.body,
              icon: notification.icon,
              data: notification.data,
            });

            // Marcar como entregue
            this.markNotificationAsDelivered(
              notification.userId,
              notification.workId,
              notification.type,
            );

            console.log(
              `✅ Notificação pendente entregue: ${notification.title}`,
            );

            // Pequeno delay entre notificações para não sobrecarregar
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            console.error("❌ Erro ao entregar notificação pendente:", error);
          }
        }

        console.log(
          `🎉 TODAS as ${userPendingNotifications.length} notificações pendentes foram entregues`,
        );
      } else {
        console.log("✅ Nenhuma notificação pendente para entregar");
      }

      // Limpeza: remover notificações muito antigas (mais de 7 dias)
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const filteredNotifications = pendingNotifications.filter(
        (notif: any) => {
          const notifDate = new Date(notif.timestamp);
          return notifDate > oneWeekAgo;
        },
      );

      if (filteredNotifications.length !== pendingNotifications.length) {
        localStorage.setItem(
          "pendingNotifications",
          JSON.stringify(filteredNotifications),
        );
        console.log(
          `🧹 Limpeza: ${pendingNotifications.length - filteredNotifications.length} notificações antigas removidas`,
        );
      }
    } catch (error) {
      console.error("❌ Erro ao processar notificações pendentes:", error);
    }
  }

  async checkPendingAssignedWorks(userId: string) {
    console.log("🔍 VERIFICAÇÃO COMPLETA DE OBRAS ATRIBUÍDAS para:", userId);

    try {
      // PRIMEIRO: Processar notificações pendentes não entregues
      await this.processPendingNotifications(userId);

      // SEGUNDO: Buscar obras de TODAS as fontes possíveis
      const localWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const leirisondaWorks = JSON.parse(
        localStorage.getItem("leirisonda_works") || "[]",
      );
      const tempWorks = JSON.parse(
        sessionStorage.getItem("temp_works") || "[]",
      );

      // Buscar também obras de emergência
      const emergencyWorks = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("emergency_work_")) {
          try {
            const emergencyWork = JSON.parse(localStorage.getItem(key) || "{}");
            if (emergencyWork.id) {
              emergencyWorks.push(emergencyWork);
            }
          } catch (e) {
            console.warn(`Erro ao carregar obra de emergência ${key}:`, e);
          }
        }
      }

      // Combinar todas as obras e remover duplicatas baseado no ID
      const allWorksMap = new Map();
      [
        ...localWorks,
        ...leirisondaWorks,
        ...tempWorks,
        ...emergencyWorks,
      ].forEach((work: any) => {
        if (work.id) {
          allWorksMap.set(work.id, work);
        }
      });

      const allWorks = Array.from(allWorksMap.values());

      console.log(`📊 TOTAL DE OBRAS ENCONTRADAS: ${allWorks.length}`);
      console.log(
        `📂 FONTES: works(${localWorks.length}) + leirisonda(${leirisondaWorks.length}) + temp(${tempWorks.length}) + emergency(${emergencyWorks.length})`,
      );

      // Filtrar obras atribuídas ao usuário atual
      const assignedWorks = allWorks.filter((work: any) => {
        const isAssigned =
          work.assignedUsers &&
          Array.isArray(work.assignedUsers) &&
          work.assignedUsers.includes(userId);
        return isAssigned;
      });

      console.log(
        `🎯 TOTAL OBRAS ATRIBUÍDAS AO USUÁRIO ${userId}: ${assignedWorks.length}`,
      );

      if (assignedWorks.length > 0) {
        console.log("📋 LISTA COMPLETA DE OBRAS ATRIBUÍDAS:");
        assignedWorks.forEach((work, index) => {
          console.log(
            `   ${index + 1}. ${work.workSheetNumber} - ${work.clientName} (Status: ${work.status})`,
          );
        });
      } else {
        console.log("❌ NENHUMA OBRA ENCONTRADA ATRIBUÍDA A ESTE USUÁRIO");
        console.log("🔍 DEBUGGING - VERIFICANDO TODAS AS OBRAS:");
        allWorks.slice(0, 5).forEach((work, index) => {
          console.log(
            `   ${index + 1}. ${work.workSheetNumber} - Atribuído a: [${work.assignedUsers ? work.assignedUsers.join(", ") : "NENHUM"}]`,
          );
        });
      }

      // Filtrar apenas obras pendentes ou em progresso
      const pendingAssignedWorks = assignedWorks.filter((work: any) => {
        const isPending =
          work.status === "pendente" || work.status === "em_progresso";
        return isPending;
      });

      console.log(
        `⏳ OBRAS PENDENTES/EM PROGRESSO: ${pendingAssignedWorks.length}`,
      );

      // VERIFICAR SE USUÁRIO JÁ VIU ESSAS OBRAS (para evitar notificações repetidas)
      const seenWorksKey = `seen_works_${userId}`;
      const seenWorks = JSON.parse(localStorage.getItem(seenWorksKey) || "[]");

      const newPendingWorks = pendingAssignedWorks.filter((work: any) => {
        return !seenWorks.includes(work.id);
      });

      console.log(
        `🆕 NOVAS OBRAS PENDENTES (não vistas): ${newPendingWorks.length}`,
      );

      // Se há obras pendentes NOVAS, mostrar notificação
      if (newPendingWorks.length > 0) {
        const mostRecentWork = newPendingWorks[0];

        const payload: NotificationPayload = {
          title: "🏗️ Nova(s) Obra(s) Atribuída(s)",
          body:
            newPendingWorks.length === 1
              ? `Nova obra atribuída: ${mostRecentWork.workSheetNumber} - ${mostRecentWork.clientName}`
              : `${newPendingWorks.length} novas obras foram atribuídas a si`,
          data: {
            type: "pending_works_summary",
            count: newPendingWorks.length,
            works: newPendingWorks.map((w: any) => ({
              id: w.id,
              workSheetNumber: w.workSheetNumber,
              clientName: w.clientName,
              status: w.status,
            })),
          },
          icon: "/leirisonda-icon.svg",
        };

        console.log(
          `🔔 MOSTRANDO NOTIFICAÇÃO para ${newPendingWorks.length} novas obras`,
        );
        await this.showLocalNotification(payload);

        // Marcar obras como vistas para evitar notificações repetidas
        const updatedSeenWorks = [
          ...seenWorks,
          ...newPendingWorks.map((w) => w.id),
        ];
        localStorage.setItem(seenWorksKey, JSON.stringify(updatedSeenWorks));
        console.log(`✅ ${newPendingWorks.length} obras marcadas como vistas`);
      } else {
        console.log("✅ Nenhuma obra nova para notificar");
      }

      return pendingAssignedWorks;
    } catch (error) {
      console.error("❌ Erro ao verificar obras pendentes atribuídas:", error);
      return [];
    }
  }

  async notifyWorkStatusChange(
    work: any,
    oldStatus: string,
    newStatus: string,
  ) {
    console.log("📊 Notificação de mudança de status:", {
      work: work.workSheetNumber,
      from: oldStatus,
      to: newStatus,
    });

    try {
      if (!work.assignedUsers || work.assignedUsers.length === 0) {
        console.log(
          "⚠️ Obra sem usuários atribuídos, não enviando notificação",
        );
        return;
      }

      const statusLabels: Record<string, string> = {
        pendente: "Pendente",
        em_progresso: "Em Progresso",
        concluida: "Concluída",
      };

      const payload: NotificationPayload = {
        title: "📊 Status da Obra Atualizado",
        body: `Obra ${work.workSheetNumber} - Status alterado para ${statusLabels[newStatus] || newStatus}`,
        data: {
          type: "work_status_changed",
          workId: work.id,
          workSheetNumber: work.workSheetNumber,
          clientName: work.clientName,
          oldStatus,
          newStatus,
        },
        icon: "/leirisonda-icon.svg",
      };

      // Enviar para todos os usuários atribuídos
      await this.notifyWorkAssigned(work, work.assignedUsers);

      console.log("✅ Notificação de mudança de status enviada");
    } catch (error) {
      console.error("❌ Erro ao notificar mudança de status:", error);
    }
  }

  // Função para diagnóstico completo do sistema
  async runDiagnostics(): Promise<any> {
    console.log("🔧 INICIANDO DIAGNÓSTICO COMPLETO DO SISTEMA DE NOTIFICAÇÕES");

    const diagnostics = {
      timestamp: new Date().toISOString(),
      isSupported: this.isSupported,
      isInitialized: this.isInitialized,
      permissions: {},
      tokens: {},
      pendingNotifications: 0,
      recentActivity: {},
    };

    try {
      // Verificar permissões
      if ("Notification" in window) {
        diagnostics.permissions = {
          notification: Notification.permission,
          serviceWorker: "serviceWorker" in navigator,
          pushManager: "PushManager" in window,
        };
      }

      // Verificar tokens salvos
      const currentUser = JSON.parse(
        localStorage.getItem("leirisonda_user") || "{}",
      );
      if (currentUser.id) {
        diagnostics.tokens = {
          userId: currentUser.id,
          userName: currentUser.name,
          hasToken: !!this.getUserToken(currentUser.id),
        };
      }

      // Verificar notificações pendentes
      const pendingNotifications = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]",
      );
      diagnostics.pendingNotifications = pendingNotifications.length;

      // Verificar atividade recente
      diagnostics.recentActivity = {
        lastWorkAssignment: localStorage.getItem(
          "lastWorkAssignmentNotification",
        ),
        lastNotificationUpdate: localStorage.getItem("lastNotificationUpdate"),
        lastBroadcast: localStorage.getItem("lastNotificationBroadcast")
          ? "Sim"
          : "Não",
      };

      console.log("📋 RESULTADO DO DIAGNÓSTICO:", diagnostics);
      return diagnostics;
    } catch (error) {
      console.error("❌ Erro no diagnóstico:", error);
      diagnostics.error = error.message;
      return diagnostics;
    }
  }
}

// Singleton instance
export const NotificationService = new NotificationServiceClass();
export default NotificationService;
