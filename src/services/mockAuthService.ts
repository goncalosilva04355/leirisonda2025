// Mock authentication service as fallback for Firebase issues
export interface MockUser {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

class MockAuthService {
  private users: MockUser[] = [
    {
      uid: "mock-admin-1",
      email: "gongonsilva@gmail.com",
      name: "Gonçalo Fonseca",
      role: "super_admin",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  private currentUser: MockUser | null = null;

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

    const user = this.users.find((u) => u.email === email && u.active);
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
    if (this.currentUser) return this.currentUser;

    try {
      const stored = localStorage.getItem("mock-current-user");
      if (stored) {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      }
    } catch (error) {
      console.warn("Error loading mock user from localStorage");
    }

    return null;
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    // Immediately call with current user
    callback(this.getCurrentUser());

    // Return empty unsubscribe function
    return () => {};
  }
}

export const mockAuthService = new MockAuthService();
