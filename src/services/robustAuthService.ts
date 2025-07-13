// Serviço de autenticação robusto que funciona com ou sem Firebase
import { UserProfile } from "./localAuthService";
import { getAuthorizedUser } from "../config/authorizedUsers";
import { safeLocalStorage, safeSessionStorage } from "../utils/storageUtils";

class RobustAuthService {
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    console.log("🔐 RobustAuth: Attempting login for:", email);

    try {
      // Validação básica
      if (!email || !password) {
        return {
          success: false,
          error: "Email e palavra-passe são obrigatórios",
        };
      }

      // Verificar se o email está autorizado
      const authorizedUser = getAuthorizedUser(email);
      if (!authorizedUser) {
        console.warn("❌ Email não autorizado:", email);
        return {
          success: false,
          error:
            "Email não autorizado. Contacte o administrador para obter acesso.",
        };
      }

      // Validação de senha - aceitar múltiplas passwords válidas
      const normalizedEmail = email.toLowerCase().trim();
      const isGoncaloEmail =
        normalizedEmail === "gongonsilva@gmail.com" ||
        normalizedEmail === "goncalosfonseca@gmail.com";
      const isPasswordValid =
        password === "123456" || // Password universal
        password === "123" || // Password simplificada
        (isGoncaloEmail && password === "19867gsf") || // Password específica do super admin
        (isGoncaloEmail && password === "123456") || // Password alternativa para super admin
        password.length >= 3; // Qualquer password com 3+ caracteres

      if (!isPasswordValid) {
        console.warn("❌ Password incorreta para:", email);
        return {
          success: false,
          error: `Password incorreta. Use "123" ou "123456" para login rápido.`,
        };
      }

      // Criar perfil do utilizador
      const userProfile: UserProfile = {
        uid: `local_${Date.now()}`,
        email: normalizedEmail,
        name: authorizedUser.name,
        role: authorizedUser.role,
        active: true,
        createdAt: new Date().toISOString(),
      };

      // Persistir dados no localStorage
      try {
        safeLocalStorage.setItem("currentUser", JSON.stringify(userProfile));
        safeLocalStorage.setItem("isAuthenticated", "true");

        // Guardar credenciais se remember me for ativado
        if (rememberMe) {
          safeLocalStorage.setItem("rememberMe", "true");
          safeSessionStorage.setItem(
            "savedLoginCredentials",
            JSON.stringify({
              email: email.trim(),
              password: password,
              rememberMe: true,
            }),
          );
          console.log("💾 RobustAuth: Credenciais guardadas para auto-login");
        }

        console.log(
          "✅ RobustAuth: Login successful and persisted for:",
          email,
        );
        return { success: true, user: userProfile };
      } catch (storageError) {
        console.error("❌ RobustAuth: Error saving to storage:", storageError);
        return { success: false, error: "Erro ao guardar sessão" };
      }
    } catch (error: any) {
      console.error("❌ RobustAuth: Unexpected error:", error);
      return {
        success: false,
        error: "Erro inesperado. Tente novamente.",
      };
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("🚪 RobustAuth: Logging out...");

      // Limpar todos os dados de autenticação
      safeLocalStorage.removeItem("currentUser");
      safeLocalStorage.removeItem("isAuthenticated");
      safeLocalStorage.removeItem("rememberMe");
      safeSessionStorage.removeItem("savedLoginCredentials");

      console.log("✅ RobustAuth: Logout successful");
    } catch (error) {
      console.error("❌ RobustAuth: Logout error:", error);
    }
  }

  getCurrentUser(): UserProfile | null {
    try {
      const savedUser = safeLocalStorage.getItem("currentUser");
      const isAuthenticated = safeLocalStorage.getItem("isAuthenticated");

      if (savedUser && isAuthenticated === "true") {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (error) {
      console.error("❌ RobustAuth: Error getting current user:", error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Função para testar credenciais rapidamente
  async quickTest(email: string, password: string): Promise<boolean> {
    const result = await this.login(email, password, false);
    if (result.success) {
      await this.logout(); // Logout imediato após teste
      return true;
    }
    return false;
  }
}

export const robustAuthService = new RobustAuthService();
export default robustAuthService;
