// Serviço de autenticação direto que sempre aceita os emails do Gonçalo
import { UserProfile } from "./localAuthService";
import { safeLocalStorage, safeSessionStorage } from "../utils/storageUtils";
import { saveToFirestoreRest } from "../utils/firestoreRestApi";

class DirectAuthService {
  // Lista fixa de emails autorizados (hardcoded para garantir que funciona)
  private readonly AUTHORIZED_EMAILS = [
    "gongonsilva@gmail.com",
    "goncalosfonseca@gmail.com",
  ];

  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    console.log("🔐 DirectAuth: Attempting login for:", email);

    try {
      // Validação básica
      if (!email || !password) {
        return {
          success: false,
          error: "Email e palavra-passe são obrigatórios",
        };
      }

      // Normalizar email
      const normalizedEmail = email.toLowerCase().trim();

      // Primeiro verificar emails hardcoded (para compatibilidade)
      const isHardcodedEmail = this.AUTHORIZED_EMAILS.includes(normalizedEmail);

      // Também verificar utilizadores criados no sistema
      const savedUsers = safeLocalStorage.getItem("app-users");
      let authorizedUser = null;

      if (savedUsers) {
        try {
          const users = JSON.parse(savedUsers);
          authorizedUser = users.find(
            (user: any) =>
              user.email?.toLowerCase().trim() === normalizedEmail &&
              user.active,
          );
        } catch (error) {
          console.warn("❌ Erro ao carregar utilizadores:", error);
        }
      }

      if (!isHardcodedEmail && !authorizedUser) {
        console.warn("❌ Email não encontrado no sistema:", email);
        return {
          success: false,
          error: "Email não encontrado ou utilizador inativo",
        };
      }

      // Verificar password (muito permissiva)
      const isPasswordValid =
        password === "123456" ||
        password === "123" ||
        password === "19867gsf" ||
        password.length >= 3; // Qualquer password com 3+ caracteres

      if (!isPasswordValid) {
        console.warn("❌ Password muito curta para:", email);
        return {
          success: false,
          error: `Password deve ter pelo menos 3 caracteres. Tente: 123, 123456 ou 19867gsf`,
        };
      }

      // Criar perfil do utilizador
      const userProfile: UserProfile = {
        uid: `direct_${Date.now()}`,
        email: normalizedEmail,
        name: "Gonçalo Fonseca",
        role: "super_admin",
        active: true,
        createdAt: new Date().toISOString(),
      };

      // Persistir dados no localStorage E no Firestore
      try {
        // Guardar localmente para sessão
        safeLocalStorage.setItem("currentUser", JSON.stringify(userProfile));
        safeLocalStorage.setItem("isAuthenticated", "true");

        // SEMPRE guardar no Firestore
        try {
          await saveToFirestoreRest(
            "users",
            userProfile.id?.toString() || email,
            userProfile,
          );
          console.log("✅ DirectAuth: Utilizador guardado no Firestore");
        } catch (firestoreError) {
          console.warn("⚠️ DirectAuth: Erro Firestore, mas login continua");
        }

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
          console.log("💾 DirectAuth: Credenciais guardadas para auto-login");
        }

        console.log("✅ DirectAuth: Login successful for:", email);

        // Disparar evento para ativar auto sync ap��s login
        setTimeout(() => {
          console.log("🔄 Disparando evento de login para ativar auto sync...");
          window.dispatchEvent(
            new CustomEvent("userLoggedIn", {
              detail: { user: userProfile, timestamp: Date.now() },
            }),
          );
        }, 100);

        return { success: true, user: userProfile };
      } catch (storageError) {
        console.error("❌ DirectAuth: Storage error:", storageError);
        return { success: false, error: "Erro ao guardar sessão" };
      }
    } catch (error: any) {
      console.error("❌ DirectAuth: Unexpected error:", error);
      return {
        success: false,
        error: "Erro inesperado. Tente novamente.",
      };
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("🚪 DirectAuth: Logging out...");

      safeLocalStorage.removeItem("currentUser");
      safeLocalStorage.removeItem("isAuthenticated");
      safeLocalStorage.removeItem("rememberMe");
      safeSessionStorage.removeItem("savedLoginCredentials");

      console.log("✅ DirectAuth: Logout successful");
    } catch (error) {
      console.error("❌ DirectAuth: Logout error:", error);
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
      console.error("❌ DirectAuth: Error getting current user:", error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Função para listar emails autorizados
  getAuthorizedEmails(): string[] {
    return [...this.AUTHORIZED_EMAILS];
  }
}

export const directAuthService = new DirectAuthService();
export default directAuthService;
