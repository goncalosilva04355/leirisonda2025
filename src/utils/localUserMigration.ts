/**
 * Local User Migration - Fallback when Firestore is not available
 * This ensures users are properly synchronized locally and in mock auth
 */

interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "super_admin";
  active: boolean;
  createdAt: string;
  permissions?: any;
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

export class LocalUserMigration {
  /**
   * Migrate users between local storage and mock auth when Firestore is not available
   */
  static async migrateLocalUsers(): Promise<{
    success: boolean;
    migrated: number;
    synchronized: number;
    details: string[];
  }> {
    try {
      console.log("🔄 LOCAL MIGRATION: Starting user synchronization...");
      console.log("📱 Mode: Local-only (Firestore not available)");
      console.log(
        "💡 LOCAL MIGRATION: This ensures users work on this device immediately",
      );
      console.log(
        "🔧 LOCAL MIGRATION: To enable cross-device access, activate Firestore in Firebase Console",
      );

      const { localUsers, mockUsers } = this.getAllLocalUsers();
      const details: string[] = [];
      let migrated = 0;
      let synchronized = 0;

      console.log(
        `📊 LOCAL MIGRATION: Found ${localUsers.length} local users and ${mockUsers.length} mock users`,
      );

      // If no users found, return success (nothing to migrate)
      if (localUsers.length === 0 && mockUsers.length === 0) {
        console.log("ℹ️ LOCAL MIGRATION: No users found to migrate");
        return {
          success: true,
          migrated: 0,
          synchronized: 0,
          details: ["No users found to migrate locally"],
        };
      }

      // Ensure all local users are in mock auth
      for (const localUser of localUsers) {
        try {
          const existsInMock = mockUsers.some(
            (m) => m.email.toLowerCase() === localUser.email.toLowerCase(),
          );

          if (!existsInMock) {
            // Add to mock auth
            const mockUser = this.convertToMockUser(localUser);
            mockUsers.push(mockUser);
            migrated++;
            details.push(`✅ Added ${localUser.email} to mock auth`);
          } else {
            synchronized++;
            details.push(`⏭️ ${localUser.email} already in mock auth`);
          }
        } catch (error: any) {
          details.push(
            `❌ Failed to migrate ${localUser.email}: ${error.message}`,
          );
        }
      }

      // Ensure all mock users are in local storage
      for (const mockUser of mockUsers) {
        try {
          const existsInLocal = localUsers.some(
            (l) => l.email.toLowerCase() === mockUser.email.toLowerCase(),
          );

          if (!existsInLocal) {
            // Add to local storage
            const localUser = this.convertToLocalUser(mockUser);
            localUsers.push(localUser);
            migrated++;
            details.push(`✅ Added ${mockUser.email} to local storage`);
          }
        } catch (error: any) {
          details.push(`❌ Failed to sync ${mockUser.email}: ${error.message}`);
        }
      }

      // Save updated lists
      localStorage.setItem("app-users", JSON.stringify(localUsers));
      localStorage.setItem("mock-users", JSON.stringify(mockUsers));

      // Create unified auth system that works without Firestore
      this.createUnifiedAuthSystem(localUsers, mockUsers);

      console.log(`🎉 LOCAL MIGRATION: Complete!`);
      console.log(
        `📊 LOCAL MIGRATION: ${migrated} migrated, ${synchronized} synchronized`,
      );
      console.log(
        `✅ LOCAL MIGRATION: Users are now ready for login on this device`,
      );
      console.log(
        `💡 LOCAL MIGRATION: To enable cross-device access, activate Firestore in Firebase Console`,
      );

      return {
        success: true,
        migrated,
        synchronized,
        details,
      };
    } catch (error: any) {
      console.error("💥 Local migration failed:", error);
      return {
        success: false,
        migrated: 0,
        synchronized: 0,
        details: [`Error: ${error.message}`],
      };
    }
  }

  /**
   * Get all local users
   */
  private static getAllLocalUsers(): {
    localUsers: LocalUser[];
    mockUsers: MockUser[];
  } {
    let localUsers: LocalUser[] = [];
    let mockUsers: MockUser[] = [];

    try {
      const savedLocalUsers = localStorage.getItem("app-users");
      if (savedLocalUsers) {
        localUsers = JSON.parse(savedLocalUsers);
      }
    } catch (error) {
      console.warn("Error loading local users:", error);
    }

    try {
      const savedMockUsers = localStorage.getItem("mock-users");
      if (savedMockUsers) {
        mockUsers = JSON.parse(savedMockUsers);
      }
    } catch (error) {
      console.warn("Error loading mock users:", error);
    }

    return { localUsers, mockUsers };
  }

  /**
   * Convert local user to mock user format
   */
  private static convertToMockUser(localUser: LocalUser): MockUser {
    const convertRole = (
      role: string,
    ): "super_admin" | "manager" | "technician" => {
      switch (role) {
        case "super_admin":
          return "super_admin";
        case "admin":
          return "manager";
        default:
          return "technician";
      }
    };

    return {
      uid: localUser.id,
      email: localUser.email,
      password: localUser.password,
      name: localUser.name,
      role: convertRole(localUser.role),
      active: localUser.active,
      createdAt: localUser.createdAt,
    };
  }

  /**
   * Convert mock user to local user format
   */
  private static convertToLocalUser(mockUser: MockUser): LocalUser {
    const convertRole = (role: string): "user" | "admin" | "super_admin" => {
      switch (role) {
        case "super_admin":
          return "super_admin";
        case "manager":
          return "admin";
        default:
          return "user";
      }
    };

    return {
      id: mockUser.uid,
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      role: convertRole(mockUser.role),
      active: mockUser.active,
      createdAt: mockUser.createdAt,
      permissions: this.getDefaultPermissions(convertRole(mockUser.role)),
    };
  }

  /**
   * Get default permissions
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
      default:
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

  /**
   * Create unified auth system that works without Firestore
   */
  private static createUnifiedAuthSystem(
    localUsers: LocalUser[],
    mockUsers: MockUser[],
  ) {
    // Store a unified user list for auth purposes
    const unifiedUsers = mockUsers.map((mockUser) => ({
      uid: mockUser.uid,
      email: mockUser.email,
      password: mockUser.password,
      name: mockUser.name,
      role: mockUser.role,
      active: mockUser.active,
      createdAt: mockUser.createdAt,
      authMethod: "local-unified",
      lastSync: new Date().toISOString(),
    }));

    localStorage.setItem("unified-users", JSON.stringify(unifiedUsers));

    // Set flag indicating users are ready for local auth
    localStorage.setItem("users-migrated-locally", "true");

    console.log("✅ Unified auth system created for local-only operation");
  }

  /**
   * Check if local migration is needed
   */
  static needsLocalMigration(): boolean {
    try {
      const migrated = localStorage.getItem("users-migrated-locally");
      if (migrated === "true") {
        return false; // Already migrated locally
      }

      const { localUsers, mockUsers } = this.getAllLocalUsers();
      return localUsers.length > 0 || mockUsers.length > 0;
    } catch (error) {
      return true; // Assume migration needed if we can't check
    }
  }
}
