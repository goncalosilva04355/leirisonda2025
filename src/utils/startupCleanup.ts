/**
 * Startup cleanup service to ensure blocked users cannot access the system
 * This runs automatically when the app starts to provide an additional security layer
 */

const BLOCKED_EMAILS = [
  "yrzamr@gmail.com",
  "alexkamaryta@gmail.com",
  "davidcarreiraa92@gmail.com",
];

const SUPER_ADMIN_EMAIL = "gongonsilva@gmail.com";

export const performStartupCleanup = (): boolean => {
  console.log("🔒 Performing startup security cleanup...");

  let cleanupPerformed = false;

  try {
    // 1. Check and clean current user sessions
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const parsed = JSON.parse(currentUser);
        if (parsed?.email && isBlockedEmail(parsed.email)) {
          localStorage.removeItem("currentUser");
          sessionStorage.clear();
          cleanupPerformed = true;
          console.log("🚫 Blocked current user removed from session");
        }
      } catch (e) {
        // Invalid JSON, remove it
        localStorage.removeItem("currentUser");
        cleanupPerformed = true;
      }
    }

    // 2. Check mock current user
    const mockCurrentUser = localStorage.getItem("mock-current-user");
    if (mockCurrentUser) {
      try {
        const parsed = JSON.parse(mockCurrentUser);
        if (parsed?.email && isBlockedEmail(parsed.email)) {
          localStorage.removeItem("mock-current-user");
          cleanupPerformed = true;
          console.log("🚫 Blocked mock user removed from session");
        }
      } catch (e) {
        localStorage.removeItem("mock-current-user");
        cleanupPerformed = true;
      }
    }

    // 3. Clean user lists
    const userKeys = ["app-users", "mock-users", "users", "saved-users"];

    for (const key of userKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            const originalLength = parsed.length;
            const filtered = parsed.filter(
              (user) => !isBlockedEmail(user?.email),
            );

            if (filtered.length !== originalLength) {
              localStorage.setItem(key, JSON.stringify(filtered));
              cleanupPerformed = true;
              console.log(
                `🧹 Cleaned ${originalLength - filtered.length} blocked users from ${key}`,
              );
            }
          }
        } catch (e) {
          // Invalid JSON, recreate with just super admin
          if (key === "app-users") {
            localStorage.setItem(key, JSON.stringify([createSuperAdmin()]));
          } else if (key === "mock-users") {
            localStorage.setItem(key, JSON.stringify([createMockSuperAdmin()]));
          }
          cleanupPerformed = true;
        }
      }
    }

    // 4. Clear any authentication state that might be corrupted
    const authKeys = [
      "isAuthenticated",
      "authState",
      "loginState",
      "savedLoginCredentials",
    ];

    for (const key of authKeys) {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        cleanupPerformed = true;
      }
    }

    // 5. Ensure super admin exists
    ensureSuperAdminExists();

    if (cleanupPerformed) {
      console.log("✅ Startup cleanup completed - blocked users removed");

      // Dispatch event to notify app of cleanup
      window.dispatchEvent(new CustomEvent("startupCleanupCompleted"));
    }

    return cleanupPerformed;
  } catch (error) {
    console.error("❌ Error during startup cleanup:", error);
    return false;
  }
};

const isBlockedEmail = (email: string): boolean => {
  if (!email) return false;
  return BLOCKED_EMAILS.some(
    (blocked) => blocked.toLowerCase() === email.toLowerCase(),
  );
};

const createSuperAdmin = () => ({
  id: 1,
  name: "Gonçalo Fonseca",
  email: SUPER_ADMIN_EMAIL,
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
});

const createMockSuperAdmin = () => ({
  uid: "admin-1",
  email: SUPER_ADMIN_EMAIL,
  password: "19867gsf",
  name: "Gonçalo Fonseca",
  role: "super_admin",
  active: true,
  createdAt: new Date().toISOString(),
});

const ensureSuperAdminExists = () => {
  // Ensure app-users has super admin
  const appUsers = localStorage.getItem("app-users");
  if (!appUsers) {
    localStorage.setItem("app-users", JSON.stringify([createSuperAdmin()]));
  } else {
    try {
      const parsed = JSON.parse(appUsers);
      if (
        !Array.isArray(parsed) ||
        !parsed.some((u) => u.email === SUPER_ADMIN_EMAIL)
      ) {
        localStorage.setItem("app-users", JSON.stringify([createSuperAdmin()]));
      }
    } catch (e) {
      localStorage.setItem("app-users", JSON.stringify([createSuperAdmin()]));
    }
  }

  // Ensure mock-users has super admin
  const mockUsers = localStorage.getItem("mock-users");
  if (!mockUsers) {
    localStorage.setItem(
      "mock-users",
      JSON.stringify([createMockSuperAdmin()]),
    );
  } else {
    try {
      const parsed = JSON.parse(mockUsers);
      if (
        !Array.isArray(parsed) ||
        !parsed.some((u) => u.email === SUPER_ADMIN_EMAIL)
      ) {
        localStorage.setItem(
          "mock-users",
          JSON.stringify([createMockSuperAdmin()]),
        );
      }
    } catch (e) {
      localStorage.setItem(
        "mock-users",
        JSON.stringify([createMockSuperAdmin()]),
      );
    }
  }
};

// Execute cleanup immediately when module loads
// performStartupCleanup(); // TEMPORARIAMENTE DESATIVADO - estava a eliminar utilizadores automaticamente

export default performStartupCleanup;
