// Secure Firebase Configuration using Environment Variables
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getSecureFirebaseConfig } from "../config/firebaseEnvSecure";

// Get configuration from environment variables
const firebaseConfig = getSecureFirebaseConfig();

// Inicializar Firebase App
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log(
    "✅ Firebase App inicializada com configuração segura:",
    app.options.projectId,
  );
} else {
  app = getApp();
  console.log("✅ Firebase App existente:", app.options.projectId);
}

// Função para obter Firestore de forma robusta
let db: any = null;

export async function getCorrectFirestore() {
  if (db) return db;

  try {
    // Aguardar um momento para garantir inicialização
    await new Promise((resolve) => setTimeout(resolve, 100));

    db = getFirestore(app);
    console.log("✅ Firestore inicializado com configuração segura");
    return db;
  } catch (error: any) {
    console.error("❌ Erro ao inicializar Firestore:", error);
    throw error;
  }
}

// Teste imediato de funcionamento
export async function testCorrectFirestore(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    console.log("🧪 Testando Firestore com configuração segura...");

    const firestore = await getCorrectFirestore();

    // Tentar criar referência
    const { doc, setDoc, getDoc, serverTimestamp } = await import(
      "firebase/firestore"
    );
    const testRef = doc(firestore, "test-correct", "connection-test");

    // Tentar escrever dados
    const testData = {
      message: "Teste com configuração segura",
      timestamp: serverTimestamp(),
      projectId: app.options.projectId,
      success: true,
    };

    await setDoc(testRef, testData);
    console.log("✅ Dados escritos com sucesso");

    // Tentar ler dados
    const docSnap = await getDoc(testRef);

    if (docSnap.exists()) {
      const readData = docSnap.data();
      console.log("✅ Dados lidos com sucesso:", readData);

      return {
        success: true,
        message: "Firestore funcionando PERFEITAMENTE com configuração segura!",
        data: {
          projectId: app.options.projectId,
          written: testData,
          read: readData,
          timestamp: new Date().toISOString(),
        },
      };
    } else {
      return {
        success: false,
        message: "Documento foi escrito mas não pode ser lido",
      };
    }
  } catch (error: any) {
    console.error("❌ Erro no teste:", error);

    return {
      success: false,
      message: `Erro: ${error.message}`,
      data: {
        error: error.code || "unknown",
        message: error.message,
        projectId: app.options.projectId,
      },
    };
  }
}

// Export das configurações corretas
export { app as firebaseApp, firebaseConfig };
export default firebaseConfig;
