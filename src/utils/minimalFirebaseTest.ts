// Minimal Firebase test to diagnose the issue

export const testMinimalFirebase = async () => {
  const results = {
    imports: false,
    app: false,
    firestore: false,
    errors: [] as string[],
  };

  try {
    // Test 1: Can we import Firebase modules?
    console.log("📦 Testing Firebase imports...");

    const { initializeApp, getApps } = await import("firebase/app");
    console.log("✅ Firebase app module imported");

    const { getFirestore } = await import("firebase/firestore");
    console.log("✅ Firestore module imported");

    results.imports = true;

    // Test 2: Can we get existing apps?
    const existingApps = getApps();
    console.log("📱 Existing apps:", existingApps.length);

    if (existingApps.length > 0) {
      const app = existingApps[0];
      console.log("✅ Found existing app:", app.name, app.options.projectId);
      results.app = true;

      // Test 3: Can we initialize Firestore?
      try {
        console.log("🔥 Attempting Firestore initialization...");
        const db = getFirestore(app);
        console.log("✅ Firestore initialized successfully");
        console.log("📊 Firestore app:", db.app.name);
        results.firestore = true;
      } catch (firestoreError: any) {
        console.error("❌ Firestore initialization failed:", firestoreError);
        results.errors.push(`Firestore init: ${firestoreError.message}`);

        // Try alternative approach
        try {
          console.log("🔄 Trying alternative Firestore initialization...");
          const { initializeFirestore } = await import("firebase/firestore");
          const db = initializeFirestore(app, {});
          console.log("✅ Alternative Firestore initialization successful");
          results.firestore = true;
        } catch (altError: any) {
          console.error("❌ Alternative Firestore failed:", altError);
          results.errors.push(`Alt Firestore: ${altError.message}`);
        }
      }
    } else {
      console.log("❌ No existing Firebase apps found");
      results.errors.push("No existing Firebase apps");

      // Try to create a new app
      try {
        console.log("🆕 Creating new Firebase app...");
        const firebaseConfig = {
          apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
          authDomain: "leiria-1cfc9.firebaseapp.com",
          projectId: "leiria-1cfc9",
          storageBucket: "leiria-1cfc9.firebasestorage.app",
          messagingSenderId: "632599887141",
          appId: "1:632599887141:web:6027bf35a9d908b264eecc",
          measurementId: "G-51GLBMB6JQ",
        };

        const app = initializeApp(firebaseConfig);
        console.log("✅ New Firebase app created:", app.name);
        results.app = true;

        // Try Firestore with new app
        const db = getFirestore(app);
        console.log("✅ Firestore with new app successful");
        results.firestore = true;
      } catch (newAppError: any) {
        console.error("❌ New app creation failed:", newAppError);
        results.errors.push(`New app: ${newAppError.message}`);
      }
    }
  } catch (error: any) {
    console.error("❌ Critical error:", error);
    results.errors.push(`Critical: ${error.message}`);
  }

  return results;
};
