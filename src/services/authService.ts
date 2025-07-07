import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseReady } from "../firebase/config";

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
  createdAt: string;
}

class AuthService {
  // Register new user
  async register(
    email: string,
    password: string,
    name: string,
    role: "super_admin" | "manager" | "technician" = "technician",
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    // Validate inputs first
    if (!email || !email.trim()) {
      return { success: false, error: "Email é obrigatório" };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: "Password deve ter pelo menos 6 caracteres",
      };
    }

    if (!name || !name.trim()) {
      return { success: false, error: "Nome é obrigatório" };
    }

    // Check if Firebase is ready
    if (!isFirebaseReady()) {
      return { success: false, error: "Firebase não está disponível" };
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName: name });

      // Default permissions based on role
      const defaultPermissions = this.getDefaultPermissions(role);

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        role,
        permissions: defaultPermissions,
        active: true,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userProfile);

      return { success: true, user: userProfile };
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "Erro ao criar conta";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password muito fraca (mínimo 6 caracteres)";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Erro de rede. Verifique a conexão à internet";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas. Tente novamente mais tarde";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage =
          "Email/Password authentication não está ativado no Firebase Console";
      } else if (error.code === "auth/invalid-api-key") {
        errorMessage = "Chave API Firebase inválida";
      } else if (error.code === "auth/app-deleted") {
        errorMessage = "Projeto Firebase foi removido";
      } else if (error.message) {
        errorMessage = `Erro Firebase: ${error.code || "unknown"} - ${error.message}`;
      }

      return { success: false, error: errorMessage };
    }
  }

  // Login user
  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    // Validate inputs first
    if (!email?.trim() || !password?.trim()) {
      return { success: false, error: "Email e password são obrigatórios" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, error: "Por favor, insira um email válido" };
    }

    // Check if Firebase is ready
    if (!isFirebaseReady()) {
      return { success: false, error: "Firebase não está disponível" };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const firebaseUser = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        // Auto-create profile for existing Firebase Auth users
        console.log("Creating missing user profile for:", firebaseUser.email);

        // Determine role and name based on email
        let role: "super_admin" | "manager" | "technician" = "technician";
        let name = firebaseUser.displayName || "Utilizador";

        // Special case for Gonçalo's admin account
        if (firebaseUser.email === "gongonsilva@gmail.com") {
          role = "super_admin";
          name = "Gonçalo Fonseca";
        }

        // Create user profile in Firestore
        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name,
          role,
          permissions: this.getDefaultPermissions(role),
          active: true,
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
        return { success: true, user: userProfile };
      }

      const userProfile = userDoc.data() as UserProfile;

      if (!userProfile.active) {
        return { success: false, error: "Conta desativada" };
      }

      return { success: true, user: userProfile };
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Credenciais inválidas";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Utilizador não encontrado";
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        errorMessage = "Password incorreta";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas. Tente novamente mais tarde";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Erro de rede. Verifique a conexão à internet";
      }

      return { success: false, error: errorMessage };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      if (auth) {
        await signOut(auth);
      }
      console.log("Logout realizado com sucesso");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    if (!auth || !db) {
      console.warn("Firebase não está disponível");
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const userProfile = userDoc.data() as UserProfile;
              callback(userProfile.active ? userProfile : null);
            } else {
              console.log("No valid user profile found, forcing logout");
              await this.logout();
              callback(null);
            }
          } catch (error) {
            console.error("Error getting user profile:", error);
            await this.logout();
            callback(null);
          }
        } else {
          callback(null);
        }
      },
    );
  }

  // Get current user profile
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    if (!auth || !db || !auth.currentUser) return null;

    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
    } catch (error) {
      console.error("Error getting current user profile:", error);
      return null;
    }
  }

  // Get default permissions based on role
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
          obras: { view: true, create: false, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: false, edit: true, delete: false },
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

  // Initialize default super admin if no users exist
  async initializeDefaultAdmin(): Promise<void> {
    console.log("Manual admin initialization only for security");
    return;
  }
}

export const authService = new AuthService();
export default authService;
