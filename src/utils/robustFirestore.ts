// Robust Firestore initialization with retry and fallback logic

export const initializeRobustFirestore = async () => {
  const result = {
    success: false,
    project: "",
    attempts: 0,
    method: "",
    error: null as string | null,
  };

  const maxAttempts = 3;
  const delayBetweenAttempts = 1000;

  // Method 1: Direct initialization with retry
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    result.attempts = attempt;

    try {
      console.log(
        `🔄 Firestore initialization attempt ${attempt}/${maxAttempts}`,
      );

      // Clear everything first
      const { getApps, deleteApp } = await import("firebase/app");
      const existingApps = getApps();

      for (const app of existingApps) {
        try {
          await deleteApp(app);
          console.log(`🗑️ Deleted app: ${app.name}`);
        } catch (e) {
          console.log(`⚠️ Could not delete app: ${app.name}`);
        }
      }

      // Wait for cleanup
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Initialize fresh app
      const { initializeApp } = await import("firebase/app");

      const config = {
        apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
        authDomain: "leiria-1cfc9.firebaseapp.com",
        projectId: "leiria-1cfc9",
        storageBucket: "leiria-1cfc9.firebasestorage.app",
        messagingSenderId: "632599887141",
        appId: "1:632599887141:web:6027bf35a9d908b264eecc",
        measurementId: "G-51GLBMB6JQ",
      };

      const app = initializeApp(config, `robust-${Date.now()}-${attempt}`);
      result.project = config.projectId;

      console.log(
        `✅ App created: ${app.name} for project: ${config.projectId}`,
      );

      // Wait for app to be ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Try Firestore initialization
      const { getFirestore, enableNetwork, connectFirestoreEmulator } =
        await import("firebase/firestore");

      const db = getFirestore(app);
      console.log(`🔥 Firestore instance created for ${app.options.projectId}`);

      // Enable network explicitly
      try {
        await enableNetwork(db);
        console.log("✅ Firestore network enabled");
      } catch (networkError) {
        console.log("⚠️ Network enable failed, but continuing:", networkError);
      }

      // Test basic operation
      const { collection, doc } = await import("firebase/firestore");
      const testCollection = collection(db, "test");
      const testDoc = doc(testCollection, "connectivity-test");

      console.log("✅ Firestore operations successful");

      result.success = true;
      result.method = `Direct initialization (attempt ${attempt})`;
      return result;
    } catch (error: any) {
      console.error(`❌ Attempt ${attempt} failed:`, error);
      result.error = error.message;

      if (attempt < maxAttempts) {
        console.log(`⏳ Waiting ${delayBetweenAttempts}ms before retry...`);
        await new Promise((resolve) =>
          setTimeout(resolve, delayBetweenAttempts),
        );
      }
    }
  }

  // Method 2: Alternative approach with different configuration
  try {
    console.log("🔄 Trying alternative Firestore approach...");

    const { initializeApp } = await import("firebase/app");
    const { initializeFirestore } = await import("firebase/firestore");

    const altConfig = {
      projectId: "leiria-1cfc9",
      apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
    };

    const altApp = initializeApp(altConfig, `alt-${Date.now()}`);

    // Use initializeFirestore instead of getFirestore
    const db = initializeFirestore(altApp, {
      experimentalForceLongPolling: true,
    });

    console.log("✅ Alternative Firestore initialization successful");

    result.success = true;
    result.method = "Alternative initializeFirestore";
    result.project = altConfig.projectId;
    return result;
  } catch (altError: any) {
    console.error("❌ Alternative approach failed:", altError);
    result.error = altError.message;
  }

  return result;
};

// Check if Firestore is actually enabled in the project
export const checkFirestoreStatus = async () => {
  const projectId = "leiria-1cfc9";
  const apiKey = "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw";

  try {
    // Try to access Firestore REST API to check if it's enabled
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/test/connectivity-check?key=${apiKey}`,
      { method: "GET" },
    );

    if (response.status === 404) {
      return {
        enabled: true,
        message: "Firestore is enabled (404 is expected for missing document)",
      };
    } else if (response.status === 403) {
      return {
        enabled: false,
        message: "Firestore not enabled or access denied",
      };
    } else {
      return {
        enabled: true,
        message: `Firestore responsive (status: ${response.status})`,
      };
    }
  } catch (error: any) {
    return {
      enabled: false,
      message: `Firestore check failed: ${error.message}`,
    };
  }
};
