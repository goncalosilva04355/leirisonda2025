// Universal Data Sync Service - Local Only (Firestore disabled)
import {
  isFirebaseReady,
  getFirestoreSafe,
} from "../firebase/configWithoutFirestore";

// Define types to avoid import errors
type Unsubscribe = () => void;

export interface UniversalDataState {
  obras: any[];
  manutencoes: any[];
  piscinas: any[];
  clientes: any[];
  lastSync: Date | null;
  totalItems: number;
}

/**
 * Simplified Universal Data Sync Service (Local Only)
 * Works without Firestore to avoid initialization errors
 */
class UniversalDataSyncService {
  private listeners: Unsubscribe[] = [];
  private isInitialized = false;
  private syncInProgress = false;

  /**
   * Initialize service in local-only mode
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    console.log("📱 Initializing UniversalDataSync in local-only mode");
    this.cleanupDuplicateWorks();
    this.isInitialized = true;
    return true;
  }

  /**
   * Get all data from local storage
   */
  async getAllUniversalData(): Promise<UniversalDataState> {
    const obras = this.getLocalDataSafe("works") || [];
    const manutencoes = this.getLocalDataSafe("maintenance") || [];
    const piscinas = this.getLocalDataSafe("pools") || [];
    const clientes = this.getLocalDataSafe("clients") || [];

    return {
      obras,
      manutencoes,
      piscinas,
      clientes,
      lastSync: new Date(),
      totalItems:
        obras.length + manutencoes.length + piscinas.length + clientes.length,
    };
  }

  /**
   * Sync data (local only)
   */
  async syncUniversalData(): Promise<boolean> {
    if (this.syncInProgress) {
      return false;
    }

    this.syncInProgress = true;
    console.log("🔄 Running local-only sync...");

    try {
      // Simulate sync process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("✅ Local sync completed");
      return true;
    } catch (error) {
      console.error("❌ Local sync error:", error);
      return false;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Save data locally
   */
  async saveData(collection: string, data: any[]): Promise<boolean> {
    try {
      localStorage.setItem(collection, JSON.stringify(data));
      console.log(`💾 Saved ${data.length} items to ${collection}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving ${collection}:`, error);
      return false;
    }
  }

  /**
   * Get local data safely
   */
  private getLocalDataSafe(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn(`⚠️ Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  /**
   * Clean up duplicate works
   */
  private cleanupDuplicateWorks(): void {
    try {
      const works = this.getLocalDataSafe("works");
      const uniqueWorks = works.filter(
        (work, index, arr) => arr.findIndex((w) => w.id === work.id) === index,
      );

      if (uniqueWorks.length !== works.length) {
        console.log(
          `🧹 Cleaned ${works.length - uniqueWorks.length} duplicate works`,
        );
        localStorage.setItem("works", JSON.stringify(uniqueWorks));
      }
    } catch (error) {
      console.warn("⚠️ Error cleaning duplicates:", error);
    }
  }

  /**
   * Enable real-time sync (local only)
   */
  enableRealTimeSync(): boolean {
    console.log("📱 Real-time sync enabled (local mode)");
    return true;
  }

  /**
   * Disable real-time sync
   */
  disableRealTimeSync(): void {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners = [];
    console.log("📱 Real-time sync disabled");
  }

  /**
   * Get sync status
   */
  getSyncStatus(): {
    isActive: boolean;
    lastSync: Date | null;
    totalItems: number;
  } {
    const data = this.getAllUniversalDataSync();
    return {
      isActive: this.isInitialized,
      lastSync: new Date(),
      totalItems: data.totalItems,
    };
  }

  /**
   * Get all data synchronously
   */
  private getAllUniversalDataSync(): UniversalDataState {
    const obras = this.getLocalDataSafe("works") || [];
    const manutencoes = this.getLocalDataSafe("maintenance") || [];
    const piscinas = this.getLocalDataSafe("pools") || [];
    const clientes = this.getLocalDataSafe("clients") || [];

    return {
      obras,
      manutencoes,
      piscinas,
      clientes,
      lastSync: new Date(),
      totalItems:
        obras.length + manutencoes.length + piscinas.length + clientes.length,
    };
  }

  /**
   * Check if service is initialized
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Force sync (local only)
   */
  async forceSync(): Promise<boolean> {
    console.log("🔄 Force sync requested (local mode)");
    return await this.syncUniversalData();
  }

  /**
   * Cleanup on app close
   */
  cleanup(): void {
    this.disableRealTimeSync();
    this.isInitialized = false;
    console.log("🧹 UniversalDataSync cleanup completed");
  }
}

// Export singleton instance
export const universalDataSync = new UniversalDataSyncService();
export default universalDataSync;
