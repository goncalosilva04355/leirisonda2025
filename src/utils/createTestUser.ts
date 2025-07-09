/**
 * Utility to create a test user for yrzamr01@gmail.com
 */

export const createTestUser = () => {
  const newUser = {
    id: `user-${Date.now()}`,
    name: "Yuri",
    email: "yuri@leirisonda.pt",
    password: "123",
    role: "user" as const,
    active: true,
    createdAt: new Date().toISOString(),
    permissions: {
      obras: { view: true, create: false, edit: false, delete: false },
      manutencoes: { view: true, create: false, edit: false, delete: false },
      piscinas: { view: true, create: false, edit: false, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: true, create: false, edit: false, delete: false },
      admin: { view: false, create: false, edit: false, delete: false },
      dashboard: { view: true },
    },
  };

  try {
    // Get existing users
    const existingUsers = JSON.parse(localStorage.getItem("app-users") || "[]");

    // Remove existing user if exists (to force recreation)
    const filteredUsers = existingUsers.filter(
      (user: any) => user.email.toLowerCase() !== newUser.email.toLowerCase(),
    );

    // Add new user
    filteredUsers.push(newUser);

    // Save to localStorage
    localStorage.setItem("app-users", JSON.stringify(filteredUsers));

    // Also create in mock-users for compatibility
    const mockUser = {
      uid: newUser.id,
      email: newUser.email,
      password: newUser.password,
      name: newUser.name,
      role: "technician" as const,
      active: newUser.active,
      createdAt: newUser.createdAt,
    };

    const existingMockUsers = JSON.parse(
      localStorage.getItem("mock-users") || "[]",
    );

    // Remove existing mock user if exists (to force recreation)
    const filteredMockUsers = existingMockUsers.filter(
      (user: any) => user.email.toLowerCase() !== mockUser.email.toLowerCase(),
    );

    filteredMockUsers.push(mockUser);
    localStorage.setItem("mock-users", JSON.stringify(filteredMockUsers));

    console.log("✅ Test user created successfully:", newUser.email);
    console.log("📧 Email:", newUser.email);
    console.log("🔑 Password:", newUser.password);
    console.log("👤 Role:", newUser.role);

    // Debug: Show created users
    console.log(
      "📋 App users:",
      JSON.parse(localStorage.getItem("app-users") || "[]"),
    );
    console.log(
      "📋 Mock users:",
      JSON.parse(localStorage.getItem("mock-users") || "[]"),
    );

    return {
      success: true,
      message: "User created successfully",
      user: newUser,
    };
  } catch (error) {
    console.error("❌ Error creating test user:", error);
    return { success: false, message: "Error creating user" };
  }
};

// Auto-execute when imported
setTimeout(() => {
  createTestUser();
}, 1000);
