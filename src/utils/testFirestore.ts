// Teste de conectividade do Firestore
import { getFirebaseFirestoreAsync } from "../firebase/firestoreConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function testFirestoreConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log("🧪 Iniciando teste de conectividade Firestore...");

    // Tentar obter instância do Firestore
    const db = await getFirebaseFirestoreAsync();

    if (!db) {
      return {
        success: false,
        message: "Firestore não está disponível - instância é null",
        details: { error: "DB_NULL" },
      };
    }

    console.log("✅ Instância Firestore obtida com sucesso");

    // Tentar escrever um documento de teste
    const testCollection = collection(db, "connection-test");
    const testDocRef = doc(testCollection, "connectivity-test");

    const testData = {
      timestamp: serverTimestamp(),
      message: "Teste de conectividade",
      success: true,
      testId: Date.now().toString(),
    };

    console.log("📝 Tentando escrever documento de teste...");
    await setDoc(testDocRef, testData);
    console.log("✅ Documento escrito com sucesso");

    // Tentar ler o documento de volta
    console.log("📖 Tentando ler documento de teste...");
    const docSnap = await getDoc(testDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("✅ Documento lido com sucesso:", data);

      return {
        success: true,
        message: "Firestore totalmente funcional - escrita e leitura OK",
        details: {
          written: testData,
          read: data,
          timestamp: new Date().toISOString(),
        },
      };
    } else {
      return {
        success: false,
        message: "Documento foi escrito mas não pode ser lido",
        details: { error: "READ_FAILED" },
      };
    }
  } catch (error: any) {
    console.error("❌ Erro no teste Firestore:", error);

    return {
      success: false,
      message: `Erro no teste Firestore: ${error.message}`,
      details: {
        error: error.code || "UNKNOWN_ERROR",
        message: error.message,
        stack: error.stack,
      },
    };
  }
}

export async function testFirestoreQuota(): Promise<{
  hasQuota: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log("🧪 Testando quota do Firestore...");

    const db = await getFirebaseFirestoreAsync();
    if (!db) {
      return {
        hasQuota: false,
        message: "Firestore não disponível para teste de quota",
      };
    }

    // Tentar várias operações rápidas para testar quota
    const testCollection = collection(db, "quota-test");

    for (let i = 0; i < 5; i++) {
      const testDoc = doc(testCollection, `quota-test-${i}`);
      await setDoc(testDoc, {
        index: i,
        timestamp: serverTimestamp(),
        test: "quota",
      });
    }

    return {
      hasQuota: true,
      message: "Quota disponível - operações múltiplas funcionaram",
      details: { operationsCompleted: 5 },
    };
  } catch (error: any) {
    if (
      error.code === "resource-exhausted" ||
      error.message.includes("quota")
    ) {
      return {
        hasQuota: false,
        message: "Quota do Firebase excedida",
        details: {
          error: error.code,
          message: error.message,
        },
      };
    }

    return {
      hasQuota: false,
      message: `Erro ao testar quota: ${error.message}`,
      details: {
        error: error.code || "UNKNOWN_ERROR",
        message: error.message,
      },
    };
  }
}
