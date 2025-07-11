// Force User Initialization - Execute this to force user creation
export const forceUserInit = () => {
  console.log("🚀 FORCE USER INIT: Forçando criação de utilizadores...");

  const users = [
    {
      id: 1,
      uid: "admin-goncalo",
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
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      uid: "test-user",
      name: "Utilizador Teste",
      email: "teste@teste.com",
      password: "123",
      role: "technician",
      permissions: {
        obras: { view: true, create: true, edit: true, delete: false },
        manutencoes: { view: true, create: true, edit: true, delete: false },
        piscinas: { view: true, create: true, edit: true, delete: false },
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
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      uid: "demo-user",
      name: "João Silva",
      email: "joao@leirisonda.com",
      password: "123",
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
      createdAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem("app-users", JSON.stringify(users));
  console.log("✅ FORCE INIT: Utilizadores criados com sucesso!");
  console.log(`📊 Total: ${users.length} utilizadores`);

  // Disparar evento para componentes escutarem
  window.dispatchEvent(new CustomEvent("usersUpdated"));

  return users;
};

// Executar automaticamente
setTimeout(() => {
  forceUserInit();
}, 1000);

export default forceUserInit;
