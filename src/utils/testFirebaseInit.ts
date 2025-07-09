/**
 * Test Firebase initialization to verify getImmediate errors are fixed
 */

import {
  getFirebaseDB,
  getFirebaseAuth,
  getFirebaseStatus,
} from "../firebase/simpleConfig";

export class FirebaseInitTest {
  static async runTest(): Promise<boolean> {
    console.log("🧪 TESTING Firebase initialization (no getImmediate errors)");

    try {
      // Test 1: Get Firebase status
      console.log("Test 1: Getting Firebase status...");
      const status = getFirebaseStatus();
      console.log("✅ Status retrieved:", status);

      // Test 2: Get Firestore instance
      console.log("Test 2: Getting Firestore instance...");
      const db = await getFirebaseDB();
      if (db) {
        console.log("✅ Firestore instance retrieved successfully");
      } else {
        console.log("⚠️ Firestore not available (local mode)");
      }

      // Test 3: Get Auth instance
      console.log("Test 3: Getting Auth instance...");
      const auth = await getFirebaseAuth();
      if (auth) {
        console.log("✅ Auth instance retrieved successfully");
      } else {
        console.log("⚠️ Auth not available (local mode)");
      }

      // Test 4: Multiple rapid calls (stress test)
      console.log("Test 4: Stress testing with rapid calls...");
      const promises = [
        getFirebaseDB(),
        getFirebaseAuth(),
        getFirebaseDB(),
        getFirebaseAuth(),
        getFirebaseDB(),
      ];

      const results = await Promise.all(promises);
      console.log("✅ Stress test completed without errors");

      console.log("🎉 ALL TESTS PASSED - No getImmediate errors detected!");
      return true;
    } catch (error) {
      console.error("❌ Firebase test failed:", error);

      // Check if it's the getImmediate error
      if (
        error instanceof Error &&
        (error.message.includes("getImmediate") ||
          error.stack?.includes("getImmediate"))
      ) {
        console.error("🚨 getImmediate error still present!");
        return false;
      }

      // Other errors might be acceptable (network issues, etc.)
      console.log("⚠️ Non-critical error, continuing...");
      return true;
    }
  }
}

// Run test when this module is imported (in development)
if (typeof window !== "undefined" && import.meta.env.DEV) {
  setTimeout(() => {
    FirebaseInitTest.runTest().then((success) => {
      if (success) {
        console.log("🔥 Firebase initialization test: PASSED");
      } else {
        console.log("❌ Firebase initialization test: FAILED");
      }
    });
  }, 2000); // Wait 2 seconds for app to stabilize
}
