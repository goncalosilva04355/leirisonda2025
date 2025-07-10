import { authService } from "./authService";

export interface RestoreResult {
  success: boolean;
  message: string;
  usersRestored: number;
  errors: string[];
}

class UserRestoreService {
  private readonly defaultUsers = [
    {
      id: 1,
      name: "Gonçalo Fonseca",
      email: "gongonsilva@gmail.com",
      password: "19867gsf",
      role: "super_admin" as const,
      permissions: {
        obras: { view: true, create: true, edit: true, delete: true },
        manutencoes: { view: true, create: true, edit: true, delete: true },
        piscinas: { view: true, create: true, edit: true, delete: true },
        utilizadores: { view: true, create: true, edit: true, delete: true },
        relatorios: { view: true, create: true, edit: true, delete: true },
        clientes: { view: true, create: true, edit: true, delete: true },
      },
      active: true,
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "João Silva",
      email: "manager@leirisonda.com",
      password: "manager123",
      role: "manager" as const,
      permissions: {
        obras: { view: true, create: true, edit: true, delete: false },
        manutencoes: { view: true, create: true, edit: true, delete: false },
        piscinas: { view: true, create: true, edit: true, delete: false },
        utilizadores: { view: true, create: false, edit: false, delete: false },
        relatorios: { view: true, create: true, edit: false, delete: false },
        clientes: { view: true, create: true, edit: true, delete: false },
      },
      active: true,
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      name: "Maria Santos",
      email: "tecnico@leirisonda.com",
      password: "tecnico123",
      role: "technician" as const,
      permissions: {
        obras: { view: true, create: true, edit: true, delete: false },
        manutencoes: { view: true, create: true, edit: true, delete: false },
        piscinas: { view: true, create: true, edit: true, delete: false },
        utilizadores: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        relatorios: { view: true, create: false, edit: false, delete: false },
        clientes: { view: true, create: false, edit: false, delete: false },
      },
      active: true,
      createdAt: "2024-01-01",
    },
    {
      id: 4,
      name: "Ana Costa",
      email: "ana@leirisonda.com",
      password: "ana123",
      role: "technician" as const,
      permissions: {
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
      },
      active: true,
      createdAt: "2024-01-01",
    },
  ];

  private readonly mockUsers = [
    {
      uid: "admin-1",
      email: "gongonsilva@gmail.com",
      password: "19867gsf",
      name: "Gonçalo Fonseca",
      role: "super_admin" as const,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      uid: "manager-1",
      email: "manager@leirisonda.com",
      password: "manager123",
      name: "João Silva",
      role: "manager" as const,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      uid: "tech-1",
      email: "tecnico@leirisonda.com",
      password: "tecnico123",
      name: "Maria Santos",
      role: "technician" as const,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      uid: "tech-2",
      email: "ana@leirisonda.com",
      password: "ana123",
      name: "Ana Costa",
      role: "technician" as const,
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  /**
   * Restaura todos os utilizadores padrão se não existirem
   */
  async restoreDefaultUsers(): Promise<RestoreResult> {
    const result: RestoreResult = {
      success: false,
      message: "",
      usersRestored: 0,
      errors: [],
    };

    try {
      console.log("🔄 Iniciando restauração de utilizadores...");

      // Restaurar app-users
      const appUsers = localStorage.getItem("app-users");
      if (!appUsers || JSON.parse(appUsers).length === 0) {
        localStorage.setItem("app-users", JSON.stringify(this.defaultUsers));
        result.usersRestored += this.defaultUsers.length;
        console.log("✅ Restaurados app-users");
      }

      // Restaurar mock-users
      const mockUsers = localStorage.getItem("mock-users");
      if (!mockUsers || JSON.parse(mockUsers).length === 0) {
        localStorage.setItem("mock-users", JSON.stringify(this.mockUsers));
        console.log("✅ Restaurados mock-users");
      }

      // Restaurar users (se necessário)
      const users = localStorage.getItem("users");
      if (!users || JSON.parse(users).length === 0) {
        localStorage.setItem("users", JSON.stringify(this.defaultUsers));
        console.log("✅ Restaurados users");
      }

      result.success = true;
      result.message = `Utilizadores restaurados com sucesso! ${result.usersRestored} utilizadores disponíveis.`;

      console.log("✅ Restauração de utilizadores concluída");

      // Notificar a aplicação sobre a mudança
      window.dispatchEvent(new CustomEvent("usersRestored"));
    } catch (error: any) {
      console.error("❌ Erro na restauração de utilizadores:", error);
      result.success = false;
      result.message = `Erro na restauração: ${error.message}`;
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Verifica se os utilizadores precisam ser restaurados
   */
  needsRestore(): boolean {
    try {
      const appUsers = localStorage.getItem("app-users");
      const mockUsers = localStorage.getItem("mock-users");

      const appUsersEmpty = !appUsers || JSON.parse(appUsers).length === 0;
      const mockUsersEmpty = !mockUsers || JSON.parse(mockUsers).length === 0;

      return appUsersEmpty || mockUsersEmpty;
    } catch (error) {
      console.error("Erro ao verificar se precisa restaurar:", error);
      return true; // Em caso de erro, assumir que precisa restaurar
    }
  }

  /**
   * Restaura utilizadores automaticamente se necessário
   */
  async autoRestore(): Promise<void> {
    if (this.needsRestore()) {
      console.log(
        "🔄 Utilizadores em falta, iniciando restauração automática...",
      );
      const result = await this.restoreDefaultUsers();
      if (result.success) {
        console.log("✅ Restauração automática concluída");
      } else {
        console.error("❌ Falha na restauração automática:", result.message);
      }
    }
  }

  /**
   * Obtém estatísticas dos utilizadores atuais
   */
  getUserStats(): {
    appUsers: number;
    mockUsers: number;
    totalUnique: number;
  } {
    try {
      const appUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
      const mockUsers = JSON.parse(localStorage.getItem("mock-users") || "[]");

      const uniqueEmails = new Set([
        ...appUsers.map((u: any) => u.email),
        ...mockUsers.map((u: any) => u.email),
      ]);

      return {
        appUsers: appUsers.length,
        mockUsers: mockUsers.length,
        totalUnique: uniqueEmails.size,
      };
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      return { appUsers: 0, mockUsers: 0, totalUnique: 0 };
    }
  }
}

export const userRestoreService = new UserRestoreService();
export default userRestoreService;
