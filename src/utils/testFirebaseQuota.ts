import { db } from "../firebase/config";
import { collection, getDocs, limit, query } from "firebase/firestore";

export const testFirebaseQuota = async () => {
  try {
    if (!db) {
      return {
        success: false,
        message: "Firebase não está configurado",
      };
    }

    // Test reading a small amount of data
    const testQuery = query(collection(db, "users"), limit(1));
    const snapshot = await getDocs(testQuery);

    return {
      success: true,
      message: "Firebase quota test successful",
      documentsRead: snapshot.size,
    };
  } catch (error: any) {
    console.error("❌ Erro no teste Firebase:", error);

    if (
      error.code === "resource-exhausted" ||
      error.message?.includes("quota")
    ) {
      return {
        success: false,
        message: "Firebase quota exceeded",
      };
    }

    return {
      success: false,
      message: error.message || "Erro desconhecido no teste Firebase",
    };
  }
};

export const runQuotaTest = testFirebaseQuota;
