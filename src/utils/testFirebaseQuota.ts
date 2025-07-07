import { db } from "../firebase/config";
import { collection, getDocs, limit, query } from "firebase/firestore";

export const testFirebaseQuota = async (): Promise<{
  success: boolean;
  planType: string;
  error?: string;
  message: string;
}> => {
  try {
    if (!db) {
      return {
        success: false,
        planType: "unknown",
        message: "Firebase não configurado",
        error: "No database connection",
      };
    }

    console.log("🔍 Testando quota do Firebase...");

    // Test with minimal operation - just get 1 document
    const testQuery = query(collection(db, "users"), limit(1));
    const snapshot = await getDocs(testQuery);

    console.log("✅ Operação Firebase bem-sucedida!");

    // If we get here, quota is working
    return {
      success: true,
      planType: "blaze-or-updated",
      message: `Firebase operacional! Quota disponível. Documentos encontrados: ${snapshot.size}`,
    };
  } catch (error: any) {
    console.error("❌ Erro no teste Firebase:", error);

    if (
      error.code === "resource-exhausted" ||
      error.message?.includes("quota") ||
      error.message?.includes("Quota exceeded")
    ) {
      return {
        success: false,
        planType: "spark-exceeded",
        message:
          "Quota ainda excedida - upgrade não aplicado ou ainda em plano gratuito",
        error: error.message,
      };
    }

    return {
      success: false,
      planType: "unknown",
      message: `Erro na conexão: ${error.message}`,
      error: error.message,
    };
  }
};

// Test function for admin
export const runQuotaTest = async () => {
  const result = await testFirebaseQuota();

  console.log("📊 Resultado do teste de quota:");
  console.log(result);

  if (result.success) {
    alert(
      `✅ FIREBASE OK!\n\n${result.message}\n\nPode reativar a sincronização.`,
    );
  } else {
    alert(
      `❌ QUOTA AINDA EXCEDIDA\n\n${result.message}\n\nVerificar:\n- Upgrade aplicado no console?\n- Método de pagamento ativo?\n- Aguardar algumas horas?`,
    );
  }

  return result;
};
