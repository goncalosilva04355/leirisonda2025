import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  setDoc,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { syncManager } from "../utils/syncManager";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "manager" | "technician";
  permissions: {
    obras: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    manutencoes: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    piscinas: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    utilizadores: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    relatorios: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    clientes: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
  active: boolean;
  createdAt: string;
  updatedAt?: Timestamp;
}

export interface Pool {
  id: string;
  name: string;
  location: string;
  type: string;
  client: string;
  status: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Maintenance {
  id: string;
  poolId: string;
  poolName: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  description: string;
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  client: string;
  location: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  startDate: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  assignedTo: string;
  assignedUsers?: Array<{ id: string; name: string }>;
  assignedUserIds?: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Collections
const COLLECTIONS = {
  USERS: "users",
  POOLS: "pools",
  MAINTENANCE: "maintenance",
  WORKS: "works",
  CLIENTS: "clients",
};

// Helper function to check if Firebase is available
const isFirebaseAvailable = () => {
  // Always return false to prevent quota errors
  return false;
};

// Critical: Wrapper for Firebase operations with quota protection
const safeFirebaseOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
): Promise<T> => {
  // Check if Firebase operations are allowed
  if (!syncManager.isFirebaseOperationAllowed()) {
    const status = syncManager.getSyncStatus();
    if (status.emergencyShutdown) {
      throw new Error(
        "Firebase em shutdown de emergência - operação bloqueada",
      );
    }
    if (status.quotaExceeded) {
      throw new Error(
        `Firebase quota excedida - aguarde ${status.hoursUntilRetry || 24} horas`,
      );
    }
    throw new Error("Firebase operação bloqueada por proteção de quota");
  }

  try {
    return await operation();
  } catch (error: any) {
    // Check for quota exceeded errors
    if (
      error.code === "resource-exhausted" ||
      error.message?.includes("quota") ||
      error.message?.includes("Quota exceeded")
    ) {
      console.error(`🚨 QUOTA EXCEEDED in ${operationName}:`, error);
      syncManager.markQuotaExceeded();

      throw new Error("Firebase quota excedida - sincronização desabilitada");
    }

    // Re-throw other errors
    throw error;
  }
};

// User Services
export const userService = {
  // Listen to real-time changes
  subscribeToUsers(callback: (users: User[]) => void) {
    // Always use localStorage instead of Firebase to prevent quota
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    callback(users);
    return () => {};
  },

  // Add new user
  async addUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">) {
    if (!db) {
      throw new Error("Firebase not configured");
    }

    return await safeFirebaseOperation(async () => {
      const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: Timestamp.now(),
      });

      console.log(`✅ Usuário ${userData.name} (${userData.email}) adicionado`);

      // Skip automatic sync to prevent quota issues
      // await syncService.triggerUserSync(docRef.id);
      // await syncService.forceCrossDeviceSync("users");

      return docRef.id;
    }, "addUser");
  },

  // Update user
  async updateUser(userId: string, userData: Partial<User>) {
    if (!db) {
      throw new Error("Firebase not configured");
    }

    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    });

    // Trigger automatic synchronization
    console.log(
      `✅ Usuário ${userId} atualizado - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("update", "users", userId);
  },

  // Delete user
  async deleteUser(userId: string) {
    if (!db) {
      throw new Error("Firebase not configured");
    }

    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await deleteDoc(userRef);

    // Trigger automatic synchronization
    console.log(
      `✅ Usuário ${userId} removido - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("delete", "users", userId);
  },

  // Initialize only real admin user - NO MOCK DATA
  async initializeDefaultUsers() {
    if (!db) {
      return; // Skip initialization if Firebase not configured
    }

    const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    if (usersSnapshot.empty) {
      const realAdmin = {
        name: "Gonçalo Fonseca",
        email: "gongonsilva@gmail.com",
        role: "super_admin" as const,
        permissions: {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        },
        active: true,
        createdAt: "2024-01-01",
      };

      await this.addUser(realAdmin);
      console.log("✅ Admin user created successfully");
    }
  },
};

// Pool Services
export const poolService = {
  // Listen to real-time changes
  subscribeToPools(callback: (pools: Pool[]) => void) {
    // Use localStorage to prevent Firebase quota
    const pools = JSON.parse(localStorage.getItem("pools") || "[]");
    callback(pools);
    return () => {};
  },

  // Add new pool
  async addPool(poolData: Omit<Pool, "id" | "createdAt" | "updatedAt">) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.POOLS), {
      ...poolData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Trigger automatic synchronization
    console.log(
      `✅ Piscina ${poolData.name} adicionada - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("create", "pools", docRef.id);

    return docRef.id;
  },

  // Update pool
  async updatePool(poolId: string, poolData: Partial<Pool>) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const poolRef = doc(db, COLLECTIONS.POOLS, poolId);
    await updateDoc(poolRef, {
      ...poolData,
      updatedAt: Timestamp.now(),
    });

    // Trigger automatic synchronization
    console.log(
      `✅ Piscina ${poolId} atualizada - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("update", "pools", poolId);
  },

  // Delete pool
  async deletePool(poolId: string) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const poolRef = doc(db, COLLECTIONS.POOLS, poolId);
    await deleteDoc(poolRef);

    // Trigger automatic synchronization
    console.log(
      `✅ Piscina ${poolId} removida - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("delete", "pools", poolId);
  },
};

// Maintenance Services
export const maintenanceService = {
  // Listen to real-time changes
  subscribeToMaintenance(callback: (maintenance: Maintenance[]) => void) {
    // Use localStorage to prevent Firebase quota
    const maintenance = JSON.parse(localStorage.getItem("maintenance") || "[]");
    callback(maintenance);
    return () => {};
  },

  // Get future maintenance
  subscribeToFutureMaintenance(callback: (maintenance: Maintenance[]) => void) {
    // Use localStorage to prevent Firebase quota
    const allMaintenance = JSON.parse(
      localStorage.getItem("maintenance") || "[]",
    );
    const today = new Date().toISOString().split("T")[0];
    const futureMaintenance = allMaintenance.filter(
      (m: Maintenance) => m.scheduledDate >= today,
    );
    callback(futureMaintenance);
    return () => {};
  },

  // Add new maintenance
  async addMaintenance(
    maintenanceData: Omit<Maintenance, "id" | "createdAt" | "updatedAt">,
  ) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.MAINTENANCE), {
      ...maintenanceData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Trigger automatic synchronization
    console.log(
      `✅ Manutenção para ${maintenanceData.poolName} adicionada - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("create", "maintenance", docRef.id);

    return docRef.id;
  },

  // Update maintenance
  async updateMaintenance(
    maintenanceId: string,
    maintenanceData: Partial<Maintenance>,
  ) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const maintenanceRef = doc(db, COLLECTIONS.MAINTENANCE, maintenanceId);
    await updateDoc(maintenanceRef, {
      ...maintenanceData,
      updatedAt: Timestamp.now(),
    });

    // Trigger automatic synchronization
    console.log(
      `✅ Manutenção ${maintenanceId} atualizada - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("update", "maintenance", maintenanceId);
  },

  // Delete maintenance
  async deleteMaintenance(maintenanceId: string) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const maintenanceRef = doc(db, COLLECTIONS.MAINTENANCE, maintenanceId);
    await deleteDoc(maintenanceRef);

    // Trigger automatic synchronization
    console.log(
      `✅ Manutenção ${maintenanceId} removida - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("delete", "maintenance", maintenanceId);
  },
};

// Work Services
export const workService = {
  // Listen to real-time changes
  subscribeToWorks(callback: (works: Work[]) => void) {
    // Use localStorage to prevent Firebase quota
    const works = JSON.parse(localStorage.getItem("works") || "[]");
    callback(works);
    return () => {};
  },

  // Add new work
  async addWork(workData: Omit<Work, "id" | "createdAt" | "updatedAt">) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.WORKS), {
      ...workData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Trigger automatic synchronization
    console.log(
      `✅ Obra ${workData.title} adicionada - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("create", "works", docRef.id);

    return docRef.id;
  },

  // Update work
  async updateWork(workId: string, workData: Partial<Work>) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const workRef = doc(db, COLLECTIONS.WORKS, workId);
    await updateDoc(workRef, {
      ...workData,
      updatedAt: Timestamp.now(),
    });

    // Trigger automatic synchronization
    console.log(
      `✅ Obra ${workId} atualizada - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("update", "works", workId);
  },

  // Delete work
  async deleteWork(workId: string) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const workRef = doc(db, COLLECTIONS.WORKS, workId);
    await deleteDoc(workRef);

    // Trigger automatic synchronization
    console.log(
      `✅ Obra ${workId} removida - sincronização automática ativada`,
    );
    await syncService.triggerAutoSync("delete", "works", workId);
  },
};

// General sync service with enhanced cross-device synchronization
export const syncService = {
  // Initialize all data
  async initializeData() {
    if (!isFirebaseAvailable()) {
      console.log("⚠️ Firebase não disponível - sincronização limitada");
      return; // Skip initialization if Firebase not configured
    }

    console.log("🚀 Inicializando dados do Firebase...");
    await userService.initializeDefaultUsers();
    console.log("✅ Dados inicializados com sucesso");
  },

  // Trigger user synchronization after adding a new user
  async triggerUserSync(userId: string) {
    if (!isFirebaseAvailable()) {
      console.log(
        "Firebase não disponível - sincronização de usuário limitada",
      );
      return;
    }

    try {
      // The real-time listeners will automatically pick up the new user
      console.log(`🔄 Sincronização ativada para usuário: ${userId}`);

      // Broadcast sync event to other tabs/windows
      const syncEvent = new CustomEvent("firebase-sync", {
        detail: { type: "user", id: userId, timestamp: Date.now() },
      });
      window.dispatchEvent(syncEvent);

      // Update localStorage to trigger cross-tab sync
      const currentUsers = localStorage.getItem("users");
      if (currentUsers) {
        const usersData = JSON.parse(currentUsers);
        localStorage.setItem("users", JSON.stringify(usersData));
      }
    } catch (error) {
      console.error("❌ Falha ao sincronizar usuário:", error);
    }
  },

  // Force cross-device synchronization for specific collection
  async forceCrossDeviceSync(collection: string) {
    if (!isFirebaseAvailable()) {
      console.log(
        `Firebase não disponível - sincronização de ${collection} limitada`,
      );
      return;
    }

    try {
      console.log(
        `🔄 Forçando sincronização entre dispositivos para: ${collection}`,
      );

      // Broadcast sync event to all tabs/windows
      const syncEvent = new CustomEvent("firebase-sync", {
        detail: {
          type: "forced-sync",
          collection,
          timestamp: Date.now(),
          source: "manual",
        },
      });
      window.dispatchEvent(syncEvent);

      // Trigger storage event for cross-tab sync
      const storageEvent = new StorageEvent("storage", {
        key: collection,
        newValue: localStorage.getItem(collection),
        oldValue: null,
        storageArea: localStorage,
      });
      window.dispatchEvent(storageEvent);

      console.log(
        `✅ Sincronização entre dispositivos ativada para: ${collection}`,
      );
    } catch (error) {
      console.error(`❌ Erro ao forçar sincronização de ${collection}:`, error);
    }
  },

  // Enhanced automatic sync for all data changes
  async triggerAutoSync(
    changeType: string,
    collectionName: string,
    documentId?: string,
  ) {
    if (!isFirebaseAvailable()) {
      return;
    }

    try {
      console.log(
        `🔄 Auto-sync disparado: ${changeType} em ${collectionName}${documentId ? ` (${documentId})` : ""}`,
      );

      // Force immediate sync for specific collection
      await this.forceCrossDeviceSync(collectionName);

      // Trigger global sync notification
      const syncEvent = new CustomEvent("firebase-auto-sync", {
        detail: {
          changeType,
          collection: collectionName,
          documentId,
          timestamp: Date.now(),
        },
      });
      window.dispatchEvent(syncEvent);
    } catch (error) {
      console.error(`❌ Erro no auto-sync para ${collectionName}:`, error);
    }
  },

  // Subscribe to all data changes with enhanced sync capabilities
  subscribeToAllData(callbacks: {
    onUsersChange: (users: User[]) => void;
    onPoolsChange: (pools: Pool[]) => void;
    onMaintenanceChange: (maintenance: Maintenance[]) => void;
    onWorksChange: (works: Work[]) => void;
  }) {
    if (!isFirebaseAvailable()) {
      // Return empty data and empty unsubscribe function
      console.log("⚠️ Firebase não disponível - retornando dados vazios");
      callbacks.onUsersChange([]);
      callbacks.onPoolsChange([]);
      callbacks.onMaintenanceChange([]);
      callbacks.onWorksChange([]);
      return () => {};
    }

    console.log(
      "📡 Configurando listeners para sincronização em tempo real...",
    );

    // Enhanced subscription with automatic sync triggers
    const unsubscribeUsers = userService.subscribeToUsers((users) => {
      console.log(
        `👥 Mudança detectada em usuários: ${users.length} registros`,
      );
      callbacks.onUsersChange(users);
      this.triggerAutoSync("users-changed", "users");
    });

    const unsubscribePools = poolService.subscribeToPools((pools) => {
      console.log(
        `🏊 Mudança detectada em piscinas: ${pools.length} registros`,
      );
      callbacks.onPoolsChange(pools);
      this.triggerAutoSync("pools-changed", "pools");
    });

    const unsubscribeMaintenance = maintenanceService.subscribeToMaintenance(
      (maintenance) => {
        console.log(
          `🔧 Mudança detectada em manutenções: ${maintenance.length} registros`,
        );
        callbacks.onMaintenanceChange(maintenance);
        this.triggerAutoSync("maintenance-changed", "maintenance");
      },
    );

    const unsubscribeWorks = workService.subscribeToWorks((works) => {
      console.log(`⚒️ Mudança detectada em obras: ${works.length} registros`);
      callbacks.onWorksChange(works);
      this.triggerAutoSync("works-changed", "works");
    });

    console.log("✅ Todos os listeners configurados com sucesso");

    // Return unsubscribe function
    return () => {
      console.log("🛑 Desconectando todos os listeners de sincronização");
      unsubscribeUsers();
      unsubscribePools();
      unsubscribeMaintenance();
      unsubscribeWorks();
    };
  },
};
