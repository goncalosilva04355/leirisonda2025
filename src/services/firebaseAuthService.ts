import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getAuthService } from "../firebase/config";

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

class FirebaseAuthService {
  private auth: any = null;
  private initialized = false;

  async initialize(): Promise<boolean> {
    try {
      // Sempre obter uma nova instância para evitar instâncias destruídas
      this.auth = await getAuthService();
      if (this.auth) {
        this.initialized = true;
        console.log("✅ Firebase Auth service initialized");
        return true;
      }
      console.warn("⚠️ Firebase Auth not available");
      this.initialized = false;
      return false;
    } catch (error) {
      console.error("❌ Failed to initialize Firebase Auth:", error);
      this.initialized = false;
      return false;
    }
  }

  async signIn(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<AuthResult> {
    try {
      // Sempre reinicializar para garantir instância válida
      this.initialized = false;
      if (!(await this.initialize())) {
        return {
          success: false,
          error: "Firebase Auth not available",
        };
      }

      // Verificar se a instância auth ainda é válida
      if (!this.auth) {
        return {
          success: false,
          error: "Firebase Auth instance is null",
        };
      }

      // Set persistence based on remember me preference
      const persistence = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;

      try {
        await setPersistence(this.auth, persistence);
      } catch (persistError) {
        console.warn(
          "⚠️ Could not set persistence, continuing without it:",
          persistError,
        );
      }

      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      console.log("✅ User signed in successfully:", userCredential.user.email);

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error: any) {
      console.error("❌ Sign in error:", error);

      let errorMessage = "Erro de autenticação";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Utilizador não encontrado";
          break;
        case "auth/wrong-password":
          errorMessage = "Palavra-passe incorreta";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/user-disabled":
          errorMessage = "Conta desativada";
          break;
        case "auth/too-many-requests":
          errorMessage = "Muitas tentativas. Tente novamente mais tarde";
          break;
        case "auth/network-request-failed":
          errorMessage = "Erro de conexão. Verifique sua internet";
          break;
        default:
          errorMessage = error.message || "Erro desconhecido";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      if (!(await this.initialize())) {
        return {
          success: false,
          error: "Firebase Auth not available",
        };
      }

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      console.log("✅ User created successfully:", userCredential.user.email);

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error: any) {
      console.error("❌ Sign up error:", error);

      let errorMessage = "Erro ao criar conta";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email já está em uso";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/weak-password":
          errorMessage = "Palavra-passe muito fraca";
          break;
        default:
          errorMessage = error.message || "Erro desconhecido";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async signOut(): Promise<boolean> {
    try {
      if (!(await this.initialize())) {
        return false;
      }

      await signOut(this.auth);
      console.log("✅ User signed out successfully");
      return true;
    } catch (error) {
      console.error("❌ Sign out error:", error);
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (!(await this.initialize())) {
        return null;
      }

      return this.auth.currentUser;
    } catch (error) {
      console.error("❌ Get current user error:", error);
      return null;
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    if (!this.auth) {
      return () => {};
    }

    return onAuthStateChanged(this.auth, callback);
  }

  async waitForAuthReady(): Promise<User | null> {
    if (!(await this.initialize())) {
      return null;
    }

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
}

// Export a singleton instance
export const authService = new FirebaseAuthService();
export default authService;
