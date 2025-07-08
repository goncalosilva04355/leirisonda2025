// Local storage service - Firebase removed completely
// All data now stored in localStorage only

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
  updatedAt?: string;
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
  createdAt: string;
  updatedAt?: string;
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
  createdAt: string;
  updatedAt?: string;
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
  createdAt: string;
  updatedAt?: string;
}

// Collections
const COLLECTIONS = {
  USERS: "users",
  POOLS: "pools",
  MAINTENANCE: "maintenance",
  WORKS: "works",
  CLIENTS: "clients",
};

// Helper function for localStorage operations
const getStorageKey = (collection: string) => `leirisonda_${collection}`;

// Helper function to generate IDs
const generateId = () => Date.now().toString();

// Helper functions for localStorage operations
const getFromStorage = <T>(collection: string): T[] => {
  try {
    const data = localStorage.getItem(getStorageKey(collection));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${collection} from localStorage:`, error);
    return [];
  }
};

const saveToStorage = <T>(collection: string, data: T[]): void => {
  try {
    localStorage.setItem(getStorageKey(collection), JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${collection} to localStorage:`, error);
  }
};

// User Services
export const userService = {
  // Listen to real-time changes (simulate with storage events)
  subscribeToUsers(callback: (users: User[]) => void) {
    const users = getFromStorage<User>(COLLECTIONS.USERS);
    callback(users);

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getStorageKey(COLLECTIONS.USERS)) {
        const updatedUsers = getFromStorage<User>(COLLECTIONS.USERS);
        callback(updatedUsers);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  },

  // Add new user
  async addUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">) {
    const users = getFromStorage<User>(COLLECTIONS.USERS);
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveToStorage(COLLECTIONS.USERS, users);

    console.log(
      `✅ Usuário ${userData.name} (${userData.email}) adicionado localmente`,
    );
    return newUser.id;
  },

  // Update user
  async updateUser(userId: string, userData: Partial<User>) {
    const users = getFromStorage<User>(COLLECTIONS.USERS);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(COLLECTIONS.USERS, users);
      console.log(`✅ Usuário ${userId} atualizado localmente`);
    }
  },

  // Delete user
  async deleteUser(userId: string) {
    const users = getFromStorage<User>(COLLECTIONS.USERS);
    const filteredUsers = users.filter((u) => u.id !== userId);
    saveToStorage(COLLECTIONS.USERS, filteredUsers);
    console.log(`✅ Usuário ${userId} removido localmente`);
  },

  // Initialize default users
  async initializeDefaultUsers() {
    const users = getFromStorage<User>(COLLECTIONS.USERS);
    if (users.length === 0) {
      const realAdmin: Omit<User, "id" | "createdAt" | "updatedAt"> = {
        name: "Gonçalo Fonseca",
        email: "gongonsilva@gmail.com",
        role: "super_admin",
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
    const pools = getFromStorage<Pool>(COLLECTIONS.POOLS);
    callback(pools);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getStorageKey(COLLECTIONS.POOLS)) {
        const updatedPools = getFromStorage<Pool>(COLLECTIONS.POOLS);
        callback(updatedPools);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  },

  // Add new pool
  async addPool(poolData: Omit<Pool, "id" | "createdAt" | "updatedAt">) {
    const pools = getFromStorage<Pool>(COLLECTIONS.POOLS);
    const newPool: Pool = {
      ...poolData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    pools.push(newPool);
    saveToStorage(COLLECTIONS.POOLS, pools);
    console.log(`✅ Piscina ${poolData.name} adicionada localmente`);
    return newPool.id;
  },

  // Update pool
  async updatePool(poolId: string, poolData: Partial<Pool>) {
    const pools = getFromStorage<Pool>(COLLECTIONS.POOLS);
    const poolIndex = pools.findIndex((p) => p.id === poolId);

    if (poolIndex !== -1) {
      pools[poolIndex] = {
        ...pools[poolIndex],
        ...poolData,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(COLLECTIONS.POOLS, pools);
      console.log(`✅ Piscina ${poolId} atualizada localmente`);
    }
  },

  // Delete pool
  async deletePool(poolId: string) {
    const pools = getFromStorage<Pool>(COLLECTIONS.POOLS);
    const filteredPools = pools.filter((p) => p.id !== poolId);
    saveToStorage(COLLECTIONS.POOLS, filteredPools);
    console.log(`✅ Piscina ${poolId} removida localmente`);
  },
};

// Maintenance Services
export const maintenanceService = {
  // Listen to real-time changes
  subscribeToMaintenance(callback: (maintenance: Maintenance[]) => void) {
    const maintenance = getFromStorage<Maintenance>(COLLECTIONS.MAINTENANCE);
    callback(maintenance);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getStorageKey(COLLECTIONS.MAINTENANCE)) {
        const updatedMaintenance = getFromStorage<Maintenance>(
          COLLECTIONS.MAINTENANCE,
        );
        callback(updatedMaintenance);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  },

  // Get future maintenance
  subscribeToFutureMaintenance(callback: (maintenance: Maintenance[]) => void) {
    const allMaintenance = getFromStorage<Maintenance>(COLLECTIONS.MAINTENANCE);
    const today = new Date().toISOString().split("T")[0];
    const futureMaintenance = allMaintenance.filter(
      (m: Maintenance) => m.scheduledDate >= today,
    );
    callback(futureMaintenance);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getStorageKey(COLLECTIONS.MAINTENANCE)) {
        const updatedMaintenance = getFromStorage<Maintenance>(
          COLLECTIONS.MAINTENANCE,
        );
        const updatedFuture = updatedMaintenance.filter(
          (m: Maintenance) => m.scheduledDate >= today,
        );
        callback(updatedFuture);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  },

  // Add new maintenance
  async addMaintenance(
    maintenanceData: Omit<Maintenance, "id" | "createdAt" | "updatedAt">,
  ) {
    const maintenance = getFromStorage<Maintenance>(COLLECTIONS.MAINTENANCE);
    const newMaintenance: Maintenance = {
      ...maintenanceData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    maintenance.push(newMaintenance);
    saveToStorage(COLLECTIONS.MAINTENANCE, maintenance);
    console.log(
      `✅ Manutenção para ${maintenanceData.poolName} adicionada localmente`,
    );
    return newMaintenance.id;
  },

  // Update maintenance
  async updateMaintenance(
    maintenanceId: string,
    maintenanceData: Partial<Maintenance>,
  ) {
    const maintenance = getFromStorage<Maintenance>(COLLECTIONS.MAINTENANCE);
    const maintenanceIndex = maintenance.findIndex(
      (m) => m.id === maintenanceId,
    );

    if (maintenanceIndex !== -1) {
      maintenance[maintenanceIndex] = {
        ...maintenance[maintenanceIndex],
        ...maintenanceData,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(COLLECTIONS.MAINTENANCE, maintenance);
      console.log(`✅ Manutenção ${maintenanceId} atualizada localmente`);
    }
  },

  // Delete maintenance
  async deleteMaintenance(maintenanceId: string) {
    const maintenance = getFromStorage<Maintenance>(COLLECTIONS.MAINTENANCE);
    const filteredMaintenance = maintenance.filter(
      (m) => m.id !== maintenanceId,
    );
    saveToStorage(COLLECTIONS.MAINTENANCE, filteredMaintenance);
    console.log(`✅ Manutenção ${maintenanceId} removida localmente`);
  },
};

// Work Services
export const workService = {
  // Listen to real-time changes
  subscribeToWorks(callback: (works: Work[]) => void) {
    const works = getFromStorage<Work>(COLLECTIONS.WORKS);
    callback(works);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getStorageKey(COLLECTIONS.WORKS)) {
        const updatedWorks = getFromStorage<Work>(COLLECTIONS.WORKS);
        callback(updatedWorks);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  },

  // Add new work
  async addWork(workData: Omit<Work, "id" | "createdAt" | "updatedAt">) {
    const works = getFromStorage<Work>(COLLECTIONS.WORKS);
    const newWork: Work = {
      ...workData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    works.push(newWork);
    saveToStorage(COLLECTIONS.WORKS, works);
    console.log(`✅ Obra ${workData.title} adicionada localmente`);
    return newWork.id;
  },

  // Update work
  async updateWork(workId: string, workData: Partial<Work>) {
    const works = getFromStorage<Work>(COLLECTIONS.WORKS);
    const workIndex = works.findIndex((w) => w.id === workId);

    if (workIndex !== -1) {
      works[workIndex] = {
        ...works[workIndex],
        ...workData,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(COLLECTIONS.WORKS, works);
      console.log(`✅ Obra ${workId} atualizada localmente`);
    }
  },

  // Delete work
  async deleteWork(workId: string) {
    const works = getFromStorage<Work>(COLLECTIONS.WORKS);
    const filteredWorks = works.filter((w) => w.id !== workId);
    saveToStorage(COLLECTIONS.WORKS, filteredWorks);
    console.log(`✅ Obra ${workId} removida localmente`);
  },
};

// General sync service (simplified for localStorage)
export const syncService = {
  // Initialize all data
  async initializeData() {
    console.log("🚀 Inicializando dados locais...");
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
    console.log("📡 Configurando listeners para dados locais...");

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

    console.log("✅ Todos os listeners configurados com sucesso");

    // Return unsubscribe function
    return () => {
      console.log("🛑 Desconectando todos os listeners");
      unsubscribeUsers();
      unsubscribePools();
      unsubscribeMaintenance();
      unsubscribeWorks();
    };
  },
};
