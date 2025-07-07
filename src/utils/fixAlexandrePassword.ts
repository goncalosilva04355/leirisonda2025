// Fix Alexandre login issues by ensuring his account exists
export const createAlexandreUser = (): {
  success: boolean;
  message: string;
} => {
  try {
    // Get existing mock users
    const mockUsersData = localStorage.getItem("mock-users");
    const mockUsers = mockUsersData ? JSON.parse(mockUsersData) : [];

    // Check if Alexandre already exists
    const alexandreExists = mockUsers.some(
      (user: any) =>
        user.email.toLowerCase() === "alexandre@leirisonda.com" ||
        user.name.toLowerCase().includes("alexandre"),
    );

    if (alexandreExists) {
      return { success: true, message: "Alexandre já existe no sistema" };
    }

    // Create Alexandre user
    const alexandreUser = {
      uid: `mock-alexandre-${Date.now()}`,
      email: "alexandre@leirisonda.com",
      password: "123456", // Default password
      name: "Alexandre",
      role: "technician",
      active: true,
      createdAt: new Date().toISOString(),
    };

    // Add Alexandre to mock users
    mockUsers.push(alexandreUser);
    localStorage.setItem("mock-users", JSON.stringify(mockUsers));

    console.log("✅ Alexandre user created successfully");
    return {
      success: true,
      message: "Utilizador Alexandre criado com sucesso",
    };
  } catch (error: any) {
    console.error("❌ Error creating Alexandre user:", error);
    return {
      success: false,
      message: `Erro ao criar utilizador: ${error.message}`,
    };
  }
};

export const fixAlexandrePassword = (): {
  success: boolean;
  message: string;
} => {
  try {
    // First ensure Alexandre user exists
    const createResult = createAlexandreUser();
    if (!createResult.success) {
      return createResult;
    }

    // Get existing mock users
    const mockUsersData = localStorage.getItem("mock-users");
    const mockUsers = mockUsersData ? JSON.parse(mockUsersData) : [];

    // Find Alexandre user
    const alexandreIndex = mockUsers.findIndex(
      (user: any) =>
        user.email.toLowerCase() === "alexandre@leirisonda.com" ||
        user.name.toLowerCase().includes("alexandre"),
    );

    if (alexandreIndex === -1) {
      return { success: false, message: "Utilizador Alexandre não encontrado" };
    }

    // Update Alexandre's password and ensure he's active
    mockUsers[alexandreIndex] = {
      ...mockUsers[alexandreIndex],
      password: "123456",
      active: true,
      email: "alexandre@leirisonda.com",
      name: "Alexandre",
      role: "technician",
    };

    // Save updated users
    localStorage.setItem("mock-users", JSON.stringify(mockUsers));

    console.log("✅ Alexandre password fixed successfully");
    return {
      success: true,
      message: "Password do Alexandre corrigida com sucesso",
    };
  } catch (error: any) {
    console.error("❌ Error fixing Alexandre password:", error);
    return {
      success: false,
      message: `Erro ao corrigir password: ${error.message}`,
    };
  }
};

// Auto-fix Alexandre on module load
console.log("🔧 Auto-fixing Alexandre user account...");
fixAlexandrePassword();
