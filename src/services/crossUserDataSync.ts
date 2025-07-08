import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  writeBatch,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseReady } from "../firebase/config";
import { realFirebaseService } from "./realFirebaseService";

export interface CrossUserSyncResult {
  success: boolean;
  message: string;
  details: string[];
  dataShared: {
    pools: number;
    works: number;
    maintenance: number;
    clients: number;
  };
}

/**
 * Enhanced service to ensure data is properly shared between all users
 * This fixes the issue where super admin data is not visible to other users
 */
class CrossUserDataSyncService {
  private listeners: Unsubscribe[] = [];

  /**
   * Force migration of all data from user-specific storage to global shared collections
   */
  async migrateToSharedData(currentUser?: {
    uid: string;
    email: string;
    name: string;
  }): Promise<CrossUserSyncResult> {
    console.log(
      "🔄 Iniciando migração para dados compartilhados globalmente...",
    );

    const result: CrossUserSyncResult = {
      success: true,
      message: "Migração concluída",
      details: [],
      dataShared: { pools: 0, works: 0, maintenance: 0, clients: 0 },
    };

    if (!isFirebaseReady() || !db) {
      result.success = false;
      result.message = "Firebase não disponível";
      result.details.push("❌ Firebase não está configurado corretamente");
      return result;
    }

    try {
      // Get all local data
      const localData = {
        pools: JSON.parse(localStorage.getItem("pools") || "[]"),
        works: JSON.parse(localStorage.getItem("works") || "[]"),
        maintenance: JSON.parse(localStorage.getItem("maintenance") || "[]"),
        clients: JSON.parse(localStorage.getItem("clients") || "[]"),
      };

      result.details.push(
        `📱 Dados locais encontrados: ${localData.pools.length} piscinas, ${localData.works.length} obras, ${localData.maintenance.length} manutenções, ${localData.clients.length} clientes`,
      );

      // Migrate pools to global shared collection
      for (const pool of localData.pools) {
        const poolId = pool.id || `pool-${Date.now()}-${Math.random()}`;
        await setDoc(doc(db, "pools", poolId), {
          ...pool,
          id: poolId,
          sharedGlobally: true,
          visibleToAllUsers: true,
          migratedAt: new Date().toISOString(),
          migratedBy: currentUser?.email || "system",
          dataSource: "migration-from-local",
        });
        result.dataShared.pools++;
      }

      // Migrate works to global shared collection
      for (const work of localData.works) {
        const workId = work.id || `work-${Date.now()}-${Math.random()}`;
        await setDoc(doc(db, "works", workId), {
          ...work,
          id: workId,
          sharedGlobally: true,
          visibleToAllUsers: true,
          migratedAt: new Date().toISOString(),
          migratedBy: currentUser?.email || "system",
          dataSource: "migration-from-local",
        });
        result.dataShared.works++;
      }

      // Migrate maintenance to global shared collection
      for (const maintenance of localData.maintenance) {
        const maintenanceId =
          maintenance.id || `maint-${Date.now()}-${Math.random()}`;
        await setDoc(doc(db, "maintenance", maintenanceId), {
          ...maintenance,
          id: maintenanceId,
          sharedGlobally: true,
          visibleToAllUsers: true,
          migratedAt: new Date().toISOString(),
          migratedBy: currentUser?.email || "system",
          dataSource: "migration-from-local",
        });
        result.dataShared.maintenance++;
      }

      // Migrate clients to global shared collection
      for (const client of localData.clients) {
        const clientId = client.id || `client-${Date.now()}-${Math.random()}`;
        await setDoc(doc(db, "clients", clientId), {
          ...client,
          id: clientId,
          sharedGlobally: true,
          visibleToAllUsers: true,
          migratedAt: new Date().toISOString(),
          migratedBy: currentUser?.email || "system",
          dataSource: "migration-from-local",
        });
        result.dataShared.clients++;
      }

      result.details.push(
        `✅ Migração Firebase concluída: ${result.dataShared.pools} piscinas, ${result.dataShared.works} obras, ${result.dataShared.maintenance} manutenções, ${result.dataShared.clients} clientes`,
      );

      // Also sync to Realtime Database for enhanced cross-device sync
      if (realFirebaseService.isReady()) {
        result.details.push(
          "🔄 Sincronizando também para Realtime Database...",
        );

        // Sync all data to realtime database for instant updates
        for (const pool of localData.pools) {
          await realFirebaseService.addPool(pool);
        }
        for (const work of localData.works) {
          await realFirebaseService.addWork(work);
        }
        for (const maintenance of localData.maintenance) {
          await realFirebaseService.addMaintenance(maintenance);
        }
        for (const client of localData.clients) {
          await realFirebaseService.addClient(client);
        }

        result.details.push(
          "✅ Dados também sincronizados para Realtime Database",
        );
      }

      // Mark migration as completed
      localStorage.setItem("crossUserDataMigrated", "true");
      localStorage.setItem("lastCrossUserSync", new Date().toISOString());

      result.message = `Migração concluída com sucesso! ${result.dataShared.pools + result.dataShared.works + result.dataShared.maintenance + result.dataShared.clients} registros agora compartilhados entre todos os utilizadores.`;
    } catch (error) {
      console.error("❌ Erro durante migração:", error);
      result.success = false;
      result.message = "Erro durante migração";
      result.details.push(
        `❌ Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    }

    return result;
  }

  /**
   * Setup real-time listeners to ensure all users see the same data
   */
  setupGlobalDataListeners(callbacks: {
    onPoolsChange: (pools: any[]) => void;
    onWorksChange: (works: any[]) => void;
    onMaintenanceChange: (maintenance: any[]) => void;
    onClientsChange: (clients: any[]) => void;
  }): () => void {
    console.log(
      "📡 Configurando listeners globais para dados compartilhados...",
    );

    if (!isFirebaseReady() || !db) {
      console.warn("⚠️ Firebase não disponível - listeners não configurados");
      return () => {};
    }

    // Setup Firestore listeners for global shared data
    const poolsListener = onSnapshot(
      query(collection(db, "pools"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const pools = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(
          `🏊 Pools sincronizados: ${pools.length} registros disponíveis para todos os utilizadores`,
        );
        callbacks.onPoolsChange(pools);
      },
      (error) => {
        console.error("❌ Erro no listener de piscinas:", error);
      },
    );

    const worksListener = onSnapshot(
      query(collection(db, "works"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const works = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(
          `⚒️ Obras sincronizadas: ${works.length} registros disponíveis para todos os utilizadores`,
        );
        callbacks.onWorksChange(works);
      },
      (error) => {
        console.error("❌ Erro no listener de obras:", error);
      },
    );

    const maintenanceListener = onSnapshot(
      query(collection(db, "maintenance"), orderBy("scheduledDate", "desc")),
      (snapshot) => {
        const maintenance = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(
          `🔧 Manutenções sincronizadas: ${maintenance.length} registros disponíveis para todos os utilizadores`,
        );
        callbacks.onMaintenanceChange(maintenance);
      },
      (error) => {
        console.error("❌ Erro no listener de manutenções:", error);
      },
    );

    const clientsListener = onSnapshot(
      query(collection(db, "clients"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const clients = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(
          `👥 Clientes sincronizados: ${clients.length} registros disponíveis para todos os utilizadores`,
        );
        callbacks.onClientsChange(clients);
      },
      (error) => {
        console.error("❌ Erro no listener de clientes:", error);
      },
    );

    this.listeners = [
      poolsListener,
      worksListener,
      maintenanceListener,
      clientsListener,
    ];

    // Also setup Realtime Database listeners for instant updates
    if (realFirebaseService.isReady()) {
      console.log("📡 Configurando também listeners do Realtime Database...");

      const rtdbUnsubscribes = [
        realFirebaseService.onPoolsChange(callbacks.onPoolsChange),
        realFirebaseService.onWorksChange(callbacks.onWorksChange),
        realFirebaseService.onMaintenanceChange(callbacks.onMaintenanceChange),
        realFirebaseService.onClientsChange(callbacks.onClientsChange),
      ];

      this.listeners.push(...rtdbUnsubscribes);
    }

    console.log(
      "✅ Todos os listeners configurados - dados serão sincronizados em tempo real entre todos os utilizadores",
    );

    // Return cleanup function
    return () => {
      console.log("🛑 Desconectando listeners globais...");
      this.listeners.forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
      this.listeners = [];
    };
  }

  /**
   * Force immediate sync of all data to ensure visibility across users
   */
  async forceCrossUserSync(): Promise<boolean> {
    console.log(
      "🚀 Forçando sincronização imediata entre todos os utilizadores...",
    );

    if (!isFirebaseReady() || !db) {
      console.warn("⚠️ Firebase não disponível para sincronização");
      return false;
    }

    try {
      // Get all data from Firestore
      const [
        poolsSnapshot,
        worksSnapshot,
        maintenanceSnapshot,
        clientsSnapshot,
      ] = await Promise.all([
        getDocs(query(collection(db, "pools"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "works"), orderBy("createdAt", "desc"))),
        getDocs(
          query(
            collection(db, "maintenance"),
            orderBy("scheduledDate", "desc"),
          ),
        ),
        getDocs(query(collection(db, "clients"), orderBy("createdAt", "desc"))),
      ]);

      const firestoreData = {
        pools: poolsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        works: worksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        maintenance: maintenanceSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        clients: clientsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };

      // Update localStorage with latest Firebase data
      localStorage.setItem("pools", JSON.stringify(firestoreData.pools));
      localStorage.setItem("works", JSON.stringify(firestoreData.works));
      localStorage.setItem(
        "maintenance",
        JSON.stringify(firestoreData.maintenance),
      );
      localStorage.setItem("clients", JSON.stringify(firestoreData.clients));

      console.log(
        `✅ Sincronização imediata concluída: ${firestoreData.pools.length} piscinas, ${firestoreData.works.length} obras, ${firestoreData.maintenance.length} manutenções, ${firestoreData.clients.length} clientes`,
      );

      // Trigger storage events to notify other tabs/windows
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "pools",
          newValue: JSON.stringify(firestoreData.pools),
          storageArea: localStorage,
        }),
      );

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "works",
          newValue: JSON.stringify(firestoreData.works),
          storageArea: localStorage,
        }),
      );

      return true;
    } catch (error) {
      console.error("❌ Erro na sincronização imediata:", error);
      return false;
    }
  }

  /**
   * Check if data migration has been completed
   */
  isMigrationCompleted(): boolean {
    return localStorage.getItem("crossUserDataMigrated") === "true";
  }

  /**
   * Get last sync timestamp
   */
  getLastSyncTime(): Date | null {
    const timestamp = localStorage.getItem("lastCrossUserSync");
    return timestamp ? new Date(timestamp) : null;
  }

  /**
   * Clean up listeners
   */
  cleanup(): void {
    this.listeners.forEach((unsubscribe) => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    });
    this.listeners = [];
  }
}

// Export singleton instance
export const crossUserDataSync = new CrossUserDataSyncService();
export default crossUserDataSync;
