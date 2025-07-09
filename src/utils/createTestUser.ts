/**
 * Utility to create a test user for yrzamr01@gmail.com
 */

export const createTestUser = () => {
  const newUser = {
    id: `user-${Date.now()}`,
    name: "Yuri",
    email: "yuri@leirisonda.pt",
    password: "leirisonda123",
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

    // Check if user already exists
    const userExists = existingUsers.some(
      (user: any) => user.email.toLowerCase() === newUser.email.toLowerCase(),
    );

    if (userExists) {
      console.log("ℹ️ User already exists:", newUser.email);
      return { success: false, message: "User already exists" };
    }

    // Add new user
    existingUsers.push(newUser);

    // Save to localStorage
    localStorage.setItem("app-users", JSON.stringify(existingUsers));

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
    const mockUserExists = existingMockUsers.some(
      (user: any) => user.email.toLowerCase() === mockUser.email.toLowerCase(),
    );

    if (!mockUserExists) {
      existingMockUsers.push(mockUser);
      localStorage.setItem("mock-users", JSON.stringify(existingMockUsers));
    }

    console.log("✅ Test user created successfully:", newUser.email);
    console.log("📧 Email:", newUser.email);
    console.log("🔑 Password:", newUser.password);
    console.log("👤 Role:", newUser.role);

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
