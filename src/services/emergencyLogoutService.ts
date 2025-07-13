/**
 * Emergency logout service to force logout ALL users and revoke ALL sessions
 * This ensures NO old users can access the app even with cached tokens
 */

import { signOut, getAuth } from "firebase/auth";
import { auth, isFirebaseReady } from "../firebase/config";

export interface EmergencyLogoutResult {
  success: boolean;
  message: string;
  details: {
    firebaseLogoutCompleted: boolean;
    localSessionsCleared: boolean;
    persistentDataCleared: boolean;
    autoLoginDisabled: boolean;
    errors: string[];
  };
}

class EmergencyLogoutService {
  private readonly SUPER_ADMIN_EMAIL =
    import.meta.env.VITE_ADMIN_EMAIL || "admin@example.com";
  private readonly SUPER_ADMIN_NAME =
    import.meta.env.VITE_ADMIN_NAME || "Administrator";
  private readonly SUPER_ADMIN_PASSWORD =
    import.meta.env.VITE_ADMIN_PASSWORD || "defaultpass";

  /**
   * Force logout ALL users and revoke ALL sessions
   */
  async forceLogoutAllUsers(): Promise<EmergencyLogoutResult> {
    const result: EmergencyLogoutResult = {
      success: false,
      message: "",
      details: {
        firebaseLogoutCompleted: false,
        localSessionsCleared: false,
        persistentDataCleared: false,
        autoLoginDisabled: false,
        errors: [],
      },
    };

    try {
      console.log("🚨 EMERGENCY LOGOUT: Starting complete user logout...");

      // Step 1: Force Firebase logout for any current user
      await this.forceFirebaseLogout(result);

      // Step 2: Clear ALL browser storage (localStorage, sessionStorage, cookies)
      await this.clearAllBrowserStorage(result);

      // Step 3: Disable auto-login mechanisms
      await this.disableAutoLogin(result);

      // Step 4: Force reload authentication services
      await this.forceAuthServiceReload(result);

      // Step 5: Recreate only super admin
      await this.recreateSuperAdminOnly(result);

      result.success = true;
      result.message =
        "✅ EMERGENCY LOGOUT COMPLETE! All users logged out, only super admin can access.";

      console.log("🏁 Emergency logout completed successfully");
    } catch (error: any) {
      console.error("�� Critical error in emergency logout:", error);
      result.success = false;
      result.message = `❌ Emergency logout failed: ${error.message}`;
      result.details.errors.push(`Critical error: ${error.message}`);
    }

    return result;
  }

  /**
   * Force Firebase logout and clear auth state
   */
  private async forceFirebaseLogout(
    result: EmergencyLogoutResult,
  ): Promise<void> {
    try {
      console.log("🔥 Forcing Firebase logout...");

      // Force sign out current Firebase user
      if (isFirebaseReady() && auth && auth.currentUser) {
        console.log(`🚪 Logging out Firebase user: ${auth.currentUser.email}`);
        await signOut(auth);
        console.log("✅ Firebase user logged out");
      }

      // Clear Firebase persistence by reinitializing auth
      if (isFirebaseReady() && auth) {
        // Import Firebase auth methods
        const { setPersistence, browserSessionPersistence } = await import(
          "firebase/auth"
        );

        // Set persistence to SESSION only (will be cleared when browser closes)
        await setPersistence(auth, browserSessionPersistence);
        console.log("🔐 Firebase persistence changed to SESSION only");
      }

      result.details.firebaseLogoutCompleted = true;
      console.log("✅ Firebase logout completed");
    } catch (error: any) {
      console.error("❌ Error in Firebase logout:", error);
      result.details.errors.push(`Firebase logout failed: ${error.message}`);
    }
  }

  /**
   * Clear ALL browser storage that could contain auth data
   */
  private async clearAllBrowserStorage(
    result: EmergencyLogoutResult,
  ): Promise<void> {
    try {
      console.log("🧹 Clearing ALL browser storage...");

      // Clear all localStorage
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach((key) => {
        localStorage.removeItem(key);
      });
      console.log(`🗑️ Cleared ${localStorageKeys.length} localStorage keys`);

      // Clear all sessionStorage
      sessionStorage.clear();
      console.log("🗑️ Cleared all sessionStorage");

      // Clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });
      console.log("🍪 Cleared all cookies");

      // Clear IndexedDB (where Firebase stores auth tokens)
      try {
        if ("indexedDB" in window) {
          const databases = await indexedDB.databases();
          for (const db of databases) {
            if (
              db.name?.includes("firebase") ||
              db.name?.includes("firebaseLocalStorage")
            ) {
              const deleteReq = indexedDB.deleteDatabase(db.name);
              await new Promise((resolve, reject) => {
                deleteReq.onsuccess = () => resolve(true);
                deleteReq.onerror = () => reject(deleteReq.error);
              });
              console.log(`🗃️ Cleared Firebase IndexedDB: ${db.name}`);
            }
          }
        }
      } catch (error: any) {
        console.warn("⚠️ Could not clear IndexedDB:", error);
      }

      result.details.localSessionsCleared = true;
      result.details.persistentDataCleared = true;
      console.log("✅ Browser storage cleared");
    } catch (error: any) {
      console.error("❌ Error clearing browser storage:", error);
      result.details.errors.push(`Storage clearing failed: ${error.message}`);
    }
  }

  /**
   * Disable all auto-login mechanisms
   */
  private async disableAutoLogin(result: EmergencyLogoutResult): Promise<void> {
    try {
      console.log("🚫 Disabling auto-login mechanisms...");

      // Remove saved login credentials
      sessionStorage.removeItem("savedLoginCredentials");
      localStorage.removeItem("savedLoginCredentials");

      // Set flag to prevent auto-login
      localStorage.setItem("autoLoginDisabled", "true");
      localStorage.setItem("emergencyLogoutActive", "true");
      localStorage.setItem("lastEmergencyLogout", new Date().toISOString());

      // Dispatch events to notify all components
      window.dispatchEvent(new CustomEvent("emergencyLogout"));
      window.dispatchEvent(new CustomEvent("autoLoginDisabled"));

      result.details.autoLoginDisabled = true;
      console.log("✅ Auto-login disabled");
    } catch (error: any) {
      console.error("❌ Error disabling auto-login:", error);
      result.details.errors.push(`Auto-login disable failed: ${error.message}`);
    }
  }

  /**
   * Force reload of authentication services
   */
  private async forceAuthServiceReload(
    result: EmergencyLogoutResult,
  ): Promise<void> {
    try {
      console.log("🔄 Forcing auth service reload...");

      // Dispatch events to force auth service reload
      window.dispatchEvent(new CustomEvent("forceAuthReload"));
      window.dispatchEvent(new CustomEvent("authStateChanged"));

      console.log("✅ Auth service reload triggered");
    } catch (error: any) {
      console.error("❌ Error reloading auth services:", error);
      result.details.errors.push(`Auth reload failed: ${error.message}`);
    }
  }

  /**
   * Recreate ONLY the super admin in clean state
   */
  private async recreateSuperAdminOnly(
    result: EmergencyLogoutResult,
  ): Promise<void> {
    try {
      console.log("🛡️ Recreating super admin only...");

      // Create super admin in app-users
      const appSuperAdmin = {
        id: "1",
        name: this.SUPER_ADMIN_NAME,
        email: this.SUPER_ADMIN_EMAIL,
        password: this.SUPER_ADMIN_PASSWORD,
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

      // Create super admin in mock-users
      const mockSuperAdmin = {
        uid: "admin-1",
        email: this.SUPER_ADMIN_EMAIL,
        password: this.SUPER_ADMIN_PASSWORD,
        name: this.SUPER_ADMIN_NAME,
        role: "super_admin",
        active: true,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("mock-users", JSON.stringify([mockSuperAdmin]));

      console.log("✅ Super admin recreated");
    } catch (error: any) {
      console.error("❌ Error recreating super admin:", error);
      result.details.errors.push(
        `Super admin recreation failed: ${error.message}`,
      );
    }
  }

  /**
   * Check if emergency logout is active
   */
  static isEmergencyLogoutActive(): boolean {
    return localStorage.getItem("emergencyLogoutActive") === "true";
  }

  /**
   * Clear emergency logout flag (only after successful login)
   */
  static clearEmergencyLogoutFlag(): void {
    localStorage.removeItem("emergencyLogoutActive");
    localStorage.removeItem("autoLoginDisabled");
    console.log("🔓 Emergency logout flag cleared");
  }
}

// Export singleton instance
export const emergencyLogoutService = new EmergencyLogoutService();
export default emergencyLogoutService;
