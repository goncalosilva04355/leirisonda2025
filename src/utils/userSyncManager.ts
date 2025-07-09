/**
 * User Synchronization Manager
 *
 * This utility helps resolve conflicts between different user storage systems:
 * - UserManagement localStorage ("app-users")
 * - MockAuth localStorage ("mock-users")
 * - Firebase Auth (when available)
 */

interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "super_admin";
  active: boolean;
  createdAt: string;
}

interface MockUser {
  uid: string;
  email: string;
  password: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

export class UserSyncManager {
  /**
   * Get all users from UserManagement localStorage
   */
  private static getLocalUsers(): LocalUser[] {
    try {
      const savedUsers = localStorage.getItem("app-users");
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      // Filter out invalid users
      return users.filter(
        (user: any) =>
          user && user.id && user.email && typeof user.email === "string",
      );
    } catch (error) {
      console.error("Error loading local users:", error);
      return [];
    }
  }

  /**
   * Get all users from MockAuth localStorage
   */
  private static getMockUsers(): MockUser[] {
    try {
      const savedUsers = localStorage.getItem("mock-users");
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      // Filter out invalid users
      return users.filter(
        (user: any) =>
          user && user.uid && user.email && typeof user.email === "string",
      );
    } catch (error) {
      console.error("Error loading mock users:", error);
      return [];
    }
  }

  /**
   * Convert UserManagement role to MockAuth role
   */
  private static convertRole(
    localRole: string,
  ): "super_admin" | "manager" | "technician" {
    try {
      if (!localRole || typeof localRole !== "string") {
        return "technician";
      }

      switch (localRole.toLowerCase()) {
        case "super_admin":
          return "super_admin";
        case "admin":
          return "manager";
        default:
          return "technician";
      }
    } catch (error) {
      console.warn("Error converting role:", error);
      return "technician";
    }
  }

  /**
   * Convert MockAuth role to UserManagement role
   */
  private static convertRoleReverse(
    mockRole: string,
  ): "user" | "admin" | "super_admin" {
    try {
      if (!mockRole || typeof mockRole !== "string") {
        return "user";
      }

      switch (mockRole.toLowerCase()) {
        case "super_admin":
          return "super_admin";
        case "manager":
          return "admin";
        default:
          return "user";
      }
    } catch (error) {
      console.warn("Error converting mock role:", error);
      return "user";
    }
  }

  /**
   * Sync a user from UserManagement to MockAuth
   */
  static syncToMockAuth(localUser: LocalUser): void {
    try {
      // Comprehensive validation of entire user object
      if (!localUser || typeof localUser !== "object") {
        console.warn("Invalid user object for sync:", localUser);
        return;
      }

      // Validate essential properties exist and are correct types
      if (
        !localUser.email ||
        !localUser.id ||
        typeof localUser.email !== "string" ||
        typeof localUser.id !== "string" ||
        localUser.email.trim() === "" ||
        localUser.id.trim() === ""
      ) {
        console.warn("Invalid user data for sync - missing required fields:", {
          hasEmail: !!localUser.email,
          hasId: !!localUser.id,
          emailType: typeof localUser.email,
          idType: typeof localUser.id,
          user: localUser,
        });
        return;
      }

      const mockUsers = this.getMockUsers();

      // Safely check if user already exists in mock auth
      const existingIndex = mockUsers.findIndex((u) => {
        try {
          return (
            u.email &&
            typeof u.email === "string" &&
            typeof localUser.email === "string" &&
            u.email.toLowerCase() === localUser.email.toLowerCase()
          );
        } catch (error) {
          console.warn("Error comparing emails:", error);
          return false;
        }
      });

      const mockUser: MockUser = {
        uid:
          localUser.id &&
          typeof localUser.id === "string" &&
          localUser.id.startsWith("mock-")
            ? localUser.id
            : `mock-${localUser.id || "unknown"}`,
        email: localUser.email || "",
        password:
          localUser.password && typeof localUser.password === "string"
            ? localUser.password
            : "",
        name:
          localUser.name && typeof localUser.name === "string"
            ? localUser.name
            : "",
        role: this.convertRole(
          localUser.role && typeof localUser.role === "string"
            ? localUser.role
            : "user",
        ),
        active: localUser.active !== false,
        createdAt:
          localUser.createdAt && typeof localUser.createdAt === "string"
            ? localUser.createdAt
            : new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        // Update existing user
        mockUsers[existingIndex] = mockUser;
        console.log(`✅ Updated user in mock auth: ${localUser.email}`);
      } else {
        // Add new user
        mockUsers.push(mockUser);
        console.log(`✅ Added user to mock auth: ${localUser.email}`);
      }

      localStorage.setItem("mock-users", JSON.stringify(mockUsers));
    } catch (error) {
      console.error("Error syncing to mock auth:", error);
    }
  }

  /**
   * Sync a user from MockAuth to UserManagement
   */
  static syncToLocalUsers(mockUser: MockUser): void {
    try {
      // Validate input user with comprehensive checks
      if (
        !mockUser ||
        !mockUser.email ||
        !mockUser.uid ||
        typeof mockUser.email !== "string" ||
        mockUser.email.trim() === ""
      ) {
        console.warn("Invalid mock user data for sync:", mockUser);
        return;
      }

      const localUsers = this.getLocalUsers();

      // Safely check if user already exists in local users
      const existingIndex = localUsers.findIndex((u) => {
        try {
          return (
            u.email &&
            typeof u.email === "string" &&
            typeof mockUser.email === "string" &&
            u.email.toLowerCase() === mockUser.email.toLowerCase()
          );
        } catch (error) {
          console.warn("Error comparing emails:", error);
          return false;
        }
      });

      const localUser: LocalUser = {
        id: mockUser.uid,
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        role: this.convertRoleReverse(mockUser.role),
        active: mockUser.active,
        createdAt: mockUser.createdAt,
        permissions: this.getDefaultPermissions(
          this.convertRoleReverse(mockUser.role),
        ),
      } as any;

      if (existingIndex >= 0) {
        // Update existing user
        localUsers[existingIndex] = localUser;
        console.log(`✅ Updated user in local storage: ${mockUser.email}`);
      } else {
        // Add new user
        localUsers.push(localUser);
        console.log(`✅ Added user to local storage: ${mockUser.email}`);
      }

      localStorage.setItem("app-users", JSON.stringify(localUsers));
    } catch (error) {
      console.error("Error syncing to local users:", error);
    }
  }

  /**
   * Perform full bidirectional sync between all user stores
   */
  static performFullSync(): {
    localUsers: number;
    mockUsers: number;
    synced: boolean;
  } {
    try {
      const localUsers = this.getLocalUsers();
      const mockUsers = this.getMockUsers();

      console.log("🔄 Starting full user sync...");
      console.log(
        `Local users: ${localUsers.length}, Mock users: ${mockUsers.length}`,
      );

      // Sync all local users to mock auth
      localUsers.forEach((localUser) => {
        try {
          this.syncToMockAuth(localUser);
        } catch (error) {
          console.error(
            `Error syncing user ${localUser?.email || "unknown"}:`,
            error,
          );
        }
      });

      // Sync all mock users to local storage (only if they don't exist locally)
      mockUsers.forEach((mockUser) => {
        try {
          const existsLocally = localUsers.some((u) => {
            try {
              return (
                u.email &&
                mockUser.email &&
                typeof u.email === "string" &&
                typeof mockUser.email === "string" &&
                u.email.toLowerCase() === mockUser.email.toLowerCase()
              );
            } catch (error) {
              console.warn(
                "Error comparing emails in existsLocally check:",
                error,
              );
              return false;
            }
          });

          if (!existsLocally) {
            this.syncToLocalUsers(mockUser);
          }
        } catch (error) {
          console.error(
            `Error processing mock user ${mockUser?.email || "unknown"}:`,
            error,
          );
        }
      });

      console.log("✅ Full user sync completed");

      return {
        localUsers: localUsers.length,
        mockUsers: mockUsers.length,
        synced: true,
      };
    } catch (error) {
      console.error("❌ Full sync failed:", error);
      return {
        localUsers: 0,
        mockUsers: 0,
        synced: false,
      };
    }
  }

  /**
   * Check if a user exists in any auth system
   */
  static userExists(email: string): {
    inLocal: boolean;
    inMock: boolean;
    user?: LocalUser | MockUser;
  } {
    const localUsers = this.getLocalUsers();
    const mockUsers = this.getMockUsers();

    const localUser = localUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    const mockUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    return {
      inLocal: !!localUser,
      inMock: !!mockUser,
      user: localUser || mockUser,
    };
  }

  /**
   * Get login troubleshooting information for a user
   */
  static getLoginDiagnostics(
    email: string,
    password: string,
  ): {
    userExists: boolean;
    emailExists: boolean;
    passwordMatches: boolean;
    isActive: boolean;
    suggestions: string[];
  } {
    const { inLocal, inMock, user } = this.userExists(email);

    const suggestions: string[] = [];
    let userExists = inLocal || inMock;
    let emailExists = userExists;
    let passwordMatches = false;
    let isActive = false;

    if (user) {
      passwordMatches = user.password === password;
      isActive = user.active;

      if (!passwordMatches) {
        suggestions.push("Verifique se a password está correta");
      }

      if (!isActive) {
        suggestions.push("A conta está desativada - contacte o administrador");
      }

      if (!inMock && inLocal) {
        suggestions.push(
          "Utilizador existe apenas no armazenamento local - será sincronizado automaticamente",
        );
        this.syncToMockAuth(user as LocalUser);
      }

      if (inMock && !inLocal) {
        suggestions.push(
          "Utilizador existe apenas no sistema de autenticação - será sincronizado automaticamente",
        );
        this.syncToLocalUsers(user as MockUser);
      }
    } else {
      suggestions.push(
        "Utilizador não encontrado - verifique o email ou crie uma nova conta",
      );
    }

    return {
      userExists,
      emailExists,
      passwordMatches,
      isActive,
      suggestions,
    };
  }

  /**
   * Generate default permissions based on role
   */
  private static getDefaultPermissions(role: string) {
    switch (role) {
      case "super_admin":
        return {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        };
      case "admin":
        return {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: true, edit: true, delete: false },
          clientes: { view: true, create: true, edit: true, delete: false },
        };
      default: // user
        return {
          obras: { view: true, create: false, edit: false, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: false, edit: false, delete: false },
          utilizadores: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: false, edit: false, delete: false },
          clientes: { view: true, create: false, edit: false, delete: false },
        };
    }
  }
}

export default UserSyncManager;
