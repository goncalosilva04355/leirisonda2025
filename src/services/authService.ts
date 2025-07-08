// Simple localStorage-based auth service - Firebase removed

export interface UserProfile {
  id: string;
  name: string;
  email: string;
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

// Default admin user
const defaultAdmin: UserProfile = {
  id: "1",
  name: "Gonçalo Fonseca",
  email: "gongonsilva@gmail.com",
  role: "super_admin",
  permissions: {
    obras: { view: true, create: true, edit: true, delete: true },
    manutencoes: { view: true, create: true, edit: true, delete: true },
    piscinas: { view: true, create: true, edit: true, delete: true },
    utilizadores: { view: true, create: true, edit: true, delete: true },
    relatorios: { view: true, create: true, edit: true, delete: true },
    clientes: { view: true, create: true, edit: true, delete: true },
  },
  active: true,
  createdAt: "2024-01-01T00:00:00.000Z",
};

export const authService = {
  // Login function
  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    console.log("🔐 Local login attempt:", email);

    // Simple validation for admin user
    if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
      sessionStorage.setItem("currentUser", JSON.stringify(defaultAdmin));
      console.log("✅ Login successful");
      return { success: true, user: defaultAdmin };
    }

    console.log("❌ Login failed");
    return { success: false, error: "Email ou password incorretos" };
  },

  // Register function (disabled for security)
  async register(): Promise<{ success: boolean; error: string }> {
    return {
      success: false,
      error: "Registo desativado - contacte o administrador",
    };
  },

  // Logout function
  async logout(): Promise<void> {
    sessionStorage.removeItem("currentUser");
    console.log("🚪 User logged out");
  },

  // Get current user
  getCurrentUser(): UserProfile | null {
    try {
      const userData = sessionStorage.getItem("currentUser");
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  // Auth state change listener (simplified)
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    // Initial call
    callback(this.getCurrentUser());

    // Listen for storage changes
    const handleStorageChange = () => {
      callback(this.getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  },
};
