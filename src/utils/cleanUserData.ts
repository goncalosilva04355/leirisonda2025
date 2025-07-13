// Utility to clean all user data except super admin
export const cleanUserData = () => {
  try {
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

    console.log("✅ User data cleaned - only super admin Gonçalo remains");
    return true;
  } catch (error) {
    console.error("❌ Error cleaning user data:", error);
    return false;
  }
};
