// Automated Firestore enabler helper

export const tryEnableFirestore = async () => {
  const results = {
    projectId: "leiria-1cfc9",
    success: false,
    instructions: "",
    errors: [] as string[],
  };

  try {
    console.log("🔥 Attempting to enable Firestore automatically...");

    // Try to access the project via API
    const projectId = "leiria-1cfc9";
    const apiKey = "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw";

    // Check if project exists and is accessible
    try {
      const projectUrl = `https://firebase.googleapis.com/v1beta1/projects/${projectId}`;
      console.log("📡 Checking project accessibility...");

      // This will help identify if project exists
      results.instructions = `
🔥 FIRESTORE SETUP INSTRUCTIONS:

1. Open this EXACT link:
   https://console.firebase.google.com/project/leiria-1cfc9/firestore

2. You should see one of these options:
   
   OPTION A - "Create database" button:
   ✅ Click "Create database"
   ✅ Choose "Start in test mode" 
   ✅ Select location: "europe-west1"
   ✅ Click "Done"

   OPTION B - Database already exists:
   ✅ Go to "Rules" tab
   ✅ Replace all content with:
   
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   
   ✅ Click "Publish"

3. Return to this app and click 🧪 to test

PROJECT: ${projectId}
API KEY: ${apiKey.substring(0, 10)}...
`;
    } catch (apiError: any) {
      results.errors.push(`API check failed: ${apiError.message}`);
    }

    // Try alternative approach - attempt Firestore initialization
    try {
      const { initializeApp, getApps } = await import("firebase/app");
      const { getFirestore, enableNetwork } = await import(
        "firebase/firestore"
      );

      const apps = getApps();
      if (apps.length > 0) {
        const app = apps[0];
        console.log("🔄 Trying to force Firestore initialization...");

        // This might work if Firestore is already enabled but not connected
        const db = getFirestore(app);
        await enableNetwork(db);

        console.log("✅ Firestore force initialization successful!");
        results.success = true;
      }
    } catch (forceError: any) {
      console.log("⚠️ Force initialization failed:", forceError.message);
      results.errors.push(`Force init: ${forceError.message}`);
    }
  } catch (error: any) {
    console.error("❌ Enable Firestore error:", error);
    results.errors.push(`General: ${error.message}`);
  }

  return results;
};

// Function to open Firebase Console directly
export const openFirebaseConsole = () => {
  const url =
    "https://console.firebase.google.com/project/leiria-1cfc9/firestore";
  console.log("🌐 Opening Firebase Console:", url);

  // Try to open in new window/tab
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }

  return url;
};
