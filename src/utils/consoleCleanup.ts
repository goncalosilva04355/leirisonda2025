/**
 * Console Commands for User Cleanup
 *
 * These functions can be called directly from the browser console
 * for immediate user cleanup operations.
 */

import { UserDuplicateCleanup } from "./userDuplicateCleanup";

// Make functions available globally for console access
declare global {
  interface Window {
    cleanDuplicateUsers: () => Promise<void>;
    checkUserStatus: () => Promise<void>;
    forceCleanAllUsers: () => void;
  }
}

/**
 * Clean all duplicate users - console command
 * Usage: cleanDuplicateUsers()
 */
window.cleanDuplicateUsers = async function () {
  console.log("🧹 Iniciando limpeza de utilizadores duplicados...");

  try {
    const result = await UserDuplicateCleanup.cleanAllDuplicateUsers();

    if (result.success) {
      console.log("✅ SUCESSO: Limpeza concluída!");
      console.log(result.message);
      console.log("\n📋 Detalhes:");
      result.details.forEach((detail) => console.log(`  ${detail}`));

      if (result.errors.length > 0) {
        console.log("\n⚠️ Avisos:");
        result.errors.forEach((error) => console.log(`  ${error}`));
      }

      console.log("\n🔄 Recarregue a página para ver as alterações.");
    } else {
      console.error("❌ ERRO: Limpeza falhou!");
      console.error(result.message);

      if (result.errors.length > 0) {
        console.error("\n❌ Erros:");
        result.errors.forEach((error) => console.error(`  ${error}`));
      }
    }
  } catch (error: any) {
    console.error("❌ ERRO CRÍTICO:", error.message);
    console.error("Tente usar: forceCleanAllUsers()");
  }
};

/**
 * Check current user status - console command
 * Usage: checkUserStatus()
 */
window.checkUserStatus = async function () {
  console.log("📊 Verificando estado dos utilizadores...");

  try {
    const summary = await UserDuplicateCleanup.getUserSummary();

    console.log("\n📈 RESUMO DE UTILIZADORES:");
    console.log(
      `  Mock Auth Storage: ${summary.mockUsers.length} utilizadores`,
    );
    console.log(`  App Users Storage: ${summary.appUsers.length} utilizadores`);
    console.log(
      `  Firebase Storage: ${summary.firebaseUsers.length} utilizadores`,
    );
    console.log(`  Total Duplicados: ${summary.totalDuplicates}`);

    console.log("\n👥 UTILIZADORES ENCONTRADOS:");

    // Mock users
    if (summary.mockUsers.length > 0) {
      console.log("\n🔐 Mock Auth:");
      summary.mockUsers.forEach((user) => {
        const isGoncalo = user.email?.toLowerCase() === "gongonsilva@gmail.com";
        console.log(
          `  ${isGoncalo ? "✅" : "❌"} ${user.name} (${user.email}) - ${user.role}`,
        );
      });
    }

    // App users
    if (summary.appUsers.length > 0) {
      console.log("\n👤 App Users:");
      summary.appUsers.forEach((user) => {
        const isGoncalo = user.email?.toLowerCase() === "gongonsilva@gmail.com";
        console.log(
          `  ${isGoncalo ? "✅" : "❌"} ${user.name} (${user.email}) - ${user.role}`,
        );
      });
    }

    // Firebase users
    if (summary.firebaseUsers.length > 0) {
      console.log("\n☁️ Firebase:");
      summary.firebaseUsers.forEach((user) => {
        const isGoncalo = user.email?.toLowerCase() === "gongonsilva@gmail.com";
        console.log(
          `  ${isGoncalo ? "✅" : "❌"} ${user.name} (${user.email}) - ${user.role}`,
        );
      });
    }

    const needsCleanup = await UserDuplicateCleanup.needsCleanup();

    if (needsCleanup) {
      console.log("\n⚠️ AÇÃO NECESSÁRIA: Existem utilizadores duplicados!");
      console.log("Execute: cleanDuplicateUsers()");
    } else {
      console.log("\n✅ ESTADO LIMPO: Apenas Gonçalo superadmin ativo.");
    }
  } catch (error: any) {
    console.error("❌ Erro ao verificar estado:", error.message);
  }
};

/**
 * Force clean all users (emergency fallback) - console command
 * Usage: forceCleanAllUsers()
 */
window.forceCleanAllUsers = function () {
  console.log(
    "🚨 LIMPEZA FORÇADA: Removendo todos os utilizadores exceto Gonçalo...",
  );

  try {
    // Force clear all localStorage user data
    const keysToRemove = [
      "mock-users",
      "app-users",
      "mock-current-user",
      "currentUser",
      "savedLoginCredentials",
      "users",
      "user-session",
      "auth-token",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`🗑️ Removido: ${key}`);
    });

    // Set only Gonçalo in mock-users
    const goncaloMock = {
      uid: "admin-1",
      email: "gongonsilva@gmail.com",
      password: "19867gsf",
      name: "Gonçalo Fonseca",
      role: "super_admin",
      active: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("mock-users", JSON.stringify([goncaloMock]));
    console.log("✅ Mock Auth: Gonçalo definido como único utilizador");

    // Set only Gonçalo in app-users
    const goncaloApp = {
      id: "1",
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
    };

    localStorage.setItem("app-users", JSON.stringify([goncaloApp]));
    console.log("✅ App Users: Gonçalo definido como único utilizador");

    // Clear session storage
    sessionStorage.clear();
    console.log("🧹 Session storage limpo");

    console.log("\n✅ LIMPEZA FORÇADA CONCLUÍDA!");
    console.log("🔄 Recarregue a página para ver as alterações.");
    console.log(
      "⚠️ Nota: Firebase users devem ser limpos manualmente na consola do Firebase",
    );
  } catch (error: any) {
    console.error("❌ Erro na limpeza forçada:", error.message);
  }
};

// Log available commands
console.log("🛠️ COMANDOS DE LIMPEZA DE UTILIZADORES DISPONÍVEIS:");
console.log(
  "  cleanDuplicateUsers() - Limpeza completa de utilizadores duplicados",
);
console.log("  checkUserStatus() - Verificar estado atual dos utilizadores");
console.log("  forceCleanAllUsers() - Limpeza forçada (emergência)");
console.log("\n💡 Use checkUserStatus() primeiro para ver o estado atual.");

export {};
