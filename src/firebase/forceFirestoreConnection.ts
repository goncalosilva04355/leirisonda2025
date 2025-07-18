/**
 * Force Firestore Connection - Specifically for iOS Safari Firestore issues
 * Since Firebase Auth works, focus only on Firestore initialization
 */

export class ForceFirestoreConnection {
  private static isConnecting = false;
  private static workingDB: any = null;

  /**
   * Force Firestore connection using multiple strategies
   */
  static async forceConnect(): Promise<{
    success: boolean;
    method?: string;
    error?: string;
  }> {
    if (this.isConnecting) {
      return { success: false, error: "Already connecting" };
    }

    this.isConnecting = true;

    try {
      console.log("🔥 FORCE FIRESTORE CONNECTION - Starting...");

      // Get existing Firebase app (since Firebase works)
      const { getApps } = await import("firebase/app");
      const apps = getApps();

      if (apps.length === 0) {
        return { success: false, error: "No Firebase apps found" };
      }

      const app = apps[0];
      console.log("✅ Using existing Firebase app:", app.name);

      // Strategy 1: Force clear Firestore cache and reconnect
      try {
        console.log("🔄 Strategy 1: Force clear Firestore cache...");

        const { clearIndexedDbPersistence, enableNetwork, disableNetwork } =
          await import("firebase/firestore");

        // Try to clear persistence
        try {
          const firestoreDb = getFirestore(app);
          await clearIndexedDbPersistence(firestoreDb);
          console.log("🗑️ Cleared Firestore persistence");
        } catch (error) {
          console.log("ℹ️ Persistence already clear or unavailable");
        }

        // Initialize with minimal settings
        const { initializeFirestore, connectFirestoreEmulator } = await import(
          "firebase/firestore"
        );

        let db;
        try {
          db = initializeFirestore(app, {
            cacheSizeBytes: -1, // Disable cache completely
            experimentalForceLongPolling: true, // Force long polling for iOS
          });
        } catch (error) {
          console.log("⚠️ initializeFirestore failed, trying getFirestore");
          const { getFirestore } = await import("firebase/firestore");
          db = getFirestore(app);
        }

        // Force enable network
        await enableNetwork(db);
        console.log("🌐 Network enabled");

        // Test connection
        const { doc, getDoc, setDoc } = await import("firebase/firestore");
        const testDoc = doc(db, "__force_test__", "connection");

        await setDoc(testDoc, {
          test: true,
          timestamp: new Date().toISOString(),
          method: "force-clear-cache",
        });

        const readResult = await getDoc(testDoc);
        if (readResult.exists()) {
          console.log(
            "✅ Strategy 1 SUCCESS: Firestore working with cache disabled",
          );
          this.workingDB = db;
          this.updateGlobalServices(app, db);
          return { success: true, method: "force-clear-cache" };
        }
      } catch (error) {
        console.warn("❌ Strategy 1 failed:", error);
      }

      // Strategy 2: Force new Firestore instance with different settings
      try {
        console.log("🔄 Strategy 2: New Firestore instance...");

        const { initializeFirestore } = await import("firebase/firestore");

        const db = initializeFirestore(
          app,
          {
            cacheSizeBytes: 1024 * 1024, // 1MB cache
            experimentalForceLongPolling: false,
            ignoreUndefinedProperties: true,
          },
          `force-firestore-${Date.now()}`,
        );

        // Test connection
        const { doc, getDoc, setDoc } = await import("firebase/firestore");
        const testDoc = doc(db, "__force_test__", "connection2");

        await setDoc(testDoc, {
          test: true,
          timestamp: new Date().toISOString(),
          method: "new-instance",
        });

        const readResult = await getDoc(testDoc);
        if (readResult.exists()) {
          console.log("✅ Strategy 2 SUCCESS: New Firestore instance working");
          this.workingDB = db;
          this.updateGlobalServices(app, db);
          return { success: true, method: "new-instance" };
        }
      } catch (error) {
        console.warn("❌ Strategy 2 failed:", error);
      }

      // Strategy 3: Basic getFirestore with network cycling
      try {
        console.log("🔄 Strategy 3: Basic Firestore with network cycling...");

        const { getFirestore, enableNetwork, disableNetwork } = await import(
          "firebase/firestore"
        );
        const db = getFirestore(app);

        // Cycle network
        await disableNetwork(db);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await enableNetwork(db);

        // Test connection
        const { doc, getDoc, setDoc } = await import("firebase/firestore");
        const testDoc = doc(db, "__force_test__", "connection3");

        await setDoc(testDoc, {
          test: true,
          timestamp: new Date().toISOString(),
          method: "network-cycle",
        });

        const readResult = await getDoc(testDoc);
        if (readResult.exists()) {
          console.log("✅ Strategy 3 SUCCESS: Network cycling worked");
          this.workingDB = db;
          this.updateGlobalServices(app, db);
          return { success: true, method: "network-cycle" };
        }
      } catch (error) {
        console.warn("❌ Strategy 3 failed:", error);
      }

      return {
        success: false,
        error: "All Firestore connection strategies failed",
      };
    } catch (error: any) {
      console.error("💥 Force Firestore connection failed:", error);
      return { success: false, error: error.message };
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Update global Firebase services with working instances
   */
  private static updateGlobalServices(app: any, db: any) {
    try {
      // Update UltimateSimpleFirebase
      import("./ultimateSimpleFirebase").then(({ UltimateSimpleFirebase }) => {
        UltimateSimpleFirebase["currentApp"] = app;
        UltimateSimpleFirebase["currentDB"] = db;
        UltimateSimpleFirebase["status"] = "ready";
        console.log("✅ Updated UltimateSimpleFirebase with working Firestore");
      });

      // Update global exports
      import("./config").then((config) => {
        // config["db"] = db; // Read-only property
        console.log("✅ Would update config.ts with working Firestore");
      });
    } catch (error) {
      console.warn("⚠️ Could not update global services:", error);
    }
  }

  /**
   * Get current working database
   */
  static getWorkingDB() {
    return this.workingDB;
  }

  /**
   * Test if Firestore is working
   */
  static async testConnection(): Promise<boolean> {
    if (!this.workingDB) {
      return false;
    }

    try {
      const { doc, getDoc } = await import("firebase/firestore");
      const testDoc = doc(this.workingDB, "__test__", "connection");
      await getDoc(testDoc);
      return true;
    } catch (error) {
      console.warn("🧪 Connection test failed:", error);
      return false;
    }
  }
}
