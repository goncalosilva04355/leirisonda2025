// Specific test for Firestore connectivity issues

export const diagnoseFirestoreConnection = async () => {
  const results = {
    configCheck: false,
    networkCheck: false,
    rulesCheck: false,
    connectionSuccess: false,
    projectId: "",
    errors: [] as string[],
    suggestions: [] as string[],
  };

  try {
    console.log("🔍 Diagnosing Firestore connection issues...");

    // Step 1: Check configuration
    const { getApps } = await import("firebase/app");
    const apps = getApps();

    if (apps.length > 0) {
      const app = apps[0];
      results.projectId = app.options.projectId || "unknown";
      results.configCheck = true;
      console.log("✅ Firebase app configured for project:", results.projectId);
    } else {
      results.errors.push("No Firebase app found");
      return results;
    }

    // Step 2: Test Firestore initialization methods
    try {
      console.log("🔥 Testing Firestore connection methods...");

      const {
        getFirestore,
        connectFirestoreEmulator,
        enableNetwork,
        disableNetwork,
      } = await import("firebase/firestore");
      const app = apps[0];

      // Method 1: Direct getFirestore
      try {
        const db = getFirestore(app);
        console.log("✅ getFirestore() successful");

        // Try to enable network explicitly
        try {
          await enableNetwork(db);
          console.log("✅ Network enabled");
          results.networkCheck = true;
        } catch (networkError: any) {
          console.log("⚠️ Network enable failed:", networkError.message);
          results.errors.push(`Network: ${networkError.message}`);
        }

        // Step 3: Test basic operation (this will reveal rules issues)
        try {
          const { collection, getDocs, doc, setDoc } = await import(
            "firebase/firestore"
          );

          // Try read operation
          const testCollection = collection(db, "connection_test");
          console.log("✅ Collection reference created");

          const snapshot = await getDocs(testCollection);
          console.log("✅ Read operation successful, docs:", snapshot.size);
          results.rulesCheck = true;
          results.connectionSuccess = true;
        } catch (operationError: any) {
          console.log("❌ Operation failed:", operationError);

          if (operationError.code === "permission-denied") {
            results.errors.push("Permission denied - Firestore rules issue");
            results.suggestions.push(
              "Check Firestore rules in Firebase Console",
            );
            results.suggestions.push("Ensure rules allow read/write access");
          } else if (operationError.code === "unavailable") {
            results.errors.push("Firestore service unavailable");
            results.suggestions.push("Check network connection");
            results.suggestions.push(
              "Verify Firestore is enabled in Firebase Console",
            );
          } else {
            results.errors.push(`Operation error: ${operationError.message}`);
          }
        }
      } catch (initError: any) {
        console.log("❌ getFirestore failed:", initError);
        results.errors.push(`Init: ${initError.message}`);

        if (initError.message.includes("getImmediate")) {
          results.suggestions.push("Multiple Firebase initialization conflict");
          results.suggestions.push("Try refreshing the page");
        }
      }
    } catch (importError: any) {
      results.errors.push(`Import error: ${importError.message}`);
    }

    // Step 4: Provide specific solutions
    if (!results.connectionSuccess) {
      if (results.configCheck && !results.networkCheck) {
        results.suggestions.push(
          "Network connectivity issue - check internet connection",
        );
      }

      if (results.networkCheck && !results.rulesCheck) {
        results.suggestions.push(
          `Update Firestore rules in: https://console.firebase.google.com/project/${results.projectId}/firestore/rules`,
        );
        results.suggestions.push("Use rule: allow read, write: if true;");
      }

      if (!results.configCheck) {
        results.suggestions.push(
          "Firebase configuration issue - check project settings",
        );
      }
    }
  } catch (error: any) {
    console.error("❌ Diagnosis error:", error);
    results.errors.push(`Diagnosis: ${error.message}`);
  }

  return results;
};
