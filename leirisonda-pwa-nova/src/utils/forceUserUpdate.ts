// Força atualização de utilizadores autorizados
import { safeLocalStorage } from "./storageUtils";

export function forceUpdateAuthorizedUsers(): void {
  console.log("🔄 Forçando atualização de utilizadores autorizados...");

  // Lista completa de emails autorizados
  const authorizedUsers = [
    {
      email: "gongonsilva@gmail.com",
      name: "Gonçalo Fonseca",
      role: "super_admin",
    },
    {
      email: "goncalosfonseca@gmail.com",
      name: "Gonçalo Fonseca",
      role: "super_admin",
    },
  ];

  // Limpar cache existente
  safeLocalStorage.removeItem("authorizedUsers");
  safeLocalStorage.removeItem("app-users");

  // Guardar nova configuração
  safeLocalStorage.setItem("authorizedUsers", JSON.stringify(authorizedUsers));

  console.log(
    "✅ Utilizadores autorizados atualizados:",
    authorizedUsers.map((u) => u.email),
  );

  // Criar app-users também
  const appUsers = authorizedUsers.map((user, index) => ({
    id: (index + 1).toString(),
    name: user.name,
    email: user.email,
    active: true,
    role: user.role,
    password: user.email.includes("gon") ? "19867gsf" : "123456",
    permissions: {
      obras: { view: true, create: true, edit: true, delete: true },
      manutencoes: { view: true, create: true, edit: true, delete: true },
      piscinas: { view: true, create: true, edit: true, delete: true },
      utilizadores: { view: true, create: true, edit: true, delete: true },
      relatorios: { view: true, create: true, edit: true, delete: true },
      clientes: { view: true, create: true, edit: true, delete: true },
    },
    createdAt: new Date().toISOString(),
  }));

  safeLocalStorage.setItem("app-users", JSON.stringify(appUsers));
  console.log(
    "✅ App users atualizados:",
    appUsers.map((u) => u.email),
  );
}

// Executar automaticamente ao importar
forceUpdateAuthorizedUsers();
