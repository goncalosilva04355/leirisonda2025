// Autenticação simples para testes
export function simpleLogin(email: string, password: string = "123456") {
  // Utilizadores autorizados
  const authorizedUsers = [
    {
      email: "gongonsilva@gmail.com",
      name: "Gonçalo Fonseca",
      role: "super_admin",
      id: "1",
    },
    {
      email: "goncalosfonseca@gmail.com",
      name: "Gonçalo Fonseca",
      role: "super_admin",
      id: "2",
    },
    {
      email: "teste@teste.com",
      name: "Utilizador de Teste",
      role: "manager",
      id: "3",
    },
  ];

  const user = authorizedUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );

  if (
    user &&
    (password === "123" || password === "123456" || password === "19867gsf")
  ) {
    // Guardar utilizador autenticado
    const authenticatedUser = {
      ...user,
      permissions: {
        obras: { view: true, create: true, edit: true, delete: true },
        manutencoes: { view: true, create: true, edit: true, delete: true },
        piscinas: { view: true, create: true, edit: true, delete: true },
        utilizadores: { view: true, create: true, edit: true, delete: true },
        relatorios: { view: true, create: true, edit: true, delete: true },
        clientes: { view: true, create: true, edit: true, delete: true },
      },
    };

    localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));
    localStorage.setItem("isAuthenticated", "true");

    console.log("✅ Login realizado com sucesso:", user.name);
    return { success: true, user: authenticatedUser };
  }

  console.warn("❌ Credenciais inválidas");
  return { success: false, error: "Credenciais inválidas" };
}

export function simpleLogout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isAuthenticated");
  console.log("✅ Logout realizado");
}

export function getCurrentUser() {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return localStorage.getItem("isAuthenticated") === "true";
}
