import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:6027bf35a9d908b264eecc",
  measurementId: "G-51GLBMB6JQ",
};

export const testFirebaseSimple = async () => {
  const results = {
    app: false,
    firestore: false,
    auth: false,
    storage: false,
    errors: [] as string[],
  };

  try {
    // Initialize Firebase App
    let app;
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
      console.log("✅ Using existing Firebase app");
    } else {
      app = initializeApp(firebaseConfig);
      console.log("✅ Firebase app initialized");
    }
    results.app = true;

    // Test Firestore
    try {
      console.log("🔥 Testing Firestore...");
      const db = getFirestore(app);
      console.log("✅ Firestore instance created");

      // Try to create a collection reference
      const testRef = collection(db, "test");
      console.log("✅ Collection reference created");

      results.firestore = true;

      // Try to read (will fail if no permission but that's OK)
      try {
        const snapshot = await getDocs(testRef);
        console.log("✅ Firestore read test completed, docs:", snapshot.size);
      } catch (readError: any) {
        if (readError.code === "permission-denied") {
          console.log("⚠️ Permission denied (expected) - Firestore is working");
        } else {
          console.log("⚠️ Read error:", readError.message);
        }
      }
    } catch (firestoreError: any) {
      console.error("❌ Firestore error:", firestoreError);
      results.errors.push(`Firestore: ${firestoreError.message}`);
    }

    // Test Auth
    try {
      const auth = getAuth(app);
      console.log("✅ Auth instance created");
      results.auth = true;
    } catch (authError: any) {
      console.error("❌ Auth error:", authError);
      results.errors.push(`Auth: ${authError.message}`);
    }

    // Test Storage
    try {
      const storage = getStorage(app);
      console.log("✅ Storage instance created");
      results.storage = true;
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
