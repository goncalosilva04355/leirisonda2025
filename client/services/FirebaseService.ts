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
    try {
      this.isFirebaseAvailable =
        db !== null && db !== undefined && typeof db === "object";
      if (this.isFirebaseAvailable) {
        console.log("🔥 FirebaseService running with Firebase sync");
      } else {
        console.log("📱 FirebaseService running in local-only mode");
      }
    } catch (error) {
      console.log("📱 FirebaseService fallback to local-only mode:", error);
      this.isFirebaseAvailable = false;
    }
  }

  // Users Collection
  async getUsers(): Promise<User[]> {
    if (!this.isFirebaseAvailable) {
      return this.getLocalUsers();
    }

    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          doc.data().createdAt,
      })) as User[];

      // Sync to localStorage as backup
      localStorage.setItem("users", JSON.stringify(users));
      return users;
    } catch (error) {
      console.error(
        "Error fetching users from Firebase, falling back to local:",
        error,
      );
      return this.getLocalUsers();
    }
  }

  private getLocalUsers(): User[] {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      return users;
    } catch (error) {
      console.error("Error fetching local users:", error);
      return [];
    }
  }

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<string> {
    if (!this.isFirebaseAvailable) {
      return this.createLocalUser(userData);
    }

    try {
      const usersRef = collection(db, "users");
      const docRef = await addDoc(usersRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("🔥 User created in Firebase:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(
        "Error creating user in Firebase, falling back to local:",
        error,
      );
      return this.createLocalUser(userData);
    }
  }

  private createLocalUser(userData: Omit<User, "id" | "createdAt">): string {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const users = this.getLocalUsers();
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    console.log("📱 User created locally:", newUser.id);
    return newUser.id;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    if (!this.isFirebaseAvailable) {
      return this.updateLocalUser(userId, updates);
    }

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log("🔥 User updated in Firebase:", userId);
    } catch (error) {
      console.error(
        "Error updating user in Firebase, falling back to local:",
        error,
      );
      this.updateLocalUser(userId, updates);
    }
  }

  private updateLocalUser(userId: string, updates: Partial<User>): void {
    try {
      const users = this.getLocalUsers();
      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem("users", JSON.stringify(users));
        console.log("📱 User updated locally:", userId);
      }
    } catch (error) {
      console.error("Error updating local user:", error);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    if (!this.isFirebaseAvailable) {
      return this.deleteLocalUser(userId);
    }

    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      console.log("🔥 User deleted from Firebase:", userId);
    } catch (error) {
      console.error(
        "Error deleting user from Firebase, falling back to local:",
        error,
      );
      this.deleteLocalUser(userId);
    }
  }

  private deleteLocalUser(userId: string): void {
    try {
      const users = this.getLocalUsers();
      const filteredUsers = users.filter((u) => u.id !== userId);
      localStorage.setItem("users", JSON.stringify(filteredUsers));
      console.log("📱 User deleted locally:", userId);
    } catch (error) {
      console.error("Error deleting local user:", error);
    }
  }

  // Works Collection
  async getWorks(): Promise<Work[]> {
    if (!this.isFirebaseAvailable) {
      return this.getLocalWorks();
    }

    try {
      const worksRef = collection(db, "works");
      const q = query(worksRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
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

      // Sync to localStorage as backup
      localStorage.setItem("works", JSON.stringify(works));
      return works;
    } catch (error) {
      console.error(
        "Error fetching works from Firebase, falling back to local:",
        error,
      );
      return this.getLocalWorks();
    }
  }

  private getLocalWorks(): Work[] {
    try {
      const works = JSON.parse(localStorage.getItem("works") || "[]");
      return works;
    } catch (error) {
      console.error("Error fetching local works:", error);
      return [];
    }
  }

  async createWork(
    workData: Omit<Work, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    if (!this.isFirebaseAvailable) {
      return this.createLocalWork(workData);
    }

    try {
      const worksRef = collection(db, "works");
      const docRef = await addDoc(worksRef, {
        ...workData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("🔥 Work created in Firebase:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(
        "Error creating work in Firebase, falling back to local:",
        error,
      );
      return this.createLocalWork(workData);
    }
  }

  private createLocalWork(
    workData: Omit<Work, "id" | "createdAt" | "updatedAt">,
  ): string {
    const newWork: Work = {
      ...workData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const works = this.getLocalWorks();
    works.push(newWork);
    localStorage.setItem("works", JSON.stringify(works));

    console.log("📱 Work created locally:", newWork.id);
    return newWork.id;
  }

  async updateWork(workId: string, updates: Partial<Work>): Promise<void> {
    if (!this.isFirebaseAvailable) {
      return this.updateLocalWork(workId, updates);
    }

    try {
      const workRef = doc(db, "works", workId);
      await updateDoc(workRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log("🔥 Work updated in Firebase:", workId);
    } catch (error) {
      console.error(
        "Error updating work in Firebase, falling back to local:",
        error,
      );
      this.updateLocalWork(workId, updates);
    }
  }

  private updateLocalWork(workId: string, updates: Partial<Work>): void {
    try {
      const works = this.getLocalWorks();
      const workIndex = works.findIndex((w) => w.id === workId);
      if (workIndex !== -1) {
        works[workIndex] = {
          ...works[workIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("works", JSON.stringify(works));
        console.log("📱 Work updated locally:", workId);
      }
    } catch (error) {
      console.error("Error updating local work:", error);
    }
  }

  async deleteWork(workId: string): Promise<void> {
    if (!this.isFirebaseAvailable) {
      return this.deleteLocalWork(workId);
    }

    try {
      const workRef = doc(db, "works", workId);
      await deleteDoc(workRef);
      console.log("🔥 Work deleted from Firebase:", workId);
    } catch (error) {
      console.error(
        "Error deleting work from Firebase, falling back to local:",
        error,
      );
      this.deleteLocalWork(workId);
    }
  }

  private deleteLocalWork(workId: string): void {
    try {
      const works = this.getLocalWorks();
      const filteredWorks = works.filter((w) => w.id !== workId);
      localStorage.setItem("works", JSON.stringify(filteredWorks));
      console.log("📱 Work deleted locally:", workId);
    } catch (error) {
      console.error("Error deleting local work:", error);
    }
  }

  // Pool Maintenances Collection
  async getMaintenances(): Promise<PoolMaintenance[]> {
    if (!this.isFirebaseAvailable) {
      return this.getLocalMaintenances();
    }

    try {
      const maintenancesRef = collection(db, "maintenances");
      const q = query(maintenancesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
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

      // Sync to localStorage as backup
      localStorage.setItem("pool_maintenances", JSON.stringify(maintenances));
      return maintenances;
    } catch (error) {
      console.error(
        "Error fetching maintenances from Firebase, falling back to local:",
        error,
      );
      return this.getLocalMaintenances();
    }
  }

  private getLocalMaintenances(): PoolMaintenance[] {
    try {
      const maintenances = JSON.parse(
        localStorage.getItem("pool_maintenances") || "[]",
      );
      return maintenances;
    } catch (error) {
      console.error("Error fetching local maintenances:", error);
      return [];
    }
  }

  async createMaintenance(
    maintenanceData: Omit<PoolMaintenance, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    if (!this.isFirebaseAvailable) {
      return this.createLocalMaintenance(maintenanceData);
    }

    try {
      const maintenancesRef = collection(db, "maintenances");
      const docRef = await addDoc(maintenancesRef, {
        ...maintenanceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("🔥 Maintenance created in Firebase:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(
        "Error creating maintenance in Firebase, falling back to local:",
        error,
      );
      return this.createLocalMaintenance(maintenanceData);
    }
  }

  private createLocalMaintenance(
    maintenanceData: Omit<PoolMaintenance, "id" | "createdAt" | "updatedAt">,
  ): string {
    const newMaintenance: PoolMaintenance = {
      ...maintenanceData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const maintenances = this.getLocalMaintenances();
    maintenances.push(newMaintenance);
    localStorage.setItem("pool_maintenances", JSON.stringify(maintenances));

    console.log("📱 Maintenance created locally:", newMaintenance.id);
    return newMaintenance.id;
  }

  async updateMaintenance(
    maintenanceId: string,
    updates: Partial<PoolMaintenance>,
  ): Promise<void> {
    if (!this.isFirebaseAvailable) {
      return this.updateLocalMaintenance(maintenanceId, updates);
    }

    try {
      const maintenanceRef = doc(db, "maintenances", maintenanceId);
      await updateDoc(maintenanceRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log("🔥 Maintenance updated in Firebase:", maintenanceId);
    } catch (error) {
      console.error(
        "Error updating maintenance in Firebase, falling back to local:",
        error,
      );
      this.updateLocalMaintenance(maintenanceId, updates);
    }
  }

  private updateLocalMaintenance(
    maintenanceId: string,
    updates: Partial<PoolMaintenance>,
  ): void {
    try {
      const maintenances = this.getLocalMaintenances();
      const maintenanceIndex = maintenances.findIndex(
        (m) => m.id === maintenanceId,
      );
      if (maintenanceIndex !== -1) {
        // Se as atualizações incluem intervenções, substitui completamente
        if (updates.interventions) {
          maintenances[maintenanceIndex] = {
            ...maintenances[maintenanceIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        } else {
          // Para outras atualizações, usa spread normal
          maintenances[maintenanceIndex] = {
            ...maintenances[maintenanceIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        localStorage.setItem("pool_maintenances", JSON.stringify(maintenances));
        console.log("📱 Maintenance updated locally:", maintenanceId);
        console.log(
          "📱 Total interventions after update:",
          maintenances[maintenanceIndex].interventions?.length || 0,
        );
      } else {
        console.error("��� Maintenance not found for update:", maintenanceId);
      }
    } catch (error) {
      console.error("Error updating local maintenance:", error);
    }
  }

  async deleteMaintenance(maintenanceId: string): Promise<void> {
    if (!this.isFirebaseAvailable) {
      return this.deleteLocalMaintenance(maintenanceId);
    }

    try {
      const maintenanceRef = doc(db, "maintenances", maintenanceId);
      await deleteDoc(maintenanceRef);
      console.log("🔥 Maintenance deleted from Firebase:", maintenanceId);
    } catch (error) {
      console.error(
        "Error deleting maintenance from Firebase, falling back to local:",
        error,
      );
      this.deleteLocalMaintenance(maintenanceId);
    }
  }

  private deleteLocalMaintenance(maintenanceId: string): void {
    try {
      const maintenances = this.getLocalMaintenances();
      const filteredMaintenances = maintenances.filter(
        (m) => m.id !== maintenanceId,
      );
      localStorage.setItem(
        "pool_maintenances",
        JSON.stringify(filteredMaintenances),
      );
      console.log("📱 Maintenance deleted locally:", maintenanceId);
    } catch (error) {
      console.error("Error deleting local maintenance:", error);
    }
  }

  // Real-time listeners (only work with Firebase)
  listenToWorks(callback: (works: Work[]) => void): () => void {
    if (!this.isFirebaseAvailable) {
      console.log("📱 Firebase not available, using local data for works");
      // Return local data immediately and setup a storage listener
      callback(this.getLocalWorks());

      const handleStorageChange = () => {
        callback(this.getLocalWorks());
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }

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

        // Update localStorage backup
        localStorage.setItem("works", JSON.stringify(works));
        callback(works);
      });

      this.unsubscribes.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error("Error listening to works:", error);
      // Fallback to local data
      callback(this.getLocalWorks());
      return () => {};
    }
  }

  listenToMaintenances(
    callback: (maintenances: PoolMaintenance[]) => void,
  ): () => void {
    if (!this.isFirebaseAvailable) {
      console.log(
        "📱 Firebase not available, using local data for maintenances",
      );
      callback(this.getLocalMaintenances());

      const handleStorageChange = () => {
        callback(this.getLocalMaintenances());
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }

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

        // Update localStorage backup
        localStorage.setItem("pool_maintenances", JSON.stringify(maintenances));
        callback(maintenances);
      });

      this.unsubscribes.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error("Error listening to maintenances:", error);
      callback(this.getLocalMaintenances());
      return () => {};
    }
  }

  listenToUsers(callback: (users: User[]) => void): () => void {
    if (!this.isFirebaseAvailable) {
      console.log("📱 Firebase not available, using local data for users");
      callback(this.getLocalUsers());

      const handleStorageChange = () => {
        callback(this.getLocalUsers());
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }

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

        // Update localStorage backup
        localStorage.setItem("users", JSON.stringify(users));
        callback(users);
      });

      this.unsubscribes.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error("Error listening to users:", error);
      callback(this.getLocalUsers());
      return () => {};
    }
  }

  // Sync local data to Firebase
  async syncLocalDataToFirebase(): Promise<void> {
    if (!this.isFirebaseAvailable) {
      console.log("���� Firebase not available, skipping sync");
      return;
    }

    try {
      console.log("🔄 Starting sync of local data to Firebase...");

      // Get local data
      const localWorks = this.getLocalWorks();
      const localMaintenances = this.getLocalMaintenances();
      const localUsers = this.getLocalUsers();

      // Sync works
      for (const work of localWorks) {
        try {
          const workRef = doc(db, "works", work.id);
          const workSnap = await getDoc(workRef);

          if (!workSnap.exists()) {
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

      // Sync users (only dynamically created ones, not predefined)
      for (const user of localUsers) {
        try {
          // Skip predefined users that are managed by AuthProvider
          const predefinedEmails = [
            "gongonsilva@gmail.com",
            "alexkamaryta@gmail.com",
          ];

          if (predefinedEmails.includes(user.email)) {
            continue; // Skip predefined users
          }

          const userRef = doc(db, "users", user.id);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await updateDoc(userRef, {
              ...user,
              createdAt: user.createdAt
                ? new Date(user.createdAt)
                : serverTimestamp(),
              updatedAt: user.updatedAt
                ? new Date(user.updatedAt)
                : serverTimestamp(),
            });
            console.log(`✅ Synced user: ${user.name} (${user.email})`);
          }
        } catch (error) {
          console.error(`❌ Error syncing user ${user.id}:`, error);
        }
      }

      console.log("✅ Local data sync completed (works, maintenances, users)");
    } catch (error) {
      console.error("❌ Error syncing local data:", error);
    }
  }

  // Cleanup listeners
  cleanup(): void {
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
    this.unsubscribes = [];
  }

  // Get Firebase availability status
  getFirebaseStatus(): { isAvailable: boolean; message: string } {
    return {
      isAvailable: this.isFirebaseAvailable,
      message: this.isFirebaseAvailable
        ? "Firebase connected and syncing"
        : "Running in local-only mode",
    };
  }
}

// Global singleton instance
export const firebaseService = FirebaseService.getInstance();
