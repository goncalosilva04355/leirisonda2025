// Cross User Data Sync disabled - Firestore not available
// import {
//   collection,
//   doc,
//   setDoc,
//   getDocs,
//   query,
//   orderBy,
//   writeBatch,
//   deleteDoc,
//   onSnapshot,
//   Unsubscribe,
// } from "firebase/firestore";

import { isFirebaseReady } from "../firebase/configWithoutFirestore";
// import { realFirebaseService } from "./realFirebaseService";

export interface CrossUserSyncResult {
  success: boolean;
  message: string;
  details: string[];
  dataShared: {
    pools: number;
    works: number;
    maintenance: number;
    clients: number;
  };
}

/**
 * Cross User Data Sync Service - Disabled
 * Firestore is not available, so cross-user sync is disabled
 */
class CrossUserDataSyncService {
  private listeners: (() => void)[] = [];
  private isInitialized = false;

  /**
   * Initialize the sync service (disabled)
   */
  async initialize(): Promise<boolean> {
    console.log("🚫 CrossUserDataSync disabled - Firestore not available");
    this.isInitialized = false;
    return false;
  }

  /**
   * Sync all data across users (disabled)
   */
  async syncAllDataAcrossUsers(): Promise<CrossUserSyncResult> {
    console.log("🚫 Cross-user sync disabled - Firestore not available");

    return {
      success: false,
      message: "Cross-user sync disabled - Firestore not available",
      details: [
        "Firestore service not enabled",
        "Data sync limited to local storage only",
        "Each device maintains independent data",
      ],
      dataShared: {
        pools: 0,
        works: 0,
        maintenance: 0,
        clients: 0,
      },
    };
  }

  /**
   * Enable real-time sync (disabled)
   */
  enableRealTimeSync(): boolean {
    console.log("🚫 Real-time sync disabled - Firestore not available");
    return false;
  }

  /**
   * Disable real-time sync
   */
  disableRealTimeSync(): void {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners = [];
    console.log("📱 Real-time sync listeners cleared");
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return false; // Always false since Firestore is disabled
  }

  /**
   * Get sync status
   */
  getSyncStatus(): {
    isActive: boolean;
    lastSync: Date | null;
    errors: string[];
  } {
    return {
      isActive: false,
      lastSync: null,
      errors: ["Firestore service not available"],
    };
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.disableRealTimeSync();
    this.isInitialized = false;
    console.log("🧹 CrossUserDataSync cleanup completed");
  }
}

// Export singleton instance
export const crossUserDataSync = new CrossUserDataSyncService();
export default crossUserDataSync;
