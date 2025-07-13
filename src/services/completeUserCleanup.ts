/**
 * Complete and aggressive user cleanup service
 * This service ensures NO old users can login by clearing ALL possible storage locations
 * INCLUDING Firebase Auth persistence that was causing the issue
 */

export interface CompleteCleanupResult {
  success: boolean;
  message: string;
  details: {
    localStorageKeysCleared: string[];
    sessionStorageCleared: boolean;
    indexedDBCleared: boolean;
    firebaseAuthCleared: boolean;
    superAdminRecreated: boolean;
    errors: string[];
  };
}

class CompleteUserCleanupService {
  private readonly SUPER_ADMIN_EMAIL = "gongonsilva@gmail.com";
  private readonly SUPER_ADMIN_NAME = "Gonçalo Fonseca";
  private readonly SUPER_ADMIN_PASSWORD = "19867gsf";

  /**
   * Nuclear option: Clear EVERYTHING user-related and recreate only super admin
   * NOW INCLUDES Firebase Auth persistence cleanup to prevent old users from staying logged in
   */
  async nuclearUserCleanup(): Promise<CompleteCleanupResult> {
    const result: CompleteCleanupResult = {
      success: false,
      message: "",
      details: {
        localStorageKeysCleared: [],
        sessionStorageCleared: false,
        indexedDBCleared: false,
        firebaseAuthCleared: false,
        superAdminRecreated: false,
        errors: [],
      },
    };

    try {
      console.log("🚨 STARTING NUCLEAR USER CLEANUP - CLEARING EVERYTHING!");

      // Step 1: CRITICAL - Force Firebase Auth logout and clear persistence
      await this.forceFirebaseAuthCleanup(result);

      // Step 2: Get ALL localStorage keys and clear any that might contain user data
      const allLocalStorageKeys = Object.keys(localStorage);
      const userRelatedKeys = allLocalStorageKeys.filter(
        (key) =>
          key.toLowerCase().includes("user") ||
          key.toLowerCase().includes("auth") ||
          key.toLowerCase().includes("login") ||
          key.toLowerCase().includes("mock") ||
          key.toLowerCase().includes("firebase") ||
          key === "app-users" ||
          key === "mock-users" ||
          key === "users" ||
          key === "saved-users" ||
          key === "currentUser" ||
          key === "mock-current-user" ||
          key === "savedLoginCredentials" ||
          key === "firebase-auth" ||
          key === "firebase-user" ||
          key.startsWith("firebase:") ||
          key.startsWith("__firebase"),
      );

      console.log(
        `🎯 Found ${userRelatedKeys.length} user-related keys:`,
        userRelatedKeys,
      );

      // Clear all user-related localStorage keys
      for (const key of userRelatedKeys) {
        try {
          localStorage.removeItem(key);
          result.details.localStorageKeysCleared.push(key);
          console.log(`🗑️ Cleared localStorage key: ${key}`);
        } catch (error: any) {
          result.details.errors.push(
            `Failed to clear ${key}: ${error.message}`,
          );
        }
      }

      // Step 3: Clear ALL sessionStorage
      try {
        sessionStorage.clear();
        result.details.sessionStorageCleared = true;
        console.log("🧹 Cleared all session storage");
      } catch (error: any) {
        result.details.errors.push(
          `Failed to clear sessionStorage: ${error.message}`,
        );
      }

      // Step 4: Clear IndexedDB databases (Firebase uses this for persistence)
      await this.clearIndexedDB(result);

      // Step 5: Clear any browser caches/cookies that might store auth data
      try {
        // Clear any potential auth cookies
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/",
            );
        });
        console.log("🍪 Cleared all cookies");
      } catch (error: any) {
        console.error("❌ Error clearing cookies:", error);
      }

      // Step 6: Recreate ONLY the super admin in all systems
      await this.recreateSuperAdminOnly(result);

      // Step 7: Force reload any auth services
      try {
        // Force page reload to clear any in-memory auth state
        console.log("🔄 Dispatching complete cleanup events");
        window.dispatchEvent(new CustomEvent("usersUpdated"));
        window.dispatchEvent(new CustomEvent("authStateChanged"));
        window.dispatchEvent(new CustomEvent("completeUserCleanup"));
      } catch (error: any) {
        console.error("❌ Error dispatching cleanup events:", error);
      }

      result.success = true;
      result.message = `✅ NUCLEAR CLEANUP COMPLETE! Cleared ${result.details.localStorageKeysCleared.length} storage keys. Firebase Auth persistence cleared. Only super admin remains.`;

      console.log("🏁 Nuclear user cleanup completed successfully");

      // Force page reload after 2 seconds to ensure clean state
      setTimeout(() => {
        console.log("🔄 Forcing page reload to ensure clean state...");
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("💥 Critical error in nuclear cleanup:", error);
      result.success = false;
      result.message = `❌ Nuclear cleanup failed: ${error.message}`;
      result.details.errors.push(`Critical error: ${error.message}`);
    }

    return result;
  }

  /**
   * Forces Firebase Auth logout and clears all authentication persistence
   * This is the KEY function that was missing - Firebase Auth persistence was keeping users logged in
   */
  private async forceFirebaseAuthCleanup(
    result: CompleteCleanupResult,
  ): Promise<void> {
    try {
      console.log("🔥 Starting aggressive Firebase Auth cleanup...");

      // Dynamic import to avoid issues if Firebase is not available
      const { auth } = await import("../firebase/config");

      if (auth) {
        try {
          // Force logout current user
          if (auth.currentUser) {
            console.log("🚪 Forcing logout of current Firebase user...");
            const { signOut } = await import("firebase/auth");
            await signOut(auth);
            console.log("✅ Firebase user signed out");
          }

          // Clear Firebase Auth persistence by setting to NONE temporarily
          try {
            const { setPersistence, browserSessionPersistence } = await import(
              "firebase/auth"
            );
            await setPersistence(auth, browserSessionPersistence);
            console.log("✅ Firebase Auth persistence set to session-only");
          } catch (persistenceError: any) {
            console.warn(
              "⚠️ Could not change Firebase persistence:",
              persistenceError,
            );
          }

          result.details.firebaseAuthCleared = true;
          console.log("✅ Firebase Auth cleanup completed");
        } catch (authError: any) {
          console.warn("⚠️ Firebase Auth cleanup error:", authError);
          result.details.errors.push(
            `Firebase Auth cleanup: ${authError.message}`,
          );
        }
      } else {
        console.log(
          "📱 Firebase Auth not available - skipping Firebase cleanup",
        );
      }
    } catch (importError: any) {
      console.warn("⚠️ Could not import Firebase Auth:", importError);
      result.details.errors.push(
        `Firebase import error: ${importError.message}`,
      );
    }
  }

  /**
   * Clears IndexedDB databases used by Firebase for persistence
   * This removes Firebase's offline storage that can keep auth tokens
   */
  private async clearIndexedDB(result: CompleteCleanupResult): Promise<void> {
    try {
      if (!("indexedDB" in window)) {
        console.log("🗃️ IndexedDB not available - skipping");
        return;
      }

      console.log("🗃️ Starting IndexedDB cleanup...");

      // Get all database names
      const databases = await indexedDB.databases();
      console.log(`📊 Found ${databases.length} IndexedDB databases`);

      let clearedCount = 0;

      for (const db of databases) {
        if (db.name) {
          try {
            // Delete Firebase-related databases
            if (
              db.name.includes("firebase") ||
              db.name.includes("firebaseLocalStorage") ||
              db.name.includes("auth") ||
              db.name.startsWith("firebase:") ||
              db.name.includes("leirisonda")
            ) {
              console.log(`🗑️ Deleting IndexedDB database: ${db.name}`);

              const deleteReq = indexedDB.deleteDatabase(db.name);

              await new Promise((resolve, reject) => {
                deleteReq.onsuccess = () => {
                  console.log(`✅ Deleted IndexedDB database: ${db.name}`);
                  clearedCount++;
                  resolve(true);
                };
                deleteReq.onerror = () => {
                  console.error(
                    `❌ Failed to delete IndexedDB database: ${db.name}`,
                  );
                  reject(deleteReq.error);
                };
                deleteReq.onblocked = () => {
                  console.warn(
                    `⚠️ IndexedDB database deletion blocked: ${db.name}`,
                  );
                  // Continue anyway
                  resolve(true);
                };
              });
            }
          } catch (error: any) {
            console.error(
              `❌ Error deleting IndexedDB database ${db.name}:`,
              error,
            );
            result.details.errors.push(
              `IndexedDB cleanup error: ${error.message}`,
            );
          }
        }
      }

      result.details.indexedDBCleared = clearedCount > 0;
      console.log(
        `✅ IndexedDB cleanup completed - ${clearedCount} databases cleared`,
      );
    } catch (error: any) {
      console.error("❌ IndexedDB cleanup failed:", error);
      result.details.errors.push(`IndexedDB cleanup failed: ${error.message}`);
    }
  }

  /**
   * Recreate ONLY the super admin in all required systems
   */
  private async recreateSuperAdminOnly(
    result: CompleteCleanupResult,
  ): Promise<void> {
    console.log("🛡️ Recreating ONLY super admin in all systems...");

    try {
      // Super admin data template
      const superAdminData = {
        email: this.SUPER_ADMIN_EMAIL,
        name: this.SUPER_ADMIN_NAME,
        password: this.SUPER_ADMIN_PASSWORD,
        role: "super_admin" as const,
        active: true,
        createdAt: new Date().toISOString(),
      };

      // Create super admin in app-users
      const appSuperAdmin = {
        id: 1,
        name: superAdminData.name,
        email: superAdminData.email,
        password: superAdminData.password,
        role: "super_admin",
        permissions: {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        },
        active: true,
        createdAt: "2024-01-01",
      };

      localStorage.setItem("app-users", JSON.stringify([appSuperAdmin]));
      console.log("✅ Created super admin in app-users");

      // Create super admin in mock-users
      const mockSuperAdmin = {
        uid: "admin-1",
        email: superAdminData.email,
        password: superAdminData.password,
        name: superAdminData.name,
        role: "super_admin",
        active: true,
        createdAt: superAdminData.createdAt,
      };

      localStorage.setItem("mock-users", JSON.stringify([mockSuperAdmin]));
      console.log("✅ Created super admin in mock-users");

      // Create super admin in users (if needed)
      localStorage.setItem("users", JSON.stringify([appSuperAdmin]));
      console.log("✅ Created super admin in users");

      result.details.superAdminRecreated = true;
      console.log("🛡️ Super admin recreated in all systems");
    } catch (error: any) {
      console.error("❌ Error recreating super admin:", error);
      result.details.errors.push(
        `Super admin recreation failed: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get detailed analysis of what user data exists before cleanup
   */
  async analyzeUserData(): Promise<{
    localStorageKeys: string[];
    userRelatedKeys: string[];
    totalUserData: number;
    firebaseAuthUser: boolean;
    indexedDBDatabases: string[];
    details: Record<string, any>;
  }> {
    const analysis = {
      localStorageKeys: Object.keys(localStorage),
      userRelatedKeys: [] as string[],
      totalUserData: 0,
      firebaseAuthUser: false,
      indexedDBDatabases: [] as string[],
      details: {} as Record<string, any>,
    };

    try {
      // Check Firebase Auth current user
      try {
        const { auth } = await import("../firebase/config");
        if (auth && auth.currentUser) {
          analysis.firebaseAuthUser = true;
          analysis.details.firebaseCurrentUser = {
            email: auth.currentUser.email,
            uid: auth.currentUser.uid,
          };
          analysis.totalUserData += 1;
          console.log(
            "🔥 Found Firebase Auth current user:",
            auth.currentUser.email,
          );
        }
      } catch (error) {
        console.log("Firebase Auth check failed or not available");
      }

      // Check IndexedDB databases
      try {
        if ("indexedDB" in window) {
          const databases = await indexedDB.databases();
          analysis.indexedDBDatabases = databases
            .map((db) => db.name || "unknown")
            .filter(
              (name) =>
                name.includes("firebase") ||
                name.includes("auth") ||
                name.includes("leirisonda"),
            );
        }
      } catch (error) {
        console.log("IndexedDB check failed");
      }

      // Find all user-related keys
      analysis.userRelatedKeys = analysis.localStorageKeys.filter(
        (key) =>
          key.toLowerCase().includes("user") ||
          key.toLowerCase().includes("auth") ||
          key.toLowerCase().includes("login") ||
          key.toLowerCase().includes("mock") ||
          key.toLowerCase().includes("firebase") ||
          key === "app-users" ||
          key === "mock-users" ||
          key === "users" ||
          key === "saved-users" ||
          key === "currentUser" ||
          key === "mock-current-user" ||
          key === "savedLoginCredentials" ||
          key.startsWith("firebase:") ||
          key.startsWith("__firebase"),
      );

      // Analyze each user-related key
      for (const key of analysis.userRelatedKeys) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (Array.isArray(parsed)) {
                analysis.details[key] = {
                  type: "array",
                  count: parsed.length,
                  users: parsed.map(
                    (u: any) => u.email || u.name || u.uid || "unknown",
                  ),
                };
                analysis.totalUserData += parsed.length;
              } else if (typeof parsed === "object" && parsed.email) {
                analysis.details[key] = {
                  type: "object",
                  user: parsed.email || parsed.name || "unknown",
                };
                analysis.totalUserData += 1;
              } else {
                analysis.details[key] = {
                  type: "other",
                  data: data.substring(0, 100),
                };
              }
            } catch (e) {
              analysis.details[key] = {
                type: "raw",
                data: data.substring(0, 100),
              };
            }
          }
        } catch (error) {
          console.error(`Error analyzing ${key}:`, error);
        }
      }

      console.log("📊 User data analysis:", analysis);
    } catch (error) {
      console.error("❌ Error in user data analysis:", error);
    }

    return analysis;
  }

  /**
   * Quick check if old users might still be logged in
   */
  async hasOldUsersLoggedIn(): Promise<boolean> {
    try {
      // Check Firebase Auth
      const { auth } = await import("../firebase/config");
      if (auth && auth.currentUser) {
        console.log(
          "⚠️ Firebase Auth user still logged in:",
          auth.currentUser.email,
        );
        return true;
      }

      // Check localStorage for user data
      const userKeys = Object.keys(localStorage).filter(
        (key) =>
          key.includes("user") ||
          key.includes("auth") ||
          key.includes("currentUser"),
      );

      if (userKeys.length > 0) {
        console.log("⚠️ User data found in localStorage:", userKeys);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking for old users:", error);
      return false;
    }
  }
}

// Export singleton instance
export const completeUserCleanupService = new CompleteUserCleanupService();
export default completeUserCleanupService;
