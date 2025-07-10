import {
  getFirebaseApp,
  getFirestoreSafe,
  getAuthSafe,
  getStorageSafe,
} from "../firebase/configFixed";
import { collection, getDocs } from "firebase/firestore";

export const testFirebaseSimple = async () => {
  const results = {
    app: false,
    firestore: false,
    auth: false,
    storage: false,
    errors: [] as string[],
  };

  try {
    // Test Firebase App using existing configuration
    const app = getFirebaseApp();
    if (app) {
      console.log("✅ Using existing Firebase app:", app.options.projectId);
      results.app = true;
    } else {
      console.log("❌ No Firebase app found");
      results.errors.push("Firebase app not initialized");
      return results;
    }

    // Test Firestore using safe method
    try {
      console.log("🔥 Testing Firestore...");
      const db = await getFirestoreSafe();
      if (db) {
        console.log("✅ Firestore instance obtained");
        results.firestore = true;

        // Try to create a collection reference
        try {
          const testRef = collection(db, "test");
          console.log("✅ Collection reference created");

          // Try to read (will fail if no permission but that's OK)
          try {
            const snapshot = await getDocs(testRef);
            console.log(
              "✅ Firestore read test completed, docs:",
              snapshot.size,
            );
          } catch (readError: any) {
            if (readError.code === "permission-denied") {
              console.log(
                "⚠️ Permission denied (expected) - Firestore is working",
              );
            } else {
              console.log("⚠️ Read error:", readError.message);
            }
          }
        } catch (collectionError: any) {
          console.log(
            "⚠️ Collection reference error:",
            collectionError.message,
          );
        }
      } else {
        console.log("❌ Failed to get Firestore instance");
        results.errors.push("Firestore instance is null");
      }
    } catch (firestoreError: any) {
      console.error("❌ Firestore error:", firestoreError);
      results.errors.push(`Firestore: ${firestoreError.message}`);
    }

    // Test Auth using safe method
    try {
      console.log("🔐 Testing Auth...");
      const auth = await getAuthSafe();
      if (auth) {
        console.log("✅ Auth instance obtained");
        results.auth = true;
      } else {
        console.log("❌ Failed to get Auth instance");
        results.errors.push("Auth instance is null");
      }
    } catch (authError: any) {
      console.error("❌ Auth error:", authError);
      results.errors.push(`Auth: ${authError.message}`);
    }

    // Test Storage using safe method
    try {
      console.log("💾 Testing Storage...");
      const storage = await getStorageSafe();
      if (storage) {
        console.log("✅ Storage instance obtained");
        results.storage = true;
      } else {
        console.log("❌ Failed to get Storage instance");
        results.errors.push("Storage instance is null");
      }
    } catch (storageError: any) {
      console.error("❌ Storage error:", storageError);
      results.errors.push(`Storage: ${storageError.message}`);
    }
  } catch (error: any) {
    console.error("❌ General Firebase error:", error);
    results.errors.push(`General: ${error.message}`);
  }

  return results;
};
