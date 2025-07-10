// Firebase Service - Simplified without Firestore
import { isFirebaseReady } from "../firebase/configWithoutFirestore";
import { syncManager } from "../utils/syncManager";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface Pool {
  id: string;
  name: string;
  location: string;
  type: string;
  createdAt: string;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  poolId: string;
  type: string;
  status: string;
  scheduledDate: string;
  createdAt: string;
}

/**
 * Firebase Service - Simplified
 * Works only with local storage since Firestore is disabled
 */
class FirebaseService {
  private listeners: (() => void)[] = [];

  /**
   * Initialize service (local only)
   */
  async initialize(): Promise<boolean> {
    console.log("📱 Firebase Service initialized (local only)");
    return true;
  }

  /**
   * Add user (local only)
   */
  async addUser(
    user: Omit<User, "id" | "createdAt">,
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const users = this.getLocalData("app-users");
      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("app-users", JSON.stringify(users));

      console.log("✅ User added locally:", newUser.email);
      return { success: true, id: newUser.id };
    } catch (error: any) {
      console.error("❌ Failed to add user:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get users (local only)
   */
  async getUsers(): Promise<User[]> {
    return this.getLocalData("app-users");
  }

  /**
   * Update user (local only)
   */
  async updateUser(
    id: string,
    updates: Partial<User>,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const users = this.getLocalData("app-users");
      const userIndex = users.findIndex((u: User) => u.id === id);

      if (userIndex === -1) {
        return { success: false, error: "User not found" };
      }

      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem("app-users", JSON.stringify(users));

      console.log("✅ User updated locally:", id);
      return { success: true };
    } catch (error: any) {
      console.error("❌ Failed to update user:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete user (local only)
   */
  async deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const users = this.getLocalData("app-users");
      const filteredUsers = users.filter((u: User) => u.id !== id);

      localStorage.setItem("app-users", JSON.stringify(filteredUsers));

      console.log("✅ User deleted locally:", id);
      return { success: true };
    } catch (error: any) {
      console.error("❌ Failed to delete user:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add pool (local only)
   */
  async addPool(
    pool: Omit<Pool, "id" | "createdAt">,
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const pools = this.getLocalData("pools");
      const newPool: Pool = {
        ...pool,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      pools.push(newPool);
      localStorage.setItem("pools", JSON.stringify(pools));

      console.log("✅ Pool added locally:", newPool.name);
      return { success: true, id: newPool.id };
    } catch (error: any) {
      console.error("❌ Failed to add pool:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get pools (local only)
   */
  async getPools(): Promise<Pool[]> {
    return this.getLocalData("pools");
  }

  /**
   * Add work (local only)
   */
  async addWork(
    work: Omit<Work, "id" | "createdAt">,
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const works = this.getLocalData("works");
      const newWork: Work = {
        ...work,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      works.push(newWork);
      localStorage.setItem("works", JSON.stringify(works));

      console.log("✅ Work added locally:", newWork.title);
      return { success: true, id: newWork.id };
    } catch (error: any) {
      console.error("❌ Failed to add work:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get works (local only)
   */
  async getWorks(): Promise<Work[]> {
    return this.getLocalData("works");
  }

  /**
   * Subscribe to changes (local only - no real-time updates)
   */
  subscribeToUsers(callback: (users: User[]) => void): () => void {
    console.log("📱 User subscription enabled (local only)");

    // Return a cleanup function
    return () => {
      console.log("📱 User subscription cleaned up");
    };
  }

  /**
   * Subscribe to pools (local only)
   */
  subscribeToPools(callback: (pools: Pool[]) => void): () => void {
    console.log("📱 Pool subscription enabled (local only)");
    return () => console.log("📱 Pool subscription cleaned up");
  }

  /**
   * Subscribe to works (local only)
   */
  subscribeToWorks(callback: (works: Work[]) => void): () => void {
    console.log("📱 Work subscription enabled (local only)");
    return () => console.log("📱 Work subscription cleaned up");
  }

  /**
   * Get local data safely
   */
  private getLocalData(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn(`⚠️ Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  /**
   * Cleanup listeners
   */
  cleanup(): void {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners = [];
    console.log("🧹 Firebase Service cleanup completed");
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return true; // Always available for local operations
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();

// Export service aliases for backward compatibility
export const syncService = firebaseService;
export const userService = firebaseService;
export const poolService = firebaseService;
export const maintenanceService = firebaseService;
export const workService = firebaseService;

export default firebaseService;
