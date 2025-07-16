// Safe Firestore test that doesn't trigger getImmediate errors
import { getFirebaseApp } from "../firebase/basicConfig";

export async function safeFirestoreTest(): Promise<{
  success: boolean;
  message: string;
  data?: any;
  solution?: string;
}> {
  try {
    console.log("🛡️ Teste seguro do Firestore via REST API...");

    // Get Firebase app
    const app = getFirebaseApp();
    if (!app) {
      return {
        success: false,
        message: "Firebase App não inicializada",
      };
    }

    const projectId = app.options.projectId;
    console.log("🔍 Testando projeto:", projectId);

    // Test Firestore availability via REST API
    const testUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

    console.log("📡 Testando conectividade Firestore via REST...");

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    console.log("📡 Resposta:", response.status, response.statusText);

    if (response.status === 401 || response.status === 403) {
      // These are expected responses when Firestore exists but needs auth
      return {
        success: true,
        message: "✅ Firestore está ATIVO e acessível via REST API",
        data: {
          projectId: projectId,
          status: response.status,
          statusText: response.statusText,
          method: "REST API",
          firestoreActive: true,
        },
      };
    } else if (response.status === 404) {
      // Firestore database doesn't exist
      return {
        success: false,
        message: "❌ Firestore NÃO está habilitado no projeto",
        data: {
          projectId: projectId,
          status: response.status,
          statusText: response.statusText,
          firestoreActive: false,
        },
        solution: `🔧 HABILITAR FIRESTORE:
1. Ir para: https://console.firebase.google.com/project/${projectId}/firestore
2. Clicar em "Create database"
3. Escolher "Start in test mode"
4. Selecionar região: europe-west3 (Frankfurt)
5. Aguardar criação (1-2 minutos)

💡 NOTA: Sistema já funciona via REST API mesmo sem SDK!`,
      };
    } else if (response.status >= 200 && response.status < 300) {
      // Successful response
      return {
        success: true,
        message: "✅ Firestore totalmente acessível via REST API",
        data: {
          projectId: projectId,
          status: response.status,
          statusText: response.statusText,
          method: "REST API",
          firestoreActive: true,
        },
      };
    } else {
      // Other response
      return {
        success: false,
        message: `Resposta inesperada do Firestore: ${response.status}`,
        data: {
          projectId: projectId,
          status: response.status,
          statusText: response.statusText,
        },
      };
    }
  } catch (error: any) {
    console.error("❌ Erro no teste seguro:", error);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Problema de conectividade - verifique internet",
        data: { error: error.message },
      };
    }

    return {
      success: false,
      message: `Erro inesperado: ${error.message}`,
      data: { error: error.message },
    };
  }
}

// Export as default
export default safeFirestoreTest;
