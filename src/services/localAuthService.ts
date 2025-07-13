// Simple localStorage-based authentication service (no Firebase required)
import {
  isEmailAuthorized,
  getAuthorizedUser,
} from "../config/authorizedUsers";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

class LocalAuthService {
  private currentUser: UserProfile | null = null;
  private listeners: Array<(user: UserProfile | null) => void> = [];

  constructor() {
    // Load user from localStorage on initialization
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    try {
      const savedUser = localStorage.getItem("currentUser");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (savedUser && isAuthenticated === "true") {
        this.currentUser = JSON.parse(savedUser);
        console.log(
          "✅ User loaded from localStorage:",
          this.currentUser?.email,
        );
      }
    } catch (error) {
      console.warn("⚠️ Error loading user from localStorage:", error);
      this.currentUser = null;
    }
  }

  private saveUserToStorage(user: UserProfile): void {
    try {
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");
      console.log("✅ User saved to localStorage");
    } catch (error) {
      console.warn("⚠️ Error saving user to localStorage:", error);
    }
  }

  private clearUserFromStorage(): void {
    try {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isAuthenticated");
      console.log("✅ User cleared from localStorage");
    } catch (error) {
      console.warn("⚠️ Error clearing user from localStorage:", error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback(this.currentUser);
      } catch (error) {
        console.error("❌ Error in auth state listener:", error);
      }
    });
  }

  // Simple login that works with correct password validation
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      // Basic validation
      if (!email || !password) {
        return {
          success: false,
          error: "Email e palavra-passe são obrigatórios",
        };
      }

      // Verificar se o email está autorizado
      const authorizedUser = getAuthorizedUser(email);
      if (!authorizedUser) {
        return {
          success: false,
          error:
            "Email não autorizado. Contacte o administrador para obter acesso.",
        };
      }

      // Simple validation - check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: "Formato de email inválido" };
      }

      // Verificar password - aceita "123", "19867gsf" para super admin, ou "123456" para outros
      const isPasswordValid =
        password === "123" || // Password universal para compatibilidade
        (email.toLowerCase() === "gongonsilva@gmail.com" &&
          password === "19867gsf") || // Password específica do super admin
        password === "123456"; // Password padrão dos utilizadores

      if (!isPasswordValid) {
        return {
          success: false,
          error: `Password incorreta. Use "123" ou consulte o administrador.`,
        };
      }

      // Create user profile with authorized user data
      const userProfile: UserProfile = {
        uid: `local_${Date.now()}`,
        email: email.toLowerCase(),
        name: authorizedUser.name,
        role: authorizedUser.role,
        active: true,
        createdAt: new Date().toISOString(),
      };

      // Set current user
      this.currentUser = userProfile;

      // Save to localStorage
      this.saveUserToStorage(userProfile);

      // Persistir sessão se rememberMe for true
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("autoLoginEnabled", "true");
        console.log("💾 Sessão persistida - auto-login ativo para:", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("autoLoginEnabled");
      }

      // Notify listeners
      this.notifyListeners();

      console.log("✅ Local login successful for:", email);
      return { success: true, user: userProfile };
    } catch (error: any) {
      console.error("❌ Local login error:", error);
      return { success: false, error: "Erro interno do sistema" };
    }
  }

  // Simple logout
  async logout(): Promise<void> {
    try {
      this.currentUser = null;
      this.clearUserFromStorage();

      // Limpar configurações de auto-login
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("autoLoginEnabled");
      sessionStorage.removeItem("savedLoginCredentials");
      console.log("🔒 Configurações de auto-login removidas");

      this.notifyListeners();
      console.log("✅ Local logout successful");
    } catch (error) {
      console.error("❌ Local logout error:", error);
    }
  }

  // Auth state listener
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    // Add callback to listeners
    this.listeners.push(callback);

    // Immediately call with current state
    setTimeout(() => callback(this.currentUser), 0);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get current user
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    return this.currentUser;
  }

  // Quick access to current user synchronously
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}

export const localAuthService = new LocalAuthService();
export default localAuthService;
