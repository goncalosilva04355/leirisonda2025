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
  return db !== null;
};

// User Services
export const userService = {
  // Listen to real-time changes
  subscribeToUsers(callback: (users: User[]) => void) {
    if (!db) {
      // Return empty unsubscribe function if db is not available
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, COLLECTIONS.USERS),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      callback(users);
    });
  },

  // Add new user
  async addUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">) {
    if (!db) {
      throw new Error("Firebase not configured");
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: Timestamp.now(),
    });

    // Trigger automatic synchronization for the new user
    console.log(
      `✅ Usuário ${userData.name} (${userData.email}) adicionado - sincronização automática ativada`,
    );
    await syncService.triggerUserSync(docRef.id);

    // Force immediate cross-device sync
    await syncService.forceCrossDeviceSync("users");

    return docRef.id;
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
  },

  // Delete user
  async deleteUser(userId: string) {
    if (!db) {
      throw new Error("Firebase not configured");
    }

    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await deleteDoc(userRef);
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
    if (!isFirebaseAvailable()) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, COLLECTIONS.POOLS),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const pools = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Pool[];
      callback(pools);
    });
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
  },

  // Delete pool
  async deletePool(poolId: string) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const poolRef = doc(db, COLLECTIONS.POOLS, poolId);
    await deleteDoc(poolRef);
  },
};

// Maintenance Services
export const maintenanceService = {
  // Listen to real-time changes
  subscribeToMaintenance(callback: (maintenance: Maintenance[]) => void) {
    if (!isFirebaseAvailable()) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, COLLECTIONS.MAINTENANCE),
      orderBy("scheduledDate", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const maintenance = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Maintenance[];
      callback(maintenance);
    });
  },

  // Get future maintenance
  subscribeToFutureMaintenance(callback: (maintenance: Maintenance[]) => void) {
    if (!isFirebaseAvailable()) {
      callback([]);
      return () => {};
    }

    const today = new Date().toISOString().split("T")[0];
    const q = query(
      collection(db, COLLECTIONS.MAINTENANCE),
      where("scheduledDate", ">=", today),
      orderBy("scheduledDate", "asc"),
    );
    return onSnapshot(q, (snapshot) => {
      const maintenance = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Maintenance[];
      callback(maintenance);
    });
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
  },

  // Delete maintenance
  async deleteMaintenance(maintenanceId: string) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const maintenanceRef = doc(db, COLLECTIONS.MAINTENANCE, maintenanceId);
    await deleteDoc(maintenanceRef);
  },
};

// Work Services
export const workService = {
  // Listen to real-time changes
  subscribeToWorks(callback: (works: Work[]) => void) {
    if (!isFirebaseAvailable()) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, COLLECTIONS.WORKS),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const works = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Work[];
      callback(works);
    });
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
  },

  // Delete work
  async deleteWork(workId: string) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const workRef = doc(db, COLLECTIONS.WORKS, workId);
    await deleteDoc(workRef);
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
