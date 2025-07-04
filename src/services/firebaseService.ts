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

  // Initialize default users
  async initializeDefaultUsers() {
    if (!db) {
      return; // Skip initialization if Firebase not configured
    }

    const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    if (usersSnapshot.empty) {
      const defaultUsers = [
        {
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
        },
        {
          name: "Maria Silva",
          email: "maria.silva@leirisonda.pt",
          role: "manager" as const,
          permissions: {
            obras: { view: true, create: true, edit: true, delete: false },
            manutencoes: {
              view: true,
              create: true,
              edit: true,
              delete: false,
            },
            piscinas: { view: true, create: true, edit: true, delete: false },
            utilizadores: {
              view: true,
              create: false,
              edit: false,
              delete: false,
            },
            relatorios: {
              view: true,
              create: true,
              edit: false,
              delete: false,
            },
            clientes: { view: true, create: true, edit: true, delete: false },
          },
          active: true,
          createdAt: "2024-01-15",
        },
        {
          name: "João Santos",
          email: "joao.santos@leirisonda.pt",
          role: "technician" as const,
          permissions: {
            obras: { view: true, create: false, edit: true, delete: false },
            manutencoes: {
              view: true,
              create: true,
              edit: true,
              delete: false,
            },
            piscinas: { view: true, create: false, edit: true, delete: false },
            utilizadores: {
              view: false,
              create: false,
              edit: false,
              delete: false,
            },
            relatorios: {
              view: true,
              create: false,
              edit: false,
              delete: false,
            },
            clientes: { view: true, create: false, edit: false, delete: false },
          },
          active: true,
          createdAt: "2024-02-01",
        },
      ];

      for (const user of defaultUsers) {
        await this.addUser(user);
      }
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
    const docRef = await addDoc(collection(db, COLLECTIONS.WORKS), {
      ...workData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Update work
  async updateWork(workId: string, workData: Partial<Work>) {
    const workRef = doc(db, COLLECTIONS.WORKS, workId);
    await updateDoc(workRef, {
      ...workData,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete work
  async deleteWork(workId: string) {
    const workRef = doc(db, COLLECTIONS.WORKS, workId);
    await deleteDoc(workRef);
  },
};

// General sync service
export const syncService = {
  // Initialize all data
  async initializeData() {
    await userService.initializeDefaultUsers();
  },

  // Subscribe to all data changes
  subscribeToAllData(callbacks: {
    onUsersChange: (users: User[]) => void;
    onPoolsChange: (pools: Pool[]) => void;
    onMaintenanceChange: (maintenance: Maintenance[]) => void;
    onWorksChange: (works: Work[]) => void;
  }) {
    const unsubscribeUsers = userService.subscribeToUsers(
      callbacks.onUsersChange,
    );
    const unsubscribePools = poolService.subscribeToPools(
      callbacks.onPoolsChange,
    );
    const unsubscribeMaintenance = maintenanceService.subscribeToMaintenance(
      callbacks.onMaintenanceChange,
    );
    const unsubscribeWorks = workService.subscribeToWorks(
      callbacks.onWorksChange,
    );

    // Return unsubscribe function
    return () => {
      unsubscribeUsers();
      unsubscribePools();
      unsubscribeMaintenance();
      unsubscribeWorks();
    };
  },
};
