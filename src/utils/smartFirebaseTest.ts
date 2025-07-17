// Teste inteligente que detecta exatamente qual é o problema
import { initializeApp, getApps, getApp } from "firebase/app";

// Configuração Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

export async function smartFirebaseTest(): Promise<{
  success: boolean;
  message: string;
  data?: any;
  solution?: string;
}> {
  try {
    console.log("🧠 Teste inteligente Firebase...");

    // Passo 1: Verificar Firebase App
    let app;
    if (getApps().length === 0) {
      console.log("📱 Inicializando Firebase App...");
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    console.log("✅ Firebase App OK:", app.name, app.options.projectId);

    // Passo 2: Tentar importar Firestore
    console.log("📦 Importando Firestore...");
    const { getFirestore } = await import("firebase/firestore");
    console.log("✅ Firestore importado com sucesso");

    // Passo 3: Tentar inicializar Firestore COM captura específica do erro
    console.log("💾 Tentando inicializar Firestore...");

    try {
      // Add a small delay to ensure Firebase app is fully ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if app is properly initialized with required options
      if (!app.options.projectId || !app.options.apiKey) {
        throw new Error("Firebase app não está adequadamente configurado");
      }

      console.log(
        "🔍 Tentando getFirestore para projeto:",
        app.options.projectId,
      );

      // Try to get Firestore instance with error prevention
      let db;
      try {
        db = getFirestore(app);
      } catch (immediateError: any) {
        // Re-throw with more context if it's the getImmediate error
        if (
          immediateError.message?.includes("getImmediate") ||
          immediateError.code === "firestore/unavailable"
        ) {
          const enhancedError = new Error(
            "Firestore service is not available in this project",
          );
          enhancedError.name = "FirestoreUnavailableError";
          (enhancedError as any).code = "firestore/unavailable";
          (enhancedError as any).originalError = immediateError;
          throw enhancedError;
        }
        throw immediateError;
      }
      console.log("✅ Firestore inicializado com sucesso!", typeof db);

      // Se chegou aqui, o Firestore está funcionando
      return {
        success: true,
        message: "Firestore está funcionando perfeitamente!",
        data: {
          app: app.name,
          projectId: app.options.projectId,
          firestoreType: typeof db,
        },
      };
    } catch (firestoreError: any) {
      console.error("❌ Erro específico do Firestore:", firestoreError);

      // Analisar o tipo de erro específico
      const errorMessage = firestoreError.message || "";
      const errorCode = firestoreError.code || "";
      const stackTrace = firestoreError.stack || "";

      // Detectar erro getImmediate (Firestore não habilitado)
      if (
        stackTrace.includes("getImmediate") ||
        errorMessage.includes("getImmediate") ||
        errorMessage.includes("Service firestore is not available") ||
        errorCode === "firestore/unavailable"
      ) {
        return {
          success: false,
          message:
            "🚨 CONFIRMADO: Firestore NÃO está habilitado no projeto Firebase!",
          data: {
            projectId: app.options.projectId,
            errorType: "getImmediate - serviço não existe",
            diagnosis: "O serviço Firestore não foi criado no projeto Firebase",
          },
          solution: `🔧 SOLUÇÃO OBRIGATÓRIA:
1. Aceda a: https://console.firebase.google.com/project/${app.options.projectId}/firestore
2. Clique em "Create database"
3. Escolha "Start in test mode"
4. Selecione localização: europe-west3 (Frankfurt)
5. Aguarde criação da base de dados
6. Volte aqui e teste novamente`,
        };
      } else if (
        errorMessage.includes("permission") ||
        errorMessage.includes("auth")
      ) {
        return {
          success: false,
          message: "Firestore existe mas há problemas de permissões",
          data: {
            error: errorCode,
            message: errorMessage,
          },
          solution: "Verifique as regras de segurança do Firestore",
        };
      } else {
        return {
          success: false,
          message: `Erro desconhecido no Firestore: ${errorMessage}`,
          data: {
            error: errorCode,
            message: errorMessage,
            stack: firestoreError.stack,
          },
          solution: "Contacte suporte técnico com estes detalhes",
        };
      }
    }
  } catch (error: any) {
    console.error("❌ Erro geral no teste:", error);

    return {
      success: false,
      message: `Erro geral: ${error.message}`,
      data: {
        error: error.message,
        stack: error.stack,
      },
      solution: "Verifique a conexão à internet e configuração do Firebase",
    };
  }
}
