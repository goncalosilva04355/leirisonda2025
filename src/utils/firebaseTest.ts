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
  };

  try {
    // Test Firebase App
    const app = getFirebaseApp();
    if (app) {
      results.app = true;
      console.log("✅ Firebase App connected:", app.options.projectId);
    } else {
      results.errors.push("Firebase App not initialized");
    }

    // Test Firestore
    try {
      const db = await getFirestoreSafe();
      if (db) {
        // Try to read from a test collection
        const { collection, getDocs } = await import("firebase/firestore");
        const testRef = collection(db, "test");
        await getDocs(testRef);
        results.firestore = true;
        console.log("✅ Firestore connected and accessible");
      }
    } catch (firestoreError: any) {
      results.errors.push(`Firestore error: ${firestoreError.message}`);
      console.log("❌ Firestore error:", firestoreError.message);
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
