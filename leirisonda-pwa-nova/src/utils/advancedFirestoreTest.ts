// Teste avançado que lida com problemas de provisionamento do Firestore
import { initializeApp, getApps, getApp } from "firebase/app";

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

export async function advancedFirestoreTest(
  retryCount = 0,
  maxRetries = 3,
): Promise<{
  success: boolean;
  message: string;
  data?: any;
  action?: string;
  canRetry?: boolean;
}> {
  try {
    console.log(
      `🔍 Teste avançado Firestore (tentativa ${retryCount + 1}/${maxRetries + 1})...`,
    );

    // Passo 1: Verificar Firebase App
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    console.log("✅ Firebase App OK:", app.options.projectId);

    // Passo 2: Aguardar um pouco antes de tentar Firestore (importante!)
    const waitTime = Math.min(1000 * (retryCount + 1), 5000); // 1s, 2s, 3s, max 5s
    console.log(
      `⏳ Aguardando ${waitTime}ms antes de inicializar Firestore...`,
    );
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Passo 3: Importar Firestore
    const { getFirestore, connectFirestoreEmulator } = await import(
      "firebase/firestore"
    );

    // Passo 4: Tentar inicializar Firestore com retry
    try {
      console.log("💾 Tentando inicializar Firestore...");
      const db = getFirestore(app);

      // Se chegou aqui sem erro, sucesso!
      console.log("🎉 Firestore inicializado com sucesso!");

      // Teste adicional: verificar se consegue criar uma referência
      const { doc } = await import("firebase/firestore");
      const testRef = doc(db, "test", "connection");
      console.log("✅ Referência de documento criada com sucesso");

      return {
        success: true,
        message: "Firestore está funcionando perfeitamente!",
        data: {
          app: app.name,
          projectId: app.options.projectId,
          attempt: retryCount + 1,
          waitTime: waitTime,
        },
      };
    } catch (firestoreError: any) {
      console.error("❌ Erro ao inicializar Firestore:", firestoreError);

      const isGetImmediateError =
        firestoreError.stack?.includes("getImmediate") ||
        firestoreError.message?.includes("getImmediate") ||
        firestoreError.message?.includes("Service firestore is not available");

      if (isGetImmediateError) {
        if (retryCount < maxRetries) {
          // Pode tentar novamente
          console.log(
            `🔄 Erro getImmediate - tentando novamente em alguns segundos...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 + retryCount * 1000),
          );
          return advancedFirestoreTest(retryCount + 1, maxRetries);
        } else {
          // Esgotaram as tentativas
          return {
            success: false,
            message: `Firestore ainda não está disponível após ${maxRetries + 1} tentativas`,
            data: {
              error: "getImmediate",
              projectId: app.options.projectId,
              attempts: retryCount + 1,
              diagnosis:
                "Firestore pode estar sendo provisionado ou há problema de configuração",
            },
            action: "MANUAL_CHECK",
            canRetry: true,
          };
        }
      } else {
        // Outro tipo de erro
        return {
          success: false,
          message: `Erro diferente de getImmediate: ${firestoreError.message}`,
          data: {
            error: firestoreError.code || "unknown",
            message: firestoreError.message,
            stack: firestoreError.stack,
          },
          action: "INVESTIGATE",
        };
      }
    }
  } catch (error: any) {
    console.error("❌ Erro geral no teste avançado:", error);

    return {
      success: false,
      message: `Erro geral: ${error.message}`,
      data: {
        error: error.message,
        stack: error.stack,
      },
      action: "CHECK_NETWORK",
    };
  }
}

// Função para verificar manualmente o status do projeto Firebase
export async function checkFirebaseProjectStatus(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    console.log("🔍 Verificando status do projeto Firebase...");

    const projectId = "leiria-1cfc9";

    // Verificar se o projeto existe através de uma requisição à API pública
    const response = await fetch(
      `https://${projectId}.firebaseapp.com/__/firebase/init.json`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Projeto Firebase existe e está ativo",
        data: {
          projectId: data.projectId || projectId,
          hasFirestore: data.databaseURL ? "Provavelmente sim" : "Incerto",
          status: "ACTIVE",
        },
      };
    } else {
      return {
        success: false,
        message: `Projeto Firebase pode não existir ou estar inacessível (${response.status})`,
        data: {
          status: response.status,
          statusText: response.statusText,
        },
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Não foi possível verificar projeto: ${error.message}`,
      data: { error: error.message },
    };
  }
}
