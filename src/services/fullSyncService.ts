import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";

export interface SyncResult {
  success: boolean;
  message: string;
  details: string[];
  stats: {
    usersSync: { local: number; firebase: number; merged: number };
    poolsSync: { local: number; firebase: number; merged: number };
    worksSync: { local: number; firebase: number; merged: number };
    maintenanceSync: { local: number; firebase: number; merged: number };
    clientsSync: { local: number; firebase: number; merged: number };
  };
}

class FullSyncService {
  async syncAllData(): Promise<SyncResult> {
    // Check if Firebase is available and not in quota cooldown
    const { isFirebaseReady, getFirebaseStatus, markQuotaExceeded } =
      await import("../firebase/config");
    const status = getFirebaseStatus();

    if (status.quotaExceeded) {
      console.log("⏸️ Firebase sync paused - quota cooldown period");
      return {
        success: true,
        message: "Sync paused - quota cooldown period",
        details: ["Firebase temporarily paused due to quota limit"],
        stats: {
          usersSync: { local: 0, firebase: 0, merged: 0 },
          poolsSync: { local: 0, firebase: 0, merged: 0 },
          worksSync: { local: 0, firebase: 0, merged: 0 },
          maintenanceSync: { local: 0, firebase: 0, merged: 0 },
          clientsSync: { local: 0, firebase: 0, merged: 0 },
        },
      };
    }

    const details: string[] = [];
    const stats = {
      usersSync: { local: 0, firebase: 0, merged: 0 },
      poolsSync: { local: 0, firebase: 0, merged: 0 },
      worksSync: { local: 0, firebase: 0, merged: 0 },
      maintenanceSync: { local: 0, firebase: 0, merged: 0 },
      clientsSync: { local: 0, firebase: 0, merged: 0 },
    };

    // Firebase sync enabled for cross-device functionality with quota protection
    console.log(
      "🔥 Firebase sync enabled - cross-device sync with quota protection",
    );

    if (!db) {
      console.log("📱 Firebase not available - working in local-only mode");
      return {
        success: true,
        message: "Local-only mode - Firebase não disponível",
        details: [
          "Dados mantidos apenas localmente - Firebase não configurado",
        ],
        stats,
      };
    }

    try {
      details.push("🔄 Iniciando sincronização completa...");

      // 1. Sync Users with quota protection
      const usersResult = await this.syncUsersWithQuotaProtection();
      details.push(...usersResult.details);
      stats.usersSync = usersResult.stats;

      // 2. Sync Pools
      const poolsResult = await this.syncCollectionWithQuotaProtection("pools");
      details.push(...poolsResult.details);
      stats.poolsSync = poolsResult.stats;

      // 3. Sync Works
      const worksResult = await this.syncCollectionWithQuotaProtection("works");
      details.push(...worksResult.details);
      stats.worksSync = worksResult.stats;

      // 4. Sync Maintenance
      const maintenanceResult =
        await this.syncCollectionWithQuotaProtection("maintenance");
      details.push(...maintenanceResult.details);
      stats.maintenanceSync = maintenanceResult.stats;

      // 5. Sync Clients
      const clientsResult =
        await this.syncCollectionWithQuotaProtection("clients");
      details.push(...clientsResult.details);
      stats.clientsSync = clientsResult.stats;

      details.push("✅ Sincronização completa finalizada!");

      return {
        success: true,
        message: "Sincronização completa realizada com sucesso",
        details,
        stats,
      };
    } catch (error: any) {
      // Check if it's a quota exceeded error
      if (
        error.message?.includes("quota") ||
        error.message?.includes("resource-exhausted")
      ) {
        markQuotaExceeded();
        details.push(
          "🚨 Quota Firebase excedido - sincronização pausada temporariamente",
        );
        return {
          success: false,
          message: "Quota Firebase excedido",
          details,
          stats,
        };
      }

      details.push(`❌ Erro na sincronização: ${error.message}`);
      return {
        success: false,
        message: "Erro durante sincronização",
        details,
        stats,
      };
    }
  }

  private async syncUsersWithQuotaProtection(): Promise<{
    details: string[];
    stats: { local: number; firebase: number; merged: number };
  }> {
    try {
      return await this.syncUsers();
    } catch (error: any) {
      if (
        error.message?.includes("quota") ||
        error.message?.includes("resource-exhausted")
      ) {
        const { markQuotaExceeded } = await import("../firebase/config");
        markQuotaExceeded();
        throw error;
      }
      throw error;
    }
  }

  private async syncCollectionWithQuotaProtection(
    collectionName: string,
  ): Promise<{
    details: string[];
    stats: { local: number; firebase: number; merged: number };
  }> {
    try {
      return await this.syncCollection(collectionName);
    } catch (error: any) {
      if (
        error.message?.includes("quota") ||
        error.message?.includes("resource-exhausted")
      ) {
        const { markQuotaExceeded } = await import("../firebase/config");
        markQuotaExceeded();
        throw error;
      }
      throw error;
    }
  }

  private async syncUsers(): Promise<{
    details: string[];
    stats: { local: number; firebase: number; merged: number };
  }> {
    const details: string[] = [];
    const stats = { local: 0, firebase: 0, merged: 0 };

    try {
      // Get local users
      const localUsersData = localStorage.getItem("mock-users");
      const localUsers = localUsersData ? JSON.parse(localUsersData) : [];
      stats.local = localUsers.length;
      details.push(`📱 Utilizadores locais: ${localUsers.length}`);

      // Get Firebase users
      const usersCollection = collection(db!, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const firebaseUsers = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      stats.firebase = firebaseUsers.length;
      details.push(`☁️ Utilizadores Firebase: ${firebaseUsers.length}`);

      // Merge users by email
      const mergedUsers = new Map();

      // Add local users
      localUsers.forEach((user: any) => {
        mergedUsers.set(user.email, {
          ...user,
          source: "local",
        });
      });

      // Add Firebase users (Firebase takes precedence for conflicts)
      firebaseUsers.forEach((user: any) => {
        const existingUser = mergedUsers.get(user.email);
        if (existingUser) {
          // Merge data, preferring Firebase but keeping local password if Firebase doesn't have it
          mergedUsers.set(user.email, {
            ...existingUser,
            ...user,
            password: existingUser.password || user.password || "123456",
            source: "merged",
          });
        } else {
          mergedUsers.set(user.email, {
            ...user,
            password: user.password || "123456",
            source: "firebase",
          });
        }
      });

      const finalUsers = Array.from(mergedUsers.values());
      stats.merged = finalUsers.length;

      // Update localStorage
      const localUpdateUsers = finalUsers.map((user) => ({
        uid: user.uid || user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        active: user.active !== false,
        createdAt: user.createdAt || new Date().toISOString(),
      }));

      localStorage.setItem("mock-users", JSON.stringify(localUpdateUsers));
      details.push(
        `📱 localStorage atualizado com ${localUpdateUsers.length} utilizadores`,
      );

      // Update Firebase
      const batch = writeBatch(db!);
      finalUsers.forEach((user: any) => {
        const userRef = doc(
          db!,
          "users",
          user.uid || user.id || `user-${Date.now()}-${Math.random()}`,
        );
        const firebaseUserData = {
          uid: user.uid || user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions:
            user.permissions || this.getDefaultPermissions(user.role),
          active: user.active !== false,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        batch.set(userRef, firebaseUserData);
      });

      await batch.commit();
      details.push(
        `☁️ Firebase atualizado com ${finalUsers.length} utilizadores`,
      );

      // Mock auth service removed
      details.push("🔄 Mock auth service disabled");

      return { details, stats };
    } catch (error: any) {
      details.push(
        `❌ Erro na sincronização de utilizadores: ${error.message}`,
      );
      return { details, stats };
    }
  }

  private async syncCollection(collectionName: string): Promise<{
    details: string[];
    stats: { local: number; firebase: number; merged: number };
  }> {
    const details: string[] = [];
    const stats = { local: 0, firebase: 0, merged: 0 };

    try {
      // Get local data
      const localData = localStorage.getItem(collectionName);
      const localItems = localData ? JSON.parse(localData) : [];
      stats.local = localItems.length;
      details.push(`📱 ${collectionName} locais: ${localItems.length}`);

      // Get Firebase data
      const firebaseCollection = collection(db!, collectionName);
      const firebaseSnapshot = await getDocs(firebaseCollection);
      const firebaseItems = firebaseSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      stats.firebase = firebaseItems.length;
      details.push(`☁️ ${collectionName} Firebase: ${firebaseItems.length}`);

      // Merge by ID
      const mergedItems = new Map();

      // Add local items
      localItems.forEach((item: any) => {
        mergedItems.set(item.id, {
          ...item,
          source: "local",
        });
      });

      // Add Firebase items (Firebase data takes precedence)
      firebaseItems.forEach((item: any) => {
        const existingItem = mergedItems.get(item.id);
        if (existingItem) {
          mergedItems.set(item.id, {
            ...existingItem,
            ...item,
            source: "merged",
          });
        } else {
          mergedItems.set(item.id, {
            ...item,
            source: "firebase",
          });
        }
      });

      const finalItems = Array.from(mergedItems.values());
      stats.merged = finalItems.length;

      // Update localStorage
      localStorage.setItem(collectionName, JSON.stringify(finalItems));
      details.push(
        `📱 localStorage ${collectionName} atualizado: ${finalItems.length} itens`,
      );

      // Update Firebase
      const batch = writeBatch(db!);
      finalItems.forEach((item: any) => {
        const itemRef = doc(
          db!,
          collectionName,
          item.id || `${collectionName}-${Date.now()}-${Math.random()}`,
        );
        const { source, ...itemData } = item; // Remove source field
        batch.set(itemRef, {
          ...itemData,
          updatedAt: new Date().toISOString(),
        });
      });

      await batch.commit();
      details.push(
        `☁️ Firebase ${collectionName} atualizado: ${finalItems.length} itens`,
      );

      return { details, stats };
    } catch (error: any) {
      details.push(
        `❌ Erro na sincronização de ${collectionName}: ${error.message}`,
      );
      return { details, stats };
    }
  }

  private getDefaultPermissions(role: string) {
    switch (role) {
      case "super_admin":
        return {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        };
      case "manager":
        return {
          obras: { view: true, create: true, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: true, edit: true, delete: false },
          utilizadores: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: true, edit: false, delete: false },
          clientes: { view: true, create: true, edit: true, delete: false },
        };
      default: // technician
        return {
          obras: { view: true, create: true, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: true, edit: true, delete: false },
          utilizadores: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: false, edit: false, delete: false },
          clientes: { view: true, create: false, edit: false, delete: false },
        };
    }
  }
}

export const fullSyncService = new FullSyncService();
