// Clean Firebase test that removes all existing apps first

export const testCleanFirebase = async () => {
  const results = {
    cleanup: false,
    app: false,
    firestore: false,
    errors: [] as string[],
  };

  try {
    console.log("🧹 Starting clean Firebase test...");

    // Step 1: Import Firebase modules
    const { initializeApp, getApps, deleteApp } = await import("firebase/app");
    console.log("✅ Firebase modules imported");

    // Step 2: Clean up existing apps
    try {
      const existingApps = getApps();
      console.log(`🗑️ Found ${existingApps.length} existing apps`);

      for (const app of existingApps) {
        try {
          await deleteApp(app);
          console.log(`✅ Deleted app: ${app.name}`);
        } catch (deleteError: any) {
          console.log(
            `⚠️ Could not delete app ${app.name}:`,
            deleteError.message,
          );
        }
      }

      // Verify cleanup
      const remainingApps = getApps();
      console.log(`✅ Apps after cleanup: ${remainingApps.length}`);
      results.cleanup = true;
    } catch (cleanupError: any) {
      console.log("⚠️ Cleanup error:", cleanupError.message);
      results.errors.push(`Cleanup: ${cleanupError.message}`);
    }

    // Step 3: Create fresh Firebase app
    try {
      console.log("🆕 Creating fresh Firebase app...");
      const firebaseConfig = {
        apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
        authDomain: "leiria-1cfc9.firebaseapp.com",
        projectId: "leiria-1cfc9",
        storageBucket: "leiria-1cfc9.firebasestorage.app",
        messagingSenderId: "632599887141",
        appId: "1:632599887141:web:6027bf35a9d908b264eecc",
        measurementId: "G-51GLBMB6JQ",
      };

      const app = initializeApp(firebaseConfig, `clean-test-${Date.now()}`);
      console.log("✅ Fresh Firebase app created:", app.name);
      results.app = true;

      // Step 4: Test Firestore with fresh app
      try {
        console.log("🔥 Testing Firestore with fresh app...");

        // Use a setTimeout to ensure app is fully initialized
        await new Promise((resolve) => setTimeout(resolve, 100));

        const { getFirestore } = await import("firebase/firestore");
        const db = getFirestore(app);

        console.log("✅ Firestore initialized successfully with fresh app");
        console.log("📊 Firestore details:", {
          app: db.app.name,
          projectId: db.app.options.projectId,
        });
        results.firestore = true;

        // Test basic operation
        try {
          const { collection } = await import("firebase/firestore");
          const testRef = collection(db, "test");
          console.log("✅ Collection reference created successfully");
        } catch (collectionError: any) {
          console.log("⚠️ Collection error:", collectionError.message);
        }
      } catch (firestoreError: any) {
        console.error("❌ Fresh Firestore failed:", firestoreError);
        results.errors.push(`Fresh Firestore: ${firestoreError.message}`);
      }
    } catch (appError: any) {
      console.error("❌ Fresh app creation failed:", appError);
      results.errors.push(`Fresh app: ${appError.message}`);
    }
  } catch (error: any) {
    console.error("❌ Clean test critical error:", error);
    results.errors.push(`Critical: ${error.message}`);
  }

  return results;
};
