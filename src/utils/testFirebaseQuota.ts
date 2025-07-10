// Firebase disabled - quota test not available
// import { db } from "../firebase/config";
// import { collection, getDocs, limit, query } from "firebase/firestore";

export const testFirebaseQuota = async (): Promise<{
  success: boolean;
  planType: string;
  error?: string;
  message: string;
}> => {
  console.log("🚫 Firebase quota test disabled - Firestore not available");
  return {
    success: false,
    planType: "firestore-disabled",
    message: "Firebase quota test disabled - Firestore not available",
    error: "Firestore service not enabled",
  };
};

// Test function for admin
export const runQuotaTest = async () => {
  const result = await testFirebaseQuota();

  console.log("📊 Resultado do teste de quota:");
  console.log(result);

  alert(
    `ℹ️ FIREBASE QUOTA TEST\n\n${result.message}\n\nFirestore está desabilitado para evitar erros.`,
  );

  return result;
};
