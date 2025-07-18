// Wrapper de autenticação seguro que sempre usa directAuthService
import { directAuthService } from "./directAuthService";
import { UserProfile } from "./localAuthService";

class AuthServiceWrapperSafe {
  constructor() {
    console.log(
      "🔐 Safe Auth Service Wrapper initialized - using DirectAuth only",
    );
  }

  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      console.log("🔐 SafeAuthWrapper: Usando DirectAuth para login");

      // SEMPRE usar directAuthService - é mais simples e confiável
      const result = await directAuthService.login(email, password, rememberMe);

      if (result.success) {
        console.log("✅ SafeAuthWrapper: Login successful via DirectAuth");
      } else {
        console.warn(
          "❌ SafeAuthWrapper: Login failed via DirectAuth:",
          result.error,
        );
      }

      return result;
    } catch (error: any) {
      console.error("❌ SafeAuthWrapper: Unexpected error:", error);
      return {
        success: false,
        error: "Erro de autenticação. Tente novamente.",
      };
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("🚪 SafeAuthWrapper: Logout using DirectAuth");
      await directAuthService.logout();
      console.log("✅ SafeAuthWrapper: Logout completed");
    } catch (error) {
      console.error("❌ SafeAuthWrapper: Logout error:", error);
    }
  }

  getCurrentUser(): UserProfile | null {
    try {
      return directAuthService.getCurrentUser();
    } catch (error) {
      console.error("❌ SafeAuthWrapper: Error getting current user:", error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    try {
      return directAuthService.isAuthenticated();
    } catch (error) {
      console.error("❌ SafeAuthWrapper: Error checking auth status:", error);
      return false;
    }
  }

  // Método para listar emails autorizados
  getAuthorizedEmails(): string[] {
    return directAuthService.getAuthorizedEmails();
  }

  // Método para verificar se um email é autorizado
  isEmailAuthorized(email: string): boolean {
    const authorizedEmails = this.getAuthorizedEmails();
    return authorizedEmails.includes(email.toLowerCase().trim());
  }
}

export const authServiceWrapperSafe = new AuthServiceWrapperSafe();
export default authServiceWrapperSafe;
