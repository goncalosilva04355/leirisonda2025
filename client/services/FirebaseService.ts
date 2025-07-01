import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
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

      // Save locally as backup
      if (maintenances.length > 0) {
        localStorage.setItem("pool_maintenances", JSON.stringify(maintenances));
      }
      return maintenances;
    } catch (error) {
      console.error("Error fetching maintenances from Firebase:", error);
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
    const newMaintenance: PoolMaintenance = {
      ...maintenanceData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("🏊 Criando nova piscina:", newMaintenance.poolName);

    // Buscar piscinas existentes
    const existingMaintenances = this.getLocalMaintenances();

    // Verificar se já existe piscina com o mesmo nome
    const normalizedNewName = newMaintenance.poolName.toLowerCase().trim();
    const existingByName = existingMaintenances.find(
      (m) => m.poolName?.toLowerCase().trim() === normalizedNewName,
    );

    if (existingByName) {
      console.warn(
        `⚠️ Piscina '${newMaintenance.poolName}' já existe - atualizando em vez de criar duplicada`,
      );
      // Atualizar a existente em vez de criar nova
      existingByName.updatedAt = newMaintenance.updatedAt;
      Object.assign(existingByName, maintenanceData);

      localStorage.setItem(
        "pool_maintenances",
        JSON.stringify(existingMaintenances),
      );
      console.log("📱 Piscina atualizada com sucesso:", existingByName.id);
      return existingByName.id;
    }

    // Adicionar nova piscina
    existingMaintenances.push(newMaintenance);

    // Aplicar deduplicação robusta antes de salvar
    const uniqueMaintenances =
      this.deduplicateMaintenances(existingMaintenances);

    localStorage.setItem(
      "pool_maintenances",
      JSON.stringify(uniqueMaintenances),
    );
    console.log("📱 Piscina criada com sucesso:", newMaintenance.id);

    return newMaintenance.id;
  }

  private deduplicateMaintenances(
    maintenances: PoolMaintenance[],
  ): PoolMaintenance[] {
    const uniqueMap = new Map();

    maintenances.forEach((maintenance) => {
      if (!maintenance || !maintenance.poolName) return;

      const normalizedName = maintenance.poolName.toLowerCase().trim();
      const key = maintenance.id || normalizedName;

      if (!uniqueMap.has(normalizedName)) {
        uniqueMap.set(normalizedName, maintenance);
      }
    });

    const result = Array.from(uniqueMap.values());
    console.log(
      `🧹 Deduplicação: ${maintenances.length} -> ${result.length} piscinas`,
    );
    return result;
  }

  async updateMaintenance(
    maintenanceId: string,
    updates: Partial<PoolMaintenance>,
  ): Promise<void> {
    // Update locally first
    this.updateLocalMaintenance(maintenanceId, updates);

    // Try Firebase if available
    if (this.isFirebaseAvailable) {
      try {
        const maintenanceRef = doc(db, "maintenances", maintenanceId);
        await updateDoc(maintenanceRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });
        console.log("🔥 Maintenance updated in Firebase:", maintenanceId);
      } catch (error) {
        console.error(
          "⚠️ Firebase update failed, maintenance updated locally:",
          error,
        );
      }
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
        maintenances[maintenanceIndex] = {
          ...maintenances[maintenanceIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("pool_maintenances", JSON.stringify(maintenances));
        console.log("📱 Maintenance updated locally:", maintenanceId);
      } else {
        console.error("❌ Maintenance not found for update:", maintenanceId);
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
      console.log("🗑️ Maintenance deleted from Firebase:", maintenanceId);
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

  getFirebaseStatus() {
    return {
      isAvailable: this.isFirebaseAvailable,
      connection: this.isFirebaseAvailable ? "online" : "offline",
    };
  }

  // Works Collection Methods
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

      // Backup locally
      localStorage.setItem("works", JSON.stringify(works));
      return works;
    } catch (error) {
      console.error("Error fetching works from Firebase:", error);
      return this.getLocalWorks();
    }
  }

  getLocalWorks(): Work[] {
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
    const newWork: Work = {
      ...workData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save locally first
    const works = this.getLocalWorks();
    works.push(newWork);
    localStorage.setItem("works", JSON.stringify(works));
    console.log("📱 Work created locally:", newWork.id);

    // Try Firebase if available
    if (this.isFirebaseAvailable) {
      try {
        const worksRef = collection(db, "works");
        await addDoc(worksRef, {
          ...newWork,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log("🔥 Work synced to Firebase:", newWork.id);
      } catch (error) {
        console.error("⚠️ Firebase sync failed, work saved locally:", error);
      }
    }

    return newWork.id;
  }

  async updateWork(workId: string, updates: Partial<Work>): Promise<void> {
    // Update locally first
    this.updateLocalWork(workId, updates);

    // Try Firebase if available
    if (this.isFirebaseAvailable) {
      try {
        const workRef = doc(db, "works", workId);
        await updateDoc(workRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });
        console.log("🔥 Work updated in Firebase:", workId);
      } catch (error) {
        console.error(
          "⚠️ Firebase update failed, work updated locally:",
          error,
        );
      }
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
    // Delete locally first
    this.deleteLocalWork(workId);

    // Try Firebase if available
    if (this.isFirebaseAvailable) {
      try {
        const workRef = doc(db, "works", workId);
        await deleteDoc(workRef);
        console.log("🗑️ Work deleted from Firebase:", workId);
      } catch (error) {
        console.error(
          "⚠️ Firebase delete failed, work deleted locally:",
          error,
        );
      }
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

  // Users Collection Methods
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
      })) as User[];

      // Backup locally
      localStorage.setItem("users", JSON.stringify(users));
      return users;
    } catch (error) {
      console.error("Error fetching users from Firebase:", error);
      return this.getLocalUsers();
    }
  }

  getLocalUsers(): User[] {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      return users;
    } catch (error) {
      console.error("Error fetching local users:", error);
      return [];
    }
  }

  // Real-time listeners
  listenToWorks(callback: (works: Work[]) => void): () => void {
    if (!this.isFirebaseAvailable) {
      callback(this.getLocalWorks());
      return () => {};
    }

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

    return unsubscribe;
  }

  listenToMaintenances(
    callback: (maintenances: PoolMaintenance[]) => void,
  ): () => void {
    if (!this.isFirebaseAvailable) {
      callback(this.getLocalMaintenances());
      return () => {};
    }

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

    return unsubscribe;
  }

  listenToUsers(callback: (users: User[]) => void): () => void {
    if (!this.isFirebaseAvailable) {
      callback(this.getLocalUsers());
      return () => {};
    }

    const usersRef = collection(db, "users");

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      callback(users);
    });

    return unsubscribe;
  }

  // Consolidation and utility methods
  consolidateWorksFromAllBackups(): Work[] {
    try {
      const allSources = [
        localStorage.getItem("works"),
        localStorage.getItem("leirisonda_works"),
        sessionStorage.getItem("temp_works"),
      ];

      const allWorks: Work[] = [];
      const seenIds = new Set<string>();

      allSources.forEach((source, index) => {
        if (source) {
          try {
            const works = JSON.parse(source);
            if (Array.isArray(works)) {
              works.forEach((work) => {
                if (work.id && !seenIds.has(work.id)) {
                  seenIds.add(work.id);
                  allWorks.push(work);
                }
              });
            }
          } catch (parseError) {
            console.warn(`Parse error in source ${index}:`, parseError);
          }
        }
      });

      // Sort by creation date
      allWorks.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      console.log(
        `🔄 Consolidated ${allWorks.length} unique works from all sources`,
      );
      return allWorks;
    } catch (error) {
      console.error("Error consolidating works:", error);
      return [];
    }
  }
}

export const firebaseService = FirebaseService.getInstance();
