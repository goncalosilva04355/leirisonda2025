// Data Cleanup Service - Simplified without Firestore

export interface CleanupResult {
  success: boolean;
  message: string;
  itemsDeleted: number;
  errors: string[];
}

export interface CleanupStats {
  totalItems: number;
  lastCleanup: Date | null;
  storageUsed: number;
  cleanupNeeded: boolean;
  duplicatesFound: number;
}

/**
 * Data Cleanup Service - Simplified
 * Works only with local storage since Firestore is disabled
 */
class DataCleanupService {
  /**
   * Clean all data
   */
  async cleanAllData(): Promise<CleanupResult> {
    console.log("🧹 Starting data cleanup (local only)...");

    try {
      let itemsDeleted = 0;
      const errors: string[] = [];

      // Clean local storage data
      const keysToClean = ["works", "pools", "maintenance", "clients"];

      keysToClean.forEach((key) => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const items = JSON.parse(data);
            if (Array.isArray(items)) {
              // Keep only recent items (example cleanup logic)
              const cleaned = items.filter(
                (item) =>
                  item.createdAt &&
                  new Date(item.createdAt) >
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              );

              const deletedCount = items.length - cleaned.length;
              if (deletedCount > 0) {
                localStorage.setItem(key, JSON.stringify(cleaned));
                itemsDeleted += deletedCount;
                console.log(`🧹 Cleaned ${deletedCount} old items from ${key}`);
              }
            }
          }
        } catch (error: any) {
          errors.push(`Error cleaning ${key}: ${error.message}`);
        }
      });

      return {
        success: true,
        message: `Cleanup completed - removed ${itemsDeleted} old items`,
        itemsDeleted,
        errors,
      };
    } catch (error: any) {
      console.error("❌ Cleanup failed:", error);
      return {
        success: false,
        message: `Cleanup failed: ${error.message}`,
        itemsDeleted: 0,
        errors: [error.message],
      };
    }
  }

  /**
   * Clear device memory
   */
  async clearDeviceMemory(): Promise<CleanupResult> {
    console.log("🧹 Clearing device memory...");

    try {
      let itemsDeleted = 0;

      // Clear temporary data
      const tempKeys = ["lastSync", "tempData", "cache"];
      tempKeys.forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          itemsDeleted++;
        }
      });

      // Clear session storage
      const sessionKeysCount = sessionStorage.length;
      sessionStorage.clear();
      itemsDeleted += sessionKeysCount;

      return {
        success: true,
        message: `Device memory cleared - removed ${itemsDeleted} items`,
        itemsDeleted,
        errors: [],
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Memory clear failed: ${error.message}`,
        itemsDeleted: 0,
        errors: [error.message],
      };
    }
  }

  /**
   * Initialize clean application
   */
  async initializeCleanApplication(): Promise<void> {
    console.log("🚀 Initializing clean application...");

    try {
      // Ensure essential data structure exists
      const essentialKeys = [
        "app-users",
        "pools",
        "works",
        "maintenance",
        "clients",
      ];

      essentialKeys.forEach((key) => {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify([]));
        }
      });

      // Ensure admin user exists
      const users = JSON.parse(localStorage.getItem("app-users") || "[]");
      const adminExists = users.some(
        (user: any) => user.email === "gongonsilva@gmail.com",
      );

      if (!adminExists) {
        const adminUser = {
          id: 1,
          name: "Gonçalo Fonseca",
          email: "gongonsilva@gmail.com",
          password: "19867gsf",
          role: "super_admin",
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        users.push(adminUser);
        localStorage.setItem("app-users", JSON.stringify(users));
        console.log("✅ Admin user restored");
      }

      console.log("✅ Clean application initialized");
    } catch (error) {
      console.error("❌ Failed to initialize clean application:", error);
    }
  }

  /**
   * Ensure user synchronization
   */
  async ensureUserSynchronization(): Promise<CleanupResult> {
    console.log("🔄 Ensuring user synchronization...");

    try {
      const users = JSON.parse(localStorage.getItem("app-users") || "[]");
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );

      // Check if current user exists in users list
      if (
        currentUser &&
        !users.some((u: any) => u.email === currentUser.email)
      ) {
        users.push(currentUser);
        localStorage.setItem("app-users", JSON.stringify(users));

        return {
          success: true,
          message:
            "User synchronization completed - added current user to list",
          itemsDeleted: 0,
          errors: [],
        };
      }

      return {
        success: true,
        message: "User synchronization verified - all users in sync",
        itemsDeleted: 0,
        errors: [],
      };
    } catch (error: any) {
      return {
        success: false,
        message: `User sync failed: ${error.message}`,
        itemsDeleted: 0,
        errors: [error.message],
      };
    }
  }

  /**
   * Get cleanup statistics
   */
  getCleanupStats(): CleanupStats {
    try {
      let totalItems = 0;
      let storageUsed = 0;
      let duplicatesFound = 0;

      // Count items in localStorage
      const dataKeys = [
        "works",
        "pools",
        "maintenance",
        "clients",
        "app-users",
      ];

      dataKeys.forEach((key) => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const items = JSON.parse(data);
            if (Array.isArray(items)) {
              totalItems += items.length;
              storageUsed += data.length;

              // Check for duplicates (simple ID check)
              const ids = items.map((item) => item.id).filter((id) => id);
              const uniqueIds = new Set(ids);
              duplicatesFound += ids.length - uniqueIds.size;
            }
          }
        } catch (error) {
          console.warn(`Error reading ${key}:`, error);
        }
      });

      return {
        totalItems,
        lastCleanup: null, // Would track last cleanup time
        storageUsed,
        cleanupNeeded: duplicatesFound > 0 || storageUsed > 1000000, // 1MB threshold
        duplicatesFound,
      };
    } catch (error) {
      console.error("Error getting cleanup stats:", error);
      return {
        totalItems: 0,
        lastCleanup: null,
        storageUsed: 0,
        cleanupNeeded: false,
        duplicatesFound: 0,
      };
    }
  }

  /**
   * Remove duplicates
   */
  async removeDuplicates(): Promise<CleanupResult> {
    console.log("🧹 Removing duplicates...");

    try {
      let itemsDeleted = 0;
      const errors: string[] = [];
      const dataKeys = ["works", "pools", "maintenance", "clients"];

      dataKeys.forEach((key) => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const items = JSON.parse(data);
            if (Array.isArray(items)) {
              const uniqueItems = items.filter(
                (item, index, arr) =>
                  arr.findIndex((i) => i.id === item.id) === index,
              );

              const duplicateCount = items.length - uniqueItems.length;
              if (duplicateCount > 0) {
                localStorage.setItem(key, JSON.stringify(uniqueItems));
                itemsDeleted += duplicateCount;
                console.log(
                  `🧹 Removed ${duplicateCount} duplicates from ${key}`,
                );
              }
            }
          }
        } catch (error: any) {
          errors.push(`Error cleaning ${key}: ${error.message}`);
        }
      });

      return {
        success: true,
        message: `Removed ${itemsDeleted} duplicate items`,
        itemsDeleted,
        errors,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Duplicate removal failed: ${error.message}`,
        itemsDeleted: 0,
        errors: [error.message],
      };
    }
  }
}

// Export singleton instance and individual functions for backward compatibility
export const dataCleanupService = new DataCleanupService();

export const cleanupOldData = () => dataCleanupService.cleanAllData();
export const cleanupDuplicateData = () => dataCleanupService.removeDuplicates();
export const runFullCleanup = () => dataCleanupService.cleanAllData();

export default dataCleanupService;
