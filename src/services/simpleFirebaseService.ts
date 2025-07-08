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
  getDocs,
  where,
} from "firebase/firestore";
import { getDB } from "../firebase/config";

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

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  pools: string[];
  createdAt: string;
  updatedAt?: Timestamp;
}

// Simple collections - all users access the same data
const COLLECTIONS = {
  USERS: "users",
  POOLS: "pools",
  MAINTENANCE: "maintenance",
  WORKS: "works",
  CLIENTS: "clients",
};

// Helper function to check if Firebase is available
const isFirebaseAvailable = async () => {
  const db = await getDB();
  return db !== null;
};

// User Services
export const userService = {
  // Listen to real-time changes
  subscribeToUsers(callback: (users: User[]) => void) {
    const setupListener = async () => {
      const db = await getDB();
      if (!db) {
        console.log(
          "📱 Firebase não disponível - carregando utilizadores do localStorage",
        );
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

        console.log(`👥 ${users.length} utilizadores carregados`);
        callback(users);

        // Save to localStorage as backup
        localStorage.setItem("users", JSON.stringify(users));
      });
    };

    setupListener();
    return () => {};
  },

  // Add new user
  async addUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">) {
    const db = await getDB();
    if (!db) {
      console.log("📱 Adicionando utilizador localmente");
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

    console.log(`✅ Utilizador ${userData.name} adicionado`);
    return docRef.id;
  },

  // Update user
  async updateUser(userId: string, userData: Partial<User>) {
    const db = await getDB();
    if (!db) {
      console.log("📱 Firebase não disponível para atualização");
      return;
    }

    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ Utilizador ${userId} atualizado`);
  },

  // Delete user
  async deleteUser(userId: string) {
    const db = await getDB();
    if (!db) {
      console.log("📱 Firebase não disponível para eliminação");
      return;
    }

    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await deleteDoc(userRef);
    console.log(`✅ Utilizador ${userId} eliminado`);
  },

  // Initialize default admin user
  async initializeDefaultUsers() {
    const db = await getDB();
    if (!db) {
      console.log(
        "📱 Firebase não disponível - a saltar inicialização de utilizadores",
      );
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
        createdAt: "2024-01-01",
      };

      await this.addUser(realAdmin);
      console.log("✅ Utilizador admin criado");
    }
  },
};

// Pool Services
export const poolService = {
  // Listen to real-time changes
  subscribeToPools(callback: (pools: Pool[]) => void) {
    const setupListener = async () => {
      const db = await getDB();
      if (!db) {
        console.log(
          "📱 Firebase não disponível - carregando piscinas do localStorage",
        );
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

        console.log(`🏊 ${pools.length} piscinas carregadas`);
        callback(pools);

        // Save to localStorage as backup
        localStorage.setItem("pools", JSON.stringify(pools));
      });
    };

    setupListener();
    return () => {};
  },

  // Add new pool
  async addPool(poolData: Omit<Pool, "id" | "createdAt" | "updatedAt">) {
    const db = await getDB();
    if (!db) {
      console.log("📱 Adicionando piscina localmente");
      const pools = JSON.parse(localStorage.getItem("pools") || "[]");
      const newPool = {
        ...poolData,
        id: Date.now().toString(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      pools.push(newPool);
      localStorage.setItem("pools", JSON.stringify(pools));
      return newPool.id;
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.POOLS), {
      ...poolData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Piscina ${poolData.name} adicionada`);
    return docRef.id;
  },

  // Update pool
  async updatePool(poolId: string, poolData: Partial<Pool>) {
    const db = await getDB();
    if (!db) return;

    const poolRef = doc(db, COLLECTIONS.POOLS, poolId);
    await updateDoc(poolRef, {
      ...poolData,
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ Piscina ${poolId} atualizada`);
  },

  // Delete pool
  async deletePool(poolId: string) {
    const db = await getDB();
    if (!db) return;

    const poolRef = doc(db, COLLECTIONS.POOLS, poolId);
    await deleteDoc(poolRef);
    console.log(`✅ Piscina ${poolId} eliminada`);
  },
};

// Maintenance Services
export const maintenanceService = {
  // Listen to real-time changes
  subscribeToMaintenance(callback: (maintenance: Maintenance[]) => void) {
    const setupListener = async () => {
      const db = await getDB();
      if (!db) {
        console.log(
          "📱 Firebase não disponível - carregando manutenções do localStorage",
        );
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

        console.log(`🔧 ${maintenance.length} manutenções carregadas`);
        callback(maintenance);

        // Save to localStorage as backup
        localStorage.setItem("maintenance", JSON.stringify(maintenance));
      });
    };

    setupListener();
    return () => {};
  },

  // Get future maintenance
  subscribeToFutureMaintenance(callback: (maintenance: Maintenance[]) => void) {
    const setupListener = async () => {
      const db = await getDB();
      if (!db) {
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
    };

    setupListener();
    return () => {};
  },

  // Add new maintenance
  async addMaintenance(
    maintenanceData: Omit<Maintenance, "id" | "createdAt" | "updatedAt">,
  ) {
    const db = await getDB();
    if (!db) {
      console.log("📱 Adicionando manutenção localmente");
      const maintenance = JSON.parse(
        localStorage.getItem("maintenance") || "[]",
      );
      const newMaintenance = {
        ...maintenanceData,
        id: Date.now().toString(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      maintenance.push(newMaintenance);
      localStorage.setItem("maintenance", JSON.stringify(maintenance));
      return newMaintenance.id;
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.MAINTENANCE), {
      ...maintenanceData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Manutenção para ${maintenanceData.poolName} adicionada`);
    return docRef.id;
  },

  // Update maintenance
  async updateMaintenance(
    maintenanceId: string,
    maintenanceData: Partial<Maintenance>,
  ) {
    const db = await getDB();
    if (!db) return;

    const maintenanceRef = doc(db, COLLECTIONS.MAINTENANCE, maintenanceId);
    await updateDoc(maintenanceRef, {
      ...maintenanceData,
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ Manutenção ${maintenanceId} atualizada`);
  },

  // Delete maintenance
  async deleteMaintenance(maintenanceId: string) {
    const db = await getDB();
    if (!db) return;

    const maintenanceRef = doc(db, COLLECTIONS.MAINTENANCE, maintenanceId);
    await deleteDoc(maintenanceRef);
    console.log(`✅ Manutenção ${maintenanceId} eliminada`);
  },
};

// Work Services
export const workService = {
  // Listen to real-time changes
  subscribeToWorks(callback: (works: Work[]) => void) {
    const setupListener = async () => {
      const db = await getDB();
      if (!db) {
        console.log(
          "📱 Firebase não disponível - carregando obras do localStorage",
        );
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

        console.log(`⚒️ ${works.length} obras carregadas`);
        callback(works);

        // Save to localStorage as backup
        localStorage.setItem("works", JSON.stringify(works));
      });
    };

    setupListener();
    return () => {};
  },

  // Add new work
  async addWork(workData: Omit<Work, "id" | "createdAt" | "updatedAt">) {
    const db = await getDB();
    if (!db) {
      console.log("📱 Adicionando obra localmente");
      const works = JSON.parse(localStorage.getItem("works") || "[]");
      const newWork = {
        ...workData,
        id: Date.now().toString(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      works.push(newWork);
      localStorage.setItem("works", JSON.stringify(works));
      return newWork.id;
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.WORKS), {
      ...workData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Obra ${workData.title} adicionada`);
    return docRef.id;
  },

  // Update work
  async updateWork(workId: string, workData: Partial<Work>) {
    const db = await getDB();
    if (!db) return;

    const workRef = doc(db, COLLECTIONS.WORKS, workId);
    await updateDoc(workRef, {
      ...workData,
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ Obra ${workId} atualizada`);
  },

  // Delete work
  async deleteWork(workId: string) {
    const db = await getDB();
    if (!db) return;

    const workRef = doc(db, COLLECTIONS.WORKS, workId);
    await deleteDoc(workRef);
    console.log(`✅ Obra ${workId} eliminada`);
  },
};

// Client Services
export const clientService = {
  // Listen to real-time changes
  subscribeToClients(callback: (clients: Client[]) => void) {
    const setupListener = async () => {
      const db = await getDB();
      if (!db) {
        console.log(
          "📱 Firebase não disponível - carregando clientes do localStorage",
        );
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
        })) as Client[];

        console.log(`👤 ${clients.length} clientes carregados`);
        callback(clients);

        // Save to localStorage as backup
        localStorage.setItem("clients", JSON.stringify(clients));
      });
    };

    setupListener();
    return () => {};
  },

  // Add new client
  async addClient(clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) {
    const db = await getDB();
    if (!db) {
      console.log("📱 Adicionando cliente localmente");
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");
      const newClient = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      clients.push(newClient);
      localStorage.setItem("clients", JSON.stringify(clients));
      return newClient.id;
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.CLIENTS), {
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Cliente ${clientData.name} adicionado`);
    return docRef.id;
  },

  // Update client
  async updateClient(clientId: string, clientData: Partial<Client>) {
    const db = await getDB();
    if (!db) return;

    const clientRef = doc(db, COLLECTIONS.CLIENTS, clientId);
    await updateDoc(clientRef, {
      ...clientData,
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ Cliente ${clientId} atualizado`);
  },

  // Delete client
  async deleteClient(clientId: string) {
    const db = await getDB();
    if (!db) return;

    const clientRef = doc(db, COLLECTIONS.CLIENTS, clientId);
    await deleteDoc(clientRef);
    console.log(`✅ Cliente ${clientId} eliminado`);
  },
};

// General sync service
export const syncService = {
  // Initialize all data
  async initializeData() {
    console.log("🚀 Inicializando dados simples...");
    await userService.initializeDefaultUsers();
    console.log("✅ Dados inicializados");
  },

  // Subscribe to all data changes
  subscribeToAllData(callbacks: {
    onUsersChange: (users: User[]) => void;
    onPoolsChange: (pools: Pool[]) => void;
    onMaintenanceChange: (maintenance: Maintenance[]) => void;
    onWorksChange: (works: Work[]) => void;
    onClientsChange: (clients: Client[]) => void;
  }) {
    console.log("📡 Configurando listeners simples...");

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

    console.log("✅ Todos os listeners configurados");

    // Return unsubscribe function
    return () => {
      console.log("🛑 Desconectando listeners");
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribePools) unsubscribePools();
      if (unsubscribeMaintenance) unsubscribeMaintenance();
      if (unsubscribeWorks) unsubscribeWorks();
      if (unsubscribeClients) unsubscribeClients();
    };
  },
};
