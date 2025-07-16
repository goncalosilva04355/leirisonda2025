// Teste inteligente que detecta exatamente qual é o problema
import { initializeApp, getApps, getApp } from "firebase/app";

// Configuração Firebase fixa
const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: "G-Q2QWQVH60L",
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
      const db = getFirestore(app);
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
