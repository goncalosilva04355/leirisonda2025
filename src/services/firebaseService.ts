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
  clientName?: string;
  clientContact?: string;
  location?: string;
  observations?: string;
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
  folhaGerada?: boolean;
  contact?: string;
  expectedEndDate?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Collections - SIMPLES E DIRETO
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

// User Services - TODOS OS UTILIZADORES VEEM TODOS OS UTILIZADORES
export const userService = {
  // Listen to real-time changes
  subscribeToUsers(callback: (users: User[]) => void) {
    if (!db) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
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
    if (!db) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      return newUser.id;
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

  // Initialize admin user
  async initializeDefaultUsers() {
    if (!db) {
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

// Pool Services - TODOS OS UTILIZADORES VEEM TODAS AS PISCINAS
export const poolService = {
  subscribeToPools(callback: (pools: Pool[]) => void) {
    if (!isFirebaseAvailable()) {
      const pools = JSON.parse(localStorage.getItem("pools") || "[]");
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

  async deletePool(poolId: string) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const poolRef = doc(db, COLLECTIONS.POOLS, poolId);
    await deleteDoc(poolRef);
  },
};

// Maintenance Services - TODOS OS UTILIZADORES VEEM TODAS AS MANUTENÇÕES
export const maintenanceService = {
  subscribeToMaintenance(callback: (maintenance: Maintenance[]) => void) {
    if (!isFirebaseAvailable()) {
      const maintenance = JSON.parse(
        localStorage.getItem("maintenance") || "[]",
      );
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

  subscribeToFutureMaintenance(callback: (maintenance: Maintenance[]) => void) {
    if (!isFirebaseAvailable()) {
      const allMaintenance = JSON.parse(
        localStorage.getItem("maintenance") || "[]",
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

  async deleteMaintenance(maintenanceId: string) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const maintenanceRef = doc(db, COLLECTIONS.MAINTENANCE, maintenanceId);
    await deleteDoc(maintenanceRef);
  },
};

// Work Services - TODOS OS UTILIZADORES VEEM TODAS AS OBRAS
export const workService = {
  subscribeToWorks(callback: (works: Work[]) => void) {
    if (!isFirebaseAvailable()) {
      const works = JSON.parse(localStorage.getItem("works") || "[]");
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

  async deleteWork(workId: string) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const workRef = doc(db, COLLECTIONS.WORKS, workId);
    await deleteDoc(workRef);
  },
};

// Client Services - TODOS OS UTILIZADORES VEEM TODOS OS CLIENTES
export const clientService = {
  subscribeToClients(callback: (clients: any[]) => void) {
    if (!isFirebaseAvailable()) {
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");
      callback(clients);
      return () => {};
    }

    const q = query(
      collection(db, COLLECTIONS.CLIENTS),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const clients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(clients);
    });
  },

  async addClient(clientData: any) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.CLIENTS), {
      ...clientData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  },

  async updateClient(clientId: string, clientData: any) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const clientRef = doc(db, COLLECTIONS.CLIENTS, clientId);
    await updateDoc(clientRef, {
      ...clientData,
      updatedAt: Timestamp.now(),
    });
  },

  async deleteClient(clientId: string) {
    if (!isFirebaseAvailable()) {
      throw new Error("Firebase not configured");
    }

    const clientRef = doc(db, COLLECTIONS.CLIENTS, clientId);
    await deleteDoc(clientRef);
  },
};

// General sync service - SIMPLES
export const syncService = {
  async initializeData() {
    if (!isFirebaseAvailable()) {
      console.log("��️ Firebase não disponível - usando dados locais");
      return;
    }

    console.log("🚀 Inicializando dados do Firebase...");
    await userService.initializeDefaultUsers();
    console.log("✅ Dados inicializados com sucesso");
  },

  // Subscribe to all data changes - TODOS OS DADOS GLOBAIS
  subscribeToAllData(callbacks: {
    onUsersChange: (users: User[]) => void;
    onPoolsChange: (pools: Pool[]) => void;
    onMaintenanceChange: (maintenance: Maintenance[]) => void;
    onWorksChange: (works: Work[]) => void;
    onClientsChange: (clients: any[]) => void;
  }) {
    if (!isFirebaseAvailable()) {
      console.log("⚠️ Firebase não disponível - usando dados locais");
      callbacks.onUsersChange([]);
      callbacks.onPoolsChange([]);
      callbacks.onMaintenanceChange([]);
      callbacks.onWorksChange([]);
      callbacks.onClientsChange([]);
      return () => {};
    }

    console.log("📡 Configurando listeners globais...");

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
    const unsubscribeClients = clientService.subscribeToClients(
      callbacks.onClientsChange,
    );

    console.log("✅ Listeners globais configurados - todos veem tudo");

    return () => {
      unsubscribeUsers();
      unsubscribePools();
      unsubscribeMaintenance();
      unsubscribeWorks();
      unsubscribeClients();
    };
  },
};
