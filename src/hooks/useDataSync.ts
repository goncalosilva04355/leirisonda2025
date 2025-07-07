import { useState, useEffect, useCallback } from "react";
import { realFirebaseService } from "../services/realFirebaseService";
import { useDataMutationSync } from "./useAutoDataSync";

// Firebase initialization disabled to prevent quota exceeded
// realFirebaseService.initialize();

// Simulate data types
export interface Pool {
  id: string;
  name: string;
  location: string;
  client: string;
  type: string;
  status: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  poolId: string;
  poolName: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | "scheduled";
  description: string;
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  notes?: string;
  observations?: string;
  clientName?: string;
  clientContact?: string;
  location?: string;
  createdAt: string;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  client: string;
  contact?: string;
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
  createdAt: string;
  createdBy?: string; // Name of user who created this work
  createdByUser?: string; // UID of user who created this work
  updatedAt?: string; // Last update timestamp
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  pools: string[];
  createdAt: string;
}

// Mock data removed - no auto-populated test data
const mockPools: Pool[] = [];

// Mock maintenance data removed - no auto-populated test data
const mockMaintenance: Maintenance[] = [];

// Mock works data - DISABLED to prevent auto-populated test data
const mockWorks: Work[] = [];

// Mock clients data
// Production - no mock data
const mockClients: Client[] = [];

export interface SyncState {
  pools: Pool[];
  maintenance: Maintenance[];
  futureMaintenance: Maintenance[];
  works: Work[];
  clients: Client[];
  isLoading: boolean;
  lastSync: Date | null;
  error: string | null;
}

export interface SyncActions {
  addPool: (pool: Omit<Pool, "id" | "createdAt">) => void;
  updatePool: (id: string, pool: Partial<Pool>) => void;
  deletePool: (id: string) => void;

  addMaintenance: (maintenance: Omit<Maintenance, "id" | "createdAt">) => void;
  updateMaintenance: (id: string, maintenance: Partial<Maintenance>) => void;
  deleteMaintenance: (id: string) => void;

  addWork: (work: Omit<Work, "id" | "createdAt">) => void;
  updateWork: (id: string, work: Partial<Work>) => void;
  deleteWork: (id: string) => void;

  addClient: (client: Omit<Client, "id" | "createdAt">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  syncWithFirebase: () => Promise<void>;
  enableSync: (enabled: boolean) => void;
  cleanAllData: () => Promise<void>;
}

export function useDataSync(): SyncState & SyncActions {
  // Simple initial state - move complex recovery to useEffect
  const [state, setState] = useState<SyncState>({
    pools: [],
    maintenance: [],
    futureMaintenance: [],
    works: [],
    clients: [],
    lastSync: null,
  });

  // Recovery logic moved to useEffect
  useEffect(() => {
    const recoverData = (dataType: string) => {
      console.log(`🔍 RECOVERY: Attempting to recover ${dataType}...`);

      // SOURCE 1: Primary storage
      try {
        const primary = localStorage.getItem(dataType);
        if (primary) {
          const data = JSON.parse(primary);
          if (data.length > 0) {
            console.log(
              `✅ PRIMARY: ${dataType} recovered (${data.length} items)`,
            );
            return data;
          }
        }
      } catch (error) {
        console.warn(`⚠️ PRIMARY: ${dataType} corrupted, trying backups...`);
      }

      // SOURCE 2: Rolling backups (last 3 saves)
      try {
        const rolling = localStorage.getItem(`${dataType}_backup_rolling`);
        if (rolling) {
          const backups = JSON.parse(rolling);
          if (backups.length > 0) {
            const latest = backups[backups.length - 1];
            if (latest.data && latest.data.length > 0) {
              console.log(
                `🔄 ROLLING: ${dataType} recovered (${latest.data.length} items)`,
              );
              return latest.data;
            }
          }
        }
      } catch (error) {
        console.warn(
          `⚠️ ROLLING: ${dataType} backup corrupted, trying daily...`,
        );
      }

      // SOURCE 3: Daily backups (try last 7 days)
      for (let i = 0; i < 7; i++) {
        try {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          const daily = localStorage.getItem(`${dataType}_daily_${dateStr}`);
          if (daily) {
            const data = JSON.parse(daily);
            if (data.length > 0) {
              console.log(
                `📅 DAILY: ${dataType} recovered from ${dateStr} (${data.length} items)`,
              );
              return data;
            }
          }
        } catch (error) {
          console.warn(`⚠️ DAILY: ${dataType} backup corrupted for day ${i}`);
        }
      }

      // SOURCE 4: Emergency backups
      try {
        const keys = Object.keys(localStorage).filter((key) =>
          key.startsWith("emergency_backup_"),
        );
        for (const key of keys.reverse()) {
          try {
            const emergency = JSON.parse(localStorage.getItem(key)!);
            if (emergency[dataType] && emergency[dataType].length > 0) {
              console.log(
                `🚨 EMERGENCY: ${dataType} recovered (${emergency[dataType].length} items)`,
              );
              return emergency[dataType];
            }
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        console.warn(`⚠️ EMERGENCY: Search failed for ${dataType}`);
      }

      console.warn(
        `❌ FAILED: No valid ${dataType} found in ANY backup source!`,
      );
      return [];
    };

    try {
      // Execute recovery
      const works = recoverData("works");
      const pools = recoverData("pools");
      const maintenance = recoverData("maintenance");
      const clients = recoverData("clients");

      console.log("🛡️ RECOVERY COMPLETE:", {
        works: works.length,
        pools: pools.length,
        maintenance: maintenance.length,
        clients: clients.length,
      });

      const today = new Date();
      const futureMaintenance = maintenance.filter(
        (m: Maintenance) => new Date(m.scheduledDate) >= today,
      );

      setState({
        pools,
        maintenance,
        futureMaintenance,
        works,
        clients,
        lastSync: null,
      });
    } catch (error) {
      console.error("🚨 RECOVERY: Complete recovery failure:", error);
      // Keep initial state if recovery fails
    }
  }, []); // Run once on mount

  // Firebase sync is always enabled with fixed configuration
  const [syncEnabled, setSyncEnabled] = useState(true);

  // BULLETPROOF DATA PROTECTION - Multiple backup layers
  useEffect(() => {
    try {
      const timestamp = new Date().toISOString();

      // LAYER 1: Create backup before any save operation
      const createBackup = (dataType: string, data: any[]) => {
        if (data.length > 0) {
          // Main storage
          localStorage.setItem(dataType, JSON.stringify(data));

          // Backup 1 - Timestamped backup
          localStorage.setItem(
            `${dataType}_backup_${Date.now()}`,
            JSON.stringify(data),
          );

          // Backup 2 - Rolling backup (keep last 3)
          const backupKey = `${dataType}_backup_rolling`;
          const existingBackups = JSON.parse(
            localStorage.getItem(backupKey) || "[]",
          );
          existingBackups.push({ timestamp, data });
          if (existingBackups.length > 3) existingBackups.shift(); // Keep only last 3
          localStorage.setItem(backupKey, JSON.stringify(existingBackups));

          // Backup 3 - Daily backup
          const today = new Date().toISOString().split("T")[0];
          localStorage.setItem(
            `${dataType}_daily_${today}`,
            JSON.stringify(data),
          );

          console.log(
            `🔒 PROTECTED: ${dataType} saved with 3 backup layers (${data.length} items)`,
          );
        }
      };

      // LAYER 2: Integrity check before saving
      const hasValidData =
        state.works.length > 0 ||
        state.pools.length > 0 ||
        state.maintenance.length > 0 ||
        state.clients.length > 0;

      if (!hasValidData) {
        console.warn(
          "⚠️ PROTECTION: Skipping save - no valid data to prevent overwrite",
        );
        return;
      }

      // LAYER 3: Save with multiple backups
      createBackup("works", state.works);
      createBackup("pools", state.pools);
      createBackup("maintenance", state.maintenance);
      createBackup("clients", state.clients);

      // LAYER 4: Audit log
      const auditLog = JSON.parse(
        localStorage.getItem("data_audit_log") || "[]",
      );
      auditLog.push({
        timestamp,
        action: "auto_save",
        counts: {
          works: state.works.length,
          pools: state.pools.length,
          maintenance: state.maintenance.length,
          clients: state.clients.length,
        },
      });
      if (auditLog.length > 100) auditLog.shift(); // Keep last 100 entries
      localStorage.setItem("data_audit_log", JSON.stringify(auditLog));

      console.log("✅ BULLETPROOF SAVE COMPLETED:", {
        works: state.works.length,
        pools: state.pools.length,
        maintenance: state.maintenance.length,
        clients: state.clients.length,
        timestamp,
      });
    } catch (error) {
      console.error("🚨 CRITICAL ERROR in bulletproof save:", error);
      // Emergency backup to a different key
      try {
        localStorage.setItem(
          "emergency_backup_" + Date.now(),
          JSON.stringify({
            works: state.works,
            pools: state.pools,
            maintenance: state.maintenance,
            clients: state.clients,
            timestamp: new Date().toISOString(),
            error: error.message,
          }),
        );
      } catch (emergencyError) {
        console.error("💥 EMERGENCY BACKUP ALSO FAILED:", emergencyError);
      }
    }
  }, [state.works, state.pools, state.maintenance, state.clients]);

  // Hook para sincronização automática em mutações - with debugging
  const withAutoSync = <T extends any[], R>(
    fn: (...args: T) => R | Promise<R>,
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        console.log("🔄 Executing data operation with args:", args);
        const result = await fn(...args);
        console.log("✅ Data operation completed successfully");
        return result;
      } catch (error) {
        console.error("❌ Error in data operation:", error);
        throw error;
      }
    };
  };

  // Initial sync when enabled
  useEffect(() => {
    if (syncEnabled) {
      const performInitialSync = async () => {
        try {
          console.log("🚀 Initializing Firebase for cross-device sync...");

          const initialized = realFirebaseService.initialize();
          if (initialized) {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
              console.log("🔄 Testing Firebase connection...");
              const connectionOk = await realFirebaseService.testConnection();
              if (!connectionOk) {
                console.warn(
                  "⚠️ Firebase connection test failed, using local mode only",
                );
                setState((prev) => ({
                  ...prev,
                  isLoading: false,
                  error: "Modo Local - Sem sincronização entre dispositivos",
                }));
                return;
              }

              console.log(
                "✅ Firebase connected successfully - cross-device sync enabled",
              );

              // Perform initial data sync to pull any existing data
              try {
                const firebaseData = await realFirebaseService.syncAllData();
                if (firebaseData) {
                  console.log("📥 Syncing existing Firebase data:", {
                    works: firebaseData.works.length,
                    pools: firebaseData.pools.length,
                    maintenance: firebaseData.maintenance.length,
                    clients: firebaseData.clients.length,
                  });

                  // Merge Firebase data with local data
                  setState((prev) => {
                    const mergedWorks = [...prev.works];
                    const mergedPools = [...prev.pools];
                    const mergedMaintenance = [...prev.maintenance];
                    const mergedClients = [...prev.clients];

                    // Add Firebase data that's not already in local storage
                    firebaseData.works.forEach((work: Work) => {
                      if (!mergedWorks.find((w) => w.id === work.id)) {
                        mergedWorks.push(work);
                      }
                    });

                    firebaseData.pools.forEach((pool: Pool) => {
                      if (!mergedPools.find((p) => p.id === pool.id)) {
                        mergedPools.push(pool);
                      }
                    });

                    firebaseData.maintenance.forEach((maint: Maintenance) => {
                      if (!mergedMaintenance.find((m) => m.id === maint.id)) {
                        mergedMaintenance.push(maint);
                      }
                    });

                    firebaseData.clients.forEach((client: Client) => {
                      if (!mergedClients.find((c) => c.id === client.id)) {
                        mergedClients.push(client);
                      }
                    });

                    const today = new Date();
                    const futureMaintenance = mergedMaintenance.filter(
                      (m) => new Date(m.scheduledDate) >= today,
                    );

                    console.log("🔄 Merged data counts:", {
                      works: mergedWorks.length,
                      pools: mergedPools.length,
                      maintenance: mergedMaintenance.length,
                      clients: mergedClients.length,
                    });

                    return {
                      ...prev,
                      works: mergedWorks,
                      pools: mergedPools,
                      maintenance: mergedMaintenance,
                      futureMaintenance,
                      clients: mergedClients,
                    };
                  });
                }
              } catch (syncError) {
                console.warn("⚠️ Initial data sync failed:", syncError);
              }

              // Set successful sync status
              setState((prev) => ({
                ...prev,
                isLoading: false,
                lastSync: new Date(),
                error: null,
              }));
            } catch (error: any) {
              console.warn("⚠️ Firebase sync failed, using local mode:", error);
              setState((prev) => ({
                ...prev,
                isLoading: false,
                error: "Modo Local - Sem sincronização entre dispositivos",
              }));
            }
          } else {
            console.warn(
              "❌ Firebase initialization failed - using local mode",
            );
            setState((prev) => ({
              ...prev,
              error: "Modo Local - Firebase não configurado",
              isLoading: false,
            }));
          }
        } catch (error: any) {
          console.error("❌ Firebase initialization error:", error);
          setState((prev) => ({
            ...prev,
            error: `Erro na inicialização: ${error.message}`,
            isLoading: false,
          }));
        }
      };

      performInitialSync();
    } else {
      // When sync is disabled, clear any errors
      setState((prev) => ({
        ...prev,
        error: null,
        isLoading: false,
      }));
    }
  }, [syncEnabled]);

  // Real-time listeners
  useEffect(() => {
    if (!syncEnabled || !realFirebaseService.isReady()) {
      return;
    }

    // Set up real-time listeners
    const unsubscribePools = realFirebaseService.onPoolsChange((pools) => {
      setState((prev) => {
        // ABSOLUTE PROTECTION: Never overwrite local data with empty arrays
        if (pools.length === 0 && prev.pools.length > 0) {
          console.warn(
            "🛡️ BLOCKED: Firebase tried to overwrite pools with empty array",
          );
          return prev; // Keep existing data
        }

        // Only update if Firebase has more/newer data
        if (pools.length >= prev.pools.length) {
          console.log(
            `🔄 SYNC: Pools updated from Firebase (${pools.length} items)`,
          );
          return { ...prev, pools };
        }

        console.log(
          `🛡️ PROTECTED: Keeping local pools (${prev.pools.length} > ${pools.length})`,
        );
        return prev;
      });
    });

    const unsubscribeWorks = realFirebaseService.onWorksChange((works) => {
      setState((prev) => {
        // ABSOLUTE PROTECTION: Never overwrite local data with empty arrays
        if (works.length === 0 && prev.works.length > 0) {
          console.warn(
            "🛡️ BLOCKED: Firebase tried to overwrite works with empty array",
          );
          return prev; // Keep existing data
        }

        // Only update if Firebase has more/newer data
        if (works.length >= prev.works.length) {
          console.log(
            `🔄 SYNC: Works updated from Firebase (${works.length} items)`,
          );
          return { ...prev, works };
        }

        console.log(
          `🛡️ PROTECTED: Keeping local works (${prev.works.length} > ${works.length})`,
        );
        return prev;
      });
    });

    const unsubscribeMaintenance = realFirebaseService.onMaintenanceChange(
      (maintenance) => {
        setState((prev) => {
          // ABSOLUTE PROTECTION: Never overwrite local data with empty arrays
          if (maintenance.length === 0 && prev.maintenance.length > 0) {
            console.warn(
              "🛡️ BLOCKED: Firebase tried to overwrite maintenance with empty array",
            );
            return prev; // Keep existing data
          }

          const today = new Date();
          const futureMaintenance = maintenance.filter(
            (m) => new Date(m.scheduledDate) >= today,
          );

          // Only update if Firebase has more/newer data
          if (maintenance.length >= prev.maintenance.length) {
            console.log(
              `🔄 SYNC: Maintenance updated from Firebase (${maintenance.length} items)`,
            );
            return { ...prev, maintenance, futureMaintenance };
          }

          console.log(
            `🛡️ PROTECTED: Keeping local maintenance (${prev.maintenance.length} > ${maintenance.length})`,
          );
          return prev;
        });
      },
    );

    const unsubscribeClients = realFirebaseService.onClientsChange(
      (clients) => {
        setState((prev) => {
          // ABSOLUTE PROTECTION: Never overwrite local data with empty arrays
          if (clients.length === 0 && prev.clients.length > 0) {
            console.warn(
              "🛡️ BLOCKED: Firebase tried to overwrite clients with empty array",
            );
            return prev; // Keep existing data
          }

          // Only update if Firebase has more/newer data
          if (clients.length >= prev.clients.length) {
            console.log(
              `🔄 SYNC: Clients updated from Firebase (${clients.length} items)`,
            );
            return { ...prev, clients };
          }

          console.log(
            `🛡️ PROTECTED: Keeping local clients (${prev.clients.length} > ${clients.length})`,
          );
          return prev;
        });
      },
    );

    // Cleanup function
    return () => {
      unsubscribePools();
      unsubscribeWorks();
      unsubscribeMaintenance();
      unsubscribeClients();
    };
  }, [syncEnabled]);

  // CRUD operations

  // Pools
  const addPool = useCallback(
    withAutoSync(async (poolData: Omit<Pool, "id" | "createdAt">) => {
      const newPool: Pool = {
        ...poolData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        pools: [...prev.pools, newPool],
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.addPool(newPool);
      }
    }),
    [withAutoSync],
  );

  const updatePool = useCallback(
    withAutoSync(async (id: string, poolData: Partial<Pool>) => {
      setState((prev) => ({
        ...prev,
        pools: prev.pools.map((pool) =>
          pool.id === id ? { ...pool, ...poolData } : pool,
        ),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.updatePool(id, poolData);
      }
    }),
    [withAutoSync],
  );

  const deletePool = useCallback(
    withAutoSync(async (id: string) => {
      setState((prev) => ({
        ...prev,
        pools: prev.pools.filter((pool) => pool.id !== id),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.deletePool(id);
      }
    }),
    [withAutoSync],
  );

  // Maintenance
  const addMaintenance = useCallback(
    withAutoSync(
      async (maintenanceData: Omit<Maintenance, "id" | "createdAt">) => {
        const newMaintenance: Maintenance = {
          ...maintenanceData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };

        // Update both maintenance and futureMaintenance arrays
        const today = new Date();
        const isFuture =
          new Date(newMaintenance.scheduledDate) >= today &&
          (newMaintenance.status === "scheduled" ||
            newMaintenance.status === "pending");

        setState((prev) => ({
          ...prev,
          maintenance: [...prev.maintenance, newMaintenance],
          futureMaintenance: isFuture
            ? [...prev.futureMaintenance, newMaintenance]
            : prev.futureMaintenance,
        }));

        if (realFirebaseService.isReady()) {
          await realFirebaseService.addMaintenance(newMaintenance);
        }
      },
    ),
    [withAutoSync],
  );

  const updateMaintenance = useCallback(
    withAutoSync(async (id: string, maintenanceData: Partial<Maintenance>) => {
      setState((prev) => {
        const updatedMaintenance = prev.maintenance.map((maint) =>
          maint.id === id ? { ...maint, ...maintenanceData } : maint,
        );

        // Recalculate future maintenance
        const today = new Date();
        const futureMaintenance = updatedMaintenance.filter(
          (m) =>
            new Date(m.scheduledDate) >= today &&
            (m.status === "scheduled" || m.status === "pending"),
        );

        return {
          ...prev,
          maintenance: updatedMaintenance,
          futureMaintenance,
        };
      });

      if (realFirebaseService.isReady()) {
        await realFirebaseService.updateMaintenance(id, maintenanceData);
      }
    }),
    [withAutoSync],
  );

  const deleteMaintenance = useCallback(
    withAutoSync(async (id: string) => {
      setState((prev) => ({
        ...prev,
        maintenance: prev.maintenance.filter((maint) => maint.id !== id),
        futureMaintenance: prev.futureMaintenance.filter(
          (maint) => maint.id !== id,
        ),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.deleteMaintenance(id);
      }
    }),
    [withAutoSync],
  );

  // Works
  const addWork = useCallback(
    withAutoSync(async (workData: Omit<Work, "id" | "createdAt">) => {
      console.log("🔧 addWork called with data:", workData);

      // Get current user info for tracking who created the work
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );

      const newWork: Work = {
        ...workData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: currentUser ? currentUser.name : "Sistema",
        createdByUser: currentUser ? currentUser.uid : "system",
      };

      console.log("🆕 Creating new work:", newWork);
      console.log("👤 Created by user:", currentUser?.name || "Unknown");

      setState((prev) => {
        const updatedWorks = [...prev.works, newWork];
        console.log("📊 Updated works count:", updatedWorks.length);
        return {
          ...prev,
          works: updatedWorks,
        };
      });

      if (realFirebaseService.isReady()) {
        console.log("🔥 Syncing to Firebase...");
        await realFirebaseService.addWork(newWork);
      } else {
        console.log("📱 Firebase not ready, using local storage only");
      }

      console.log("✅ Work added successfully");
    }),
    [withAutoSync],
  );

  const updateWork = useCallback(
    withAutoSync(async (id: string, workData: Partial<Work>) => {
      console.log("🔧 updateWork called with:", { id, workData });

      setState((prev) => {
        const workIndex = prev.works.findIndex((work) => work.id === id);
        if (workIndex === -1) {
          console.error("❌ Work not found for ID:", id);
          return prev;
        }

        const updatedWorks = prev.works.map((work) =>
          work.id === id ? { ...work, ...workData } : work,
        );

        console.log("✅ Work updated in state:", updatedWorks[workIndex]);

        return {
          ...prev,
          works: updatedWorks,
        };
      });

      if (realFirebaseService.isReady()) {
        console.log("🔥 Syncing work update to Firebase...");
        await realFirebaseService.updateWork(id, workData);
        console.log("✅ Firebase sync completed");
      } else {
        console.log("📱 Firebase not ready, using local storage only");
      }
    }),
    [withAutoSync],
  );

  const deleteWork = useCallback(
    withAutoSync(async (id: string) => {
      setState((prev) => ({
        ...prev,
        works: prev.works.filter((work) => work.id !== id),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.deleteWork(id);
      }
    }),
    [withAutoSync],
  );

  // Clients
  const addClient = useCallback(
    withAutoSync(async (clientData: Omit<Client, "id" | "createdAt">) => {
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        clients: [...prev.clients, newClient],
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.addClient(newClient);
      }
    }),
    [withAutoSync],
  );

  const updateClient = useCallback(
    withAutoSync(async (id: string, clientData: Partial<Client>) => {
      setState((prev) => ({
        ...prev,
        clients: prev.clients.map((client) =>
          client.id === id ? { ...client, ...clientData } : client,
        ),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.updateClient(id, clientData);
      }
    }),
    [withAutoSync],
  );

  const deleteClient = useCallback(
    withAutoSync(async (id: string) => {
      setState((prev) => ({
        ...prev,
        clients: prev.clients.filter((client) => client.id !== id),
      }));

      if (realFirebaseService.isReady()) {
        await realFirebaseService.deleteClient(id);
      }
    }),
    [withAutoSync],
  );

  // Sync operations
  const syncWithFirebase = useCallback(async () => {
    if (!realFirebaseService.isReady()) {
      console.warn("Firebase service not ready");
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [pools, maintenance, works, clients] = await Promise.all([
        realFirebaseService.getPools(),
        realFirebaseService.getMaintenance(),
        realFirebaseService.getWorks(),
        realFirebaseService.getClients(),
      ]);

      // Calculate future maintenance
      const today = new Date();
      const futureMaintenance = maintenance.filter(
        (m) =>
          new Date(m.scheduledDate) >= today &&
          (m.status === "scheduled" || m.status === "pending"),
      );

      setState((prev) => ({
        ...prev,
        pools,
        maintenance,
        futureMaintenance,
        works,
        clients,
        isLoading: false,
        lastSync: new Date(),
        error: null,
      }));
    } catch (error: any) {
      console.error("Firebase sync error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Sync failed",
      }));
    }
  }, []);

  const enableSync = useCallback((enabled: boolean) => {
    setSyncEnabled(enabled);
  }, []);

  const cleanAllData = useCallback(async () => {
    // Clear all data locally
    setState({
      pools: [],
      maintenance: [],
      futureMaintenance: [],
      works: [],
      clients: [],
      isLoading: false,
      lastSync: null,
      error: null,
    });

    // Clear all data in Firebase if connected
    if (realFirebaseService.isReady()) {
      try {
        await realFirebaseService.cleanAllData();
      } catch (error) {
        console.warn("Failed to clean Firebase data:", error);
      }
    }
  }, []);

  return {
    ...state,
    addPool,
    updatePool,
    deletePool,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    addWork,
    updateWork,
    deleteWork,
    addClient,
    updateClient,
    deleteClient,
    syncWithFirebase,
    enableSync,
    cleanAllData,
  };
}
