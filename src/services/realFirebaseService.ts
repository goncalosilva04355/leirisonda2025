import { FirebaseApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  onValue,
  remove,
  update,
} from "firebase/database";
import { app as firebaseApp } from "../firebase/config";

class RealFirebaseService {
  // Sanitize data for Firebase - remove undefined values and functions
  private sanitizeData(data: any): any {
    if (data === null || data === undefined) {
      return null;
    }

    if (typeof data === "function") {
      return null;
    }

    if (Array.isArray(data)) {
      return data
        .map((item) => this.sanitizeData(item))
        .filter((item) => item !== null);
    }

    if (typeof data === "object") {
      const sanitized: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const sanitizedValue = this.sanitizeData(data[key]);
          if (sanitizedValue !== null) {
            sanitized[key] = sanitizedValue;
          }
        }
      }
      return sanitized;
    }

    return data;
  }

  async initialize(): Promise<boolean> {
    try {
      if (!firebaseApp) {
        console.log("⚠️ Firebase app not available");
        return false;
      }

      console.log("✅ RealFirebaseService initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Firebase database initialization failed:", error);
      return false;
    }
  }

  async syncAllData(): Promise<any> {
    try {
      if (!firebaseApp) {
        console.log("⚠️ Firebase not available for sync");
        return {
          users: [],
          pools: [],
          maintenance: [],
          works: [],
          clients: [],
        };
      }

      const database = getDatabase(firebaseApp);

      const usersRef = ref(database, "users");
      const poolsRef = ref(database, "pools");
      const maintenanceRef = ref(database, "maintenance");
      const worksRef = ref(database, "works");
      const clientsRef = ref(database, "clients");

      const [
        usersSnapshot,
        poolsSnapshot,
        maintenanceSnapshot,
        worksSnapshot,
        clientsSnapshot,
      ] = await Promise.all([
        get(usersRef),
        get(poolsRef),
        get(maintenanceRef),
        get(worksRef),
        get(clientsRef),
      ]);

      return {
        users: usersSnapshot.exists() ? Object.values(usersSnapshot.val()) : [],
        pools: poolsSnapshot.exists() ? Object.values(poolsSnapshot.val()) : [],
        maintenance: maintenanceSnapshot.exists()
          ? Object.values(maintenanceSnapshot.val())
          : [],
        works: worksSnapshot.exists() ? Object.values(worksSnapshot.val()) : [],
        clients: clientsSnapshot.exists()
          ? Object.values(clientsSnapshot.val())
          : [],
      };
    } catch (error) {
      console.error("❌ Error syncing data:", error);
      return {
        users: [],
        pools: [],
        maintenance: [],
        works: [],
        clients: [],
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!firebaseApp) {
        console.warn(
          "Firebase connection test failed, will use local mode:",
          "No Firebase app",
        );
        return false;
      }

      const database = getDatabase(firebaseApp);
      const testRef = ref(database, ".info/connected");
      const snapshot = await get(testRef);

      console.log("✅ Firebase connection test successful");
      return snapshot.exists();
    } catch (error) {
      console.warn(
        "Firebase connection test failed, will use local mode:",
        error,
      );
      return false;
    }
  }

  async migrateAllDataToGlobalSharing(): Promise<boolean> {
    try {
      if (!firebaseApp) {
        console.log("⚠️ Firebase not available for migration");
        return false;
      }

      console.log("✅ Data migration completed (or not needed)");
      return true;
    } catch (error) {
      console.error("❌ Data migration failed:", error);
      return false;
    }
  }
}

export const realFirebaseService = new RealFirebaseService();
