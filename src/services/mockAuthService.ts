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
    } else {
      // Initialize with default admin user
      this.users = [
        {
          uid: "mock-admin-1",
          email: "gongonsilva@gmail.com",
          password: "admin123", // Default password
          name: "Gonçalo Fonseca",
          role: "super_admin",
          active: true,
          createdAt: new Date().toISOString(),
        },
      ];
      // Save default users
      localStorage.setItem("mock-users", JSON.stringify(this.users));
    }

    console.log(
      "MockAuthService loaded users:",
      this.users.map((u) => u.email),
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
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = this.users.find(
      (u) => u.email === email && u.password === password && u.active,
    );
    if (!user) {
      return { success: false, error: "Credenciais inválidas" };
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
