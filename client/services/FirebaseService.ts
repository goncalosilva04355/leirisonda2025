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

    // Verificar duplicados localmente primeiro
    const existingMaintenances = this.getLocalMaintenances();
    const duplicate = existingMaintenances.find(
      (m) =>
        m.poolName?.toLowerCase().trim() ===
        maintenanceData.poolName?.toLowerCase().trim(),
    );

    if (duplicate) {
      throw new Error(
        `Já existe uma piscina com o nome "${maintenanceData.poolName}"`,
      );
    }

    // Criar apenas localmente para evitar duplicação
    existingMaintenances.push(newMaintenance);
    localStorage.setItem(
      "pool_maintenances",
      JSON.stringify(existingMaintenances),
    );
    console.log("📱 Piscina criada com sucesso:", newMaintenance.id);

    return newMaintenance.id;
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

  // Works collection methods would go here...
  // Users collection methods would go here...
  // Other methods...
}

export const firebaseService = FirebaseService.getInstance();
