/**
 * Restauração imediata de utilizadores
 * Este script roda automaticamente para garantir que os utilizadores existem
 */

const restoreUsers = () => {
  console.log("🚨 RESTAURAÇÃO EMERGÊNCIA DE UTILIZADORES INICIADA");

  // Utilizadores padrão para app-users
  const defaultAppUsers = [
    {
      id: 1,
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
    },
    {
      id: 2,
      name: "João Silva",
      email: "manager@leirisonda.com",
      password: "manager123",
      role: "manager",
      permissions: {
        obras: { view: true, create: true, edit: true, delete: false },
        manutencoes: { view: true, create: true, edit: true, delete: false },
        piscinas: { view: true, create: true, edit: true, delete: false },
        utilizadores: { view: true, create: false, edit: false, delete: false },
        relatorios: { view: true, create: true, edit: false, delete: false },
        clientes: { view: true, create: true, edit: true, delete: false },
      },
      active: true,
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      name: "Maria Santos",
      email: "tecnico@leirisonda.com",
      password: "tecnico123",
      role: "technician",
      permissions: {
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
      },
      active: true,
      createdAt: "2024-01-01",
    },
    {
      id: 4,
      name: "Ana Costa",
      email: "ana@leirisonda.com",
      password: "ana123",
      role: "technician",
      permissions: {
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
      },
      active: true,
      createdAt: "2024-01-01",
    },
  ];

  // Utilizadores para mock-users
  const mockUsers = [
    {
      uid: "admin-1",
      email: "gongonsilva@gmail.com",
      password: "19867gsf",
      name: "Gonçalo Fonseca",
      role: "super_admin",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      uid: "manager-1",
      email: "manager@leirisonda.com",
      password: "manager123",
      name: "João Silva",
      role: "manager",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      uid: "tech-1",
      email: "tecnico@leirisonda.com",
      password: "tecnico123",
      name: "Maria Santos",
      role: "technician",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      uid: "tech-2",
      email: "ana@leirisonda.com",
      password: "ana123",
      name: "Ana Costa",
      role: "technician",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  try {
    // Verificar e restaurar app-users
    const currentAppUsers = localStorage.getItem("app-users");
    if (!currentAppUsers || JSON.parse(currentAppUsers).length === 0) {
      localStorage.setItem("app-users", JSON.stringify(defaultAppUsers));
      console.log(
        "✅ app-users restaurados:",
        defaultAppUsers.length,
        "utilizadores",
      );
    } else {
      console.log(
        "✅ app-users já existem:",
        JSON.parse(currentAppUsers).length,
        "utilizadores",
      );
    }

    // Verificar e restaurar mock-users
    const currentMockUsers = localStorage.getItem("mock-users");
    if (!currentMockUsers || JSON.parse(currentMockUsers).length === 0) {
      localStorage.setItem("mock-users", JSON.stringify(mockUsers));
      console.log(
        "✅ mock-users restaurados:",
        mockUsers.length,
        "utilizadores",
      );
    } else {
      console.log(
        "✅ mock-users já existem:",
        JSON.parse(currentMockUsers).length,
        "utilizadores",
      );
    }

    // Também garantir que users existe (backup)
    const currentUsers = localStorage.getItem("users");
    if (!currentUsers || JSON.parse(currentUsers).length === 0) {
      localStorage.setItem("users", JSON.stringify(defaultAppUsers));
      console.log("✅ users (backup) restaurados");
    }

    console.log("🎉 RESTAURAÇÃO DE UTILIZADORES CONCLUÍDA COM SUCESSO!");
    console.log("👥 Utilizadores disponíveis:");
    defaultAppUsers.forEach((user) => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });

    // Disparar evento para notificar a aplicação
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("usersRestored", {
          detail: { restored: true, count: defaultAppUsers.length },
        }),
      );
    }
  } catch (error) {
    console.error("❌ ERRO NA RESTAURAÇÃO DE UTILIZADORES:", error);
  }
};

// Executar imediatamente
restoreUsers();

export default restoreUsers;
