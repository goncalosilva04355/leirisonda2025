/**
 * User Data Isolation Service - Disabled
 * Firestore is not available, so user data isolation is disabled
 */

export interface UserDataAccess {
  hasAccess: boolean;
  reason: string;
  allowedOperations: string[];
}

export interface DataIsolationResult {
  success: boolean;
  message: string;
  errors: string[];
}

/**
 * User Data Isolation Service - Disabled
 * Since Firestore is not available, all data operations are local only
 */
class UserDataIsolationService {
  /**
   * Check user access (disabled)
   */
  async checkUserAccess(
    userId: string,
    dataType: string,
    dataId: string,
  ): Promise<UserDataAccess> {
    console.log("🚫 User data isolation disabled - Firestore not available");

    return {
      hasAccess: true, // Allow local access since no cross-user data sharing
      reason: "Local storage only - no cross-user access control needed",
      allowedOperations: ["read", "write", "delete"],
    };
  }

  /**
   * Isolate user data (disabled)
   */
  async isolateUserData(userId: string): Promise<DataIsolationResult> {
    console.log("🚫 Data isolation disabled - Firestore not available");

    return {
      success: false,
      message: "Data isolation disabled - Firestore not available",
      errors: ["Firestore service not enabled"],
    };
  }

  /**
   * Setup user data access (disabled)
   */
  async setupUserDataAccess(userId: string): Promise<DataIsolationResult> {
    console.log("🚫 User data access setup disabled - Firestore not available");

    return {
      success: false,
      message: "User data access setup disabled - Firestore not available",
      errors: ["Firestore service not enabled"],
    };
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return false;
  }
}

// Export singleton instance
export const userDataIsolation = new UserDataIsolationService();
export default userDataIsolation;
