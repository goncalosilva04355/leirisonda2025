// Emergency User Initialization - Garante que sempre há utilizadores disponíveis
export const emergencyUserInit = () => {
  console.log("🆘 Emergency User Init: Verificando utilizadores...");

  try {
    const savedUsers = localStorage.getItem("app-users");
    let users = savedUsers ? JSON.parse(savedUsers) : [];

    // Verificar se Gonçalo existe
    const goncaloExists = users.some(
      (u: any) =>
        u.email === "gongonsilva@gmail.com" || u.name.includes("Gonçalo"),
    );

    if (!goncaloExists) {
      console.log("⚠️ Gonçalo não encontrado, adicionando...");

      const goncalo = {
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
      };

      users.unshift(goncalo); // Adicionar no início
      localStorage.setItem("app-users", JSON.stringify(users));
      console.log("✅ Gonçalo adicionado com sucesso");
    }

    // Verificar se há pelo menos um utilizador de teste
    const testUserExists = users.some(
      (u: any) => u.email === "teste@teste.com",
    );

    if (!testUserExists) {
      console.log("⚠️ Utilizador de teste não encontrado, adicionando...");

      const testUser = {
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
      };

      users.push(testUser);
      localStorage.setItem("app-users", JSON.stringify(users));
      console.log("✅ Utilizador de teste adicionado");
    }

    console.log(
      `✅ Emergency Init completo: ${users.length} utilizadores disponíveis`,
    );
    return users;
  } catch (error) {
    console.error("❌ Erro no Emergency User Init:", error);

    // Fallback absoluto
    const fallbackUsers = [
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
    ];

    localStorage.setItem("app-users", JSON.stringify(fallbackUsers));
    console.log("🆘 Fallback users criados");
    return fallbackUsers;
  }
};

// Auto-executar na importação
emergencyUserInit();

export default emergencyUserInit;
