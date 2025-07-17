// Wrapper de autenticação que escolhe o serviço correto baseado no ambiente
import { directAuthService } from "./directAuthService";
import { UserProfile } from "./localAuthService";

class AuthServiceWrapper {
  private isDevelopment = import.meta.env.DEV;
  private isNetlify =
    import.meta.env.NETLIFY === "true" ||
    import.meta.env.VITE_IS_NETLIFY === "true";

  constructor() {
    console.log("🔐 Auth Service Wrapper initialized:", {
      isDevelopment: this.isDevelopment,
      isNetlify: this.isNetlify,
      usingService: this.getServiceName(),
    });
  }

  private getServiceName(): string {
    // SEMPRE usar directAuthService para evitar erros Firebase
    return "DirectAuth (Local)";
  }

  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      console.log("🔐 AuthWrapper: Usando DirectAuth para login");

      // SEMPRE usar directAuthService - é mais simples e confiável
      const result = await directAuthService.login(email, password, rememberMe);

      if (result.success) {
        console.log("✅ AuthWrapper: Login successful via DirectAuth");
      } else {
        console.warn(
          "❌ AuthWrapper: Login failed via DirectAuth:",
          result.error,
        );
      }

      return result;
    } catch (error: any) {
      console.error("❌ AuthWrapper: Unexpected error:", error);
      return {
        success: false,
        error: "Erro de autenticação. Tente novamente.",
      };
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("🚪 AuthWrapper: Logout using DirectAuth");
      await directAuthService.logout();
      console.log("✅ AuthWrapper: Logout completed");
    } catch (error) {
      console.error("❌ AuthWrapper: Logout error:", error);
    }
  }

  getCurrentUser(): UserProfile | null {
    try {
      return directAuthService.getCurrentUser();
    } catch (error) {
      console.error("❌ AuthWrapper: Error getting current user:", error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    try {
      return directAuthService.isAuthenticated();
    } catch (error) {
      console.error("❌ AuthWrapper: Error checking auth status:", error);
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

export const authServiceWrapper = new AuthServiceWrapper();
export default authServiceWrapper;
