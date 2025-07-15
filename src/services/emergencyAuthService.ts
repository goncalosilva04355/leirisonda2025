/**
 * Serviço de autenticação de emergência
 * Usado quando Firebase está bloqueado temporariamente
 */

import { AuthResult, UserProfile } from "../types/auth";

export class EmergencyAuthService {
  private static instance: EmergencyAuthService;

  static getInstance(): EmergencyAuthService {
    if (!EmergencyAuthService.instance) {
      EmergencyAuthService.instance = new EmergencyAuthService();
    }
    return EmergencyAuthService.instance;
  }

  /**
   * Login de emergência (só localStorage)
   */
  async emergencyLogin(email: string, password: string): Promise<AuthResult> {
    console.log("🚨 MODO EMERGÊNCIA: Usando apenas autenticação local");

    const normalizedEmail = email.toLowerCase().trim();

    // Utilizadores autorizados
    const authorizedUsers = [
      { email: "goncalo@aquagest.pt", name: "Gonçalo Fonseca", role: "admin" },
      { email: "admin@aquagest.pt", name: "Administrador", role: "admin" },
      { email: "test@test.com", name: "Utilizador Teste", role: "user" },
      { email: "user@aquagest.pt", name: "Utilizador", role: "user" },
    ];

    const authorizedUser = authorizedUsers.find(
      (user) => user.email === normalizedEmail,
    );

    if (!authorizedUser) {
      return {
        success: false,
        error: "Login incorreto",
      };
    }

    // Validação simples de password
    const isPasswordValid =
      password === "123" ||
      password === "123456" ||
      (normalizedEmail.includes("goncalo") && password === "19867gsf") ||
      password.length >= 3;

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Login incorreto",
      };
    }

    // Criar perfil do utilizador
    const userProfile: UserProfile = {
      uid: `emergency_${Date.now()}`,
      email: normalizedEmail,
      name: authorizedUser.name,
      role: authorizedUser.role,
      active: true,
      emergencyMode: true,
    };

    // Guardar no localStorage
    localStorage.setItem("emergency_user", JSON.stringify(userProfile));
    localStorage.setItem("emergency_auth_time", Date.now().toString());

    console.log("✅ Login de emergência bem-sucedido:", userProfile);

    return {
      success: true,
      user: userProfile,
    };
  }

  /**
   * Verificar se há sessão de emergência ativa
   */
  getEmergencySession(): UserProfile | null {
    try {
      const emergencyUser = localStorage.getItem("emergency_user");
      const authTime = localStorage.getItem("emergency_auth_time");

      if (!emergencyUser || !authTime) return null;

      // Verificar se a sessão não expirou (24h)
      const sessionAge = Date.now() - parseInt(authTime);
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas

      if (sessionAge > maxAge) {
        this.clearEmergencySession();
        return null;
      }

      return JSON.parse(emergencyUser);
    } catch (error) {
      console.error("❌ Erro ao verificar sessão de emergência:", error);
      return null;
    }
  }

  /**
   * Limpar sessão de emergência
   */
  clearEmergencySession(): void {
    localStorage.removeItem("emergency_user");
    localStorage.removeItem("emergency_auth_time");
    console.log("🧹 Sessão de emergência limpa");
  }

  /**
   * Verificar se está em modo emergência
   */
  isEmergencyMode(): boolean {
    return this.getEmergencySession()?.emergencyMode === true;
  }
}

export const emergencyAuthService = EmergencyAuthService.getInstance();
