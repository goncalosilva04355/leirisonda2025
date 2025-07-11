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

// Função para sincronizar authorizedUsers para app-users E Firestore
async function syncToAppUsers(
  authorizedUsers: AuthorizedUser[],
): Promise<void> {
  try {
    const appUsers = authorizedUsers.map((user, index) => ({
      id: (index + 1).toString(),
      name: user.name,
      email: user.email,
      active: true,
      role: user.role,
      password: user.email === "gongonsilva@gmail.com" ? "19867gsf" : "123456", // Password padrão
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

    // Sincronizar para localStorage
    localStorage.setItem("app-users", JSON.stringify(appUsers));
    console.log("✅ app-users sincronizados (localStorage):", appUsers.length);

    // Sincronizar para Firestore se disponível
    try {
      const { firestoreService } = await import("../services/firestoreService");

      // Trigger Firebase sync que irá fazer a sincronização bidirecional
      await firestoreService.getUtilizadores();
      console.log(
        "✅ Sincronização Firebase/Firestore ativada para utilizadores",
      );
    } catch (error) {
      console.warn(
        "⚠️ Firebase não disponível, utilizando apenas localStorage:",
        error,
      );
    }
  } catch (error) {
    console.error("❌ Erro ao sincronizar app-users:", error);
  }
}

// Função para inicializar utilizadores autorizados se necessário
export async function initializeAuthorizedUsers(): Promise<void> {
  const savedUsers = localStorage.getItem("authorizedUsers");
  const savedAppUsers = localStorage.getItem("app-users");

  if (!savedUsers || savedUsers.trim() === "" || savedUsers === "[]") {
    console.log("🔄 Inicializando utilizadores autorizados...");
    localStorage.setItem("authorizedUsers", JSON.stringify(AUTHORIZED_USERS));
    console.log(
      "✅ Utilizadores autorizados inicializados:",
      AUTHORIZED_USERS.length,
    );
  } else {
    console.log("✅ Utilizadores autorizados já existem no localStorage");
  }

  // Sempre sincronizar para app-users + Firebase se necessário
  if (!savedAppUsers || savedAppUsers.trim() === "" || savedAppUsers === "[]") {
    console.log("🔄 Sincronizando para app-users + Firebase...");
    const currentAuthorizedUsers = getCurrentAuthorizedUsers();
    await syncToAppUsers(currentAuthorizedUsers);
  } else {
    console.log(
      "✅ app-users já existem, verificando sincronização Firebase...",
    );
    // Mesmo que já existam app-users, garantir sincronização Firebase
    try {
      const { firestoreService } = await import("../services/firestoreService");
      await firestoreService.getUtilizadores();
      console.log("✅ Sincronização Firebase verificada");
    } catch (error) {
      console.warn("⚠️ Firebase não disponível:", error);
    }
  }
}

// Função para forçar ressincronização (útil quando utilizadores autorizados são alterados)
export async function forceSyncToAppUsers(): Promise<void> {
  console.log(
    "🔄 Forçando ressincronização de utilizadores autorizados para app-users...",
  );
  const currentAuthorizedUsers = getCurrentAuthorizedUsers();
  await syncToAppUsers(currentAuthorizedUsers);
}

// Listener para mudanças nos utilizadores autorizados
if (typeof window !== "undefined") {
  window.addEventListener("authorizedUsersChanged", async (event: any) => {
    console.log(
      "🔄 Utilizadores autorizados alterados, forçando sincronização...",
    );
    await forceSyncToAppUsers();
  });
}
