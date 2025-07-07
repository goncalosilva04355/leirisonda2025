import { UserDuplicateCleanup } from "./userDuplicateCleanup";

// Utility to clean all user data except super admin
// Now uses the comprehensive UserDuplicateCleanup utility
export const cleanUserData = async () => {
  try {
    console.log("🧹 Using comprehensive user duplicate cleanup...");
    const result = await UserDuplicateCleanup.cleanAllDuplicateUsers();

    if (result.success) {
      console.log("✅ User data cleaned - only super admin Gonçalo remains");
      console.log("Details:", result.details);
      return true;
    } else {
      console.error("❌ Error cleaning user data:", result.message);
      console.error("Errors:", result.errors);
      return false;
    }
  } catch (error) {
    console.error("❌ Error cleaning user data:", error);

    // Fallback to original cleanup method
    try {
      console.log("🔄 Using fallback cleanup method...");

      // Only keep super admin in mock-users
      const superAdmin = {
        uid: "admin-1",
        email: "gongonsilva@gmail.com",
        password: "19867gsf",
        name: "Gonçalo Fonseca",
        role: "super_admin",
        active: true,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("mock-users", JSON.stringify([superAdmin]));

      // Only keep super admin in app-users
      const appSuperAdmin = {
        id: "1",
        name: "Gonçalo Fonseca",
        email: "gongonsilva@gmail.com",
        password: "19867gsf",
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
        createdAt: "2024-01-01",
      };

      localStorage.setItem("app-users", JSON.stringify([appSuperAdmin]));

      // Clear any current user session
      localStorage.removeItem("mock-current-user");
      localStorage.removeItem("currentUser");

      console.log("✅ Fallback cleanup completed");
      return true;
    } catch (fallbackError) {
      console.error("❌ Fallback cleanup also failed:", fallbackError);
      return false;
    }
  }
};
