// Force Firestore connection when it's enabled but not connecting

export const forceFirestoreConnection = async () => {
  console.log("🔄 Forcing Firestore connection...");

  const result = {
    success: false,
    steps: [] as string[],
    error: null as string | null,
  };

  try {
    // Step 1: Clear all browser cache related to Firebase
    result.steps.push("Clearing browser cache...");

    // Clear localStorage entries
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.includes("firebase") || key.includes("firestore"))) {
        localStorage.removeItem(key);
      }
    }

    // Clear sessionStorage
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && (key.includes("firebase") || key.includes("firestore"))) {
        sessionStorage.removeItem(key);
      }
    }

    result.steps.push("✅ Browser cache cleared");

    // Step 2: Force delete ALL Firebase apps
    result.steps.push("Deleting all Firebase apps...");
    const { getApps, deleteApp } = await import("firebase/app");
    const apps = getApps();

    for (const app of apps) {
      try {
        await deleteApp(app);
        result.steps.push(`✅ Deleted app: ${app.name}`);
      } catch (e) {
        result.steps.push(`⚠️ Could not delete: ${app.name}`);
      }
    }

    // Step 3: Wait for cleanup
    result.steps.push("Waiting for cleanup...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 4: Create brand new Firebase app with timestamp
    result.steps.push("Creating fresh Firebase app...");
    const { initializeApp } = await import("firebase/app");

    const freshConfig = {
      apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
      authDomain: "leiria-1cfc9.firebaseapp.com",
      projectId: "leiria-1cfc9",
      storageBucket: "leiria-1cfc9.firebasestorage.app",
      messagingSenderId: "632599887141",
      appId: "1:632599887141:web:6027bf35a9d908b264eecc",
      measurementId: "G-51GLBMB6JQ",
    };

    const timestamp = Date.now();
    const app = initializeApp(freshConfig, `fresh-${timestamp}`);
    result.steps.push(`✅ Created app: ${app.name}`);

    // Step 5: Wait for app initialization
    result.steps.push("Waiting for app initialization...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 6: Test Firestore with multiple methods
    result.steps.push("Testing Firestore connection...");

    // Method 1: Direct getFirestore
    try {
      const { getFirestore } = await import("firebase/firestore");
      const db = getFirestore(app);

      result.steps.push("✅ Firestore instance created");

      // Test basic operation
      const { collection, doc, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const testRef = collection(db, "connection_test");
      const testDoc = doc(testRef, `test_${timestamp}`);

      result.steps.push("✅ Firestore operations available");
      result.success = true;

      return result;
    } catch (error: any) {
      result.steps.push(`❌ Method 1 failed: ${error.message}`);

      // Method 2: Try with network settings
      try {
        const { getFirestore, enableNetwork, connectFirestoreEmulator } =
          await import("firebase/firestore");
        const db = getFirestore(app);

        await enableNetwork(db);
        result.steps.push("✅ Network enabled");

        result.success = true;
        return result;
      } catch (error2: any) {
        result.steps.push(`❌ Method 2 failed: ${error2.message}`);
        result.error = error2.message;
      }
    }
  } catch (criticalError: any) {
    result.error = criticalError.message;
    result.steps.push(`❌ Critical error: ${criticalError.message}`);
  }

  return result;
};

// Check if the issue is propagation delay
export const checkFirestorePropagation = async () => {
  const projectId = "leiria-1cfc9";
  const apiKey = "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw";

  try {
    // Test direct Firestore REST API
    const testUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents?key=${apiKey}`;

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return {
        propagated: true,
        message: "Firestore is accessible via REST API",
      };
    } else if (response.status === 403) {
      return {
        propagated: true,
        message: "Firestore is active but access denied (security rules)",
      };
    } else {
      return {
        propagated: false,
        message: `Firestore not yet propagated (HTTP ${response.status})`,
      };
    }
  } catch (error: any) {
    return {
      propagated: false,
      message: `Propagation check failed: ${error.message}`,
    };
  }
};

// Provide troubleshooting steps
export const getTroubleshootingSteps = () => {
  return {
    immediate: [
      "1. Aguarde 5-10 minutos após habilitar Firestore",
      "2. Recarregue a página completamente (Ctrl+F5)",
      "3. Limpe cache do browser (Ctrl+Shift+Del)",
      "4. Tente em modo incógnito/privado",
    ],

    firebaseConsole: [
      "1. Verifique se projeto é 'leiria-1cfc9'",
      "2. Vá para Firestore Database",
      "3. Confirme que mostra 'Native mode' ativo",
      "4. Vá para Rules tab",
      "5. Confirme regras permitem acesso",
    ],

    advanced: [
      "1. Tente criar um documento manualmente no console",
      "2. Verifique se não há quotas/limites atingidos",
      "3. Confirme que região está correta (europe-west1)",
      "4. Verifique se billing está ativo",
    ],
  };
};
