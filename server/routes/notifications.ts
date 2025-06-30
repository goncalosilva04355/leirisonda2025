import { RequestHandler } from "express";
import admin from "firebase-admin";

// Inicializar Firebase Admin SDK se ainda não foi inicializado
if (!admin.apps.length) {
  try {
    // Para produção, usar variável de ambiente com service account key
    // Para desenvolvimento, usar configuração simplificada
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : {
          // Configuração de desenvolvimento - pode usar emulador ou configuração simplificada
          projectId: "leirisonda-obras",
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL:
        "https://leirisonda-obras-default-rtdb.europe-west1.firebasedatabase.app",
    });

    console.log("✅ Firebase Admin SDK inicializado");
  } catch (error) {
    console.warn("⚠️ Erro ao inicializar Firebase Admin SDK:", error);
    console.log(
      "💡 Continuando sem Admin SDK - notificações push não funcionarão",
    );
  }
}

export interface SendNotificationRequest {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  icon?: string;
}

export const sendNotification: RequestHandler = async (req, res) => {
  try {
    const {
      token,
      title,
      body,
      data = {},
      icon,
    } = req.body as SendNotificationRequest;

    console.log("📤 Recebido pedido de notificação push:", {
      token: token ? `${token.substring(0, 20)}...` : "sem token",
      title,
      body,
      dataKeys: Object.keys(data),
    });

    // Validar dados necessários
    if (!token || !title || !body) {
      console.error("❌ Dados insuficientes para notificação push");
      return res.status(400).json({
        success: false,
        error: "Token, título e corpo são obrigatórios",
      });
    }

    // Validar formato do token FCM
    if (token === "test-token" || token.length < 100) {
      console.warn("⚠️ Token de teste ou inválido detectado");
      return res.json({
        success: true,
        messageId: `test-${Date.now()}`,
        note: "Token de teste - notificação simulada",
      });
    }

    // Verificar se Firebase Admin está disponível
    if (!admin.apps.length) {
      console.warn("⚠️ Firebase Admin não disponível - simulando envio");
      return res.json({
        success: true,
        messageId: `simulated-${Date.now()}`,
        note: "Notificação simulada - Firebase Admin não configurado",
      });
    }

    // Preparar mensagem para FCM
    const message: admin.messaging.Message = {
      token: token,
      notification: {
        title: title,
        body: body,
        icon: icon || "/leirisonda-icon.svg",
      },
      data: {
        ...data,
        // Garantir que todos os valores sejam strings
        ...Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            typeof value === "string" ? value : JSON.stringify(value),
          ]),
        ),
      },
      android: {
        notification: {
          icon: "ic_notification",
          color: "#007784",
          sound: "default",
          channelId: "leirisonda_notifications",
        },
        priority: "high",
      },
      apns: {
        aps: {
          alert: {
            title: title,
            body: body,
          },
          badge: 1,
          sound: "default",
        },
      },
      webpush: {
        notification: {
          title: title,
          body: body,
          icon: icon || "/leirisonda-icon.svg",
          badge: "/leirisonda-icon.svg",
          requireInteraction: true,
          tag: "leirisonda-notification",
        },
        fcmOptions: {
          link: data.workId ? `/work/${data.workId}` : "/dashboard",
        },
      },
    };

    console.log("📱 Enviando notificação push via Firebase Admin...");

    // Enviar notificação
    const response = await admin.messaging().send(message);

    console.log("✅ Notificação push enviada com sucesso:", response);

    res.json({
      success: true,
      messageId: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro ao enviar notificação push:", error);

    // Distinguir entre diferentes tipos de erro FCM
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("registration-token-not-registered")) {
        console.warn("⚠️ Token FCM inválido ou expirado");
        return res.status(400).json({
          success: false,
          error: "Token FCM inválido ou expirado",
          code: "INVALID_TOKEN",
        });
      }

      if (
        errorMessage.includes("invalid-argument") ||
        errorMessage.includes("string did not match the expected pattern")
      ) {
        console.warn("⚠️ Argumentos inválidos na mensagem ou token malformado");
        return res.status(400).json({
          success: false,
          error: "Token FCM malformado ou dados da mensagem inválidos",
          code: "INVALID_MESSAGE",
        });
      }

      if (errorMessage.includes("invalid-registration-token")) {
        console.warn("⚠️ Formato de token FCM inválido");
        return res.status(400).json({
          success: false,
          error: "Formato de token FCM inválido",
          code: "MALFORMED_TOKEN",
        });
      }

      if (errorMessage.includes("messaging/invalid-payload")) {
        console.warn("⚠️ Payload da mensagem inválido");
        return res.status(400).json({
          success: false,
          error: "Conteúdo da mensagem inválido",
          code: "INVALID_PAYLOAD",
        });
      }
    }

    res.status(500).json({
      success: false,
      error: "Erro interno do servidor ao enviar notificação",
      details: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// Endpoint para testar conectividade do Firebase Admin
export const testFirebaseAdmin: RequestHandler = async (req, res) => {
  try {
    console.log("🔍 Testando conectividade Firebase Admin...");

    if (!admin.apps.length) {
      return res.json({
        success: false,
        message: "Firebase Admin SDK não está inicializado",
        adminApps: 0,
      });
    }

    // Testar conexão básica
    const app = admin.app();

    res.json({
      success: true,
      message: "Firebase Admin SDK está funcionando",
      adminApps: admin.apps.length,
      projectId: app.options.projectId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro no teste Firebase Admin:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao testar Firebase Admin SDK",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
