// Lista de utilizadores autorizados a fazer login
export interface AuthorizedUser {
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
}

export const AUTHORIZED_USERS: AuthorizedUser[] = [
  {
    email: "gongonsilva@gmail.com",
    name: "Gonçalo Fonseca",
    role: "super_admin",
  },
  // Adicione mais utilizadores autorizados aqui
  // {
  //   email: "exemplo@empresa.com",
  //   name: "Nome do Utilizador",
  //   role: "technician"
  // }
];

// Função para obter lista atual de utilizadores (localStorage + padrão)
export function getCurrentAuthorizedUsers(): AuthorizedUser[] {
  try {
    const savedUsers = localStorage.getItem("authorizedUsers");
    if (savedUsers && savedUsers.trim() !== "") {
      const parsedUsers = JSON.parse(savedUsers);
      if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
        console.log(
          "✅ Utilizadores carregados do localStorage:",
          parsedUsers.length,
        );
        return parsedUsers;
      }
    }
  } catch (error) {
    console.warn("⚠️ Erro ao carregar utilizadores do localStorage:", error);
  }

  console.log("📝 Inicializando utilizadores padrão no localStorage");
  // Guardar utilizadores padrão no localStorage para serem detetados pelo diagnóstico
  localStorage.setItem("authorizedUsers", JSON.stringify(AUTHORIZED_USERS));
  return [...AUTHORIZED_USERS];
}

// Função para verificar se um email está autorizado
export function isEmailAuthorized(email: string): AuthorizedUser | null {
  const normalizedEmail = email.toLowerCase().trim();
  const currentUsers = getCurrentAuthorizedUsers();
  return (
    currentUsers.find((user) => user.email.toLowerCase() === normalizedEmail) ||
    null
  );
}

// Função para obter utilizador autorizado por email
export function getAuthorizedUser(email: string): AuthorizedUser | null {
  return isEmailAuthorized(email);
}
