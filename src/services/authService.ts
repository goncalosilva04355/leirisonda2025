import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  auth,
  db,
  isFirebaseReady,
  waitForFirebaseInit,
} from "../firebase/config";
import { mockAuthService } from "./mockAuthService";
import { QuotaManager } from "../utils/quotaManager";

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

    // Wait for Firebase initialization and try Firebase first for cross-device access
    const firebaseReady = await waitForFirebaseInit();
    if (firebaseReady && isFirebaseReady()) {
      console.log(
        "🔥 Attempting Firebase registration for cross-device access...",
      );
      try {
        const result = await this.registerWithFirebase(
          email,
          password,
          name,
          role,
        );
        if (result.success) {
          console.log(
            "✅ Firebase registration successful - user can access from any device",
          );
          return result;
        }
      } catch (error: any) {
        // Check for quota exceeded
        if (
          error.message?.includes("quota") ||
          error.message?.includes("resource-exhausted")
        ) {
          const { markQuotaExceeded } = await import("../firebase/config");
          markQuotaExceeded();
          console.warn(
            "🚨 Firebase quota exceeded during registration, using local auth",
          );
        } else {
          console.warn(
            "⚠️ Firebase registration failed, falling back to local:",
            error,
          );
        }
      }
    } else {
      console.log("📱 Firebase not ready, using local auth");
    }

    // Fallback to mock authentication (device-specific only)
    console.log(
      "Using local authentication - access limited to this device...",
    );
    const result = await this.registerWithMock(email, password, name, role);
    if (result.success) {
      console.log(
        "⚠️ Local registration successful - user can only access from this device",
      );
    }
    return result;
  }

  private async registerWithFirebase(
    email: string,
    password: string,
    name: string,
    role: "super_admin" | "manager" | "technician",
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
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
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Full error:", JSON.stringify(error, null, 2));

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

  private async registerWithMock(
    email: string,
    password: string,
    name: string,
    role: "super_admin" | "manager" | "technician",
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      const mockResult = await mockAuthService.register(
        email,
        password,
        name,
        role,
      );

      if (mockResult.success && mockResult.user) {
        // Convert mock user to UserProfile format
        const userProfile: UserProfile = {
          uid: mockResult.user.uid,
          email: mockResult.user.email,
          name: mockResult.user.name,
          role: mockResult.user.role,
          permissions: this.getDefaultPermissions(mockResult.user.role),
          active: mockResult.user.active,
          createdAt: mockResult.user.createdAt,
        };

        return { success: true, user: userProfile };
      } else {
        return {
          success: false,
          error: mockResult.error || "Erro na autenticação local",
        };
      }
    } catch (error: any) {
      console.error("Mock auth registration failed:", error);
      return { success: false, error: "Erro na autenticação local" };
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

    // Try Firebase first for cross-device access with quota protection
    const quotaStatus = QuotaManager.getQuotaStatus();
    const firebaseReady = await waitForFirebaseInit();

    if (firebaseReady && isFirebaseReady() && quotaStatus.canSync) {
      console.log("🔥 Attempting Firebase login for cross-device access...");

      const firebaseLoginResult = await QuotaManager.executeWithQuotaProtection(
        () => this.loginWithFirebase(email, password),
        "user-login",
      );

      if (firebaseLoginResult.success && firebaseLoginResult.data?.success) {
        console.log(
          "✅ Firebase login successful - cross-device access enabled",
        );
        return firebaseLoginResult.data;
      } else if (firebaseLoginResult.error?.includes("quota")) {
        console.log(
          "🚨 Firebase quota exceeded during login, using local auth",
        );
      } else {
        console.log("🔄 Firebase login failed, using local auth");
      }
    } else if (!quotaStatus.canSync) {
      console.log(
        `⏸️ Firebase login blocked: ${quotaStatus.recommendedAction}`,
      );
    } else {
      console.log("📱 Firebase not ready, using local authentication");
    }

    // Fallback to mock auth for local-only users
    console.log("Using local authentication as fallback...");
    try {
      const result = await this.loginWithMock(email, password);
      if (result.success) {
        console.log("⚠️ Local login successful - device-specific access only");
        return result;
      } else {
        return result;
      }
    } catch (mockError: any) {
      console.error("Local auth failed:", mockError);
      return {
        success: false,
        error: "Credenciais inválidas",
      };
    }
  }

  private async loginWithFirebase(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      // Check if user is in the blocked list
      const blockedEmails = [
        "yrzamr@gmail.com",
        "yrzamr01@gmail.com",
        "alexkamaryta@gmail.com",
        "davidcarreiraa92@gmail.com",
      ];

      if (
        blockedEmails.some(
          (blocked) => blocked.toLowerCase() === email.trim().toLowerCase(),
        )
      ) {
        console.log("🚫 Blocked user attempt:", email);
        return { success: false, error: "Acesso negado" };
      }

      // Check if Firebase Auth is available
      if (!auth) {
        console.warn("Firebase Auth not available, falling back to mock auth");
        throw new Error("Firebase Auth not initialized");
      }

      // Check if Firestore is available
      if (!db) {
        console.warn("Firestore not available, falling back to mock auth");
        throw new Error("Firestore not initialized");
      }

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const firebaseUser = userCredential.user;

      // Get user profile from Firestore with error handling
      let userDoc;
      try {
        if (!db) {
          throw new Error("Firestore not available");
        }
        userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      } catch (firestoreError: any) {
        console.warn("Firestore access failed:", firestoreError.message);
        throw new Error("Firestore not available");
      }

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

        try {
          await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
          console.log("User profile created successfully");
        } catch (createError: any) {
          console.warn(
            "Failed to create user profile in Firestore:",
            createError.message,
          );
          throw new Error("Failed to create user profile");
        }

        return { success: true, user: userProfile };
      }

      const userProfile = userDoc.data() as UserProfile;

      if (!userProfile.active) {
        return { success: false, error: "Conta desativada" };
      }

      return { success: true, user: userProfile };
    } catch (error: any) {
      // Only log actual authentication errors, not network/initialization errors
      if (error.code && error.code.startsWith("auth/")) {
        console.log("🔐 Firebase auth error:", error.code);
      }

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
      } else if (
        error.code === "auth/network-request-failed" ||
        error.message === "Firebase timeout" ||
        error.message === "Firebase Auth not initialized" ||
        error.message === "Firestore not initialized"
      ) {
        // Network or initialization error - throw to trigger fallback to mock auth
        throw error;
      } else if (error.message && error.message.includes("fetch")) {
        // General network fetch error - throw to trigger fallback
        throw error;
      }

      return { success: false, error: errorMessage };
    }
  }

  private async loginWithMock(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      // Check if user is in the blocked list
      const blockedEmails = [
        "yrzamr@gmail.com",
        "yrzamr01@gmail.com",
        "alexkamaryta@gmail.com",
        "davidcarreiraa92@gmail.com",
      ];

      if (
        blockedEmails.some(
          (blocked) => blocked.toLowerCase() === email.trim().toLowerCase(),
        )
      ) {
        console.log("🚫 Blocked user attempt:", email);
        return { success: false, error: "Acesso negado" };
      }

      // First, try to get login diagnostics and auto-sync if needed
      const { UserSyncManager } = await import("../utils/userSyncManager");
      const diagnostics = UserSyncManager.getLoginDiagnostics(email, password);

      console.log("🔍 Login diagnostics:", {
        email,
        userExists: diagnostics.userExists,
        emailExists: diagnostics.emailExists,
        passwordMatches: diagnostics.passwordMatches,
        isActive: diagnostics.isActive,
        suggestions: diagnostics.suggestions,
      });

      // If user exists but login might fail due to sync issues, perform sync
      if (diagnostics.userExists && !diagnostics.passwordMatches) {
        console.log("🔄 Performing user sync before login attempt...");
        UserSyncManager.performFullSync();
      }

      const mockResult = await mockAuthService.login(email, password);

      if (mockResult.success && mockResult.user) {
        // Convert mock user to UserProfile format
        const userProfile: UserProfile = {
          uid: mockResult.user.uid,
          email: mockResult.user.email,
          name: mockResult.user.name,
          role: mockResult.user.role,
          permissions: this.getDefaultPermissions(mockResult.user.role),
          active: mockResult.user.active,
          createdAt: mockResult.user.createdAt,
        };

        return { success: true, user: userProfile };
      } else {
        // Enhanced error message with diagnostics
        let errorMessage = mockResult.error || "Credenciais inválidas";

        if (diagnostics.userExists) {
          if (!diagnostics.isActive) {
            errorMessage =
              "Conta desativada. Contacte o administrador para reativar.";
          } else if (!diagnostics.passwordMatches) {
            errorMessage = "Password incorreta. Verifique as suas credenciais.";
          }
        } else {
          errorMessage =
            "Utilizador não encontrado. Verifique o email ou contacte o administrador.";
        }

        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error: any) {
      console.error("Mock auth login failed:", error);
      return {
        success: false,
        error: "Erro de autenticação. Tente novamente.",
      };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Clear mock auth state
      await mockAuthService.logout();

      // Clear Firebase auth state
      if (auth) {
        await signOut(auth);
      }

      // Clear session storage only
      sessionStorage.clear();

      console.log(
        "Complete logout performed - Firebase will handle auth persistence automatically",
      );
    } catch (error) {
      console.error("Error during logout:", error);

      // Force clear session storage even if logout fails
      sessionStorage.clear();
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    // Try Firebase first if available
    if (auth && db) {
      console.log("Setting up Firebase auth state listener");
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
                // Force logout if no valid user profile found
                console.log("No valid user profile found, forcing logout");
                await this.logout();
                callback(null);
              }
            } catch (error) {
              console.error("Error getting user profile:", error);
              // Force logout on error for security
              await this.logout();
              callback(null);
            }
          } else {
            callback(null);
          }
        },
      );
    } else {
      // Fallback to mock authentication
      console.log("Setting up mock auth state listener");
      return mockAuthService.onAuthStateChanged((mockUser) => {
        if (mockUser) {
          const userProfile: UserProfile = {
            uid: mockUser.uid,
            email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role,
            permissions: this.getDefaultPermissions(mockUser.role),
            active: mockUser.active,
            createdAt: mockUser.createdAt,
          };
          callback(userProfile);
        } else {
          callback(null);
        }
      });
    }
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

  // Initialize default super admin if no users exist - REMOVED FOR SECURITY
  // This function was causing automatic login which is a security risk
  // Users must always login manually
  async initializeDefaultAdmin(): Promise<void> {
    // Function disabled for security - no automatic login allowed
    console.log("Automatic admin initialization disabled for security");
    return;
  }
}

export const authService = new AuthService();
export default authService;
