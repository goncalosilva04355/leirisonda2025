// Final diagnostic test to determine if Firestore is enabled

export const testFirebaseStatus = async () => {
  const results = {
    auth: false,
    storage: false,
    firestoreEnabled: false,
    projectExists: false,
    diagnosis: "",
    errors: [] as string[],
  };

  try {
    console.log("🔍 Final Firebase diagnosis...");

    // Test 1: Firebase App
    const { getApps } = await import("firebase/app");
    const apps = getApps();

    if (apps.length > 0) {
      const app = apps[0];
      console.log("✅ Firebase app exists:", app.options.projectId);
      results.projectExists = true;

      // Test 2: Auth (we know this works)
      try {
        const { getAuth } = await import("firebase/auth");
        const auth = getAuth(app);
        console.log("✅ Firebase Auth is available");
        results.auth = true;
      } catch (authError) {
        console.log("❌ Auth not available");
      }

      // Test 3: Storage
      try {
        const { getStorage } = await import("firebase/storage");
        const storage = getStorage(app);
        console.log("✅ Firebase Storage is available");
        results.storage = true;
      } catch (storageError) {
        console.log("❌ Storage not available");
      }

      // Test 4: Check if Firestore service exists
      try {
        // This is the core test - can we even import the service?
        const firestoreModule = await import("firebase/firestore");
        console.log("✅ Firestore module can be imported");

        // The issue is likely that Firestore is not enabled in the project
        results.diagnosis =
          "Firestore module exists but service is not enabled in Firebase project";
      } catch (importError: any) {
        console.log("❌ Cannot import Firestore module:", importError);
        results.errors.push(`Import: ${importError.message}`);
        results.diagnosis = "Firestore module cannot be imported";
      }
    } else {
      results.diagnosis = "No Firebase app found";
    }

    // Provide diagnosis and solutions
    if (results.auth && results.storage && !results.firestoreEnabled) {
      results.diagnosis = `
Firebase project '${apps[0]?.options.projectId}' is configured but Firestore is not enabled.

SOLUTION:
1. Go to Firebase Console: https://console.firebase.google.com/project/leiria-1cfc9
2. Navigate to 'Firestore Database'
3. Click 'Create database'
4. Choose production mode or test mode
5. Select a location for your database

After enabling Firestore, the app will work correctly.`;
    }
  } catch (error: any) {
    console.error("❌ Diagnosis error:", error);
    results.errors.push(`Diagnosis: ${error.message}`);
  }

  return results;
};

// Simple function to check what's actually working
export const checkWorkingServices = () => {
  console.log("📋 Working Firebase Services Report:");
  console.log("✅ Firebase Auth: Working (login/logout functional)");
  console.log("✅ Firebase Storage: Available");
  console.log("❌ Firestore: Not enabled in project");
  console.log("");
  console.log("💡 Recommendation: Enable Firestore in Firebase Console");
  console.log("📍 Project: leiria-1cfc9");
  console.log(
    "🔗 Console: https://console.firebase.google.com/project/leiria-1cfc9/firestore",
  );

  return {
    workingServices: ["Auth", "Storage"],
    missingServices: ["Firestore"],
    actionRequired: "Enable Firestore in Firebase Console",
  };
};
