import { FirebaseApp } from "firebase/app";
import {
  getDatabase,
  Database,
  ref,
  push,
  set,
  get,
  onValue,
  off,
  remove,
  update,
} from "firebase/database";
import { app as firebaseApp } from "../firebase/config";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

class RealFirebaseService {
  private app: FirebaseApp | null = null;
  private database: Database | null = null;
  private isInitialized = false;

  // Sanitize data for Firebase - remove undefined values and functions
  private sanitizeForFirebase(data: any): any {
    // Handle null and undefined
    if (data === null) {
      return null;
    }

    if (data === undefined) {
      return null;
    }

    // Remove functions
    if (typeof data === "function") {
      return null;
    }

    // Preserve primitive values (strings, numbers, booleans)
    if (
      typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean"
    ) {
      return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
      const sanitizedArray = data
        .map((item) => this.sanitizeForFirebase(item))
        .filter((item) => item !== null && item !== undefined);
      return sanitizedArray;
    }

    // Handle objects
    if (typeof data === "object") {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const sanitizedValue = this.sanitizeForFirebase(value);
        // Preserve all values except null/undefined
        if (sanitizedValue !== null && sanitizedValue !== undefined) {
          sanitized[key] = sanitizedValue;
        }
      }
      return sanitized;
    }

    return data;
  }

  // Initialize Firebase using existing app instance
  initialize(): boolean {
    try {
      if (!firebaseApp) {
        console.log(
          "⏸️ Firebase app not available from config - quota protection mode",
        );
        return false;
      }

      this.app = firebaseApp;
      this.database = getDatabase(this.app);
      this.isInitialized = true;

      console.log("✅ Firebase database service initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Firebase database initialization failed:", error);
      return false;
    }
  }

  // Check if Firebase is ready
  isReady(): boolean {
    return this.isInitialized && this.database !== null && this.app !== null;
  }

  // Get current user ID for isolated data
  private getCurrentUserId(): string {
    try {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const user = JSON.parse(userData);
        return user.uid || user.id || "default_user";
      }
      return "default_user";
    } catch {
      return "default_user";
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    if (!this.isReady()) {
      console.warn("Firebase service not ready for connection test");
      return false;
    }

    try {
      const testRef = ref(this.database!, "test");
      await set(testRef, { timestamp: Date.now() });
      await remove(testRef);
      console.log("Firebase connection test successful");
      return true;
    } catch (error) {
      console.warn(
        "Firebase connection test failed, will use local mode:",
        error,
      );
      return false;
    }
  }

  // CRUD operations for Pools - GLOBAL SHARED DATA
  async addPool(poolData: any): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const poolsRef = ref(this.database!, "shared/pools"); // Global shared location
      const newPoolRef = push(poolsRef);

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...poolData,
        id: newPoolRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sharedGlobally: true, // Mark as global data
      });

      await set(newPoolRef, sanitizedData);
      console.log(
        `✅ Pool "${poolData.name}" added to shared database - visible to all users`,
      );
      return newPoolRef.key;
    } catch (error) {
      console.error("Failed to add pool:", error);
      return null;
    }
  }

  async updatePool(poolId: string, poolData: any): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const poolRef = ref(this.database!, `shared/pools/${poolId}`); // Global shared location

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...poolData,
        updatedAt: new Date().toISOString(),
        sharedGlobally: true,
      });

      await update(poolRef, sanitizedData);
      console.log(
        `✅ Pool ${poolId} updated in shared database - visible to all users`,
      );
      return true;
    } catch (error) {
      console.error("Failed to update pool:", error);
      return false;
    }
  }

  async deletePool(poolId: string): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const userId = this.getCurrentUserId();
      const poolRef = ref(this.database!, `users/${userId}/pools/${poolId}`); // User-specific location
      await remove(poolRef);
      console.log(
        `✅ Pool ${poolId} deleted from user's isolated data - removed only for current user`,
      );
      return true;
    } catch (error) {
      console.error("Failed to delete pool:", error);
      return false;
    }
  }

  // CRUD operations for Works - ISOLATED USER DATA
  async addWork(workData: any): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const userId = this.getCurrentUserId();
      const worksRef = ref(this.database!, `users/${userId}/works`); // User-specific location
      const newWorkRef = push(worksRef);

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...workData,
        id: newWorkRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: this.getCurrentUserId(), // Mark as user-specific data
      });

      await set(newWorkRef, sanitizedData);
      console.log(
        `✅ Work "${workData.title}" added to user's isolated data - only visible to current user`,
      );
      return newWorkRef.key;
    } catch (error) {
      console.error("Failed to add work:", error);
      return null;
    }
  }

  async updateWork(workId: string, workData: any): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const userId = this.getCurrentUserId();
      const workRef = ref(this.database!, `users/${userId}/works/${workId}`); // User-specific location

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...workData,
        updatedAt: new Date().toISOString(),
        userId: this.getCurrentUserId(),
      });

      await update(workRef, sanitizedData);
      console.log(
        `✅ Work ${workId} updated in user's isolated data - only visible to current user`,
      );
      return true;
    } catch (error) {
      console.error("Failed to update work:", error);
      return false;
    }
  }

  async deleteWork(workId: string): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const userId = this.getCurrentUserId();
      const workRef = ref(this.database!, `users/${userId}/works/${workId}`); // User-specific location
      await remove(workRef);
      console.log(
        `✅ Work ${workId} deleted from user's isolated data - removed only for current user`,
      );
      return true;
    } catch (error) {
      console.error("Failed to delete work:", error);
      return false;
    }
  }

  // CRUD operations for Maintenance - ISOLATED USER DATA
  async addMaintenance(maintenanceData: any): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const userId = this.getCurrentUserId();
      const maintenanceRef = ref(this.database!, `users/${userId}/maintenance`); // User-specific location
      const newMaintenanceRef = push(maintenanceRef);

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...maintenanceData,
        id: newMaintenanceRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: this.getCurrentUserId(), // Mark as user-specific data
      });

      await set(newMaintenanceRef, sanitizedData);
      console.log(
        `✅ Maintenance for "${maintenanceData.poolName}" added to user's isolated data - only visible to current user`,
      );
      return newMaintenanceRef.key;
    } catch (error) {
      console.error("Failed to add maintenance:", error);
      return null;
    }
  }

  async updateMaintenance(
    maintenanceId: string,
    maintenanceData: any,
  ): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const userId = this.getCurrentUserId();
      const maintenanceRef = ref(
        this.database!,
        `users/${userId}/maintenance/${maintenanceId}`, // User-specific location
      );
      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...maintenanceData,
        updatedAt: new Date().toISOString(),
        userId: this.getCurrentUserId(),
      });

      await update(maintenanceRef, sanitizedData);
      console.log(
        `✅ Maintenance ${maintenanceId} updated in user's isolated data - only visible to current user`,
      );
      return true;
    } catch (error) {
      console.error("Failed to update maintenance:", error);
      return false;
    }
  }

  async deleteMaintenance(maintenanceId: string): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const userId = this.getCurrentUserId();
      const maintenanceRef = ref(
        this.database!,
        `users/${userId}/maintenance/${maintenanceId}`, // User-specific location
      );
      await remove(maintenanceRef);
      console.log(
        `✅ Maintenance ${maintenanceId} deleted from user's isolated data - removed only for current user`,
      );
      return true;
    } catch (error) {
      console.error("Failed to delete maintenance:", error);
      return false;
    }
  }

  // CRUD operations for Clients - ISOLATED USER DATA
  async addClient(clientData: any): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const userId = this.getCurrentUserId();
      const clientsRef = ref(this.database!, `users/${userId}/clients`); // User-specific location
      const newClientRef = push(clientsRef);

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...clientData,
        id: newClientRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: this.getCurrentUserId(), // Mark as user-specific data
      });

      await set(newClientRef, sanitizedData);
      console.log(
        `✅ Client "${clientData.name}" added to user's isolated data - only visible to current user`,
      );
      return newClientRef.key;
    } catch (error) {
      console.error("Failed to add client:", error);
      return null;
    }
  }

  async updateClient(clientId: string, clientData: any): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const userId = this.getCurrentUserId();
      const clientRef = ref(
        this.database!,
        `users/${userId}/clients/${clientId}`,
      ); // User-specific location

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...clientData,
        updatedAt: new Date().toISOString(),
        userId: this.getCurrentUserId(),
      });

      await update(clientRef, sanitizedData);
      console.log(
        `✅ Client ${clientId} updated in user's isolated data - only visible to current user`,
      );
      return true;
    } catch (error) {
      console.error("Failed to update client:", error);
      return false;
    }
  }

  async deleteClient(clientId: string): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const userId = this.getCurrentUserId();
      const clientRef = ref(
        this.database!,
        `users/${userId}/clients/${clientId}`,
      ); // User-specific location
      await remove(clientRef);
      console.log(
        `✅ Client ${clientId} deleted from user's isolated data - removed only for current user`,
      );
      return true;
    } catch (error) {
      console.error("Failed to delete client:", error);
      return false;
    }
  }

  // Real-time listeners with enhanced cross-user sync
  onPoolsChange(callback: (pools: any[]) => void): () => void {
    if (!this.isReady()) return () => {};

    const poolsRef = ref(this.database!, "shared/pools"); // Global shared data
    const unsubscribe = onValue(poolsRef, (snapshot) => {
      const data = snapshot.val();
      const pools = data ? Object.values(data) : [];
      console.log(`🔄 SYNC: ${pools.length} pools synced across all users`);
      callback(pools);
    });

    return unsubscribe;
  }

  onWorksChange(callback: (works: any[]) => void): () => void {
    if (!this.isReady()) return () => {};

    const userId = this.getCurrentUserId();
    const worksRef = ref(this.database!, `users/${userId}/works`); // User-specific data
    const unsubscribe = onValue(worksRef, (snapshot) => {
      const data = snapshot.val();
      const works = data ? Object.values(data) : [];
      console.log(
        `🔄 SYNC: ${works.length} works synced for current user only`,
      );
      callback(works);
    });

    return unsubscribe;
  }

  onMaintenanceChange(callback: (maintenance: any[]) => void): () => void {
    if (!this.isReady()) return () => {};

    const userId = this.getCurrentUserId();
    const maintenanceRef = ref(this.database!, `users/${userId}/maintenance`); // User-specific data
    const unsubscribe = onValue(maintenanceRef, (snapshot) => {
      const data = snapshot.val();
      const maintenance = data ? Object.values(data) : [];
      console.log(
        `🔄 SYNC: ${maintenance.length} maintenance records synced for current user only`,
      );
      callback(maintenance);
    });

    return unsubscribe;
  }

  onClientsChange(callback: (clients: any[]) => void): () => void {
    if (!this.isReady()) return () => {};

    const userId = this.getCurrentUserId();
    const clientsRef = ref(this.database!, `users/${userId}/clients`); // User-specific data
    const unsubscribe = onValue(clientsRef, (snapshot) => {
      const data = snapshot.val();
      const clients = data ? Object.values(data) : [];
      console.log(
        `🔄 SYNC: ${clients.length} clients synced for current user only`,
      );
      callback(clients);
    });

    return unsubscribe;
  }

  // Bulk sync operations - GLOBAL SHARED DATA
  async syncAllData(): Promise<{
    pools: any[];
    works: any[];
    maintenance: any[];
    clients: any[];
  } | null> {
    if (!this.isReady()) return null;

    try {
      console.log("🔄 Syncing ALL shared data visible to all users...");
      const [
        poolsSnapshot,
        worksSnapshot,
        maintenanceSnapshot,
        clientsSnapshot,
      ] = await Promise.all([
        get(ref(this.database!, "shared/pools")), // Global shared location
        get(ref(this.database!, "shared/works")), // Global shared location
        get(ref(this.database!, "shared/maintenance")), // Global shared location
        get(ref(this.database!, "shared/clients")), // Global shared location
      ]);

      const syncedData = {
        pools: poolsSnapshot.val() ? Object.values(poolsSnapshot.val()) : [],
        works: worksSnapshot.val() ? Object.values(worksSnapshot.val()) : [],
        maintenance: maintenanceSnapshot.val()
          ? Object.values(maintenanceSnapshot.val())
          : [],
        clients: clientsSnapshot.val()
          ? Object.values(clientsSnapshot.val())
          : [],
      };

      console.log("✅ Global data sync completed:", {
        pools: syncedData.pools.length,
        works: syncedData.works.length,
        maintenance: syncedData.maintenance.length,
        clients: syncedData.clients.length,
        message: "All data is shared between all users",
      });

      return syncedData;
    } catch (error) {
      console.error("Failed to sync all data:", error);
      return null;
    }
  }
}

// Export singleton instance
export const realFirebaseService = new RealFirebaseService();
export default realFirebaseService;
