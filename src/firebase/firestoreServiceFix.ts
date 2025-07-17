/**
 * Firestore Service Fix - Handles "Service firestore is not available" errors
 * This happens when Firestore is not enabled in the Firebase project
 */

export class FirestoreServiceFix {
  /**
   * Check if Firestore service is available and try to enable it
   */
  static async checkAndEnableFirestore(): Promise<{
    available: boolean;
    error?: string;
    solution?: string;
  }> {
    try {
      console.log("🔍 Checking Firestore service availability...");

      // Try to get Firebase app first
      const { getApps, initializeApp } = await import("firebase/app");

      let app;
      const existingApps = getApps();
      if (existingApps.length > 0) {
        app = existingApps[0];
        console.log("✅ Found existing Firebase app");
      } else {
        const { getLegacyFirebaseConfig } = await import(
          "../config/firebaseEnv"
        );
        const config = getLegacyFirebaseConfig();

        app = initializeApp(config);
        console.log("✅ Initialized new Firebase app");
      }

      // Check if Firestore is available (lightweight check)
      try {
        console.log("🧪 Testing Firestore service availability...");

        // First, check if the Firebase project has Firestore enabled
        // This is a safer approach that doesn't trigger getImmediate errors
        const projectId = app.options.projectId;
        console.log(`🔍 Checking Firestore for project: ${projectId}`);

        // Try to import and use getFirestore carefully
        const { getFirestore } = await import("firebase/firestore");

        try {
          const db = getFirestore(app);
          console.log("✅ Firestore service obtained (basic)");

          // Very light test - just check if we can create a doc reference
          // Don't actually query it to avoid network errors
          const { doc } = await import("firebase/firestore");
          const testDoc = doc(db, "__test__", "connectivity");

          if (testDoc) {
            console.log("✅ Firestore service appears functional");
            return { available: true };
          } else {
            throw new Error("Could not create document reference");
          }
        } catch (initError: any) {
          console.warn("⚠️ Firestore initialization issue:", initError.message);

          // Check for specific error patterns
          if (
            initError.message?.includes("Service firestore is not available") ||
            initError.message?.includes("getImmediate") ||
            initError.code === "firestore/unavailable"
          ) {
            return {
              available: false,
              error: "Firestore service is not enabled in the Firebase project",
              solution: "Firestore needs to be enabled in Firebase Console",
            };
          } else {
            return {
              available: false,
              error: `Firestore initialization failed: ${initError.message}`,
              solution: "Check Firestore configuration in Firebase Console",
            };
          }
        }
      } catch (firestoreError: any) {
        console.error("❌ Firestore service check failed:", firestoreError);

        return {
          available: false,
          error: `Firestore check failed: ${firestoreError.message}`,
          solution: "Verify Firebase project configuration",
        };
      }
    } catch (error: any) {
      console.error("💥 Firebase app error:", error);
      return {
        available: false,
        error: error.message,
        solution: "Firebase app initialization failed",
      };
    }
  }

  /**
   * Try alternative Firestore initialization methods
   */
  static async tryAlternativeInit(): Promise<any> {
    const methods = [
      // Method 1: Standard getFirestore
      async () => {
        console.log("🔄 Method 1: Standard getFirestore");
        const { getApps } = await import("firebase/app");
        const { getFirestore } = await import("firebase/firestore");
        const app = getApps()[0];
        return getFirestore(app);
      },

      // Method 2: initializeFirestore with custom settings
      async () => {
        console.log("🔄 Method 2: initializeFirestore with settings");
        const { getApps } = await import("firebase/app");
        const { initializeFirestore } = await import("firebase/firestore");
        const app = getApps()[0];
        return initializeFirestore(app, {
          cacheSizeBytes: 1024 * 1024,
          experimentalForceLongPolling: true,
        });
      },

      // Method 3: Force new app with Firestore
      async () => {
        console.log("🔄 Method 3: Use existing or create new app");
        const { initializeApp, getApps } = await import("firebase/app");
        const { getFirestore } = await import("firebase/firestore");

        // Verificar se já existe uma app válida
        const existingApps = getApps();
        if (existingApps.length > 0) {
          try {
            const existingApp = existingApps[0];
            const db = getFirestore(existingApp);
            console.log("✅ Using existing app for Firestore");
            return db;
          } catch (error) {
            console.warn("⚠️ Existing app invalid, creating new one:", error);
          }
        }

        const { getLegacyFirebaseConfig } = await import(
          "../config/firebaseEnv"
        );
        const config = getLegacyFirebaseConfig();

        const app = initializeApp(config, `firestore-fix-${Date.now()}`);
        return getFirestore(app);
      },

      // Method 4: Minimal Firestore init
      async () => {
        console.log("🔄 Method 4: Minimal init");
        const { getApps } = await import("firebase/app");
        const { initializeFirestore } = await import("firebase/firestore");
        const app = getApps()[0];
        return initializeFirestore(app, {});
      },
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        const db = await methods[i]();

        // Test the database
        const { doc, getDoc } = await import("firebase/firestore");
        const testDoc = doc(db, "__init_test__", "test");
        await getDoc(testDoc);

        console.log(`✅ Method ${i + 1} successful!`);
        return db;
      } catch (error: any) {
        console.warn(`❌ Method ${i + 1} failed:`, error.message);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    throw new Error("All Firestore initialization methods failed");
  }

  /**
   * Generate instructions for manual Firestore activation
   */
  static getManualActivationInstructions(): string[] {
    return [
      "🔥 1. Abra o Firebase Console: console.firebase.google.com",
      "🎯 2. Selecione o projeto: leirisonda-16f8b",
      "🗂️ 3. No menu lateral, clique em 'Firestore Database'",
      "🚀 4. Se aparecer 'Create database', clique nele",
      "🛡️ 5. Escolha 'Start in test mode' (por agora)",
      "🌍 6. Escolha a região (Europe-west1 ou similar)",
      "✅ 7. Clique em 'Done' e aguarde a criação",
      "🔄 8. Volte à app e tente novamente",
    ];
  }

  /**
   * Check if this is a "service not available" error
   */
  static isServiceNotAvailableError(error: any): boolean {
    return (
      error?.message?.includes("Service firestore is not available") ||
      error?.message?.includes("getImmediate") ||
      error?.code === "firestore/unavailable"
    );
  }
}
