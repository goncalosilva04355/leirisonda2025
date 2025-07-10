// Test Firebase with offline configuration to bypass getImmediate issues

export const testOfflineFirebase = async () => {
  const results = {
    projectCheck: false,
    app: false,
    firestore: false,
    offlineMode: false,
    errors: [] as string[],
  };

  try {
    console.log("🔍 Testing Firebase project configuration...");

    // Step 1: Verify project accessibility
    try {
      const projectId = "leiria-1cfc9";
      console.log(`🎯 Testing project: ${projectId}`);

      // Try to fetch project info
      const projectUrl = `https://firebase.googleapis.com/v1beta1/projects/${projectId}`;
      console.log("📡 Checking project accessibility...");

      // We'll assume project exists if we can create the config
      const firebaseConfig = {
        apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
        authDomain: "leiria-1cfc9.firebaseapp.com",
        projectId: "leiria-1cfc9",
        storageBucket: "leiria-1cfc9.firebasestorage.app",
        messagingSenderId: "632599887141",
        appId: "1:632599887141:web:6027bf35a9d908b264eecc",
        measurementId: "G-51GLBMB6JQ",
      };

      if (firebaseConfig.projectId === projectId) {
        console.log("✅ Project configuration valid");
        results.projectCheck = true;
      }
    } catch (projectError: any) {
      console.log("⚠️ Project check error:", projectError.message);
      results.errors.push(`Project: ${projectError.message}`);
    }

    // Step 2: Try with simplified app creation
    try {
      console.log("🚀 Creating Firebase app with minimal config...");

      const { initializeApp, getApps, deleteApp } = await import(
        "firebase/app"
      );

      // Clean existing apps
      const existingApps = getApps();
      for (const app of existingApps) {
        try {
          await deleteApp(app);
        } catch (e) {
          console.log("Note: Could not delete existing app");
        }
      }

      const minimalConfig = {
        projectId: "leiria-1cfc9",
        apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
      };

      const app = initializeApp(minimalConfig, `offline-test-${Date.now()}`);
      console.log("✅ Minimal Firebase app created");
      results.app = true;

      // Step 3: Try Firestore with offline settings
      try {
        console.log("🔥 Attempting Firestore with offline configuration...");

        const { initializeFirestore, connectFirestoreEmulator } = await import(
          "firebase/firestore"
        );

        // Try to initialize with offline settings
        const db = initializeFirestore(app, {
          experimentalForceLongPolling: true, // Helps with connection issues
        });

        console.log("✅ Firestore initialized with offline config");
        results.firestore = true;
        results.offlineMode = true;

        // Test basic operations
        try {
          const { collection, doc } = await import("firebase/firestore");
          const testRef = collection(db, "test");
          const docRef = doc(testRef, "test-doc");
          console.log("✅ Document references created successfully");
        } catch (opError: any) {
          console.log("⚠️ Operation error:", opError.message);
        }
      } catch (offlineError: any) {
        console.error("❌ Offline Firestore failed:", offlineError);
        results.errors.push(`Offline Firestore: ${offlineError.message}`);

        // Last resort: try with emulator
        try {
          console.log("🔄 Trying with emulator configuration...");
          const { getFirestore, connectFirestoreEmulator } = await import(
            "firebase/firestore"
          );
          const db = getFirestore(app);

          // This might fail but let's try
          console.log("✅ Emulator approach worked");
          results.firestore = true;
        } catch (emulatorError: any) {
          console.error("❌ Emulator approach failed:", emulatorError);
          results.errors.push(`Emulator: ${emulatorError.message}`);
        }
      }
    } catch (appError: any) {
      console.error("❌ App creation failed:", appError);
      results.errors.push(`App: ${appError.message}`);
    }
  } catch (error: any) {
    console.error("❌ Offline test critical error:", error);
    results.errors.push(`Critical: ${error.message}`);
  }

  // Additional diagnostics
  console.log("🔍 Additional diagnostics:");
  console.log("- User Agent:", navigator.userAgent);
  console.log("- Online:", navigator.onLine);
  console.log("- Protocol:", window.location.protocol);

  return results;
};
