/**
 * Serviço Firebase-Only - Remove dependência do localStorage
 * Sistema simplificado usando apenas Firebase como fonte única da verdade
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  getDoc,
} from "firebase/firestore";
import { UnifiedSafeFirebase } from "../firebase/unifiedSafeFirebase";

export class FirebaseOnlyService {
  private static db: any = null;

  // Inicializar conexão com Firebase usando sistema unificado
  static async initialize(): Promise<boolean> {
    try {
      console.log("🔄 FirebaseOnlyService usando UnifiedSafeFirebase...");
      const success = await UnifiedSafeFirebase.initialize();

      if (success) {
        this.db = await UnifiedSafeFirebase.getDB();
        if (this.db) {
          console.log("✅ FirebaseOnlyService inicializado com UnifiedSafe");
          return true;
        }
      }

      console.error("❌ Firebase não disponível via UnifiedSafe");
      return false;
    } catch (error) {
      console.error("❌ Erro ao inicializar Firebase via UnifiedSafe:", error);
      return false;
    }
  }

  // Obter instância do banco
  private static async getDatabase() {
    if (!this.db) {
      const success = await this.initialize();
      if (!success) {
        console.error("❌ Falha ao obter database via UnifiedSafe");
        return null;
      }
    }
    return this.db;
  }

  // ==================== UTILIZADORES ====================

  static async getUsers(): Promise<any[]> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`✅ Carregados ${users.length} utilizadores do Firebase`);
      return users;
    } catch (error) {
      console.error("❌ Erro ao carregar utilizadores:", error);
      return [];
    }
  }

  static async addUser(userData: any): Promise<boolean> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const usersRef = collection(db, "users");
      const docRef = await addDoc(usersRef, {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Utilizador adicionado ao Firebase:", docRef.id);
      return true;
    } catch (error) {
      console.error("❌ Erro ao adicionar utilizador:", error);
      return false;
    }
  }

  static async updateUser(userId: string, userData: any): Promise<boolean> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date(),
      });

      console.log("✅ Utilizador atualizado no Firebase:", userId);
      return true;
    } catch (error) {
      console.error("❌ Erro ao atualizar utilizador:", error);
      return false;
    }
  }

  // ==================== PISCINAS ====================

  static async getPools(): Promise<any[]> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const poolsRef = collection(db, "pools");
      const snapshot = await getDocs(poolsRef);

      const pools = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`✅ Carregadas ${pools.length} piscinas do Firebase`);
      return pools;
    } catch (error) {
      console.error("❌ Erro ao carregar piscinas:", error);
      return [];
    }
  }

  static async addPool(poolData: any): Promise<boolean> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const poolsRef = collection(db, "pools");
      const docRef = await addDoc(poolsRef, {
        ...poolData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Piscina adicionada ao Firebase:", docRef.id);
      return true;
    } catch (error) {
      console.error("❌ Erro ao adicionar piscina:", error);
      return false;
    }
  }

  // ==================== OBRAS ====================

  static async getWorks(): Promise<any[]> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const worksRef = collection(db, "works");
      const snapshot = await getDocs(worksRef);

      const works = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`✅ Carregadas ${works.length} obras do Firebase`);
      return works;
    } catch (error) {
      console.error("❌ Erro ao carregar obras:", error);
      return [];
    }
  }

  static async addWork(workData: any): Promise<boolean> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const worksRef = collection(db, "works");
      const docRef = await addDoc(worksRef, {
        ...workData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Obra adicionada ao Firebase:", docRef.id);
      return true;
    } catch (error) {
      console.error("❌ Erro ao adicionar obra:", error);
      return false;
    }
  }

  // ==================== MANUTENÇÕES ====================

  static async getMaintenance(): Promise<any[]> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const maintenanceRef = collection(db, "maintenance");
      const snapshot = await getDocs(maintenanceRef);

      const maintenance = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(
        `✅ Carregadas ${maintenance.length} manutenções do Firebase`,
      );
      return maintenance;
    } catch (error) {
      console.error("❌ Erro ao carregar manutenções:", error);
      return [];
    }
  }

  static async addMaintenance(maintenanceData: any): Promise<boolean> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const maintenanceRef = collection(db, "maintenance");
      const docRef = await addDoc(maintenanceRef, {
        ...maintenanceData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Manutenção adicionada ao Firebase:", docRef.id);
      return true;
    } catch (error) {
      console.error("❌ Erro ao adicionar manutenção:", error);
      return false;
    }
  }

  // ==================== CLIENTES ====================

  static async getClients(): Promise<any[]> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const clientsRef = collection(db, "clients");
      const snapshot = await getDocs(clientsRef);

      const clients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`✅ Carregados ${clients.length} clientes do Firebase`);
      return clients;
    } catch (error) {
      console.error("❌ Erro ao carregar clientes:", error);
      return [];
    }
  }

  static async addClient(clientData: any): Promise<boolean> {
    try {
      const db = await this.getDatabase();
      if (!db) throw new Error("Firebase não disponível");

      const clientsRef = collection(db, "clients");
      const docRef = await addDoc(clientsRef, {
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Cliente adicionado ao Firebase:", docRef.id);
      return true;
    } catch (error) {
      console.error("❌ Erro ao adicionar cliente:", error);
      return false;
    }
  }

  // ==================== LISTENERS EM TEMPO REAL ====================

  static subscribeToUsers(callback: (users: any[]) => void): () => void {
    return this.subscribeToCollection("users", callback);
  }

  static subscribeToPools(callback: (pools: any[]) => void): () => void {
    return this.subscribeToCollection("pools", callback);
  }

  static subscribeToWorks(callback: (works: any[]) => void): () => void {
    return this.subscribeToCollection("works", callback);
  }

  static subscribeToMaintenance(
    callback: (maintenance: any[]) => void,
  ): () => void {
    return this.subscribeToCollection("maintenance", callback);
  }

  static subscribeToClients(callback: (clients: any[]) => void): () => void {
    return this.subscribeToCollection("clients", callback);
  }

  private static subscribeToCollection(
    collectionName: string,
    callback: (data: any[]) => void,
  ): () => void {
    const unsubscribe = async () => {
      try {
        const db = await this.getDatabase();
        if (!db) {
          console.warn(`Firebase não disponível para ${collectionName}`);
          return () => {};
        }

        const collectionRef = collection(db, collectionName);

        return onSnapshot(
          collectionRef,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            console.log(
              `🔄 ${collectionName} atualizado: ${data.length} itens`,
            );
            callback(data);
          },
          (error) => {
            console.error(`❌ Erro no listener ${collectionName}:`, error);
          },
        );
      } catch (error) {
        console.error(
          `❌ Erro ao configurar listener ${collectionName}:`,
          error,
        );
        return () => {};
      }
    };

    // Retornar uma função que vai configurar o listener
    unsubscribe().then((unsub) => {
      if (typeof unsub === "function") {
        return unsub;
      }
    });

    return () => {}; // Fallback
  }

  // ==================== STATUS E DIAGNÓSTICO ====================

  static async getStatus(): Promise<any> {
    try {
      const db = await this.getDatabase();
      const isAvailable = !!db;

      if (isAvailable) {
        // Testar com uma operação simples
        const testRef = collection(db, "users");
        await getDocs(testRef);
      }

      return {
        available: isAvailable,
        connected: isAvailable,
        mode: "firebase-only",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        available: false,
        connected: false,
        mode: "offline",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Inicializar automaticamente quando o módulo for importado
FirebaseOnlyService.initialize().then((success) => {
  if (success) {
    console.log("🔥 Sistema Firebase-Only inicializado com sucesso");
  } else {
    console.warn("⚠️ Sistema Firebase-Only não conseguiu inicializar");
  }
});
