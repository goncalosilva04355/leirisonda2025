/**
 * Test utility for Firebase lazy loading
 */

import { getDB, getAuthService } from "../firebase/config";

export const testFirebaseLazyLoading = async () => {
  console.log("🧪 Testing Firebase lazy loading...");

  try {
    // Test Auth lazy loading
    console.log("🔐 Testing Auth lazy loading...");
    const authService = await getAuthService();
    console.log("✅ Auth service:", authService ? "Available" : "Unavailable");

    // Test Firestore lazy loading
    console.log("🔄 Testing Firestore lazy loading...");
    const dbService = await getDB();
    console.log(
      "✅ Firestore service:",
      dbService ? "Available" : "Unavailable",
    );

    const results = {
      auth: !!authService,
      firestore: !!dbService,
      overall: !!(authService && dbService),
    };

    console.log("🧪 Lazy loading test results:", results);
    return results;
  } catch (error: any) {
    console.error("❌ Lazy loading test failed:", error.message);
    return {
      auth: false,
      firestore: false,
      overall: false,
      error: error.message,
    };
  }
};
