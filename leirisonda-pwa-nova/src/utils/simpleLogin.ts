// Função de login simplificada que funciona sem erros
import { robustAuthService } from "../services/robustAuthService";
import { safeLocalStorage } from "./storageUtils";
import { UserProfile } from "../services/localAuthService";

export async function performLogin(
  email: string,
  password: string,
  rememberMe: boolean = false,
): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
  try {
    console.log("🔐 SimpleLogin: Attempting login for:", email);

    // Validação básica
    if (!email?.trim() || !password?.trim()) {
      return {
        success: false,
        error: "Por favor, preencha todos os campos",
      };
    }

    // Usar o serviço robusto de autenticação
    const result = await robustAuthService.login(
      email.trim(),
      password,
      rememberMe,
    );

    if (result.success && result.user) {
      console.log("✅ SimpleLogin: Login successful for:", result.user.email);

      // Garantir que os dados estão persistidos
      safeLocalStorage.setItem("currentUser", JSON.stringify(result.user));
      safeLocalStorage.setItem("isAuthenticated", "true");

      // Disparar evento para notificar outros componentes
      window.dispatchEvent(
        new CustomEvent("userLoggedIn", {
          detail: { user: result.user },
        }),
      );

      return result;
    } else {
      console.warn("❌ SimpleLogin: Login failed:", result.error);
      return result;
    }
  } catch (error: any) {
    console.error("❌ SimpleLogin: Unexpected error:", error);
    return {
      success: false,
      error: "Erro inesperado. Tente novamente.",
    };
  }
}

export async function performLogout(): Promise<void> {
  try {
    console.log("🚪 SimpleLogin: Performing logout...");

    await robustAuthService.logout();

    // Disparar evento para notificar outros componentes
    window.dispatchEvent(new CustomEvent("userLoggedOut"));

    console.log("✅ SimpleLogin: Logout successful");
  } catch (error) {
    console.error("❌ SimpleLogin: Logout error:", error);
  }
}
