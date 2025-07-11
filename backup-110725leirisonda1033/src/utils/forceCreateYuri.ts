/**
 * Force create Yuri user - runs immediately when imported
 */

// Execute immediately
console.log("🔧 FORCE CREATING USER: yuri@leirisonda.pt");

// Clear any existing user with this email
const clearExistingUser = () => {
  try {
    // App users
    const appUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
    const filteredAppUsers = appUsers.filter(
      (user: any) => user.email.toLowerCase() !== "yuri@leirisonda.pt",
    );
    localStorage.setItem("app-users", JSON.stringify(filteredAppUsers));

    // Mock users
    const mockUsers = JSON.parse(localStorage.getItem("mock-users") || "[]");
    const filteredMockUsers = mockUsers.filter(
      (user: any) => user.email.toLowerCase() !== "yuri@leirisonda.pt",
    );
    localStorage.setItem("mock-users", JSON.stringify(filteredMockUsers));

    console.log("🗑️ Cleared existing user");
  } catch (error) {
    console.error("Error clearing user:", error);
  }
};

// Create user function
const createYuriUser = () => {
  clearExistingUser();

  const timestamp = Date.now();

  // App user
  const appUser = {
    id: `user-${timestamp}`,
    name: "Yuri",
    email: "yuri@leirisonda.pt",
    password: "123",
    role: "user",
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

  // Mock user
  const mockUser = {
    uid: `user-${timestamp}`,
    email: "yuri@leirisonda.pt",
    password: "123",
    name: "Yuri",
    role: "technician",
    active: true,
    createdAt: new Date().toISOString(),
  };

  try {
    // Add to app-users
    const appUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
    appUsers.push(appUser);
    localStorage.setItem("app-users", JSON.stringify(appUsers));

    // Add to mock-users
    const mockUsers = JSON.parse(localStorage.getItem("mock-users") || "[]");
    mockUsers.push(mockUser);
    localStorage.setItem("mock-users", JSON.stringify(mockUsers));

    console.log("✅ USER CREATED SUCCESSFULLY!");
    console.log("📧 Email: yuri@leirisonda.pt");
    console.log("🔑 Password: 123");
    console.log(
      "📋 App Users:",
      JSON.parse(localStorage.getItem("app-users") || "[]"),
    );
    console.log(
      "📋 Mock Users:",
      JSON.parse(localStorage.getItem("mock-users") || "[]"),
    );

    // Notifications disabled
  } catch (error) {
    console.error("❌ Error creating user:", error);
  }
};

// Auto-execution disabled
// createYuriUser();

export default createYuriUser;
