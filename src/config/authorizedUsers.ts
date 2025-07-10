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

// Função para verificar se um email está autorizado
export function isEmailAuthorized(email: string): AuthorizedUser | null {
  const normalizedEmail = email.toLowerCase().trim();
  return (
    AUTHORIZED_USERS.find(
      (user) => user.email.toLowerCase() === normalizedEmail,
    ) || null
  );
}

// Função para obter utilizador autorizado por email
export function getAuthorizedUser(email: string): AuthorizedUser | null {
  return isEmailAuthorized(email);
}
