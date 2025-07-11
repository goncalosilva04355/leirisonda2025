import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken,
  type Messaging,
} from "firebase/messaging";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLXCz8h0dw0i0u8rQ4ABIB_0pU-WO6KMs",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
};

// VAPID Key para FCM
const VAPID_KEY =
  "BKx4QpPgWjQ4w1KdYJhOgQ_rVGp_yZQ4DvPzL-8A0_sF5xHg9QnBkRZo0l-3uYhWpQjC9fJ6A7kJ1nZp2mXvA8s";

interface FCMToken {
  token: string;
  userId: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    timestamp: number;
  };
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  clickAction?: string;
  data?: Record<string, any>;
}

class FCMService {
  private messaging: Messaging | null = null;
  private initialized = false;
  private currentToken: string | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Verificar se o browser suporta FCM
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("❌ FCM: Browser não suporta notificações push");
        return;
      }

      // Verificar se está em HTTPS ou localhost
      if (location.protocol !== "https:" && location.hostname !== "localhost") {
        console.warn("❌ FCM: Requer HTTPS para funcionar");
        return;
      }

      // Inicializar Firebase App se não existir
      let app;
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }

      // Inicializar Firebase Messaging
      this.messaging = getMessaging(app);
      this.initialized = true;

      console.log("✅ FCM: Serviço inicializado com sucesso");

      // Configurar listener para mensagens em foreground
      this.setupForegroundMessageListener();
    } catch (error) {
      console.error("❌ FCM: Erro na inicialização:", error);
    }
  }

  private setupForegroundMessageListener() {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log("📱 FCM: Mensagem recebida em foreground:", payload);

      // Mostrar notificação personalizada quando app está aberta
      if (payload.notification) {
        this.showForegroundNotification({
          title: payload.notification.title || "Nova notificação",
          body: payload.notification.body || "",
          icon: payload.notification.icon,
          data: payload.data,
        });
      }
    });
  }

  private showForegroundNotification(notification: NotificationPayload) {
    // Criar toast personalizado para notificações em foreground
    const toast = document.createElement("div");
    toast.className = `
      fixed top-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-xl max-w-sm
      transform translate-x-full opacity-0 transition-all duration-300 ease-out
    `;

    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="font-semibold">${notification.title}</h4>
          <p class="text-sm opacity-90">${notification.body}</p>
        </div>
        <button class="text-white/80 hover:text-white" onclick="this.parentElement.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
      toast.style.opacity = "1";
    }, 100);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      toast.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 5000);

    // Click para navegar se tiver dados
    if (notification.data?.workId) {
      toast.style.cursor = "pointer";
      toast.onclick = () => {
        window.location.hash = "#obras";
        toast.remove();
      };
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      console.log("📱 FCM: Permissão de notificação:", permission);
      return permission === "granted";
    } catch (error) {
      console.error("❌ FCM: Erro ao solicitar permissão:", error);
      return false;
    }
  }

  async getToken(userId?: string): Promise<string | null> {
    if (!this.initialized || !this.messaging) {
      console.warn("⚠️ FCM: Serviço não inicializado");
      return null;
    }

    try {
      // Verificar permissão primeiro
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn("⚠️ FCM: Permissão negada pelo usuário");
        return null;
      }

      // Obter token do dispositivo
      const token = await getToken(this.messaging, {
        vapidKey: VAPID_KEY,
      });

      if (token) {
        this.currentToken = token;
        console.log("✅ FCM: Token obtido com sucesso");

        // Salvar token se userId fornecido
        if (userId) {
          await this.saveTokenForUser(userId, token);
        }

        return token;
      } else {
        console.warn("⚠️ FCM: Nenhum token de registro disponível");
        return null;
      }
    } catch (error) {
      console.error("❌ FCM: Erro ao obter token:", error);
      return null;
    }
  }

  private async saveTokenForUser(userId: string, token: string) {
    try {
      const tokenData: FCMToken = {
        token,
        userId,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          timestamp: Date.now(),
        },
      };

      // Salvar no localStorage
      const existingTokens = JSON.parse(
        localStorage.getItem("fcm-tokens") || "[]",
      );

      // Remover tokens antigos deste usuário
      const filteredTokens = existingTokens.filter(
        (t: FCMToken) => t.userId !== userId,
      );

      // Adicionar novo token
      filteredTokens.push(tokenData);

      localStorage.setItem("fcm-tokens", JSON.stringify(filteredTokens));

      console.log(`✅ FCM: Token salvo para usuário ${userId}`);
    } catch (error) {
      console.error("❌ FCM: Erro ao salvar token:", error);
    }
  }

  async deleteCurrentToken(): Promise<boolean> {
    if (!this.messaging || !this.currentToken) {
      return false;
    }

    try {
      await deleteToken(this.messaging);
      this.currentToken = null;
      console.log("✅ FCM: Token removido com sucesso");
      return true;
    } catch (error) {
      console.error("❌ FCM: Erro ao remover token:", error);
      return false;
    }
  }

  getUserTokens(userId: string): FCMToken[] {
    try {
      const tokens = JSON.parse(localStorage.getItem("fcm-tokens") || "[]");
      return tokens.filter((t: FCMToken) => t.userId === userId);
    } catch (error) {
      console.error("❌ FCM: Erro ao buscar tokens do usuário:", error);
      return [];
    }
  }

  getAllTokens(): FCMToken[] {
    try {
      return JSON.parse(localStorage.getItem("fcm-tokens") || "[]");
    } catch (error) {
      console.error("❌ FCM: Erro ao buscar todos os tokens:", error);
      return [];
    }
  }

  async sendNotificationToUser(
    userId: string,
    notification: NotificationPayload,
  ): Promise<boolean> {
    const userTokens = this.getUserTokens(userId);

    if (userTokens.length === 0) {
      console.warn(`⚠️ FCM: Nenhum token encontrado para usuário ${userId}`);
      return false;
    }

    console.log(
      `📱 FCM: Enviando notificação para ${userTokens.length} dispositivo(s) do usuário ${userId}`,
    );

    // Aqui você integraria com seu backend para enviar via FCM
    // Por enquanto, vamos simular e mostrar notificação local se possível
    for (const tokenData of userTokens) {
      try {
        // Se a app está aberta, mostrar notificação local
        if (document.visibilityState === "visible") {
          this.showForegroundNotification(notification);
        }

        console.log(
          `✅ FCM: Notificação enviada para token ${tokenData.token.substring(0, 20)}...`,
        );
      } catch (error) {
        console.error("❌ FCM: Erro ao enviar notificação:", error);
      }
    }

    return true;
  }

  isSupported(): boolean {
    return (
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      this.initialized
    );
  }

  getStatus() {
    return {
      supported: this.isSupported(),
      initialized: this.initialized,
      hasToken: !!this.currentToken,
      permission: Notification.permission,
    };
  }
}

// Singleton instance
export const fcmService = new FCMService();
export default fcmService;
