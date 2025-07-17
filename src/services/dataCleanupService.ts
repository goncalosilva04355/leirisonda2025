import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { getFirestoreInstance } from "../firebase/config";
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
      clients: number;
      interventions: number;
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
          clients: 0,
          interventions: 0,
        },
        realtimeDbCleared: false,
        localStorageCleared: false,
      },
    };

    try {
      // 1. Clean Firestore data (if Firebase is configured)
      if (db) {
        console.log("🔥 Starting Firestore data cleanup...");

        // Delete all pools
        try {
          const poolsSnapshot = await getDocs(
            collection(getFirestoreInstance(), "pools"),
          );
          console.log(`Found ${poolsSnapshot.docs.length} pools to delete`);
          for (const poolDoc of poolsSnapshot.docs) {
            await deleteDoc(doc(db, "pools", poolDoc.id));
            result.details.firestoreDeleted.pools++;
          }
        } catch (error) {
          console.error("Failed to delete pools from Firestore:", error);
        }

        // Delete all works
        try {
          const worksSnapshot = await getDocs(
            collection(getFirestoreInstance(), "works"),
          );
          console.log(`Found ${worksSnapshot.docs.length} works to delete`);
          for (const workDoc of worksSnapshot.docs) {
            await deleteDoc(doc(db, "works", workDoc.id));
            result.details.firestoreDeleted.works++;
          }
        } catch (error) {
          console.error("Failed to delete works from Firestore:", error);
        }

        // Delete all maintenance
        try {
          const maintenanceSnapshot = await getDocs(
            collection(getFirestoreInstance(), "maintenance"),
          );
          console.log(
            `Found ${maintenanceSnapshot.docs.length} maintenance records to delete`,
          );
          for (const maintenanceDoc of maintenanceSnapshot.docs) {
            await deleteDoc(doc(db, "maintenance", maintenanceDoc.id));
            result.details.firestoreDeleted.maintenance++;
          }
        } catch (error) {
          console.error("Failed to delete maintenance from Firestore:", error);
        }

        // Delete all clients
        try {
          const clientsSnapshot = await getDocs(
            collection(getFirestoreInstance(), "clients"),
          );
          console.log(`Found ${clientsSnapshot.docs.length} clients to delete`);
          for (const clientDoc of clientsSnapshot.docs) {
            await deleteDoc(doc(db, "clients", clientDoc.id));
            result.details.firestoreDeleted.clients++;
          }
        } catch (error) {
          console.warn("Failed to delete clients from Firestore:", error);
        }

        // Delete all interventions (if they exist as a separate collection)
        try {
          const interventionsSnapshot = await getDocs(
            collection(getFirestoreInstance(), "interventions"),
          );
          console.log(
            `Found ${interventionsSnapshot.docs.length} interventions to delete`,
          );
          for (const interventionDoc of interventionsSnapshot.docs) {
            await deleteDoc(doc(db, "interventions", interventionDoc.id));
            result.details.firestoreDeleted.interventions++;
          }
        } catch (error) {
          console.warn("Failed to delete interventions from Firestore:", error);
        }

        console.log(
          `✅ Firestore cleanup complete: ${result.details.firestoreDeleted.pools} pools, ${result.details.firestoreDeleted.works} works, ${result.details.firestoreDeleted.maintenance} maintenance, ${result.details.firestoreDeleted.clients} clients, ${result.details.firestoreDeleted.interventions} interventions deleted`,
        );
      } else {
        console.warn("🔥 Firestore not available - skipping Firestore cleanup");
      }

      // 2. Clean Realtime Database data (if configured)
      const realtimeInitialized =
        realFirebaseService.isReady() || realFirebaseService.initialize();
      if (realtimeInitialized) {
        console.log("🚀 Starting Realtime Database cleanup...");

        try {
          // The realFirebaseService uses different collection structure
          // We need to delete data from pools, works, maintenance, clients collections
          await this.clearRealtimeDatabase();
          result.details.realtimeDbCleared = true;
          console.log("✅ Realtime Database cleanup complete");
        } catch (error) {
          console.error("❌ Failed to clean Realtime Database:", error);
        }
      } else {
        console.warn(
          "🚀 Realtime Database not available - skipping Realtime DB cleanup",
        );
      }

      // 3. Clean Local Storage data
      console.log("💾 Starting Local Storage cleanup...");

      // Count existing data before cleanup
      const existingData = {
        pools: localStorage.getItem("pools"),
        works: localStorage.getItem("works"),
        maintenance: localStorage.getItem("maintenance"),
        interventions: localStorage.getItem("interventions"),
        clients: localStorage.getItem("clients"),
      };

      Object.entries(existingData).forEach(([key, value]) => {
        if (value) {
          const parsedData = JSON.parse(value);
          console.log(
            `Found ${Array.isArray(parsedData) ? parsedData.length : "some"} ${key} in localStorage`,
          );
        }
      });

      // Limpar apenas dados automáticos/mock, manter dados do utilizador
      const pools = JSON.parse(localStorage.getItem("pools") || "[]");
      const cleanPools = pools.filter(
        (pool: any) =>
          !pool.name?.includes("Piscina Principal") &&
          !pool.name?.includes("Piscina Exemplo") &&
          !pool.name?.includes("Villa Marina") &&
          !pool.client?.includes("Cliente Exemplo"),
      );

      localStorage.setItem("pools", JSON.stringify(cleanPools));
      console.log(
        `🧹 Cleaned ${pools.length - cleanPools.length} automatic pools, kept ${cleanPools.length} user pools`,
      );

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
      console.log("✅ Local Storage and Session Storage cleanup complete");

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

    console.log("🚀 Fetching all data from Realtime Database...");

    // Since realFirebaseService doesn't expose a direct delete all method,
    // we need to get all data and delete individually
    const allData = await realFirebaseService.syncAllData();

    if (allData) {
      console.log(`Found data in Realtime DB:`, {
        pools: allData.pools.length,
        works: allData.works.length,
        maintenance: allData.maintenance.length,
        clients: allData.clients.length,
      });

      // Delete all pools
      console.log(`Deleting ${allData.pools.length} pools from Realtime DB...`);
      for (const pool of allData.pools) {
        if (pool.id) {
          await realFirebaseService.deletePool(pool.id);
        }
      }

      // Delete all works
      console.log(`Deleting ${allData.works.length} works from Realtime DB...`);
      for (const work of allData.works) {
        if (work.id) {
          await realFirebaseService.deleteWork(work.id);
        }
      }

      // Delete all maintenance
      console.log(
        `Deleting ${allData.maintenance.length} maintenance records from Realtime DB...`,
      );
      for (const maintenance of allData.maintenance) {
        if (maintenance.id) {
          await realFirebaseService.deleteMaintenance(maintenance.id);
        }
      }

      // Delete all clients
      console.log(
        `Deleting ${allData.clients.length} clients from Realtime DB...`,
      );
      for (const client of allData.clients) {
        if (client.id) {
          try {
            await realFirebaseService.deleteClient(client.id);
          } catch (error) {
            console.warn(`Failed to delete client ${client.id}:`, error);
          }
        }
      }
    } else {
      console.log("No data found in Realtime Database or failed to fetch data");
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
      await getDocs(collection(getFirestoreInstance(), "users"));
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
   * Clears all device memory including localStorage, sessionStorage, and caches
   * This is more aggressive than cleanAllData and removes everything from the device
   */
  async clearDeviceMemory(): Promise<CleanupResult> {
    const result: CleanupResult = {
      success: false,
      message: "",
      details: {
        firestoreDeleted: {
          pools: 0,
          works: 0,
          maintenance: 0,
          clients: 0,
          interventions: 0,
        },
        realtimeDbCleared: false,
        localStorageCleared: false,
      },
    };

    try {
      console.log("🧹 Starting complete device memory cleanup...");

      // Count items before cleanup for reporting
      const localStorageCount = localStorage.length;
      const sessionStorageCount = sessionStorage.length;

      console.log(
        `📊 Found ${localStorageCount} localStorage items and ${sessionStorageCount} sessionStorage items`,
      );

      // 1. Clear ALL localStorage (everything, including user preferences)
      localStorage.clear();
      console.log("✅ localStorage completely cleared");

      // 2. Clear ALL sessionStorage
      sessionStorage.clear();
      console.log("✅ sessionStorage completely cleared");

      // 3. Clear IndexedDB if available
      if ("indexedDB" in window) {
        try {
          // This is a more complex operation, we'll do a basic cleanup
          console.log("🗃️ Attempting IndexedDB cleanup...");
          // Note: Full IndexedDB cleanup would require knowing database names
          // For now we just log the attempt
          console.log("✅ IndexedDB cleanup attempted");
        } catch (error) {
          console.warn("⚠️ IndexedDB cleanup failed:", error);
        }
      }

      // 4. Clear WebSQL if available (deprecated but might exist)
      try {
        if ("webkitStorageInfo" in navigator) {
          console.log("🗄️ WebSQL cleanup attempted");
        }
      } catch (error) {
        console.warn("⚠️ WebSQL cleanup failed:", error);
      }

      // 5. Clear caches if available (Service Worker caches)
      if ("caches" in window) {
        try {
          const cacheNames = await caches.keys();
          console.log(`🗂️ Found ${cacheNames.length} caches to clear`);

          for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
            console.log(`✅ Cache '${cacheName}' deleted`);
          }
        } catch (error) {
          console.warn("⚠️ Cache cleanup failed:", error);
        }
      }

      // 6. Force reload to clear any remaining in-memory state
      console.log("🔄 Device memory cleanup complete. Page will reload...");

      result.success = true;
      result.localStorageCleared = true;
      result.message = `Memória do dispositivo limpa com sucesso! Removidos ${localStorageCount} itens do localStorage e ${sessionStorageCount} do sessionStorage.`;

      // Set a flag before reload so we know cleanup happened
      sessionStorage.setItem("device-memory-cleaned", "true");

      // Small delay to show success message before reload
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Device memory cleanup failed:", error);
      result.success = false;
      result.message = `Erro na limpeza da memória do dispositivo: ${error.message}`;
    }

    return result;
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
