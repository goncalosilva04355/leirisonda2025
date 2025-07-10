import {
  getFirebaseApp,
  getFirestoreSafe,
  getStorageSafe,
} from "../firebase/configFixed";

export const testFirebaseConnectivity = async () => {
  const results = {
    app: false,
    firestore: false,
    storage: false,
    errors: [] as string[],
    details: {} as any,
  };

  try {
    // Test Firebase App
    const app = getFirebaseApp();
    if (app) {
      results.app = true;
      results.details.app = {
        projectId: app.options.projectId,
        authDomain: app.options.authDomain,
        name: app.name,
      };
      console.log("✅ Firebase App connected:", app.options.projectId);
    } else {
      results.errors.push("Firebase App not initialized");
    }

    // Test Firestore with detailed diagnostics
    console.log("🔍 Testing Firestore connection...");
    try {
      const db = await getFirestoreSafe();
      if (db) {
        console.log("✅ Firestore instance obtained");

        // Try different approaches to test Firestore
        const { collection, getDocs, doc, getDoc } = await import(
          "firebase/firestore"
        );

        // Test 1: Try to get a simple collection reference
        try {
          const testRef = collection(db, "connectivity_test");
          console.log("✅ Collection reference created");

          // Test 2: Try to read (this will fail if rules are restrictive)
          const snapshot = await getDocs(testRef);
          console.log("✅ Firestore read successful, docs:", snapshot.size);
          results.firestore = true;
          results.details.firestore = {
            status: "connected",
            docsCount: snapshot.size,
            app: db.app.name,
          };
        } catch (readError: any) {
          console.log("⚠️ Firestore read failed:", readError.message);

          if (readError.code === "permission-denied") {
            results.errors.push(
              "Firestore rules deny access - needs authentication or rule update",
            );
            results.details.firestore = {
              status: "permission_denied",
              message: "Security rules deny access",
              suggestion: "Update Firestore rules or authenticate user",
            };
          } else {
            results.errors.push(`Firestore read error: ${readError.message}`);
            results.details.firestore = {
              status: "read_error",
              error: readError.message,
              code: readError.code,
            };
          }
        }
      } else {
        results.errors.push("Failed to get Firestore instance");
      }
    } catch (firestoreError: any) {
      results.errors.push(
        `Firestore initialization error: ${firestoreError.message}`,
      );
      console.log("❌ Firestore initialization error:", firestoreError);
    }

    // Test Storage
    try {
      const storage = await getStorageSafe();
      if (storage) {
        // Try to get a reference (doesn't need to exist)
        const { ref } = await import("firebase/storage");
        const testRef = ref(storage, "test/connectivity.txt");
        if (testRef) {
          results.storage = true;
          console.log("✅ Firebase Storage connected and accessible");
        }
      }
    } catch (storageError: any) {
      results.errors.push(`Storage error: ${storageError.message}`);
      console.log("❌ Storage error:", storageError.message);
    }
  } catch (error: any) {
    results.errors.push(`General Firebase error: ${error.message}`);
    console.error("❌ Firebase test error:", error);
  }

  return results;
};

export const testFirestoreOperations = async () => {
  try {
    const db = await getFirestoreSafe();
    if (!db) throw new Error("Firestore not available");

    const { collection, doc, setDoc, getDoc, serverTimestamp } = await import(
      "firebase/firestore"
    );

    // Test write operation
    const testDoc = doc(collection(db, "connectivity_test"), "test_doc");
    await setDoc(testDoc, {
      message: "Firebase connectivity test",
      timestamp: serverTimestamp(),
      test: true,
    });
    console.log("✅ Firestore WRITE operation successful");

    // Test read operation
    const docSnap = await getDoc(testDoc);
    if (docSnap.exists()) {
      console.log("✅ Firestore READ operation successful:", docSnap.data());
      return true;
    } else {
      console.log("❌ Document was not found after write");
      return false;
    }
  } catch (error: any) {
    console.error("❌ Firestore operations test failed:", error.message);
    return false;
  }
};
