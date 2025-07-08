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

// Default users - SIMPLES E DIRETO
const defaultUsers = [
  {
    uid: "admin-1",
    email: "gongonsilva@gmail.com",
    password: "19867gsf",
    name: "Gonçalo Fonseca",
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
    createdAt: new Date().toISOString(),
  },
  {
    uid: "manager-1",
    email: "manager@leirisonda.com",
    password: "manager123",
    name: "João Silva",
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
    createdAt: new Date().toISOString(),
  },
  {
    uid: "tech-1",
    email: "tecnico@leirisonda.com",
    password: "tecnico123",
    name: "Maria Santos",
    role: "technician" as const,
    permissions: {
      obras: { view: true, create: false, edit: true, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: false, edit: true, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: true, create: false, edit: false, delete: false },
      clientes: { view: true, create: false, edit: false, delete: false },
    },
    active: true,
    createdAt: new Date().toISOString(),
  },
];

// Initialize users in localStorage
const initializeUsers = () => {
  const existingUsers = localStorage.getItem("app-users");
  if (!existingUsers) {
    localStorage.setItem("app-users", JSON.stringify(defaultUsers));
    console.log("✅ Utilizadores inicializados:", defaultUsers.length);
  }
};

// Initialize on load
initializeUsers();

export const authService = {
  // Simple login function
  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      console.log("🔐 Tentativa de login:", email);

      // Get users from localStorage
      const usersData = localStorage.getItem("app-users");
      if (!usersData) {
        initializeUsers();
      }

      const users = JSON.parse(localStorage.getItem("app-users") || "[]");
      console.log("👥 Utilizadores disponíveis:", users.length);

      // Find user
      const user = users.find(
        (u: any) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password &&
          u.active,
      );

      if (user) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions,
          active: user.active,
          createdAt: user.createdAt,
        };

        console.log(
          "✅ Login bem-sucedido:",
          userProfile.name,
          `(${userProfile.role})`,
        );
        return { success: true, user: userProfile };
      } else {
        console.warn("❌ Credenciais inválidas para:", email);
        return { success: false, error: "Credenciais inválidas" };
      }
    } catch (error) {
      console.error("❌ Erro no login:", error);
      return { success: false, error: "Erro interno do sistema" };
    }
  },

  // Simple logout
  async logout(): Promise<void> {
    console.log("🚪 Logout realizado");
  },

  // Get current user from localStorage
  getCurrentUser(): UserProfile | null {
    try {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error("❌ Erro ao obter utilizador atual:", error);
      return null;
    }
  },

  // Simple auth state listener
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    // Check current user on startup
    const currentUser = this.getCurrentUser();
    callback(currentUser);

    // Return empty unsubscribe function
    return () => {};
  },
};
