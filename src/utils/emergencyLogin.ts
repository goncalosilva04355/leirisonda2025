/**
 * Sistema de login de emergência quando Firebase está bloqueado
 */

interface EmergencyUser {
  uid: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  emergencyMode: boolean;
}

export class EmergencyLoginSystem {
  // Utilizadores autorizados para login de emergência
  private authorizedUsers = [
    { email: "goncalo@aquagest.pt", name: "Gonçalo Fonseca", role: "admin" },
    {
      email: "gongonsilva@gmail.com",
      name: "Gonçalo Fonseca",
      role: "super_admin",
    },
    { email: "admin@aquagest.pt", name: "Administrador", role: "admin" },
    { email: "test@test.com", name: "Utilizador Teste", role: "user" },
    { email: "user@aquagest.pt", name: "Utilizador", role: "user" },
  ];

  // Passwords aceites (propositadamente simples para emergência)
  private validPasswords = ["123", "123456", "19867gsf"];

  isFirebaseBlocked(): boolean {
    return (
      (window as any).FIREBASE_BLOCKED === true ||
      localStorage.getItem("firebase_blocked") === "true"
    );
  }

  async attemptEmergencyLogin(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: EmergencyUser; error?: string }> {
    try {
      console.log("🚨 Tentativa de login de emergência:", email);

      // Normalizar email
      const normalizedEmail = email.toLowerCase().trim();

      // Verificar se utilizador está autorizado
      const authorizedUser = this.authorizedUsers.find(
        (u) => u.email === normalizedEmail,
      );
      if (!authorizedUser) {
        return { success: false, error: "Login incorreto" };
      }

      // Verificar password
      if (!this.validPasswords.includes(password)) {
        return { success: false, error: "Login incorreto" };
      }

      // Criar utilizador de emergência
      const emergencyUser: EmergencyUser = {
        uid: `emergency_${Date.now()}`,
        email: normalizedEmail,
        name: authorizedUser.name,
        role: authorizedUser.role,
        active: true,
        emergencyMode: true,
      };

      // Guardar no localStorage
      localStorage.setItem("currentUser", JSON.stringify(emergencyUser));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("emergency_user", JSON.stringify(emergencyUser));
      localStorage.setItem("emergency_login_time", Date.now().toString());

      console.log("✅ Login de emergência bem-sucedido:", emergencyUser);

      return { success: true, user: emergencyUser };
    } catch (error) {
      console.error("❌ Erro no login de emergência:", error);
      return { success: false, error: "Erro interno" };
    }
  }

  getEmergencySession(): EmergencyUser | null {
    try {
      const emergencyUser = localStorage.getItem("emergency_user");
      const loginTime = localStorage.getItem("emergency_login_time");

      if (!emergencyUser || !loginTime) return null;

      // Verificar se sessão não expirou (24 horas)
      const sessionAge = Date.now() - parseInt(loginTime);
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas

      if (sessionAge > maxAge) {
        this.clearEmergencySession();
        return null;
      }

      return JSON.parse(emergencyUser);
    } catch (error) {
      console.error("❌ Erro ao obter sessão de emergência:", error);
      return null;
    }
  }

  clearEmergencySession() {
    localStorage.removeItem("emergency_user");
    localStorage.removeItem("emergency_login_time");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
    console.log("🧹 Sessão de emergência limpa");
  }

  autoLogin(): boolean {
    try {
      // Verificar se há sessão de emergência válida
      const emergencyUser = this.getEmergencySession();
      if (emergencyUser) {
        console.log("🔄 Auto-login de emergência:", emergencyUser.email);

        // Restaurar sessão
        localStorage.setItem("currentUser", JSON.stringify(emergencyUser));
        localStorage.setItem("isAuthenticated", "true");

        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Erro no auto-login de emergência:", error);
      return false;
    }
  }
}

// Instanciar globalmente
const emergencyLogin = new EmergencyLoginSystem();
(window as any).emergencyLogin = emergencyLogin;

// Auto-tentar login se Firebase estiver bloqueado
if (emergencyLogin.isFirebaseBlocked()) {
  console.log(
    "🚨 Firebase bloqueado detectado - tentando auto-login de emergência",
  );
  emergencyLogin.autoLogin();
}

console.log("🚨 Emergency Login System ativo. Use window.emergencyLogin");

export { emergencyLogin };
