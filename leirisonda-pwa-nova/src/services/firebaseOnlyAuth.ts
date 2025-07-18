/**
 * Autenticação Firebase-Only
 * Remove dependência do mockAuthService e localStorage
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { UnifiedSafeFirebase } from "../firebase/unifiedSafeFirebase";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
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
  createdAt?: Date;
  lastLogin?: Date;
}

export class FirebaseOnlyAuth {
  private static auth: any = null;
  private static db: any = null;
  private static currentUser: UserProfile | null = null;

  // Inicializar serviços Firebase usando sistema unificado
  static async initialize(): Promise<boolean> {
    try {
      console.log("🔄 FirebaseOnlyAuth usando UnifiedSafeFirebase...");
      const success = await UnifiedSafeFirebase.initialize();

      if (success) {
        this.auth = await UnifiedSafeFirebase.getAuth();
        this.db = await UnifiedSafeFirebase.getDB();

        if (this.auth || this.db) {
          console.log("✅ FirebaseOnlyAuth inicializado com UnifiedSafe");
          console.log(`📊 Auth: ${!!this.auth}, DB: ${!!this.db}`);

          if (this.auth) {
            this.setupAuthListener();
          }
          return true;
        }
      }

      console.error("❌ Firebase Auth/DB não disponível via UnifiedSafe");
      return false;
    } catch (error) {
      console.error(
        "❌ Erro ao inicializar FirebaseOnlyAuth via UnifiedSafe:",
        error,
      );
      return false;
    }
  }

  // Configurar listener de autenticação
  private static setupAuthListener() {
    if (!this.auth) return;

    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        console.log("👤 Utilizador autenticado:", firebaseUser.email);

        // Carregar perfil do utilizador
        const userProfile = await this.getUserProfile(firebaseUser.uid);
        if (userProfile) {
          this.currentUser = userProfile;

          // Atualizar último login
          await this.updateLastLogin(firebaseUser.uid);

          console.log("✅ Perfil carregado:", userProfile.name);

          // Notificar componentes
          window.dispatchEvent(
            new CustomEvent("userAuthenticated", {
              detail: userProfile,
            }),
          );
        }
      } else {
        console.log("👤 Utilizador deslogado");
        this.currentUser = null;

        window.dispatchEvent(new CustomEvent("userLoggedOut"));
      }
    });
  }

  // Login com email e password
  static async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      if (!this.auth) {
        await this.initialize();
        if (!this.auth) {
          throw new Error("Firebase Auth não disponível");
        }
      }

      // Verificar modo emergência
      if (
        typeof window !== "undefined" &&
        (window as any).EMERGENCY_MODE_ACTIVE
      ) {
        console.log("🚨 firebaseOnlyAuth bloqueado - modo emergência");
        throw new Error("Firebase desativado temporariamente");
      }

      console.log("🔐 Tentando login:", email);

      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      // Carregar perfil do utilizador
      const userProfile = await this.getUserProfile(firebaseUser.uid);

      if (!userProfile) {
        throw new Error("Perfil do utilizador não encontrado");
      }

      if (!userProfile.active) {
        throw new Error("Conta desativada");
      }

      this.currentUser = userProfile;

      console.log("✅ Login bem-sucedido:", userProfile.name);

      return { success: true, user: userProfile };
    } catch (error: any) {
      console.error("❌ Erro no login:", error);

      let errorMessage = "Erro no login";

      if (error.code === "auth/user-not-found") {
        errorMessage = "Utilizador não encontrado";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Password incorreta";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas. Tente mais tarde";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  }

  // Logout
  static async logout(): Promise<boolean> {
    try {
      if (!this.auth) return false;

      await signOut(this.auth);
      this.currentUser = null;

      console.log("✅ Logout bem-sucedido");
      return true;
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      return false;
    }
  }

  // Criar novo utilizador (apenas super admin)
  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    permissions: any;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      if (!this.auth || !this.db) {
        await this.initialize();
        if (!this.auth || !this.db) {
          throw new Error("Firebase não disponível");
        }
      }

      // Verificar se utilizador atual é super admin
      if (!this.currentUser || this.currentUser.role !== "super_admin") {
        throw new Error("Apenas super admin pode criar utilizadores");
      }

      console.log("👥 Criando novo utilizador:", userData.email);

      // Criar conta no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password,
      );

      const firebaseUser = userCredential.user;

      // Atualizar perfil no Firebase Auth
      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });

      // Criar perfil no Firestore
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role as any,
        permissions: userData.permissions,
        active: true,
        createdAt: new Date(),
      };

      const userRef = doc(this.db, "users", firebaseUser.uid);
      await setDoc(userRef, userProfile);

      console.log("✅ Utilizador criado:", userData.name);

      return { success: true, user: userProfile };
    } catch (error: any) {
      console.error("❌ Erro ao criar utilizador:", error);

      let errorMessage = "Erro ao criar utilizador";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email já está em uso";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password muito fraca";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  }

  // Obter perfil do utilizador
  private static async getUserProfile(
    uid: string,
  ): Promise<UserProfile | null> {
    try {
      if (!this.db) return null;

      const userRef = doc(this.db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      } else {
        console.warn("⚠️ Perfil não encontrado para:", uid);
        return null;
      }
    } catch (error) {
      console.error("❌ Erro ao carregar perfil:", error);
      return null;
    }
  }

  // Atualizar último login
  private static async updateLastLogin(uid: string): Promise<void> {
    try {
      if (!this.db) return;

      const userRef = doc(this.db, "users", uid);
      await setDoc(
        userRef,
        {
          lastLogin: new Date(),
        },
        { merge: true },
      );
    } catch (error) {
      console.warn("⚠️ Não foi possível atualizar último login:", error);
    }
  }

  // Obter utilizador atual
  static getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  // Verificar se está autenticado
  static isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Obter todos os utilizadores (apenas admin)
  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      if (!this.db) {
        await this.initialize();
        if (!this.db) throw new Error("Firebase não disponível");
      }

      if (!this.currentUser || this.currentUser.role !== "super_admin") {
        throw new Error("Apenas super admin pode ver todos os utilizadores");
      }

      const usersRef = collection(this.db, "users");
      const snapshot = await getDocs(usersRef);

      const users = snapshot.docs.map((doc) => doc.data() as UserProfile);

      console.log(`✅ Carregados ${users.length} utilizadores`);
      return users;
    } catch (error) {
      console.error("❌ Erro ao carregar utilizadores:", error);
      return [];
    }
  }

  // Criar super admin se não existir
  static async ensureSuperAdmin(): Promise<void> {
    try {
      if (!this.db) return;

      // Verificar se já existe super admin
      const usersRef = collection(this.db, "users");
      const q = query(usersRef, where("role", "==", "super_admin"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("👑 Criando super admin...");

        // Criar super admin padrão
        const superAdminData = {
          email: "admin@leirisonda.com",
          password: "admin123",
          name: "Super Admin",
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
        };

        // Temporariamente definir currentUser como super admin para permitir criação
        this.currentUser = {
          uid: "temp",
          email: "temp@temp.com",
          name: "Temp",
          role: "super_admin",
          permissions: superAdminData.permissions,
          active: true,
        };

        const result = await this.createUser(superAdminData);

        if (result.success) {
          console.log("✅ Super admin criado com sucesso");
        } else {
          console.error("❌ Erro ao criar super admin:", result.error);
        }

        // Limpar currentUser temporário
        this.currentUser = null;
      }
    } catch (error) {
      console.error("❌ Erro ao verificar/criar super admin:", error);
    }
  }
}

// Inicializar automaticamente
FirebaseOnlyAuth.initialize().then((success) => {
  if (success) {
    console.log("🔐 Sistema de autenticação Firebase-Only inicializado");

    // Garantir que existe super admin
    FirebaseOnlyAuth.ensureSuperAdmin();
  } else {
    console.warn("⚠️ Sistema de autenticação não conseguiu inicializar");
  }
});
