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
  private initializationPromise: Promise<boolean> | null = null;
  private maxRetries = 3;
  private retryCount = 0;

  async initialize(): Promise<boolean> {
    // Evitar múltiplas inicializações simultâneas
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  private async _performInitialization(): Promise<boolean> {
    try {
      console.log("🔥 Tentando inicializar Firebase Auth...");

      // Timeout para evitar hang
      const timeoutPromise = new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error("Firebase Auth timeout")), 3000),
      );

      const authPromise = getAuthService();
      this.auth = await Promise.race([authPromise, timeoutPromise]);

      if (this.auth) {
        this.initialized = true;
        this.retryCount = 0;
        console.log("✅ Firebase Auth inicializado com sucesso");
        return true;
      }

      throw new Error("Auth service returned null");
    } catch (error) {
      console.warn("⚠️ Firebase Auth falhou:", error);
      this.initialized = false;
      this.auth = null;
      this.initializationPromise = null;
      return false;
    }
  }

  async signIn(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<AuthResult> {
    // Verificar modo emergência
    if (
      typeof window !== "undefined" &&
      (window as any).EMERGENCY_MODE_ACTIVE
    ) {
      console.log("🚨 Firebase signIn bloqueado - modo emergência");
      return { success: false, error: "Firebase desativado temporariamente" };
    }

    console.log("🔐 Tentando login Firebase...");

    try {
      // Tentar inicializar Firebase se ainda não estiver
      if (!this.initialized && this.retryCount < this.maxRetries) {
        this.retryCount++;
        const initSuccess = await this.initialize();
        if (!initSuccess) {
          throw new Error("Firebase Auth not available");
        }
      }

      if (!this.auth || !this.initialized) {
        throw new Error("Firebase Auth instance not ready");
      }

      // Definir persistência com timeout
      try {
        const persistence = rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence;
        await Promise.race([
          setPersistence(this.auth, persistence),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Persistence timeout")), 2000),
          ),
        ]);
      } catch (persistError) {
        console.warn("⚠️ Persistence failed, continuando:", persistError);
      }

      // Login com timeout
      const loginPromise = signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Login timeout")), 8000),
      );

      const userCredential = await Promise.race([loginPromise, timeoutPromise]);

      console.log("✅ Firebase login bem-sucedido:", userCredential.user.email);

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error: any) {
      console.warn("⚠️ Firebase login falhou:", error);

      // Reset estado se erro crítico
      if (
        error.message &&
        (error.message.includes("destroyed") ||
          error.message.includes("checkDestroyed") ||
          error.message.includes("timeout"))
      ) {
        console.log("🔄 Resetando Firebase Auth devido a erro crítico");
        this.initialized = false;
        this.auth = null;
        this.initializationPromise = null;
      }

      let errorMessage = "Firebase indisponível";

      if (error.code) {
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage = "Utilizador não encontrado no Firebase";
            break;
          case "auth/wrong-password":
            errorMessage = "Password incorreta no Firebase";
            break;
          case "auth/invalid-email":
            errorMessage = "Email inválido";
            break;
          case "auth/user-disabled":
            errorMessage = "Conta desativada";
            break;
          case "auth/too-many-requests":
            errorMessage = "Muitas tentativas. Tente mais tarde";
            break;
          case "auth/network-request-failed":
            errorMessage = "Erro de rede";
            break;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async signUp(email: string, password: string): Promise<AuthResult> {
    console.log("👥 Tentando criar utilizador no Firebase...");

    try {
      // Sempre reinicializar para garantir instância válida
      this.initialized = false;
      if (!(await this.initialize())) {
        return {
          success: false,
          error: "Firebase Auth não disponível",
        };
      }

      if (!this.auth) {
        return {
          success: false,
          error: "Firebase Auth instance is null",
        };
      }

      // Criar utilizador com timeout
      const signupPromise = createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Signup timeout")), 8000),
      );

      const userCredential = await Promise.race([
        signupPromise,
        timeoutPromise,
      ]);

      console.log(
        "✅ Utilizador criado no Firebase:",
        userCredential.user.email,
      );

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error: any) {
      console.warn("⚠️ Firebase signup falhou:", error);

      // Reset estado se erro crítico
      if (
        error.message &&
        (error.message.includes("destroyed") ||
          error.message.includes("checkDestroyed") ||
          error.message.includes("timeout"))
      ) {
        console.log(
          "🔄 Resetando Firebase Auth devido a erro crítico no signup",
        );
        this.initialized = false;
        this.auth = null;
        this.initializationPromise = null;
      }

      let errorMessage = "Firebase indisponível para criar conta";

      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Email já está em uso no Firebase";
            break;
          case "auth/weak-password":
            errorMessage = "Password muito fraca";
            break;
          case "auth/invalid-email":
            errorMessage = "Email inválido";
            break;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      if (this.auth && this.initialized) {
        await signOut(this.auth);
        console.log("✅ Firebase logout bem-sucedido");
      }
    } catch (error) {
      console.warn("⚠️ Erro no logout Firebase:", error);
    }

    // Reset sempre o estado
    this.initialized = false;
    this.auth = null;
    this.initializationPromise = null;
    this.retryCount = 0;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    // Verificar modo emergência
    if (
      typeof window !== "undefined" &&
      (window as any).EMERGENCY_MODE_ACTIVE
    ) {
      console.log("🚨 onAuthStateChanged bloqueado - modo emergência");
      return () => {};
    }

    if (!this.auth || !this.initialized) {
      console.log("⚠️ Firebase Auth não inicializado - sem listener");
      return () => {};
    }

    try {
      return onAuthStateChanged(this.auth, callback);
    } catch (error) {
      console.warn("⚠️ Erro ao configurar listener:", error);
      return () => {};
    }
  }

  getCurrentUser(): User | null {
    if (!this.auth || !this.initialized) {
      return null;
    }

    try {
      return this.auth.currentUser;
    } catch (error) {
      console.warn("⚠️ Erro ao obter utilizador atual:", error);
      return null;
    }
  }

  async getIdToken(): Promise<string | null> {
    try {
      const user = this.getCurrentUser();
      if (user) {
        return await user.getIdToken();
      }
    } catch (error) {
      console.warn("⚠️ Erro ao obter token:", error);
    }
    return null;
  }

  async refreshToken(): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (user) {
        await user.getIdToken(true);
      }
    } catch (error) {
      console.warn("⚠️ Erro ao atualizar token:", error);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // Método para forçar reinicialização em caso de erro
  async forceReinitialize(): Promise<boolean> {
    console.log("🔄 Forçando reinicialização do Firebase Auth...");
    this.initialized = false;
    this.auth = null;
    this.initializationPromise = null;
    this.retryCount = 0;
    return this.initialize();
  }
}

export const authService = new FirebaseAuthService();
export default authService;
