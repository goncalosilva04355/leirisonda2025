/**
 * Migrate Users to Firestore - Move users from localStorage to Firebase
 * Since other data is in Firestore, we need to migrate users too
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

export class MigrateUsersToFirestore {
  /**
   * Get all users from localStorage and mock auth
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
   * Check which users are already in Firestore
   */
  private static async getUsersInFirestore(): Promise<string[]> {
    try {
      const { getDB } = await import("../firebase/config");
      const db = await getDB();

      if (!db) {
        throw new Error("Firestore not available");
      }

      const { collection, getDocs } = await import("firebase/firestore");
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(usersCollection);

      const existingEmails: string[] = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.email) {
          existingEmails.push(userData.email.toLowerCase());
        }
      });

      return existingEmails;
    } catch (error) {
      console.warn("Error checking Firestore users:", error);
      return [];
    }
  }

  /**
   * Migrate a single user to Firestore
   */
  private static async migrateUserToFirestore(
    user: LocalUser | MockUser,
  ): Promise<boolean> {
    try {
      console.log(`🔄 Attempting to migrate user: ${user.email}`);

      const { getDB } = await import("../firebase/config");
      const db = await getDB();

      if (!db) {
        throw new Error("Firestore not available");
      }

      const { doc, setDoc } = await import("firebase/firestore");

      // Validate user data first
      if (!user.email || !user.name) {
        throw new Error("Missing required user data (email or name)");
      }

      // Convert user to Firestore format with validation
      let firestoreUser;
      let documentId;

      if ("uid" in user) {
        // MockUser format
        documentId = this.sanitizeDocumentId(user.uid);
        firestoreUser = {
          uid: user.uid,
          email: String(user.email).trim(),
          name: String(user.name).trim(),
          role: String(user.role),
          permissions: this.getDefaultPermissions(user.role),
          active: Boolean(user.active),
          createdAt: String(user.createdAt || new Date().toISOString()),
          migratedFrom: "mock-auth",
          migratedAt: new Date().toISOString(),
        };
      } else {
        // LocalUser format
        const convertedRole = this.convertLocalRole(user.role);
        documentId = this.sanitizeDocumentId(user.id);
        firestoreUser = {
          uid: user.id,
          email: String(user.email).trim(),
          name: String(user.name).trim(),
          role: convertedRole,
          permissions:
            user.permissions || this.getDefaultPermissions(convertedRole),
          active: Boolean(user.active),
          createdAt: String(user.createdAt || new Date().toISOString()),
          migratedFrom: "local-storage",
          migratedAt: new Date().toISOString(),
        };
      }

      // Ensure document ID is valid
      if (!documentId || documentId.length === 0) {
        documentId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.warn(
          `Generated new document ID for ${user.email}: ${documentId}`,
        );
      }

      console.log(
        `📝 Creating document with ID: ${documentId} for ${user.email}`,
      );

      // Try to create the document
      const userDocRef = doc(db, "users", documentId);

      // Test if we can write to Firestore first
      console.log(`🧪 Testing Firestore write access...`);
      const testData = { test: true, timestamp: new Date().toISOString() };
      const testDocRef = doc(db, "__migration_test__", "test");
      await setDoc(testDocRef, testData);
      console.log(`✅ Firestore write test successful`);

      // Now migrate the actual user
      console.log(`💾 Writing user data to Firestore...`);
      await setDoc(userDocRef, firestoreUser);

      console.log(`✅ Successfully migrated user ${user.email} to Firestore`);
      return true;
    } catch (error: any) {
      console.error(`❌ Failed to migrate user ${user.email}:`, error);
      console.error(`Error code: ${error.code}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Full error:`, error);

      // Try alternative migration strategies
      return await this.tryAlternativeMigration(user);
    }
  }

  /**
   * Sanitize document ID for Firestore
   */
  private static sanitizeDocumentId(id: string): string {
    if (!id) return "";

    // Remove invalid characters and ensure valid Firestore document ID
    return String(id)
      .replace(/[\/\s\.\#\$\[\]]/g, "_") // Replace invalid chars with underscore
      .substring(0, 1500); // Firestore limit
  }

  /**
   * Try alternative migration strategies if main method fails
   */
  private static async tryAlternativeMigration(
    user: LocalUser | MockUser,
  ): Promise<boolean> {
    try {
      console.log(`🔄 Trying alternative migration for ${user.email}...`);

      const { getDB } = await import("../firebase/config");
      const db = await getDB();

      if (!db) {
        return false;
      }

      const { doc, setDoc } = await import("firebase/firestore");

      // Create minimal user object
      const minimalUser = {
        email: String(user.email).trim(),
        name: String(user.name).trim(),
        role: "uid" in user ? user.role : this.convertLocalRole(user.role),
        active: true,
        createdAt: new Date().toISOString(),
        migratedFrom: "alternative-method",
        migratedAt: new Date().toISOString(),
      };

      // Use email-based document ID
      const emailId = user.email.replace(/[\.@]/g, "_");
      const userDocRef = doc(db, "users", emailId);

      await setDoc(userDocRef, minimalUser);

      console.log(`✅ Alternative migration successful for ${user.email}`);
      return true;
    } catch (error: any) {
      console.error(
        `❌ Alternative migration also failed for ${user.email}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Convert local role to Firebase role format
   */
  private static convertLocalRole(
    localRole: string,
  ): "super_admin" | "manager" | "technician" {
    switch (localRole) {
      case "super_admin":
        return "super_admin";
      case "admin":
        return "manager";
      default:
        return "technician";
    }
  }

  /**
   * Get default permissions for role
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
      case "manager":
        return {
          obras: { view: true, create: true, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: true, edit: true, delete: false },
          utilizadores: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: true, edit: false, delete: false },
          clientes: { view: true, create: true, edit: true, delete: false },
        };
      default: // technician
        return {
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
        };
    }
  }

  /**
   * Main migration function
   */
  static async migrateAllUsers(): Promise<{
    success: boolean;
    migrated: number;
    skipped: number;
    failed: number;
    details: string[];
  }> {
    try {
      console.log("🔄 Starting user migration to Firestore...");

      // Get all local users
      const { localUsers, mockUsers } = this.getAllLocalUsers();
      const allUsers = [...localUsers, ...mockUsers];

      if (allUsers.length === 0) {
        return {
          success: true,
          migrated: 0,
          skipped: 0,
          failed: 0,
          details: ["No users found to migrate"],
        };
      }

      console.log(`📊 Found ${allUsers.length} users to potentially migrate`);

      // Check existing users in Firestore
      const existingEmails = await this.getUsersInFirestore();
      console.log(
        `📊 Found ${existingEmails.length} users already in Firestore`,
      );

      let migrated = 0;
      let skipped = 0;
      let failed = 0;
      const details: string[] = [];

      // Process each user
      for (const user of allUsers) {
        try {
          const email = user.email.toLowerCase();

          if (existingEmails.includes(email)) {
            skipped++;
            details.push(`⏭️ Skipped ${user.email} (already in Firestore)`);
            continue;
          }

          console.log(`🔄 Processing user ${user.email}...`);
          const success = await this.migrateUserToFirestore(user);

          if (success) {
            migrated++;
            details.push(`✅ Migrated ${user.email}`);
          } else {
            failed++;
            details.push(`❌ Failed to migrate ${user.email}`);
          }

          // Small delay between migrations to avoid rate limits
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error: any) {
          failed++;
          details.push(
            `❌ Exception migrating ${user.email}: ${error.message}`,
          );
          console.error(
            `💥 Exception during migration of ${user.email}:`,
            error,
          );
        }
      }

      console.log(
        `🎉 Migration complete: ${migrated} migrated, ${skipped} skipped, ${failed} failed`,
      );

      return {
        success: failed === 0,
        migrated,
        skipped,
        failed,
        details,
      };
    } catch (error: any) {
      console.error("💥 Migration failed:", error);
      return {
        success: false,
        migrated: 0,
        skipped: 0,
        failed: 0,
        details: [`Error: ${error.message}`],
      };
    }
  }

  /**
   * Quick test to see if migration is needed
   */
  static async needsMigration(): Promise<boolean> {
    try {
      const { localUsers, mockUsers } = this.getAllLocalUsers();
      const localCount = localUsers.length + mockUsers.length;

      if (localCount === 0) {
        return false; // No local users to migrate
      }

      const firestoreEmails = await this.getUsersInFirestore();

      // If we have local users but no Firestore users, migration is needed
      return localCount > firestoreEmails.length;
    } catch (error) {
      console.warn("Error checking migration needs:", error);
      return true; // Assume migration needed if we can't check
    }
  }
}
