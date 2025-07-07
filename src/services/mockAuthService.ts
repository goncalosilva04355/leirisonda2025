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
    // Load users from localStorage or initialize with default admin
    const savedUsers = localStorage.getItem("mock-users");

    if (savedUsers) {
      this.users = JSON.parse(savedUsers);

      // Migrate old users without password field
      let needsMigration = false;
      this.users = this.users.map((user) => {
        if (!user.password) {
          needsMigration = true;
          return {
            ...user,
            password: "123456", // Default password for migrated users
          };
        }
        return user;
      });

      if (needsMigration) {
        console.log("Migrating users to include password field");
        localStorage.setItem("mock-users", JSON.stringify(this.users));
      }
    } else {
      // Initialize with only real admin user - NO MOCK DATA
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
      ];
      localStorage.setItem("mock-users", JSON.stringify(this.users));
    }

    console.log(
      "MockAuthService loaded users:",
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
      email,
      password, // Store password
      name,
      role,
      active: true,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.currentUser = newUser;

    // Store in localStorage for persistence
    localStorage.setItem("mock-users", JSON.stringify(this.users));
    localStorage.setItem("mock-current-user", JSON.stringify(newUser));

    return { success: true, user: newUser };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: MockUser }> {
    // Validate inputs
    if (!email?.trim() || !password?.trim()) {
      return { success: false, error: "Email e password são obrigatórios" };
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Debug logging
    console.log("🔍 Mock login attempt:");
    console.log("📧 Email:", email.trim().toLowerCase());
    console.log("🔑 Password length:", password.length);
    console.log(
      "👥 Available users:",
      this.users.map((u) => ({
        email: u.email.toLowerCase(),
        passwordLength: u.password?.length || 0,
        active: u.active,
      })),
    );

    const user = this.users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password &&
        u.active,
    );

    if (!user) {
      // More specific error messages for debugging
      const userExists = this.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      );

      if (userExists) {
        console.log("🚨 User found but login failed:");
        console.log("📧 Stored email:", userExists.email);
        console.log("🔑 Stored password:", userExists.password);
        console.log("🔑 Input password:", password);
        console.log("🔄 Password match:", userExists.password === password);
        console.log("✅ Account active:", userExists.active);

        if (!userExists.active) {
          return { success: false, error: "Conta desativada" };
        } else {
          return { success: false, error: "Password incorreta" };
        }
      } else {
        console.log("❌ User not found");
        return { success: false, error: "Utilizador não encontrado" };
      }
    }

    this.currentUser = user;
    localStorage.setItem("mock-current-user", JSON.stringify(user));

    return { success: true, user };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem("mock-current-user");
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

  // Debug function to check stored users
  debugUsers(): void {
    console.log("🔍 DEBUG: All stored users:");
    this.users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`, {
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active,
        passwordLength: user.password?.length || 0,
        hasPassword: !!user.password,
      });
    });

    // Also check localStorage
    const storedUsers = localStorage.getItem("mock-users");
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      console.log(
        "💾 localStorage users:",
        parsed.map((u: any) => ({
          email: u.email,
          passwordLength: u.password?.length || 0,
        })),
      );
    }
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
