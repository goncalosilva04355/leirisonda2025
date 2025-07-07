/**
 * Script manual para remover completamente os utilizadores problemáticos
 */

const PROBLEMATIC_EMAILS = [
  "yrzamr@gmail.com",
  "yrzamr01@gmail.com",
  "alexkamaryta@gmail.com",
  "davidcarreiraa92@gmail.com",
];

const SUPER_ADMIN_EMAIL = "gongonsilva@gmail.com";

export const executeManualCleanup = (): {
  success: boolean;
  message: string;
  details: {
    foundUsers: string[];
    removedUsers: string[];
    keysChecked: string[];
  };
} => {
  console.log("🧹 EXECUTANDO LIMPEZA MANUAL DE UTILIZADORES PROBLEMÁTICOS...");

  const result = {
    success: false,
    message: "",
    details: {
      foundUsers: [] as string[],
      removedUsers: [] as string[],
      keysChecked: [] as string[],
    },
  };

  try {
    // Limpar todas as chaves relacionadas com utilizadores
    const keysToCheck = [
      "app-users",
      "mock-users",
      "users",
      "saved-users",
      "currentUser",
      "mock-current-user",
      "userPreferences",
      "authState",
      "loginState",
    ];

    keysToCheck.forEach((key) => {
      result.details.keysChecked.push(key);

      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsedData = JSON.parse(data);

          if (Array.isArray(parsedData)) {
            // Array de utilizadores
            const beforeCount = parsedData.length;
            const cleanedData = parsedData.filter((user: any) => {
              const userEmail = user.email?.toLowerCase();
              if (
                userEmail &&
                PROBLEMATIC_EMAILS.some(
                  (email) => email.toLowerCase() === userEmail,
                )
              ) {
                result.details.foundUsers.push(userEmail);
                result.details.removedUsers.push(userEmail);
                console.log(
                  `❌ Removendo utilizador problemático de ${key}: ${userEmail}`,
                );
                return false; // Remove este utilizador
              }
              return true; // Manter outros utilizadores
            });

            if (beforeCount !== cleanedData.length) {
              localStorage.setItem(key, JSON.stringify(cleanedData));
              console.log(
                `✅ ${key} limpo: ${beforeCount} → ${cleanedData.length} utilizadores`,
              );
            }
          } else if (parsedData?.email) {
            // Utilizador único
            const userEmail = parsedData.email.toLowerCase();
            if (
              PROBLEMATIC_EMAILS.some(
                (email) => email.toLowerCase() === userEmail,
              )
            ) {
              result.details.foundUsers.push(userEmail);
              result.details.removedUsers.push(userEmail);
              localStorage.removeItem(key);
              console.log(
                `❌ Removido utilizador problemático de ${key}: ${userEmail}`,
              );
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao verificar ${key}:`, error);
      }
    });

    // Recriar apenas o super admin
    const superAdmin = {
      id: 1,
      name: "Gonçalo Fonseca",
      email: SUPER_ADMIN_EMAIL,
      password: "19867gsf",
      role: "super_admin",
      permissions: {
        obras: { view: true, create: true, edit: true, delete: true },
        viaturas: { view: true, create: true, edit: true, delete: true },
        piscinas: { view: true, create: true, edit: true, delete: true },
        utilizadores: { view: true, create: true, edit: true, delete: true },
        relatorios: { view: true, create: true, edit: true, delete: true },
        configuracao: { view: true, create: true, edit: true, delete: true },
      },
      active: true,
    };

    const mockSuperAdmin = {
      uid: "admin-1",
      email: SUPER_ADMIN_EMAIL,
      password: "19867gsf",
      name: "Gonçalo Fonseca",
      role: "super_admin",
      active: true,
      lastLogin: new Date().toISOString(),
    };

    localStorage.setItem("app-users", JSON.stringify([superAdmin]));
    localStorage.setItem("mock-users", JSON.stringify([mockSuperAdmin]));

    // Limpar current user se for problemático
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const parsed = JSON.parse(currentUser);
        if (
          parsed?.email &&
          PROBLEMATIC_EMAILS.some(
            (email) => email.toLowerCase() === parsed.email.toLowerCase(),
          )
        ) {
          localStorage.removeItem("currentUser");
          console.log("❌ Current user problemático removido");
        }
      } catch (error) {
        console.warn("⚠️ Erro ao verificar currentUser:", error);
      }
    }

    result.success = true;
    result.message = `Limpeza concluída. ${result.details.removedUsers.length} utilizadores problemáticos removidos.`;

    console.log("🎉 LIMPEZA MANUAL CONCLUÍDA COM SUCESSO!");
    console.log(
      `📊 Utilizadores encontrados: ${result.details.foundUsers.length}`,
    );
    console.log(
      `📊 Utilizadores removidos: ${result.details.removedUsers.length}`,
    );
    console.log(`📊 Chaves verificadas: ${result.details.keysChecked.length}`);

    return result;
  } catch (error) {
    console.error("💥 ERRO NA LIMPEZA MANUAL:", error);
    result.message = `Erro na limpeza: ${error}`;
    return result;
  }
};

// Executar automaticamente quando importado
export const runCleanupNow = () => {
  const result = executeManualCleanup();

  // Disparar eventos para atualizar a interface
  try {
    window.dispatchEvent(new CustomEvent("usersUpdated"));
    window.dispatchEvent(new CustomEvent("authStateChanged"));
    window.dispatchEvent(new CustomEvent("problematicUsersRemoved"));
    console.log("📡 Eventos de limpeza disparados");
  } catch (error) {
    console.warn("⚠️ Erro ao disparar eventos:", error);
  }

  return result;
};
