/**
 * User Duplicate Cleanup Utility
 *
 * Removes all duplicate users from all storage locations and keeps only
 * the main "Gonçalo superadmin" account active across the entire system.
 */

import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth, isFirebaseReady } from "../firebase/config";
import { signOut } from "firebase/auth";

interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "super_admin";
  active: boolean;
  createdAt: string;
}

interface MockUser {
  uid: string;
  email: string;
  password: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

interface FirebaseUser {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  permissions: any;
  active: boolean;
  createdAt: string;
}

export class UserDuplicateCleanup {
  private static readonly GONCALO_EMAIL = "gongonsilva@gmail.com";
  private static readonly GONCALO_PASSWORD = "19867gsf";
  private static readonly GONCALO_NAME = "Gonçalo Fonseca";

  /**
   * Main function to clean all duplicate users
   */
  static async cleanAllDuplicateUsers(): Promise<{
    success: boolean;
    message: string;
    details: string[];
    errors: string[];
  }> {
    const details: string[] = [];
    const errors: string[] = [];

    try {
      console.log("🧹 Starting comprehensive user cleanup...");

      // Step 1: Clean localStorage storage
      const localStorageResult = await this.cleanLocalStorageUsers();
      details.push(...localStorageResult.details);
      if (localStorageResult.errors.length > 0) {
        errors.push(...localStorageResult.errors);
      }

      // Step 2: Clean Firebase users (if available)
      if (isFirebaseReady()) {
        const firebaseResult = await this.cleanFirebaseUsers();
        details.push(...firebaseResult.details);
        if (firebaseResult.errors.length > 0) {
          errors.push(...firebaseResult.errors);
        }
      } else {
        details.push("⚠️ Firebase não disponível - limpeza apenas local");
      }

      // Step 3: Clear any current sessions
      this.clearUserSessions();
      details.push("🔐 Sessões de utilizador limpas");

      // Step 4: Verify cleanup
      const verificationResult = await this.verifyCleanup();
      details.push(...verificationResult.details);

      const successMessage =
        "✅ Limpeza de utilizadores duplicados concluída com sucesso!";
      console.log(successMessage);

      return {
        success: true,
        message: successMessage,
        details,
        errors,
      };
    } catch (error: any) {
      const errorMessage = `❌ Erro durante a limpeza: ${error.message}`;
      console.error(errorMessage, error);
      errors.push(errorMessage);

      return {
        success: false,
        message: errorMessage,
        details,
        errors,
      };
    }
  }

  /**
   * Clean users from localStorage storage systems
   */
  private static async cleanLocalStorageUsers(): Promise<{
    details: string[];
    errors: string[];
  }> {
    const details: string[] = [];
    const errors: string[] = [];

    try {
      // Clean mock-users storage
      const mockUsers = this.getMockUsers();
      const duplicateMockUsers = mockUsers.filter(
        (user) => user.email.toLowerCase() !== this.GONCALO_EMAIL.toLowerCase(),
      );

      if (duplicateMockUsers.length > 0) {
        details.push(
          `🗑️ Removendo ${duplicateMockUsers.length} utilizadores duplicados de mock-users`,
        );
        duplicateMockUsers.forEach((user) => {
          details.push(`   - ${user.name} (${user.email})`);
        });
      }

      // Keep only Gonçalo in mock-users
      const goncaloMockUser: MockUser = {
        uid: "admin-1",
        email: this.GONCALO_EMAIL,
        password: this.GONCALO_PASSWORD,
        name: this.GONCALO_NAME,
        role: "super_admin",
        active: true,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("mock-users", JSON.stringify([goncaloMockUser]));

      // Clean app-users storage
      const appUsers = this.getAppUsers();
      const duplicateAppUsers = appUsers.filter(
        (user) => user.email.toLowerCase() !== this.GONCALO_EMAIL.toLowerCase(),
      );

      if (duplicateAppUsers.length > 0) {
        details.push(
          `🗑️ Removendo ${duplicateAppUsers.length} utilizadores duplicados de app-users`,
        );
        duplicateAppUsers.forEach((user) => {
          details.push(`   - ${user.name} (${user.email})`);
        });
      }

      // Keep only Gonçalo in app-users
      const goncaloAppUser: LocalUser = {
        id: "1",
        name: this.GONCALO_NAME,
        email: this.GONCALO_EMAIL,
        password: this.GONCALO_PASSWORD,
        role: "super_admin",
        active: true,
        createdAt: "2024-01-01",
      };

      localStorage.setItem("app-users", JSON.stringify([goncaloAppUser]));

      // Clean any other user-related localStorage items
      const itemsToRemove = [
        "mock-current-user",
        "currentUser",
        "savedLoginCredentials",
        "users",
        "user-session",
        "auth-token",
      ];

      itemsToRemove.forEach((item) => {
        if (localStorage.getItem(item)) {
          localStorage.removeItem(item);
          details.push(`🧹 Removido: ${item}`);
        }
      });

      details.push("✅ localStorage limpo - apenas Gonçalo superadmin mantido");
    } catch (error: any) {
      errors.push(`Erro na limpeza localStorage: ${error.message}`);
    }

    return { details, errors };
  }

  /**
   * Clean users from Firebase
   */
  private static async cleanFirebaseUsers(): Promise<{
    details: string[];
    errors: string[];
  }> {
    const details: string[] = [];
    const errors: string[] = [];

    try {
      if (!db) {
        errors.push("Firestore não disponível");
        return { details, errors };
      }

      // Get all users from Firebase
      const usersSnapshot = await getDocs(collection(db, "users"));
      const firebaseUsers: FirebaseUser[] = [];

      usersSnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseUser;
        firebaseUsers.push({ ...data, uid: doc.id });
      });

      // Find duplicates (anyone except Gonçalo)
      const duplicateUsers = firebaseUsers.filter(
        (user) =>
          user.email?.toLowerCase() !== this.GONCALO_EMAIL.toLowerCase(),
      );

      if (duplicateUsers.length > 0) {
        details.push(
          `🗑️ Removendo ${duplicateUsers.length} utilizadores duplicados do Firebase`,
        );

        // Delete duplicate users
        for (const user of duplicateUsers) {
          try {
            await deleteDoc(doc(db, "users", user.uid));
            details.push(`   - Removido: ${user.name} (${user.email})`);
          } catch (error: any) {
            errors.push(`Erro ao remover ${user.email}: ${error.message}`);
          }
        }
      }

      // Ensure Gonçalo's profile exists and is correct
      const goncaloUser = firebaseUsers.find(
        (user) =>
          user.email?.toLowerCase() === this.GONCALO_EMAIL.toLowerCase(),
      );

      if (!goncaloUser) {
        details.push("🔧 Criando perfil do Gonçalo no Firebase");

        const goncaloProfile: FirebaseUser = {
          uid: "admin-goncalo",
          email: this.GONCALO_EMAIL,
          name: this.GONCALO_NAME,
          role: "super_admin",
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
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", "admin-goncalo"), goncaloProfile);
        details.push("✅ Perfil do Gonçalo criado no Firebase");
      } else {
        details.push("✅ Perfil do Gonçalo já existe no Firebase");
      }
    } catch (error: any) {
      errors.push(`Erro na limpeza Firebase: ${error.message}`);
    }

    return { details, errors };
  }

  /**
   * Clear all user sessions
   */
  private static clearUserSessions(): void {
    try {
      // Clear sessionStorage
      sessionStorage.clear();

      // Sign out from Firebase Auth if active
      if (auth?.currentUser) {
        signOut(auth).catch((error) => {
          console.warn("Erro ao fazer logout do Firebase:", error);
        });
      }

      // Clear any authentication tokens
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    } catch (error: any) {
      console.warn("Erro ao limpar sessões:", error);
    }
  }

  /**
   * Verify that cleanup was successful
   */
  private static async verifyCleanup(): Promise<{
    details: string[];
  }> {
    const details: string[] = [];

    try {
      // Check localStorage
      const mockUsers = this.getMockUsers();
      const appUsers = this.getAppUsers();

      details.push(`📊 Verificação final:`);
      details.push(`   - mock-users: ${mockUsers.length} utilizador(es)`);
      details.push(`   - app-users: ${appUsers.length} utilizador(es)`);

      // Check if only Gonçalo remains
      const onlyGoncaloMock =
        mockUsers.length === 1 &&
        mockUsers[0].email.toLowerCase() === this.GONCALO_EMAIL.toLowerCase();
      const onlyGoncaloApp =
        appUsers.length === 1 &&
        appUsers[0].email.toLowerCase() === this.GONCALO_EMAIL.toLowerCase();

      if (onlyGoncaloMock && onlyGoncaloApp) {
        details.push(
          "✅ Verificação bem-sucedida: apenas Gonçalo superadmin ativo",
        );
      } else {
        details.push("⚠️ Verificação: podem existir utilizadores adicionais");
      }

      // Check Firebase if available
      if (isFirebaseReady() && db) {
        try {
          const usersSnapshot = await getDocs(collection(db, "users"));
          const firebaseUserCount = usersSnapshot.size;
          details.push(
            `   - Firebase users: ${firebaseUserCount} utilizador(es)`,
          );
        } catch (error: any) {
          details.push(
            `   - Firebase users: erro na verificação (${error.message})`,
          );
        }
      }
    } catch (error: any) {
      details.push(`⚠️ Erro na verificação: ${error.message}`);
    }

    return { details };
  }

  /**
   * Get users from mock-users localStorage
   */
  private static getMockUsers(): MockUser[] {
    try {
      const data = localStorage.getItem("mock-users");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get users from app-users localStorage
   */
  private static getAppUsers(): LocalUser[] {
    try {
      const data = localStorage.getItem("app-users");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get summary of current users across all systems
   */
  static async getUserSummary(): Promise<{
    mockUsers: MockUser[];
    appUsers: LocalUser[];
    firebaseUsers: FirebaseUser[];
    totalDuplicates: number;
  }> {
    const mockUsers = this.getMockUsers();
    const appUsers = this.getAppUsers();
    let firebaseUsers: FirebaseUser[] = [];

    // Get Firebase users if available
    if (isFirebaseReady() && db) {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        usersSnapshot.forEach((doc) => {
          const data = doc.data() as FirebaseUser;
          firebaseUsers.push({ ...data, uid: doc.id });
        });
      } catch (error) {
        console.warn("Erro ao obter utilizadores do Firebase:", error);
      }
    }

    // Count duplicates (anyone except Gonçalo)
    const duplicateMock = mockUsers.filter(
      (user) => user.email.toLowerCase() !== this.GONCALO_EMAIL.toLowerCase(),
    ).length;

    const duplicateApp = appUsers.filter(
      (user) => user.email.toLowerCase() !== this.GONCALO_EMAIL.toLowerCase(),
    ).length;

    const duplicateFirebase = firebaseUsers.filter(
      (user) => user.email?.toLowerCase() !== this.GONCALO_EMAIL.toLowerCase(),
    ).length;

    const totalDuplicates = duplicateMock + duplicateApp + duplicateFirebase;

    return {
      mockUsers,
      appUsers,
      firebaseUsers,
      totalDuplicates,
    };
  }

  /**
   * Quick check if cleanup is needed
   */
  static async needsCleanup(): Promise<boolean> {
    const summary = await this.getUserSummary();
    return summary.totalDuplicates > 0;
  }
}
