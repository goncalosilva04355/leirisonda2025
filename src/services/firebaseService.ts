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
import { db, isFirebaseReady } from "../firebase/config";

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
  return isFirebaseReady() && db !== null;
};

// Fallback to localStorage when Firebase is not available
const getFromStorage = <T>(collection: string): T[] => {
  try {
    const data = localStorage.getItem(`leirisonda_${collection}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${collection} from localStorage:`, error);
    return [];
  }
};

const saveToStorage = <T>(collection: string, data: T[]): void => {
  try {
    localStorage.setItem(`leirisonda_${collection}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${collection} to localStorage:`, error);
  }
};

// User Services
export const userService = {
  // Listen to real-time changes
  subscribeToUsers(callback: (users: User[]) => void) {
    if (!isFirebaseAvailable()) {
      const users = getFromStorage<User>(COLLECTIONS.USERS);
      callback(users);
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
    if (!isFirebaseAvailable()) {
      // Fallback to localStorage
      const users = getFromStorage<User>(COLLECTIONS.USERS);
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(newUser);
      saveToStorage(COLLECTIONS.USERS, users);
      console.log(`✅ Usuário ${userData.name} adicionado localmente`);
      return newUser.id;
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Usuário ${userData.name} adicionado no Firebase`);
    return docRef.id;
  },

  // Update user
  async updateUser(userId: string, userData: Partial<User>) {
    if (!isFirebaseAvailable()) {
      const users = getFromStorage<User>(COLLECTIONS.USERS);
      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        saveToStorage(COLLECTIONS.USERS, users);
      }
      return;
    }

    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete user
  async deleteUser(userId: string) {
    if (!isFirebaseAvailable()) {
      const users = getFromStorage<User>(COLLECTIONS.USERS);
      const filteredUsers = users.filter((u) => u.id !== userId);
      saveToStorage(COLLECTIONS.USERS, filteredUsers);
      return;
    }

    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await deleteDoc(userRef);
  },

  // Initialize default users
  async initializeDefaultUsers() {
    if (!isFirebaseAvailable()) {
      const users = getFromStorage<User>(COLLECTIONS.USERS);
      if (users.length === 0) {
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
        };
        await this.addUser(realAdmin);
      }
      return;
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
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        },
        active: true,
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
      const pools = getFromStorage<Pool>(COLLECTIONS.POOLS);
      callback(pools);
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
      const pools = getFromStorage<Pool>(COLLECTIONS.POOLS);
      const newPool = {
        ...poolData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      pools.push(newPool);
      saveToStorage(COLLECTIONS.POOLS, pools);
      console.log(`✅ Piscina ${poolData.name} adicionada localmente`);
      return newPool.id;
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.POOLS), {
      ...poolData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Piscina ${poolData.name} adicionada no Firebase`);
    return docRef.id;
  },

  // Update pool
  async updatePool(poolId: string, poolData: Partial<Pool>) {
    if (!isFirebaseAvailable()) {
      const pools = getFromStorage<Pool>(COLLECTIONS.POOLS);
      const poolIndex = pools.findIndex((p) => p.id === poolId);
      if (poolIndex !== -1) {
        pools[poolIndex] = { ...pools[poolIndex], ...poolData };
        saveToStorage(COLLECTIONS.POOLS, pools);
      }
      return;
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
      const pools = getFromStorage<Pool>(COLLECTIONS.POOLS);
      const filteredPools = pools.filter((p) => p.id !== poolId);
      saveToStorage(COLLECTIONS.POOLS, filteredPools);
      return;
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
      const maintenance = getFromStorage<Maintenance>(COLLECTIONS.MAINTENANCE);
      callback(maintenance);
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
      const allMaintenance = getFromStorage<Maintenance>(
        COLLECTIONS.MAINTENANCE,
      );
      const today = new Date().toISOString().split("T")[0];
      const futureMaintenance = allMaintenance.filter(
        (m: Maintenance) => m.scheduledDate >= today,
      );
      callback(futureMaintenance);
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
      const maintenance = getFromStorage<Maintenance>(COLLECTIONS.MAINTENANCE);
      const newMaintenance = {
        ...maintenanceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      maintenance.push(newMaintenance);
      saveToStorage(COLLECTIONS.MAINTENANCE, maintenance);
      console.log(
        `✅ Manutenção ${maintenanceData.poolName} adicionada localmente`,
      );
      return newMaintenance.id;
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.MAINTENANCE), {
      ...maintenanceData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(
      `✅ Manutenção ${maintenanceData.poolName} adicionada no Firebase`,
    );
    return docRef.id;
  },

  // Update maintenance
  async updateMaintenance(
    maintenanceId: string,
    maintenanceData: Partial<Maintenance>,
  ) {
    if (!isFirebaseAvailable()) {
      const maintenance = getFromStorage<Maintenance>(COLLECTIONS.MAINTENANCE);
      const maintenanceIndex = maintenance.findIndex(
        (m) => m.id === maintenanceId,
      );
      if (maintenanceIndex !== -1) {
        maintenance[maintenanceIndex] = {
          ...maintenance[maintenanceIndex],
          ...maintenanceData,
        };
        saveToStorage(COLLECTIONS.MAINTENANCE, maintenance);
      }
      return;
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
      const maintenance = getFromStorage<Maintenance>(COLLECTIONS.MAINTENANCE);
      const filteredMaintenance = maintenance.filter(
        (m) => m.id !== maintenanceId,
      );
      saveToStorage(COLLECTIONS.MAINTENANCE, filteredMaintenance);
      return;
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
      const works = getFromStorage<Work>(COLLECTIONS.WORKS);
      callback(works);
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
      const works = getFromStorage<Work>(COLLECTIONS.WORKS);
      const newWork = {
        ...workData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      works.push(newWork);
      saveToStorage(COLLECTIONS.WORKS, works);
      console.log(`✅ Obra ${workData.title} adicionada localmente`);
      return newWork.id;
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.WORKS), {
      ...workData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Obra ${workData.title} adicionada no Firebase`);
    return docRef.id;
  },

  // Update work
  async updateWork(workId: string, workData: Partial<Work>) {
    if (!isFirebaseAvailable()) {
      const works = getFromStorage<Work>(COLLECTIONS.WORKS);
      const workIndex = works.findIndex((w) => w.id === workId);
      if (workIndex !== -1) {
        works[workIndex] = { ...works[workIndex], ...workData };
        saveToStorage(COLLECTIONS.WORKS, works);
      }
      return;
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
      const works = getFromStorage<Work>(COLLECTIONS.WORKS);
      const filteredWorks = works.filter((w) => w.id !== workId);
      saveToStorage(COLLECTIONS.WORKS, filteredWorks);
      return;
    }

    const workRef = doc(db, COLLECTIONS.WORKS, workId);
    await deleteDoc(workRef);
  },
};

// General sync service
export const syncService = {
  // Initialize all data
  async initializeData() {
    console.log("🚀 Inicializando dados...");
    await userService.initializeDefaultUsers();
    console.log("✅ Dados inicializados com sucesso");
  },

  // Subscribe to all data changes
  subscribeToAllData(callbacks: {
    onUsersChange: (users: User[]) => void;
    onPoolsChange: (pools: Pool[]) => void;
    onMaintenanceChange: (maintenance: Maintenance[]) => void;
    onWorksChange: (works: Work[]) => void;
  }) {
    console.log("📡 Configurando listeners...");

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

    console.log("✅ Todos os listeners configurados");

    // Return unsubscribe function
    return () => {
      console.log("🛑 Desconectando listeners");
      unsubscribeUsers();
      unsubscribePools();
      unsubscribeMaintenance();
      unsubscribeWorks();
    };
  },
};
