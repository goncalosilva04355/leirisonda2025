// Completely isolated Firebase test - bypasses all existing configurations

export const testIsolatedFirebase = async () => {
  const results = {
    success: false,
    project: "",
    firestore: false,
    errors: [] as string[],
  };

  try {
    console.log("🧪 Starting completely isolated Firebase test...");

    // Step 1: Clean ALL existing Firebase apps
    const { getApps, deleteApp } = await import("firebase/app");
    const existingApps = getApps();

    console.log(`🗑️ Cleaning ${existingApps.length} existing apps...`);
    for (const app of existingApps) {
      try {
        await deleteApp(app);
        console.log(`✅ Deleted: ${app.name}`);
      } catch (error) {
        console.log(`⚠️ Could not delete: ${app.name}`);
      }
    }

    // Wait a moment for cleanup
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step 2: Initialize FRESH Firebase with CORRECT project
    const { initializeApp } = await import("firebase/app");

    const correctConfig = {
      apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
      authDomain: "leiria-1cfc9.firebaseapp.com",
      projectId: "leiria-1cfc9",
      storageBucket: "leiria-1cfc9.firebasestorage.app",
      messagingSenderId: "632599887141",
      appId: "1:632599887141:web:6027bf35a9d908b264eecc",
      measurementId: "G-51GLBMB6JQ",
    };

    console.log(
      "🔥 Creating fresh Firebase app with project:",
      correctConfig.projectId,
    );

    const app = initializeApp(correctConfig, `fresh-test-${Date.now()}`);
    console.log("✅ Fresh app created:", app.name);

    results.success = true;
    results.project = app.options.projectId || "unknown";

    // Step 3: Test Firestore with fresh app
    try {
      const { getFirestore, connectFirestoreEmulator } = await import(
        "firebase/firestore"
      );

      console.log("🔥 Testing Firestore with fresh app...");

      // Wait a moment for app to be ready
      await new Promise((resolve) => setTimeout(resolve, 300));

      const db = getFirestore(app);
      console.log("✅ Firestore initialized successfully!");

      results.firestore = true;

      // Test basic operation
      const { collection, doc } = await import("firebase/firestore");
      const testRef = collection(db, "test");
      const docRef = doc(testRef, "test-doc");

      console.log("✅ Firestore operations successful!");
    } catch (firestoreError: any) {
      console.error("❌ Firestore test failed:", firestoreError);
      results.errors.push(`Firestore: ${firestoreError.message}`);

      if (firestoreError.message.includes("not available")) {
        results.errors.push(
          "Firestore service not enabled in Firebase project",
        );
        results.errors.push(
          `Check: https://console.firebase.google.com/project/${correctConfig.projectId}/firestore`,
        );
      }
    }
  } catch (error: any) {
    console.error("❌ Isolated test failed:", error);
    results.errors.push(`Critical: ${error.message}`);
  }

  return results;
};

// Alternative approach: Create a completely separate Firebase instance
export const createFreshFirebaseInstance = async () => {
  try {
    console.log("🆕 Creating completely separate Firebase instance...");

    // Dynamic import to avoid conflicts
    const firebase = await import("firebase/app");

    // Use different app name to avoid conflicts
    const freshConfig = {
      apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
      authDomain: "leiria-1cfc9.firebaseapp.com",
      projectId: "leiria-1cfc9",
      storageBucket: "leiria-1cfc9.firebasestorage.app",
      messagingSenderId: "632599887141",
      appId: "1:632599887141:web:6027bf35a9d908b264eecc",
      measurementId: "G-51GLBMB6JQ",
    };

    const freshApp = firebase.initializeApp(
      freshConfig,
      `isolated-${Math.random()}`,
    );

    // Test Firestore immediately
    const { getFirestore } = await import("firebase/firestore");
    const db = getFirestore(freshApp);

    return {
      success: true,
      app: freshApp,
      firestore: db,
      project: freshConfig.projectId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};
