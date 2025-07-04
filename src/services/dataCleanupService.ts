import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { realFirebaseService } from "./realFirebaseService";
import {
  poolService,
  maintenanceService,
  workService,
} from "./firebaseService";

export interface CleanupResult {
  success: boolean;
  message: string;
  details: {
    firestoreDeleted: {
      pools: number;
      works: number;
      maintenance: number;
    };
    realtimeDbCleared: boolean;
    localStorageCleared: boolean;
  };
}

class DataCleanupService {
  /**
   * Cleans all obras/manutenções and piscinas data from all sources:
   * - Firestore collections
   * - Realtime Database
   * - Local Storage
   * - Application state
   */
  async cleanAllData(): Promise<CleanupResult> {
    const result: CleanupResult = {
      success: false,
      message: "",
      details: {
        firestoreDeleted: {
          pools: 0,
          works: 0,
          maintenance: 0,
        },
        realtimeDbCleared: false,
        localStorageCleared: false,
      },
    };

    try {
      // 1. Clean Firestore data (if Firebase is configured)
      if (db) {
        console.log("Cleaning Firestore data...");

        // Delete all pools
        const poolsSnapshot = await getDocs(collection(db, "pools"));
        for (const poolDoc of poolsSnapshot.docs) {
          await deleteDoc(doc(db, "pools", poolDoc.id));
          result.details.firestoreDeleted.pools++;
        }

        // Delete all works
        const worksSnapshot = await getDocs(collection(db, "works"));
        for (const workDoc of worksSnapshot.docs) {
          await deleteDoc(doc(db, "works", workDoc.id));
          result.details.firestoreDeleted.works++;
        }

        // Delete all maintenance
        const maintenanceSnapshot = await getDocs(
          collection(db, "maintenance"),
        );
        for (const maintenanceDoc of maintenanceSnapshot.docs) {
          await deleteDoc(doc(db, "maintenance", maintenanceDoc.id));
          result.details.firestoreDeleted.maintenance++;
        }

        // Delete all clients
        try {
          const clientsSnapshot = await getDocs(collection(db, "clients"));
          for (const clientDoc of clientsSnapshot.docs) {
            await deleteDoc(doc(db, "clients", clientDoc.id));
          }
          console.log(
            `Deleted ${clientsSnapshot.docs.length} clients from Firestore`,
          );
        } catch (error) {
          console.warn("Failed to delete clients from Firestore:", error);
        }

        // Delete all interventions (if they exist as a separate collection)
        try {
          const interventionsSnapshot = await getDocs(
            collection(db, "interventions"),
          );
          for (const interventionDoc of interventionsSnapshot.docs) {
            await deleteDoc(doc(db, "interventions", interventionDoc.id));
          }
          console.log(
            `Deleted ${interventionsSnapshot.docs.length} interventions from Firestore`,
          );
        } catch (error) {
          console.warn("Failed to delete interventions from Firestore:", error);
        }

        console.log(
          `Firestore cleanup complete: ${result.details.firestoreDeleted.pools} pools, ${result.details.firestoreDeleted.works} works, ${result.details.firestoreDeleted.maintenance} maintenance deleted`,
        );
      }

      // 2. Clean Realtime Database data (if configured)
      if (realFirebaseService.isReady()) {
        console.log("Cleaning Realtime Database data...");

        try {
          // The realFirebaseService uses different collection structure
          // We need to delete data from pools, works, maintenance, clients collections
          await this.clearRealtimeDatabase();
          result.details.realtimeDbCleared = true;
          console.log("Realtime Database cleanup complete");
        } catch (error) {
          console.error("Failed to clean Realtime Database:", error);
        }
      }

      // 3. Clean Local Storage data
      console.log("Cleaning Local Storage data...");

      // Remove main data collections
      localStorage.removeItem("pools");
      localStorage.removeItem("works");
      localStorage.removeItem("maintenance");
      localStorage.removeItem("interventions");
      localStorage.removeItem("clients");

      // Remove cleanup and sync flags
      localStorage.removeItem("demo-data-cleaned");
      localStorage.removeItem("auto-sync-completed");
      localStorage.removeItem("last-full-sync");

      // Remove any cached/temporary data
      localStorage.removeItem("mock-users");
      localStorage.removeItem("mock-current-user");

      // Clear session storage as well
      sessionStorage.clear();

      result.details.localStorageCleared = true;
      console.log("Local Storage and Session Storage cleanup complete");

      result.success = true;
      result.message =
        "Limpeza de dados concluída com sucesso. A aplicação está agora limpa de todas as obras, manutenções e piscinas.";
    } catch (error: any) {
      console.error("Data cleanup failed:", error);
      result.success = false;
      result.message = `Erro na limpeza de dados: ${error.message}`;
    }

    return result;
  }

  /**
   * Clears all data from Firebase Realtime Database
   */
  private async clearRealtimeDatabase(): Promise<void> {
    if (!realFirebaseService.isReady()) {
      throw new Error("Realtime Database not initialized");
    }

    // Since realFirebaseService doesn't expose a direct delete all method,
    // we need to get all data and delete individually
    const allData = await realFirebaseService.syncAllData();

    if (allData) {
      // Delete all pools
      for (const pool of allData.pools) {
        if (pool.id) {
          await realFirebaseService.deletePool(pool.id);
        }
      }

      // Delete all works
      for (const work of allData.works) {
        if (work.id) {
          await realFirebaseService.deleteWork(work.id);
        }
      }

      // Delete all maintenance
      for (const maintenance of allData.maintenance) {
        if (maintenance.id) {
          await realFirebaseService.deleteMaintenance(maintenance.id);
        }
      }

      // Delete all clients
      for (const client of allData.clients) {
        if (client.id) {
          try {
            await realFirebaseService.deleteClient(client.id);
          } catch (error) {
            console.warn(`Failed to delete client ${client.id}:`, error);
          }
        }
      }
    }
  }

  /**
   * Ensures proper user synchronization when new users are added
   * This method sets up the necessary hooks and configurations
   */
  async ensureUserSynchronization(): Promise<boolean> {
    try {
      // Firebase is always configured with fixed settings
      console.log("Firebase cleanup service using fixed configuration");

      // Initialize Firebase services if not already done
      if (db) {
        console.log("Firestore is ready for user synchronization");
      }

      if (realFirebaseService.isReady() || realFirebaseService.initialize()) {
        console.log("Realtime Database is ready for user synchronization");
      }

      // Test connections
      const firestoreTest = await this.testFirestoreConnection();
      const realtimeTest = realFirebaseService.isReady()
        ? await realFirebaseService.testConnection()
        : false;

      console.log(
        `Synchronization status - Firestore: ${firestoreTest}, Realtime: ${realtimeTest}`,
      );

      return firestoreTest || realtimeTest;
    } catch (error) {
      console.error("Failed to ensure user synchronization:", error);
      return false;
    }
  }

  /**
   * Tests Firestore connection
   */
  private async testFirestoreConnection(): Promise<boolean> {
    if (!db) return false;

    try {
      // Try to read from users collection to test connection
      await getDocs(collection(db, "users"));
      return true;
    } catch (error) {
      console.error("Firestore connection test failed:", error);
      return false;
    }
  }

  /**
   * Creates a clean application state for new installations
   */
  async initializeCleanApplication(): Promise<void> {
    console.log("Initializing clean application state...");

    // Clear all existing data
    await this.cleanAllData();

    // Ensure user synchronization is properly set up
    await this.ensureUserSynchronization();

    // Set a flag to indicate the app has been cleaned
    localStorage.setItem("app-cleaned", new Date().toISOString());
    localStorage.setItem("last-cleanup", new Date().toISOString());

    console.log("Clean application initialization complete");
  }

  /**
   * Checks if the application has been cleaned recently
   */
  isApplicationClean(): boolean {
    const cleanedFlag = localStorage.getItem("app-cleaned");
    const lastCleanup = localStorage.getItem("last-cleanup");

    if (!cleanedFlag || !lastCleanup) {
      return false;
    }

    // Check if cleanup was recent (within last hour)
    const cleanupTime = new Date(lastCleanup);
    const now = new Date();
    const hoursSinceCleanup =
      (now.getTime() - cleanupTime.getTime()) / (1000 * 60 * 60);

    return hoursSinceCleanup < 1;
  }

  /**
   * Gets cleanup statistics
   */
  getCleanupStats(): {
    lastCleanup: string | null;
    isClean: boolean;
    localStorageEmpty: boolean;
  } {
    const lastCleanup = localStorage.getItem("last-cleanup");
    const isClean = this.isApplicationClean();

    // Check if local storage is empty of data
    const pools = localStorage.getItem("pools");
    const works = localStorage.getItem("works");
    const maintenance = localStorage.getItem("maintenance");
    const interventions = localStorage.getItem("interventions");
    const clients = localStorage.getItem("clients");

    const localStorageEmpty =
      (!pools || pools === "[]") &&
      (!works || works === "[]") &&
      (!maintenance || maintenance === "[]") &&
      (!interventions || interventions === "[]") &&
      (!clients || clients === "[]");

    return {
      lastCleanup,
      isClean,
      localStorageEmpty,
    };
  }
}

// Export singleton instance
export const dataCleanupService = new DataCleanupService();
export default dataCleanupService;
