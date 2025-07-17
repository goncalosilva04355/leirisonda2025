// Configuração Firebase CORRETA usando configuração centralizada
import { getFirebaseApp, getFirestoreInstance } from "./config";

// Obter instâncias Firebase de forma robusta
const app = getFirebaseApp();
let db: any = null;

export async function getCorrectFirestore() {
  if (db) return db;

  try {
    // Aguardar um momento para garantir inicialização
    await new Promise((resolve) => setTimeout(resolve, 100));

    db = getFirestoreInstance();
    console.log("✅ Firestore inicializado com configuração correta");
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
    console.log("🧪 Testando Firestore com configuração correta...");

    const firestore = await getCorrectFirestore();

    // Tentar criar referência
    const { doc, setDoc, getDoc, serverTimestamp } = await import(
      "firebase/firestore"
    );
    const testRef = doc(firestore, "test-correct", "connection-test");

    // Tentar escrever dados
    const testData = {
      message: "Teste com configuração correta",
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
        message:
          "Firestore funcionando PERFEITAMENTE com configuração correta!",
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
export { app as firebaseApp };
export default app;
