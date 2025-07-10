// Full Sync Service - Simplified without Firestore
import { isFirebaseReady } from "../firebase/configWithoutFirestore";
import { mockAuthService } from "./mockAuthService";

export interface SyncResult {
  success: boolean;
  message: string;
  details: string[];
  stats: {
    usersSync: { local: number; firebase: number; merged: number };
    poolsSync: { local: number; firebase: number; merged: number };
    worksSync: { local: number; firebase: number; merged: number };
    maintenanceSync: { local: number; firebase: number; merged: number };
    clientsSync: { local: number; firebase: number; merged: number };
  };
}

/**
 * Full Sync Service - Simplified
 * Works only with local storage since Firestore is disabled
 */
class FullSyncService {
  private isSyncing = false;

  /**
   * Perform full synchronization (local only)
   */
  async performFullSync(): Promise<SyncResult> {
    if (this.isSyncing) {
      return {
        success: false,
        message: "Sync already in progress",
        details: ["Another sync operation is currently running"],
        stats: this.getEmptyStats(),
      };
    }

    this.isSyncing = true;

    try {
      console.log("🔄 Starting full sync (local only)...");

      const result: SyncResult = {
        success: false,
        message: "",
        details: [],
        stats: this.getEmptyStats(),
      };

      // 1. Sync users (local only)
      const usersResult = await this.syncUsers();
      result.stats.usersSync = usersResult;
      result.details.push(`Users: ${usersResult.local} local`);

      // 2. Sync pools (local only)
      const poolsResult = await this.syncPools();
      result.stats.poolsSync = poolsResult;
      result.details.push(`Pools: ${poolsResult.local} local`);

      // 3. Sync works (local only)
      const worksResult = await this.syncWorks();
      result.stats.worksSync = worksResult;
      result.details.push(`Works: ${worksResult.local} local`);

      // 4. Sync maintenance (local only)
      const maintenanceResult = await this.syncMaintenance();
      result.stats.maintenanceSync = maintenanceResult;
      result.details.push(`Maintenance: ${maintenanceResult.local} local`);

      // 5. Sync clients (local only)
      const clientsResult = await this.syncClients();
      result.stats.clientsSync = clientsResult;
      result.details.push(`Clients: ${clientsResult.local} local`);

      const totalLocal =
        usersResult.local +
        poolsResult.local +
        worksResult.local +
        maintenanceResult.local +
        clientsResult.local;

      result.success = true;
      result.message = `Sync completed successfully (local only) - ${totalLocal} items`;
      result.details.push(
        "Note: Firestore sync disabled - working with local data only",
      );

      console.log("✅ Full sync completed:", result);
      return result;
    } catch (error: any) {
      console.error("❌ Full sync failed:", error);
      return {
        success: false,
        message: `Sync failed: ${error.message}`,
        details: [`Error: ${error.message}`],
        stats: this.getEmptyStats(),
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync users (local only)
   */
  private async syncUsers(): Promise<{
    local: number;
    firebase: number;
    merged: number;
  }> {
    try {
      const localUsers = this.getLocalData("app-users") || [];

      // Ensure at least the admin user exists
      if (localUsers.length === 0) {
        const adminUser = {
          id: 1,
          name: "Gonçalo Fonseca",
          email: "gongonsilva@gmail.com",
          password: "19867gsf",
          role: "super_admin",
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        localUsers.push(adminUser);
        localStorage.setItem("app-users", JSON.stringify(localUsers));
      }

      return { local: localUsers.length, firebase: 0, merged: 0 };
    } catch (error) {
      console.warn("⚠️ Users sync error:", error);
      return { local: 0, firebase: 0, merged: 0 };
    }
  }

  /**
   * Sync pools (local only)
   */
  private async syncPools(): Promise<{
    local: number;
    firebase: number;
    merged: number;
  }> {
    try {
      const localPools = this.getLocalData("pools") || [];
      return { local: localPools.length, firebase: 0, merged: 0 };
    } catch (error) {
      console.warn("⚠️ Pools sync error:", error);
      return { local: 0, firebase: 0, merged: 0 };
    }
  }

  /**
   * Sync works (local only)
   */
  private async syncWorks(): Promise<{
    local: number;
    firebase: number;
    merged: number;
  }> {
    try {
      const localWorks = this.getLocalData("works") || [];
      return { local: localWorks.length, firebase: 0, merged: 0 };
    } catch (error) {
      console.warn("⚠️ Works sync error:", error);
      return { local: 0, firebase: 0, merged: 0 };
    }
  }

  /**
   * Sync maintenance (local only)
   */
  private async syncMaintenance(): Promise<{
    local: number;
    firebase: number;
    merged: number;
  }> {
    try {
      const localMaintenance = this.getLocalData("maintenance") || [];
      return { local: localMaintenance.length, firebase: 0, merged: 0 };
    } catch (error) {
      console.warn("⚠️ Maintenance sync error:", error);
      return { local: 0, firebase: 0, merged: 0 };
    }
  }

  /**
   * Sync clients (local only)
   */
  private async syncClients(): Promise<{
    local: number;
    firebase: number;
    merged: number;
  }> {
    try {
      const localClients = this.getLocalData("clients") || [];
      return { local: localClients.length, firebase: 0, merged: 0 };
    } catch (error) {
      console.warn("⚠️ Clients sync error:", error);
      return { local: 0, firebase: 0, merged: 0 };
    }
  }

  /**
   * Get local data safely
   */
  private getLocalData(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn(`⚠️ Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  /**
   * Get empty stats structure
   */
  private getEmptyStats() {
    return {
      usersSync: { local: 0, firebase: 0, merged: 0 },
      poolsSync: { local: 0, firebase: 0, merged: 0 },
      worksSync: { local: 0, firebase: 0, merged: 0 },
      maintenanceSync: { local: 0, firebase: 0, merged: 0 },
      clientsSync: { local: 0, firebase: 0, merged: 0 },
    };
  }

  /**
   * Check if sync is in progress
   */
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return true; // Always available for local operations
  }
}

// Export singleton instance
export const fullSyncService = new FullSyncService();
export default fullSyncService;
