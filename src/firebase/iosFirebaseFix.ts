/**
 * iOS Firebase Fix - Aggressive solution for Safari/iOS Firestore issues
 * Clears all caches, forces reinitialization, and uses iOS-optimized settings
 */

export class IOSFirebaseFix {
  private static isFixing = false;
  private static fixAttempts = 0;

  /**
   * Force clear all Firebase caches and reinitialize
   */
  static async forceFirebaseClear(): Promise<boolean> {
    if (this.isFixing) {
      console.log("🔄 iOS fix already in progress");
      return false;
    }

    this.isFixing = true;
    this.fixAttempts++;

    try {
      console.log(`🍎 iOS FIREBASE FIX - Attempt ${this.fixAttempts}`);
      console.log("🧹 Clearing all Firebase caches and services...");

      // Step 1: Clear all localStorage Firebase data
      const firebaseKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("firebase") || key.includes("firestore"))) {
          firebaseKeys.push(key);
        }
      }

      firebaseKeys.forEach((key) => {
        try {
          localStorage.removeItem(key);
          console.log(`🗑️ Cleared localStorage: ${key}`);
        } catch (error) {
          console.warn(`⚠️ Could not clear ${key}:`, error);
        }
      });

      // Step 2: Clear sessionStorage
      try {
        sessionStorage.clear();
        console.log("🗑️ Cleared sessionStorage");
      } catch (error) {
        console.warn("⚠️ Could not clear sessionStorage:", error);
      }

      // Step 3: Check existing Firebase apps (don't delete)
      try {
        const { getApps } = await import("firebase/app");
        const apps = getApps();

        if (apps.length > 0) {
          console.log(
            `✅ Found ${apps.length} existing Firebase apps, will reuse them`,
          );
        }
      } catch (error) {
        console.warn("⚠️ Could not check Firebase apps:", error);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 5: Fresh initialization with iOS-specific settings
      console.log("🍎 Initializing Firebase with iOS-optimized settings...");

      const { initializeApp } = await import("firebase/app");
      const {
        initializeFirestore,
        connectFirestoreEmulator,
        enableNetwork,
        clearIndexedDbPersistence,
      } = await import("firebase/firestore");
      const { getAuth, connectAuthEmulator } = await import("firebase/auth");

      const config = {
        apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
        authDomain: "leirisonda-16f8b.firebaseapp.com",
        projectId: "leirisonda-16f8b",
        storageBucket: "leirisonda-16f8b.firebasestorage.app",
        messagingSenderId: "540456875574",
        appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
        measurementId: "G-R9W43EHH2C",
      };

      // Create fresh app with unique name
      const app = initializeApp(config, `ios-fix-${Date.now()}`);
      console.log("✅ Firebase app created");

      // Try to clear IndexedDB cache first
      try {
        await clearIndexedDbPersistence(app);
        console.log("🗑️ Cleared IndexedDB persistence");
      } catch (error) {
        console.log("ℹ️ IndexedDB already clear or unavailable");
      }

      // Initialize Firestore with iOS-optimized settings
      let db;
      try {
        db = initializeFirestore(app, {
          cacheSizeBytes: 1024 * 1024, // 1MB cache - small for iOS
          experimentalForceLongPolling: true, // Better for iOS/Safari
          ignoreUndefinedProperties: true,
        });
        console.log("✅ Firestore initialized with iOS settings");
      } catch (error) {
        console.warn("⚠️ Custom Firestore init failed, trying basic:", error);
        const { getFirestore } = await import("firebase/firestore");
        db = getFirestore(app);
      }

      // Initialize Auth
      const auth = getAuth(app);
      console.log("✅ Auth initialized");

      // Enable network explicitly
      try {
        await enableNetwork(db);
        console.log("✅ Firestore network enabled");
      } catch (error) {
        console.warn("⚠️ Could not explicitly enable network:", error);
      }

      // Test connectivity
      console.log("🧪 Testing Firestore connectivity...");
      const { doc, getDoc, setDoc } = await import("firebase/firestore");

      const testDoc = doc(db, "__ios_test__", "connectivity");

      // Try to write
      await setDoc(testDoc, {
        test: true,
        timestamp: new Date().toISOString(),
        platform: "iOS Safari",
        attempt: this.fixAttempts,
      });
      console.log("✅ Firestore WRITE test successful");

      // Try to read
      const readResult = await getDoc(testDoc);
      if (readResult.exists()) {
        console.log("✅ Firestore READ test successful");
      } else {
        throw new Error("Read test failed - document not found");
      }

      // Update UltimateSimpleFirebase with new services
      try {
        const { UltimateSimpleFirebase } = await import(
          "./ultimateSimpleFirebase"
        );
        UltimateSimpleFirebase["currentApp"] = app;
        UltimateSimpleFirebase["currentDB"] = db;
        UltimateSimpleFirebase["currentAuth"] = auth;
        UltimateSimpleFirebase["status"] = "ready";
        console.log("✅ Updated UltimateSimpleFirebase services");
      } catch (error) {
        console.warn("⚠️ Could not update UltimateSimpleFirebase:", error);
      }

      console.log("🎉 iOS FIREBASE FIX SUCCESSFUL!");
      return true;
    } catch (error: any) {
      console.error("❌ iOS Firebase fix failed:", error);
      console.error("Error details:", error.message);
      return false;
    } finally {
      this.isFixing = false;
    }
  }

  /**
   * Get fix status
   */
  static getStatus() {
    return {
      isFixing: this.isFixing,
      attempts: this.fixAttempts,
    };
  }

  /**
   * Reset attempts counter
   */
  static resetAttempts() {
    this.fixAttempts = 0;
  }
}
