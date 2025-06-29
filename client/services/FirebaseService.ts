import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Work, PoolMaintenance } from "@shared/types";

export class FirebaseService {
  private static instance: FirebaseService;
  private unsubscribes: (() => void)[] = [];
  private isFirebaseAvailable: boolean = false;

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  constructor() {
    // Check if Firebase is available
    this.isFirebaseAvailable = db !== null && auth !== null;
    if (!this.isFirebaseAvailable) {
      console.log("📱 FirebaseService running in local-only mode");
    }
  }

  // Users Collection
  async getUsers(): Promise<User[]> {
    if (!this.isFirebaseAvailable) {
      // Fallback to localStorage
      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        return users;
      } catch (error) {
        console.error("Error fetching local users:", error);
        return [];
      }
    }

    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          doc.data().createdAt,
      })) as User[];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<string> {
    try {
      const usersRef = collection(db, "users");
      const docRef = await addDoc(usersRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Works Collection
  async getWorks(): Promise<Work[]> {
    try {
      const worksRef = collection(db, "works");
      const q = query(worksRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          doc.data().createdAt,
        updatedAt:
          doc.data().updatedAt?.toDate?.()?.toISOString() ||
          doc.data().updatedAt,
      })) as Work[];
    } catch (error) {
      console.error("Error fetching works:", error);
      return [];
    }
  }

  async createWork(
    workData: Omit<Work, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    try {
      const worksRef = collection(db, "works");
      const docRef = await addDoc(worksRef, {
        ...workData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating work:", error);
      throw error;
    }
  }

  async updateWork(workId: string, updates: Partial<Work>): Promise<void> {
    try {
      const workRef = doc(db, "works", workId);
      await updateDoc(workRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating work:", error);
      throw error;
    }
  }

  async deleteWork(workId: string): Promise<void> {
    try {
      const workRef = doc(db, "works", workId);
      await deleteDoc(workRef);
    } catch (error) {
      console.error("Error deleting work:", error);
      throw error;
    }
  }

  // Pool Maintenances Collection
  async getMaintenances(): Promise<PoolMaintenance[]> {
    try {
      const maintenancesRef = collection(db, "maintenances");
      const q = query(maintenancesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          doc.data().createdAt,
        updatedAt:
          doc.data().updatedAt?.toDate?.()?.toISOString() ||
          doc.data().updatedAt,
      })) as PoolMaintenance[];
    } catch (error) {
      console.error("Error fetching maintenances:", error);
      return [];
    }
  }

  async createMaintenance(
    maintenanceData: Omit<PoolMaintenance, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    try {
      const maintenancesRef = collection(db, "maintenances");
      const docRef = await addDoc(maintenancesRef, {
        ...maintenanceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating maintenance:", error);
      throw error;
    }
  }

  async updateMaintenance(
    maintenanceId: string,
    updates: Partial<PoolMaintenance>,
  ): Promise<void> {
    try {
      const maintenanceRef = doc(db, "maintenances", maintenanceId);
      await updateDoc(maintenanceRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating maintenance:", error);
      throw error;
    }
  }

  async deleteMaintenance(maintenanceId: string): Promise<void> {
    try {
      const maintenanceRef = doc(db, "maintenances", maintenanceId);
      await deleteDoc(maintenanceRef);
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      throw error;
    }
  }

  // Real-time listeners
  listenToWorks(callback: (works: Work[]) => void): () => void {
    try {
      const worksRef = collection(db, "works");
      const q = query(worksRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const works = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.()?.toISOString() ||
            doc.data().createdAt,
          updatedAt:
            doc.data().updatedAt?.toDate?.()?.toISOString() ||
            doc.data().updatedAt,
        })) as Work[];
        callback(works);
      });

      this.unsubscribes.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error("Error listening to works:", error);
      return () => {};
    }
  }

  listenToMaintenances(
    callback: (maintenances: PoolMaintenance[]) => void,
  ): () => void {
    try {
      const maintenancesRef = collection(db, "maintenances");
      const q = query(maintenancesRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const maintenances = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.()?.toISOString() ||
            doc.data().createdAt,
          updatedAt:
            doc.data().updatedAt?.toDate?.()?.toISOString() ||
            doc.data().updatedAt,
        })) as PoolMaintenance[];
        callback(maintenances);
      });

      this.unsubscribes.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error("Error listening to maintenances:", error);
      return () => {};
    }
  }

  listenToUsers(callback: (users: User[]) => void): () => void {
    try {
      const usersRef = collection(db, "users");

      const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.()?.toISOString() ||
            doc.data().createdAt,
        })) as User[];
        callback(users);
      });

      this.unsubscribes.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error("Error listening to users:", error);
      return () => {};
    }
  }

  // Sync local data to Firebase
  async syncLocalDataToFirebase(): Promise<void> {
    try {
      console.log("🔄 Starting sync of local data to Firebase...");

      // Get local data
      const localWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const localMaintenances = JSON.parse(
        localStorage.getItem("pool_maintenances") || "[]",
      );

      // Sync works
      for (const work of localWorks) {
        try {
          // Check if work already exists in Firebase
          const workRef = doc(db, "works", work.id);
          const workSnap = await getDoc(workRef);

          if (!workSnap.exists()) {
            // Create new work in Firebase
            await updateDoc(workRef, {
              ...work,
              createdAt: work.createdAt
                ? new Date(work.createdAt)
                : serverTimestamp(),
              updatedAt: work.updatedAt
                ? new Date(work.updatedAt)
                : serverTimestamp(),
            });
            console.log(`✅ Synced work: ${work.workSheetNumber}`);
          }
        } catch (error) {
          console.error(`❌ Error syncing work ${work.id}:`, error);
        }
      }

      // Sync maintenances
      for (const maintenance of localMaintenances) {
        try {
          const maintenanceRef = doc(db, "maintenances", maintenance.id);
          const maintenanceSnap = await getDoc(maintenanceRef);

          if (!maintenanceSnap.exists()) {
            await updateDoc(maintenanceRef, {
              ...maintenance,
              createdAt: maintenance.createdAt
                ? new Date(maintenance.createdAt)
                : serverTimestamp(),
              updatedAt: maintenance.updatedAt
                ? new Date(maintenance.updatedAt)
                : serverTimestamp(),
            });
            console.log(`✅ Synced maintenance: ${maintenance.poolName}`);
          }
        } catch (error) {
          console.error(
            `❌ Error syncing maintenance ${maintenance.id}:`,
            error,
          );
        }
      }

      console.log("✅ Local data sync completed");
    } catch (error) {
      console.error("❌ Error syncing local data:", error);
      throw error;
    }
  }

  // Cleanup listeners
  cleanup(): void {
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
    this.unsubscribes = [];
  }
}

// Global singleton instance
export const firebaseService = FirebaseService.getInstance();
