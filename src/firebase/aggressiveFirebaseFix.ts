/**
 * Aggressive Firebase Fix - Specifically for iOS/Safari issues
 * This module tries multiple strategies to get Firestore working
 */

interface FirebaseFixResult {
  success: boolean;
  method: string;
  error?: string;
  db?: any;
  auth?: any;
}

export class AggressiveFirebaseFix {
  private static fixAttempts = 0;
  private static maxAttempts = 10;
  private static currentApp: any = null;
  private static currentDB: any = null;
  private static currentAuth: any = null;

  // Firebase config optimized for iOS/Safari
  private static config = {
    apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
    authDomain: "leirisonda-16f8b.firebaseapp.com",
    projectId: "leirisonda-16f8b",
    storageBucket: "leirisonda-16f8b.firebasestorage.app",
    messagingSenderId: "540456875574",
    appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
    measurementId: "G-R9W43EHH2C",
  };

  /**
   * Method 1: Clean slate initialization
   */
  private static async tryCleanInit(): Promise<FirebaseFixResult> {
    try {
      console.log("🔧 Fix Method 1: Clean initialization");

      // Delete all existing apps first
      const { getApps, deleteApp } = await import("firebase/app");
      const existingApps = getApps();

      for (const app of existingApps) {
        try {
          await deleteApp(app);
          console.log("🗑️ Deleted existing Firebase app");
        } catch (error) {
          console.warn("⚠️ Could not delete app:", error);
        }
      }

      // Wait for cleanup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Fresh initialization
      const { initializeApp } = await import("firebase/app");
      const { getFirestore } = await import("firebase/firestore");
      const { getAuth } = await import("firebase/auth");

      const app = initializeApp(this.config, `firebase-app-${Date.now()}`);
      const db = getFirestore(app);
      const auth = getAuth(app);

      // Test database
      const { collection, getDocs } = await import("firebase/firestore");
      const testCol = collection(db, "__test__");
      await getDocs(testCol);

      this.currentApp = app;
      this.currentDB = db;
      this.currentAuth = auth;

      return { success: true, method: "clean-init", db, auth };
    } catch (error: any) {
      console.warn("❌ Clean init failed:", error.message);
      return { success: false, method: "clean-init", error: error.message };
    }
  }

  /**
   * Method 2: Force Firestore with specific settings for iOS
   */
  private static async tryIOSOptimizedInit(): Promise<FirebaseFixResult> {
    try {
      console.log("🔧 Fix Method 2: iOS-optimized initialization");

      const { initializeApp, getApps } = await import("firebase/app");
      const { getFirestore, initializeFirestore, connectFirestoreEmulator } =
        await import("firebase/firestore");
      const { getAuth } = await import("firebase/auth");

      let app;
      const existingApps = getApps();
      if (existingApps.length > 0) {
        app = existingApps[0];
      } else {
        app = initializeApp(this.config);
      }

      // Try initializeFirestore with iOS-specific settings
      let db;
      try {
        db = initializeFirestore(app, {
          experimentalForceLongPolling: true, // Better for iOS
          cacheSizeBytes: 1048576, // 1MB cache - small for iOS
        });
      } catch (error) {
        console.log("Using getFirestore fallback");
        db = getFirestore(app);
      }

      const auth = getAuth(app);

      // Test database
      const { collection, getDocs } = await import("firebase/firestore");
      const testCol = collection(db, "__test__");
      await getDocs(testCol);

      this.currentApp = app;
      this.currentDB = db;
      this.currentAuth = auth;

      return { success: true, method: "ios-optimized", db, auth };
    } catch (error: any) {
      console.warn("❌ iOS optimized init failed:", error.message);
      return { success: false, method: "ios-optimized", error: error.message };
    }
  }

  /**
   * Method 3: Minimal Firestore setup
   */
  private static async tryMinimalInit(): Promise<FirebaseFixResult> {
    try {
      console.log("🔧 Fix Method 3: Minimal initialization");

      const { initializeApp, getApps } = await import("firebase/app");
      const { getFirestore } = await import("firebase/firestore");
      const { getAuth } = await import("firebase/auth");

      let app;
      const existingApps = getApps();
      if (existingApps.length > 0) {
        app = existingApps[0];
      } else {
        app = initializeApp(this.config);
      }

      // Very basic Firestore initialization
      const db = getFirestore(app);
      const auth = getAuth(app);

      // Simple test
      const { doc, getDoc } = await import("firebase/firestore");
      const testDoc = doc(db, "__test__", "connectivity");
      await getDoc(testDoc); // This should not fail even if doc doesn't exist

      this.currentApp = app;
      this.currentDB = db;
      this.currentAuth = auth;

      return { success: true, method: "minimal", db, auth };
    } catch (error: any) {
      console.warn("❌ Minimal init failed:", error.message);
      return { success: false, method: "minimal", error: error.message };
    }
  }

  /**
   * Method 4: Retry with different cache settings
   */
  private static async tryAlternativeCache(): Promise<FirebaseFixResult> {
    try {
      console.log("🔧 Fix Method 4: Alternative cache settings");

      const { initializeApp, getApps } = await import("firebase/app");
      const { initializeFirestore } = await import("firebase/firestore");
      const { getAuth } = await import("firebase/auth");

      let app;
      const existingApps = getApps();
      if (existingApps.length > 0) {
        app = existingApps[0];
      } else {
        app = initializeApp(this.config);
      }

      // Try with different cache settings
      const db = initializeFirestore(app, {
        cacheSizeBytes: -1, // Disable cache
        experimentalForceLongPolling: false,
      });

      const auth = getAuth(app);

      // Test with enableNetwork
      const { enableNetwork, doc, getDoc } = await import("firebase/firestore");
      await enableNetwork(db);

      const testDoc = doc(db, "__test__", "connectivity");
      await getDoc(testDoc);

      this.currentApp = app;
      this.currentDB = db;
      this.currentAuth = auth;

      return { success: true, method: "alternative-cache", db, auth };
    } catch (error: any) {
      console.warn("❌ Alternative cache init failed:", error.message);
      return {
        success: false,
        method: "alternative-cache",
        error: error.message,
      };
    }
  }

  /**
   * Main fix method - tries all strategies
   */
  static async fixFirestore(): Promise<FirebaseFixResult> {
    if (this.fixAttempts >= this.maxAttempts) {
      console.log("🛑 Max fix attempts reached, stopping");
      return {
        success: false,
        method: "max-attempts",
        error: "Too many attempts",
      };
    }

    this.fixAttempts++;
    console.log(
      `🔧 AGGRESSIVE FIREBASE FIX - Attempt ${this.fixAttempts}/${this.maxAttempts}`,
    );

    const methods = [
      this.tryCleanInit.bind(this),
      this.tryIOSOptimizedInit.bind(this),
      this.tryMinimalInit.bind(this),
      this.tryAlternativeCache.bind(this),
    ];

    for (const method of methods) {
      try {
        console.log(`⏳ Trying fix method...`);
        const result = await method();

        if (result.success) {
          console.log(`✅ SUCCESS: Firebase fixed using ${result.method}`);
          return result;
        } else {
          console.log(`❌ Method ${result.method} failed: ${result.error}`);
          // Wait before trying next method
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error: any) {
        console.error(`💥 Method crashed:`, error.message);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log("❌ All fix methods failed");
    return {
      success: false,
      method: "all-failed",
      error: "All methods exhausted",
    };
  }

  /**
   * Get current working services
   */
  static getCurrentServices() {
    return {
      app: this.currentApp,
      db: this.currentDB,
      auth: this.currentAuth,
      isReady: !!(this.currentDB && this.currentAuth),
    };
  }

  /**
   * Reset fix attempts counter
   */
  static resetAttempts() {
    this.fixAttempts = 0;
    console.log("🔄 Fix attempts counter reset");
  }

  /**
   * Test current database connectivity
   */
  static async testCurrentDB(): Promise<boolean> {
    if (!this.currentDB) {
      return false;
    }

    try {
      const { doc, getDoc } = await import("firebase/firestore");
      const testDoc = doc(this.currentDB, "__test__", "connectivity");
      await getDoc(testDoc);
      return true;
    } catch (error) {
      console.warn("🧪 Database test failed:", error);
      return false;
    }
  }
}
