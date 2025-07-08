// Mock authentication service as fallback for Firebase issues
export interface MockUser {
  uid: string;
  email: string;
  password: string; // Added password field
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

class MockAuthService {
  private users: MockUser[] = [];

  // SECURITY: Always start with no user logged in
  private currentUser: MockUser | null = null;

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    // First, try to load existing users from localStorage
    try {
      const storedUsers = localStorage.getItem("mock-users");
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.users = parsed;
          console.log(
            "MockAuthService loaded existing users from localStorage",
          );
          return;
        }
      }
    } catch (error) {
      console.warn("Failed to load users from localStorage:", error);
    }

    // Initialize with default users including super admin and example users
    this.users = [
      {
        uid: "admin-1",
        email: "gongonsilva@gmail.com",
        password: "19867gsf",
        name: "Gonçalo Fonseca",
        role: "super_admin",
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        uid: "manager-1",
        email: "manager@leirisonda.com",
        password: "manager123",
        name: "João Silva",
        role: "manager",
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        uid: "tech-1",
        email: "tecnico@leirisonda.com",
        password: "tecnico123",
        name: "Maria Santos",
        role: "technician",
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        uid: "tech-2",
        email: "ana@leirisonda.com",
        password: "ana123",
        name: "Ana Costa",
        role: "technician",
        active: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Save to localStorage to persist the users
    localStorage.setItem("mock-users", JSON.stringify(this.users));

    console.log(
      "MockAuthService initialized default users:",
      this.users.map((u) => `${u.name} (${u.email})`),
    );
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: "super_admin" | "manager" | "technician" = "technician",
  ): Promise<{ success: boolean; error?: string; user?: MockUser }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists
    const existingUser = this.users.find((u) => u.email === email);
    if (existingUser) {
      return { success: false, error: "Este email já está em uso" };
    }

    // Create new user
    const newUser: MockUser = {
      uid: `mock-${Date.now()}`,
      email: email.trim(),
      password: password.trim(), // Store password without spaces
      name: name.trim(),
      role,
      active: true,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.currentUser = newUser;

    // Save updated users list to localStorage
    localStorage.setItem("mock-users", JSON.stringify(this.users));

    return { success: true, user: newUser };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: MockUser }> {
    // Check if user is in the blocked list
    const blockedEmails = [
      "yrzamr@gmail.com",
      "yrzamr01@gmail.com",
      "alexkamaryta@gmail.com",
      "davidcarreiraa92@gmail.com",
    ];

    if (
      blockedEmails.some(
        (blocked) => blocked.toLowerCase() === email.trim().toLowerCase(),
      )
    ) {
      console.log("🚫 Blocked user attempt:", email);
      return { success: false, error: "Acesso negado" };
    }

    // Validate inputs
    if (!email?.trim() || !password?.trim()) {
      return { success: false, error: "Email e password são obrigatórios" };
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Basic logging for troubleshooting
    console.log("🔐 Login attempt for:", email.trim().toLowerCase());

    const user = this.users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password.trim() &&
        u.active,
    );

    if (!user) {
      // More specific error messages for debugging
      const userExists = this.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      );

      if (userExists && !userExists.active) {
        return { success: false, error: "Conta desativada" };
      } else if (userExists) {
        return { success: false, error: "Password incorreta" };
      } else {
        return { success: false, error: "Utilizador não encontrado" };
      }
    }

    this.currentUser = user;

    // Firebase will handle persistence automatically

    return { success: true, user };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    // Firebase will handle persistence automatically
  }

  getCurrentUser(): MockUser | null {
    // DO NOT restore user from localStorage automatically - security risk
    // Users must login manually every time for security
    return this.currentUser; // Only return if currently logged in this session
  }

  // Force reload users from localStorage (for debugging)
  reloadUsers(): void {
    this.loadUsers();
  }

  // Get all users (for debugging)
  getAllUsers(): MockUser[] {
    return this.users;
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    // Do NOT immediately call with current user - this was causing automatic login
    // Only call callback when user actually logs in
    setTimeout(() => {
      // Only return user if they are actually logged in through manual login
      callback(null); // Always start as not authenticated for security
    }, 100);

    // Return empty unsubscribe function
    return () => {};
  }
}

export const mockAuthService = new MockAuthService();
