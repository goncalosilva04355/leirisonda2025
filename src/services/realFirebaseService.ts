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
    if (data === null || data === undefined) {
      return null;
    }

    if (typeof data === "function") {
      return null;
    }

    if (Array.isArray(data)) {
      return data
        .map((item) => this.sanitizeForFirebase(item))
        .filter((item) => item !== null);
    }

    if (typeof data === "object") {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const sanitizedValue = this.sanitizeForFirebase(value);
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
        console.error("Firebase app not available from config");
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

  // CRUD operations for Pools
  async addPool(poolData: any): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const poolsRef = ref(this.database!, "pools");
      const newPoolRef = push(poolsRef);

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...poolData,
        id: newPoolRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await set(newPoolRef, sanitizedData);
      return newPoolRef.key;
    } catch (error) {
      console.error("Failed to add pool:", error);
      return null;
    }
  }

  async updatePool(poolId: string, poolData: any): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const poolRef = ref(this.database!, `pools/${poolId}`);

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...poolData,
        updatedAt: new Date().toISOString(),
      });

      await update(poolRef, sanitizedData);
      return true;
    } catch (error) {
      console.error("Failed to update pool:", error);
      return false;
    }
  }

  async deletePool(poolId: string): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const poolRef = ref(this.database!, `pools/${poolId}`);
      await remove(poolRef);
      return true;
    } catch (error) {
      console.error("Failed to delete pool:", error);
      return false;
    }
  }

  // CRUD operations for Works
  async addWork(workData: any): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const worksRef = ref(this.database!, "works");
      const newWorkRef = push(worksRef);

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...workData,
        id: newWorkRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await set(newWorkRef, sanitizedData);
      return newWorkRef.key;
    } catch (error) {
      console.error("Failed to add work:", error);
      return null;
    }
  }

  async updateWork(workId: string, workData: any): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const workRef = ref(this.database!, `works/${workId}`);

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...workData,
        updatedAt: new Date().toISOString(),
      });

      await update(workRef, sanitizedData);
      return true;
    } catch (error) {
      console.error("Failed to update work:", error);
      return false;
    }
  }

  async deleteWork(workId: string): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const workRef = ref(this.database!, `works/${workId}`);
      await remove(workRef);
      return true;
    } catch (error) {
      console.error("Failed to delete work:", error);
      return false;
    }
  }

  // CRUD operations for Maintenance
  async addMaintenance(maintenanceData: any): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const maintenanceRef = ref(this.database!, "maintenance");
      const newMaintenanceRef = push(maintenanceRef);

      // Sanitize data before sending to Firebase
      const sanitizedData = this.sanitizeForFirebase({
        ...maintenanceData,
        id: newMaintenanceRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await set(newMaintenanceRef, sanitizedData);
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
      const maintenanceRef = ref(
        this.database!,
        `maintenance/${maintenanceId}`,
      );
      await update(maintenanceRef, {
        ...maintenanceData,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Failed to update maintenance:", error);
      return false;
    }
  }

  async deleteMaintenance(maintenanceId: string): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const maintenanceRef = ref(
        this.database!,
        `maintenance/${maintenanceId}`,
      );
      await remove(maintenanceRef);
      return true;
    } catch (error) {
      console.error("Failed to delete maintenance:", error);
      return false;
    }
  }

  // CRUD operations for Clients
  async addClient(clientData: any): Promise<string | null> {
    if (!this.isReady()) return null;

    try {
      const clientsRef = ref(this.database!, "clients");
      const newClientRef = push(clientsRef);
      await set(newClientRef, {
        ...clientData,
        id: newClientRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return newClientRef.key;
    } catch (error) {
      console.error("Failed to add client:", error);
      return null;
    }
  }

  async updateClient(clientId: string, clientData: any): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const clientRef = ref(this.database!, `clients/${clientId}`);
      await update(clientRef, {
        ...clientData,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Failed to update client:", error);
      return false;
    }
  }

  async deleteClient(clientId: string): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const clientRef = ref(this.database!, `clients/${clientId}`);
      await remove(clientRef);
      return true;
    } catch (error) {
      console.error("Failed to delete client:", error);
      return false;
    }
  }

  // Real-time listeners
  onPoolsChange(callback: (pools: any[]) => void): () => void {
    if (!this.isReady()) return () => {};

    const poolsRef = ref(this.database!, "pools");
    const unsubscribe = onValue(poolsRef, (snapshot) => {
      const data = snapshot.val();
      const pools = data ? Object.values(data) : [];
      callback(pools);
    });

    return unsubscribe;
  }

  onWorksChange(callback: (works: any[]) => void): () => void {
    if (!this.isReady()) return () => {};

    const worksRef = ref(this.database!, "works");
    const unsubscribe = onValue(worksRef, (snapshot) => {
      const data = snapshot.val();
      const works = data ? Object.values(data) : [];
      callback(works);
    });

    return unsubscribe;
  }

  onMaintenanceChange(callback: (maintenance: any[]) => void): () => void {
    if (!this.isReady()) return () => {};

    const maintenanceRef = ref(this.database!, "maintenance");
    const unsubscribe = onValue(maintenanceRef, (snapshot) => {
      const data = snapshot.val();
      const maintenance = data ? Object.values(data) : [];
      callback(maintenance);
    });

    return unsubscribe;
  }

  onClientsChange(callback: (clients: any[]) => void): () => void {
    if (!this.isReady()) return () => {};

    const clientsRef = ref(this.database!, "clients");
    const unsubscribe = onValue(clientsRef, (snapshot) => {
      const data = snapshot.val();
      const clients = data ? Object.values(data) : [];
      callback(clients);
    });

    return unsubscribe;
  }

  // Bulk sync operations
  async syncAllData(): Promise<{
    pools: any[];
    works: any[];
    maintenance: any[];
    clients: any[];
  } | null> {
    if (!this.isReady()) return null;

    try {
      const [
        poolsSnapshot,
        worksSnapshot,
        maintenanceSnapshot,
        clientsSnapshot,
      ] = await Promise.all([
        get(ref(this.database!, "pools")),
        get(ref(this.database!, "works")),
        get(ref(this.database!, "maintenance")),
        get(ref(this.database!, "clients")),
      ]);

      return {
        pools: poolsSnapshot.val() ? Object.values(poolsSnapshot.val()) : [],
        works: worksSnapshot.val() ? Object.values(worksSnapshot.val()) : [],
        maintenance: maintenanceSnapshot.val()
          ? Object.values(maintenanceSnapshot.val())
          : [],
        clients: clientsSnapshot.val()
          ? Object.values(clientsSnapshot.val())
          : [],
      };
    } catch (error) {
      console.error("Failed to sync all data:", error);
      return null;
    }
  }
}

// Export singleton instance
export const realFirebaseService = new RealFirebaseService();
export default realFirebaseService;
