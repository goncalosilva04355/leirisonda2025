// User Deletion Service - Simplified without Firestore
import { deleteUser as deleteFirebaseUser } from "firebase/auth";
import {
  getAuthSafe,
  isFirebaseReady,
} from "../firebase/configWithoutFirestore";
import { mockAuthService } from "./mockAuthService";

export interface UserDeletionResult {
  success: boolean;
  message: string;
  details: {
    firebaseUsersDeleted: number;
    firestoreUsersDeleted: number;
    localStorageUsersDeleted: number;
    mockAuthUsersDeleted: number;
    errors: string[];
  };
}

/**
 * User Deletion Service - Simplified
 * Works without Firestore, only handles local and Firebase Auth
 */
class UserDeletionService {
  /**
   * Delete all users (simplified)
   */
  async deleteAllUsers(): Promise<UserDeletionResult> {
    const result: UserDeletionResult = {
      success: false,
      message: "",
      details: {
        firebaseUsersDeleted: 0,
        firestoreUsersDeleted: 0, // Always 0 since Firestore is disabled
        localStorageUsersDeleted: 0,
        mockAuthUsersDeleted: 0,
        errors: [],
      },
    };

    try {
      console.log("🗑️ Starting user deletion process (without Firestore)...");

      // 1. Delete current Firebase Auth user if available
      try {
        const auth = await getAuthSafe();
        if (auth && auth.currentUser) {
          await deleteFirebaseUser(auth.currentUser);
          result.details.firebaseUsersDeleted = 1;
          console.log("✅ Current Firebase user deleted");
        }
      } catch (authError: any) {
        console.warn("⚠️ Firebase user deletion failed:", authError);
        result.details.errors.push(`Firebase Auth: ${authError.message}`);
      }

      // 2. Clear local storage users
      try {
        const keys = [
          "app-users",
          "currentUser",
          "isAuthenticated",
          "manualLogout",
        ];
        let deletedCount = 0;

        keys.forEach((key) => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            deletedCount++;
          }
        });

        result.details.localStorageUsersDeleted = deletedCount;
        console.log(`✅ Cleared ${deletedCount} localStorage entries`);
      } catch (localError: any) {
        console.warn("⚠️ Local storage cleanup failed:", localError);
        result.details.errors.push(`Local Storage: ${localError.message}`);
      }

      // 3. Clear mock auth users
      try {
        const mockResult = await mockAuthService.deleteAllUsers();
        result.details.mockAuthUsersDeleted = mockResult.deletedCount || 0;
        console.log(
          `✅ Deleted ${result.details.mockAuthUsersDeleted} mock users`,
        );
      } catch (mockError: any) {
        console.warn("⚠️ Mock auth cleanup failed:", mockError);
        result.details.errors.push(`Mock Auth: ${mockError.message}`);
      }

      // Note: Firestore deletion skipped since service is disabled
      result.details.errors.push(
        "Firestore deletion skipped - service not available",
      );

      const totalDeleted =
        result.details.firebaseUsersDeleted +
        result.details.localStorageUsersDeleted +
        result.details.mockAuthUsersDeleted;

      if (totalDeleted > 0) {
        result.success = true;
        result.message = `Successfully deleted ${totalDeleted} users (Firebase Auth + Local + Mock)`;
      } else {
        result.success = false;
        result.message = "No users found to delete";
      }

      console.log("🗑️ User deletion process completed:", result);
      return result;
    } catch (error: any) {
      console.error("❌ User deletion failed:", error);
      result.success = false;
      result.message = `User deletion failed: ${error.message}`;
      result.details.errors.push(`General: ${error.message}`);
      return result;
    }
  }

  /**
   * Delete specific user by email (simplified)
   */
  async deleteUserByEmail(email: string): Promise<UserDeletionResult> {
    const result: UserDeletionResult = {
      success: false,
      message: "",
      details: {
        firebaseUsersDeleted: 0,
        firestoreUsersDeleted: 0,
        localStorageUsersDeleted: 0,
        mockAuthUsersDeleted: 0,
        errors: [],
      },
    };

    try {
      console.log(`🗑️ Deleting user: ${email}`);

      // Delete from mock auth
      try {
        const mockResult = await mockAuthService.deleteUser(email);
        if (mockResult.success) {
          result.details.mockAuthUsersDeleted = 1;
          console.log(`✅ Deleted ${email} from mock auth`);
        }
      } catch (mockError: any) {
        result.details.errors.push(`Mock Auth: ${mockError.message}`);
      }

      // Clear local storage if it's the current user
      try {
        const currentUserStr = localStorage.getItem("currentUser");
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.email === email) {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("isAuthenticated");
            result.details.localStorageUsersDeleted = 1;
            console.log(`✅ Cleared local storage for ${email}`);
          }
        }
      } catch (localError: any) {
        result.details.errors.push(`Local Storage: ${localError.message}`);
      }

      // Note: Firebase Auth and Firestore deletion would require additional permissions
      result.details.errors.push(
        "Firebase Auth deletion requires admin permissions",
      );
      result.details.errors.push(
        "Firestore deletion skipped - service not available",
      );

      const totalDeleted =
        result.details.mockAuthUsersDeleted +
        result.details.localStorageUsersDeleted;

      if (totalDeleted > 0) {
        result.success = true;
        result.message = `Successfully deleted user ${email} from ${totalDeleted} systems`;
      } else {
        result.success = false;
        result.message = `User ${email} not found or already deleted`;
      }

      return result;
    } catch (error: any) {
      console.error(`❌ Failed to delete user ${email}:`, error);
      result.success = false;
      result.message = `Failed to delete user ${email}: ${error.message}`;
      result.details.errors.push(`General: ${error.message}`);
      return result;
    }
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return true; // Available for local operations
  }
}

// Export singleton instance
export const userDeletionService = new UserDeletionService();
export default userDeletionService;
