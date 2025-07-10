// Utility to fix user login issues and screen shaking
export interface UserLoginIssue {
  email: string;
  name: string;
  expectedPassword: string;
  active: boolean;
  found: boolean;
  source: "mock" | "firebase" | "both" | "none";
}

export const diagnoseUserLoginIssues = (): UserLoginIssue[] => {
  const issues: UserLoginIssue[] = [];

  // Check mock users
  const mockUsersData = localStorage.getItem("mock-users");
  const mockUsers = mockUsersData ? JSON.parse(mockUsersData) : [];

  // Check app users
  const appUsersData = localStorage.getItem("app-users");
  const appUsers = appUsersData ? JSON.parse(appUsersData) : [];

  // No problematic users - system cleaned
  const problematicUsers: Array<{
    name: string;
    email: string;
    expectedPassword: string;
  }> = [];

  problematicUsers.forEach((user) => {
    const mockUser = mockUsers.find(
      (u: any) =>
        u.email.toLowerCase() === user.email.toLowerCase() ||
        u.name.toLowerCase().includes(user.name.toLowerCase()),
    );

    const appUser = appUsers.find(
      (u: any) =>
        u.email.toLowerCase() === user.email.toLowerCase() ||
        u.name.toLowerCase().includes(user.name.toLowerCase()),
    );

    let source: "mock" | "firebase" | "both" | "none" = "none";
    let found = false;
    let active = false;

    if (mockUser && appUser) {
      source = "both";
      found = true;
      active = mockUser.active && appUser.active;
    } else if (mockUser) {
      source = "mock";
      found = true;
      active = mockUser.active;
    } else if (appUser) {
      source = "firebase";
      found = true;
      active = appUser.active;
    }

    issues.push({
      email: user.email,
      name: user.name,
      expectedPassword: user.expectedPassword,
      active,
      found,
      source,
    });
  });

  return issues;
};

export const fixUserPasswords = (): { fixed: number; errors: string[] } => {
  const errors: string[] = [];
  let fixed = 0;

  try {
    // No users to fix - only super admin exists
    console.log("🔧 No problematic users to fix - only super admin exists");
  } catch (error: any) {
    errors.push(`Erro ao corrigir passwords: ${error.message}`);
  }

  return { fixed, errors };
};

export const createMissingUsers = (): { created: number; errors: string[] } => {
  const errors: string[] = [];
  let created = 0;

  try {
    const mockUsersData = localStorage.getItem("mock-users");
    const mockUsers = mockUsersData ? JSON.parse(mockUsersData) : [];

    const appUsersData = localStorage.getItem("app-users");
    const appUsers = appUsersData ? JSON.parse(appUsersData) : [];

    // No default users to create - system cleaned for manual user creation
    const defaultUsers: Array<{
      name: string;
      email: string;
      password: string;
      role: string;
      active: boolean;
    }> = [];

    defaultUsers.forEach((defaultUser) => {
      // Check if user exists in mock
      const existsInMock = mockUsers.some(
        (u: any) => u.email.toLowerCase() === defaultUser.email.toLowerCase(),
      );

      if (!existsInMock) {
        const newMockUser = {
          uid: `mock-${Date.now()}-${Math.random()}`,
          ...defaultUser,
          createdAt: new Date().toISOString(),
        };
        mockUsers.push(newMockUser);
        created++;
        console.log(`✅ Created mock user: ${defaultUser.name}`);
      }

      // Check if user exists in app
      const existsInApp = appUsers.some(
        (u: any) => u.email.toLowerCase() === defaultUser.email.toLowerCase(),
      );

      if (!existsInApp) {
        const newAppUser = {
          id: `app-${Date.now()}-${Math.random()}`,
          ...defaultUser,
          permissions: {
            obras: { view: true, create: false, edit: true, delete: false },
            manutencoes: {
              view: true,
              create: true,
              edit: true,
              delete: false,
            },
            piscinas: { view: true, create: false, edit: true, delete: false },
            utilizadores: {
              view: false,
              create: false,
              edit: false,
              delete: false,
            },
            relatorios: {
              view: true,
              create: false,
              edit: false,
              delete: false,
            },
            clientes: { view: true, create: false, edit: false, delete: false },
          },
          createdAt: new Date().toISOString().split("T")[0],
        };
        appUsers.push(newAppUser);
        console.log(`✅ Created app user: ${defaultUser.name}`);
      }
    });

    // Save updated arrays
    localStorage.setItem("mock-users", JSON.stringify(mockUsers));
    localStorage.setItem("app-users", JSON.stringify(appUsers));
  } catch (error: any) {
    errors.push(`Erro ao criar utilizadores: ${error.message}`);
  }

  return { created, errors };
};

export const fixLoginScreenShaking = (): void => {
  // Clear any problematic auto-login data that might cause loops
  const problematicKeys = [
    "savedLoginCredentials",
    "mock-current-user",
    "firebase-current-user",
  ];

  problematicKeys.forEach((key) => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // If saved credentials exist but are causing issues, clear them
        if (key === "savedLoginCredentials" && parsed.rememberMe) {
          console.log("🔧 Clearing problematic auto-login credentials");
          localStorage.removeItem(key);
        }
      } catch (error) {
        // If data is corrupted, remove it
        localStorage.removeItem(key);
      }
    }
  });

  // Clear any error states that might cause re-renders
  sessionStorage.removeItem("login-error-state");
  sessionStorage.removeItem("auth-error-count");

  console.log("🔧 Login screen shake fixes applied");
};

export const runCompleteUserFix = (): {
  diagnosis: UserLoginIssue[];
  passwordsFixed: number;
  usersCreated: number;
  errors: string[];
} => {
  console.log("🔧 Running complete user login fix...");

  // Diagnose issues
  const diagnosis = diagnoseUserLoginIssues();

  // Fix screen shaking first
  fixLoginScreenShaking();

  // Fix passwords
  const passwordResult = fixUserPasswords();

  // Create missing users
  const creationResult = createMissingUsers();

  // Reload auth services
  // Mock auth service removed
  console.log("Mock auth service disabled");

  const allErrors = [...passwordResult.errors, ...creationResult.errors];

  console.log("✅ User login fix completed", {
    passwordsFixed: passwordResult.fixed,
    usersCreated: creationResult.created,
    errors: allErrors,
  });

  return {
    diagnosis,
    passwordsFixed: passwordResult.fixed,
    usersCreated: creationResult.created,
    errors: allErrors,
  };
};
