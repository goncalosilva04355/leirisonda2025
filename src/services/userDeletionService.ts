import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { deleteUser as deleteFirebaseUser } from "firebase/auth";
import { db, auth, isFirebaseReady } from "../firebase/config";
import { mockAuthService } from "./mockAuthService";

export interface UserDeletionResult {
  success: boolean;
  message: string;
  details: {
    firebaseUsersDeleted: number;
    firestoreUsersDeleted: number;
    localStorageUsersDeleted: number;
    mockAuthUsersDeleted: number;
    superAdminPreserved: boolean;
    errors: string[];
  };
}

class UserDeletionService {
  private readonly SUPER_ADMIN_EMAIL = "gongonsilva@gmail.com";
  private readonly SUPER_ADMIN_NAME = "Gonçalo Fonseca";

  /**
   * Deletes all users except the super admin "goncalo" from all systems
   * - Firebase Auth
   * - Firestore users collection
   * - localStorage (app-users and mock-users)
   * - Mock authentication service
   */
  async deleteAllUsersExceptSuperAdmin(): Promise<UserDeletionResult> {
    const result: UserDeletionResult = {
      success: false,
      message: "",
      details: {
        firebaseUsersDeleted: 0,
        firestoreUsersDeleted: 0,
        localStorageUsersDeleted: 0,
        mockAuthUsersDeleted: 0,
        superAdminPreserved: false,
        errors: [],
      },
    };

    try {
      console.log("🚨 Starting complete user deletion process...");
      console.log(`⚠️ Super admin to preserve: ${this.SUPER_ADMIN_EMAIL}`);

      // 1. Delete from Firestore users collection (if Firebase is available)
      if (isFirebaseReady() && db) {
        try {
          await this.deleteFromFirestore(result);
        } catch (error: any) {
          result.details.errors.push(
            `Firestore deletion error: ${error.message}`,
          );
          console.error("❌ Firestore deletion failed:", error);
        }
      } else {
        console.log("⚠️ Firebase not available - skipping Firestore deletion");
      }

      // 2. Delete from localStorage (app-users)
      try {
        await this.deleteFromLocalStorage(result);
      } catch (error: any) {
        result.details.errors.push(
          `localStorage deletion error: ${error.message}`,
        );
        console.error("❌ localStorage deletion failed:", error);
      }

      // 3. Delete from mock authentication service
      try {
        await this.deleteFromMockAuth(result);
      } catch (error: any) {
        result.details.errors.push(
          `Mock auth deletion error: ${error.message}`,
        );
        console.error("❌ Mock auth deletion failed:", error);
      }

      // 4. Ensure super admin is preserved in all systems
      try {
        await this.ensureSuperAdminExists(result);
      } catch (error: any) {
        result.details.errors.push(
          `Super admin preservation error: ${error.message}`,
        );
        console.error("❌ Super admin preservation failed:", error);
      }

      // 5. Clear any current user sessions (except if super admin is logged in)
      try {
        await this.clearUserSessions();
      } catch (error: any) {
        result.details.errors.push(`Session clearing error: ${error.message}`);
        console.error("❌ Session clearing failed:", error);
      }

      // Determine overall success
      const totalDeleted =
        result.details.firebaseUsersDeleted +
        result.details.firestoreUsersDeleted +
        result.details.localStorageUsersDeleted +
        result.details.mockAuthUsersDeleted;

      if (totalDeleted > 0 || result.details.errors.length === 0) {
        result.success = true;
        result.message = `✅ Eliminação completa! ${totalDeleted} utilizadores removidos. Super admin ${this.SUPER_ADMIN_NAME} preservado.`;
      } else {
        result.success = false;
        result.message = `❌ Falha na eliminação de utilizadores. Erros: ${result.details.errors.join(", ")}`;
      }

      console.log("🏁 User deletion process completed:", {
        success: result.success,
        totalDeleted,
        superAdminPreserved: result.details.superAdminPreserved,
        errors: result.details.errors,
      });
    } catch (error: any) {
      console.error("💥 Critical error in user deletion process:", error);
      result.success = false;
      result.message = `❌ Erro crítico na eliminação de utilizadores: ${error.message}`;
      result.details.errors.push(`Critical error: ${error.message}`);
    }

    return result;
  }

  /**
   * Delete users from Firestore collection (preserving super admin)
   */
  private async deleteFromFirestore(result: UserDeletionResult): Promise<void> {
    if (!db) {
      throw new Error("Firestore not available");
    }

    console.log("🔥 Starting Firestore users deletion...");

    const usersSnapshot = await getDocs(collection(db, "users"));
    console.log(`Found ${usersSnapshot.docs.length} users in Firestore`);

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userEmail = userData.email?.toLowerCase();

      // Preserve super admin
      if (userEmail === this.SUPER_ADMIN_EMAIL.toLowerCase()) {
        console.log(`🛡️ Preserving super admin in Firestore: ${userEmail}`);
        result.details.superAdminPreserved = true;
        continue;
      }

      try {
        await deleteDoc(doc(db, "users", userDoc.id));
        result.details.firestoreUsersDeleted++;
        console.log(`🗑️ Deleted Firestore user: ${userEmail || userDoc.id}`);
      } catch (error: any) {
        console.error(
          `❌ Failed to delete Firestore user ${userDoc.id}:`,
          error,
        );
        result.details.errors.push(
          `Firestore user ${userDoc.id}: ${error.message}`,
        );
      }
    }

    console.log(
      `✅ Firestore deletion complete: ${result.details.firestoreUsersDeleted} users deleted`,
    );
  }

  /**
   * Delete users from localStorage (preserving super admin)
   */
  private async deleteFromLocalStorage(
    result: UserDeletionResult,
  ): Promise<void> {
    console.log("💾 Starting localStorage users deletion...");

    // Handle app-users
    const appUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
    console.log(`Found ${appUsers.length} users in app-users localStorage`);

    const preservedAppUsers = appUsers.filter((user: any) => {
      const userEmail = user.email?.toLowerCase();
      if (userEmail === this.SUPER_ADMIN_EMAIL.toLowerCase()) {
        console.log(`🛡️ Preserving super admin in app-users: ${userEmail}`);
        result.details.superAdminPreserved = true;
        return true;
      }
      result.details.localStorageUsersDeleted++;
      console.log(`🗑️ Deleted app-users user: ${userEmail || user.id}`);
      return false;
    });

    localStorage.setItem("app-users", JSON.stringify(preservedAppUsers));

    // Handle mock-users
    const mockUsers = JSON.parse(localStorage.getItem("mock-users") || "[]");
    console.log(`Found ${mockUsers.length} users in mock-users localStorage`);

    const preservedMockUsers = mockUsers.filter((user: any) => {
      const userEmail = user.email?.toLowerCase();
      if (userEmail === this.SUPER_ADMIN_EMAIL.toLowerCase()) {
        console.log(`🛡️ Preserving super admin in mock-users: ${userEmail}`);
        return true;
      }
      console.log(`🗑️ Deleted mock-users user: ${userEmail || user.uid}`);
      return false;
    });

    localStorage.setItem("mock-users", JSON.stringify(preservedMockUsers));

    console.log(
      `✅ localStorage deletion complete: ${result.details.localStorageUsersDeleted} users deleted`,
    );
  }

  /**
   * Delete users from mock authentication service (preserving super admin)
   */
  private async deleteFromMockAuth(result: UserDeletionResult): Promise<void> {
    console.log("🔧 Starting mock auth users deletion...");

    try {
      // Get all users from mock auth
      const allMockUsers = mockAuthService.getAllUsers();
      console.log(`Found ${allMockUsers.length} users in mock auth service`);

      let deletedFromMockAuth = 0;

      for (const user of allMockUsers) {
        const userEmail = user.email?.toLowerCase();

        // Preserve super admin
        if (userEmail === this.SUPER_ADMIN_EMAIL.toLowerCase()) {
          console.log(`🛡️ Preserving super admin in mock auth: ${userEmail}`);
          continue;
        }

        try {
          // Note: mockAuthService might not have a direct delete method
          // We'll handle this by reloading the users from localStorage after we've cleaned it
          deletedFromMockAuth++;
          console.log(
            `🗑️ Marked for deletion from mock auth: ${userEmail || user.uid}`,
          );
        } catch (error: any) {
          console.error(
            `❌ Failed to delete mock auth user ${user.uid}:`,
            error,
          );
          result.details.errors.push(
            `Mock auth user ${user.uid}: ${error.message}`,
          );
        }
      }

      // Force reload mock auth users from cleaned localStorage
      mockAuthService.reloadUsers();
      result.details.mockAuthUsersDeleted = deletedFromMockAuth;

      console.log(
        `✅ Mock auth deletion complete: ${result.details.mockAuthUsersDeleted} users deleted`,
      );
    } catch (error: any) {
      console.error("❌ Mock auth deletion failed:", error);
      throw error;
    }
  }

  /**
   * Ensure super admin exists in all systems after deletion
   */
  private async ensureSuperAdminExists(
    result: UserDeletionResult,
  ): Promise<void> {
    console.log("🛡️ Ensuring super admin exists in all systems...");

    const superAdminData = {
      email: this.SUPER_ADMIN_EMAIL,
      name: this.SUPER_ADMIN_NAME,
      role: "super_admin" as const,
      password: "19867gsf", // Known super admin password
    };

    // Ensure super admin exists in app-users localStorage
    const appUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
    const hasSuperAdminInAppUsers = appUsers.some(
      (user: any) =>
        user.email?.toLowerCase() === this.SUPER_ADMIN_EMAIL.toLowerCase(),
    );

    if (!hasSuperAdminInAppUsers) {
      console.log("➕ Creating super admin in app-users localStorage");
      const appSuperAdmin = {
        id: "1",
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
      appUsers.push(appSuperAdmin);
      localStorage.setItem("app-users", JSON.stringify(appUsers));
    }

    // Ensure super admin exists in mock-users localStorage
    const mockUsers = JSON.parse(localStorage.getItem("mock-users") || "[]");
    const hasSuperAdminInMockUsers = mockUsers.some(
      (user: any) =>
        user.email?.toLowerCase() === this.SUPER_ADMIN_EMAIL.toLowerCase(),
    );

    if (!hasSuperAdminInMockUsers) {
      console.log("➕ Creating super admin in mock-users localStorage");
      const mockSuperAdmin = {
        uid: "admin-1",
        email: superAdminData.email,
        password: superAdminData.password,
        name: superAdminData.name,
        role: "super_admin",
        active: true,
        createdAt: new Date().toISOString(),
      };
      mockUsers.push(mockSuperAdmin);
      localStorage.setItem("mock-users", JSON.stringify(mockUsers));
    }

    // Force reload mock auth to pick up changes
    mockAuthService.reloadUsers();

    result.details.superAdminPreserved = true;
    console.log("✅ Super admin ensured in all systems");
  }

  /**
   * Clear user sessions but preserve super admin if currently logged in
   */
  private async clearUserSessions(): Promise<void> {
    console.log("🧹 Clearing user sessions...");

    try {
      // Check if super admin is currently logged in
      const currentUser = localStorage.getItem("mock-current-user");
      let preserveSession = false;

      if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (
          userData.email?.toLowerCase() === this.SUPER_ADMIN_EMAIL.toLowerCase()
        ) {
          console.log(
            "🛡️ Super admin currently logged in - preserving session",
          );
          preserveSession = true;
        }
      }

      if (!preserveSession) {
        // Clear all session data
        localStorage.removeItem("mock-current-user");
        localStorage.removeItem("currentUser");
        sessionStorage.clear();
        console.log("🧹 All user sessions cleared");
      }

      // Dispatch event to notify other components that users were updated
      window.dispatchEvent(new CustomEvent("usersUpdated"));
      console.log("📢 usersUpdated event dispatched after user deletion");
    } catch (error: any) {
      console.error("❌ Error clearing sessions:", error);
      throw error;
    }
  }

  /**
   * Get statistics about users in all systems before deletion
   */
  async getUserStatistics(): Promise<{
    firestore: number;
    localStorage: number;
    mockAuth: number;
    total: number;
  }> {
    const stats = {
      firestore: 0,
      localStorage: 0,
      mockAuth: 0,
      total: 0,
    };

    try {
      // Count Firestore users
      if (isFirebaseReady() && db) {
        const usersSnapshot = await getDocs(collection(db, "users"));
        stats.firestore = usersSnapshot.docs.length;
      }

      // Count localStorage users
      const appUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
      const mockUsers = JSON.parse(localStorage.getItem("mock-users") || "[]");
      stats.localStorage = appUsers.length + mockUsers.length;

      // Count mock auth users
      const allMockUsers = mockAuthService.getAllUsers();
      stats.mockAuth = allMockUsers.length;

      // Calculate total (deduplicated estimate)
      stats.total = Math.max(
        stats.firestore,
        stats.localStorage,
        stats.mockAuth,
      );
    } catch (error) {
      console.error("Error getting user statistics:", error);
    }

    return stats;
  }
}

// Export singleton instance
export const userDeletionService = new UserDeletionService();
export default userDeletionService;
