/**
 * Complete and aggressive user cleanup service
 * This service ensures NO old users can login by clearing ALL possible storage locations
 */

export interface CompleteCleanupResult {
  success: boolean;
  message: string;
  details: {
    localStorageKeysCleared: string[];
    sessionStorageCleared: boolean;
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
   * Now uses emergency logout service for complete session revocation
   */
  async nuclearUserCleanup(): Promise<CompleteCleanupResult> {
    const result: CompleteCleanupResult = {
      success: false,
      message: "",
      details: {
        localStorageKeysCleared: [],
        sessionStorageCleared: false,
        superAdminRecreated: false,
        errors: [],
      },
    };

    try {
      console.log("🚨 STARTING NUCLEAR USER CLEANUP - CLEARING EVERYTHING!");

      // Step 0: Execute emergency logout to revoke ALL sessions
      try {
        const { emergencyLogoutService } = await import(
          "./emergencyLogoutService"
        );
        const emergencyResult =
          await emergencyLogoutService.forceLogoutAllUsers();

        if (emergencyResult.success) {
          console.log(
            "✅ Emergency logout completed as part of nuclear cleanup",
          );
        } else {
          console.warn(
            "⚠️ Emergency logout had issues, continuing with manual cleanup",
          );
          result.details.errors.push(...emergencyResult.details.errors);
        }
      } catch (emergencyError: any) {
        console.warn(
          "⚠️ Emergency logout failed, continuing with manual cleanup:",
          emergencyError,
        );
        result.details.errors.push(
          `Emergency logout failed: ${emergencyError.message}`,
        );
      }

      // Step 1: Get ALL localStorage keys and clear any that might contain user data
      const allLocalStorageKeys = Object.keys(localStorage);
      const userRelatedKeys = allLocalStorageKeys.filter(
        (key) =>
          key.toLowerCase().includes("user") ||
          key.toLowerCase().includes("auth") ||
          key.toLowerCase().includes("login") ||
          key.toLowerCase().includes("mock") ||
          key === "app-users" ||
          key === "mock-users" ||
          key === "users" ||
          key === "saved-users" ||
          key === "currentUser" ||
          key === "mock-current-user" ||
          key === "savedLoginCredentials" ||
          key === "firebase-auth" ||
          key === "firebase-user",
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

      // Step 2: Clear ALL sessionStorage
      try {
        sessionStorage.clear();
        result.details.sessionStorageCleared = true;
        console.log("🧹 Cleared all session storage");
      } catch (error: any) {
        result.details.errors.push(
          `Failed to clear sessionStorage: ${error.message}`,
        );
      }

      // Step 3: Clear any browser caches/cookies that might store auth data
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

      // Step 4: Recreate ONLY the super admin in all systems
      await this.recreateSuperAdminOnly(result);

      // Step 5: Force reload any auth services
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
      result.message = `✅ NUCLEAR CLEANUP COMPLETE! Cleared ${result.details.localStorageKeysCleared.length} storage keys. Only super admin remains.`;

      console.log("🏁 Nuclear user cleanup completed successfully");
    } catch (error: any) {
      console.error("💥 Critical error in nuclear cleanup:", error);
      result.success = false;
      result.message = `❌ Nuclear cleanup failed: ${error.message}`;
      result.details.errors.push(`Critical error: ${error.message}`);
    }

    return result;
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
    details: Record<string, any>;
  }> {
    const analysis = {
      localStorageKeys: Object.keys(localStorage),
      userRelatedKeys: [] as string[],
      totalUserData: 0,
      details: {} as Record<string, any>,
    };

    try {
      // Find all user-related keys
      analysis.userRelatedKeys = analysis.localStorageKeys.filter(
        (key) =>
          key.toLowerCase().includes("user") ||
          key.toLowerCase().includes("auth") ||
          key.toLowerCase().includes("login") ||
          key.toLowerCase().includes("mock") ||
          key === "app-users" ||
          key === "mock-users" ||
          key === "users" ||
          key === "saved-users" ||
          key === "currentUser" ||
          key === "mock-current-user" ||
          key === "savedLoginCredentials",
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
}

// Export singleton instance
export const completeUserCleanupService = new CompleteUserCleanupService();
export default completeUserCleanupService;
