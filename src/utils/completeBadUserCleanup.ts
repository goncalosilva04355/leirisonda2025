/**
 * Utilidade para remover completamente utilizadores problemáticos
 * Remove todos os vestígios dos emails especificados de todos os sistemas
 */

const PROBLEMATIC_EMAILS = [
  "yrzamr@gmail.com",
  "alexkamaryta@gmail.com",
  "davidcarreiraa92@gmail.com",
  // Add any additional emails that need to be blocked
];

const SUPER_ADMIN_EMAIL = "gongonsilva@gmail.com";

export interface CleanupResult {
  success: boolean;
  message: string;
  details: {
    emailsFound: string[];
    emailsRemoved: string[];
    systemsCleaned: string[];
    errors: string[];
  };
}

export const executeCompleteCleanup = async (): Promise<CleanupResult> => {
  console.log("🧹 INICIANDO LIMPEZA COMPLETA DE UTILIZADORES PROBLEMÁTICOS...");

  const result: CleanupResult = {
    success: false,
    message: "",
    details: {
      emailsFound: [],
      emailsRemoved: [],
      systemsCleaned: [],
      errors: [],
    },
  };

  try {
    // 1. Limpar Firebase Auth se utilizador problemático estiver logado
    await cleanFirebaseAuth(result);

    // 2. Limpar localStorage completamente
    await cleanLocalStorage(result);

    // 3. Limpar sessionStorage
    await cleanSessionStorage(result);

    // 4. Limpar IndexedDB
    await cleanIndexedDB(result);

    // 5. Recriar apenas o super admin
    await recreateSuperAdmin(result);

    // 6. Disparar eventos de limpeza
    dispatchCleanupEvents();

    result.success = true;
    result.message = `✅ Limpeza completa! ${result.details.emailsRemoved.length} emails problemáticos removidos.`;

    console.log("🎉 LIMPEZA COMPLETA CONCLUÍDA!", result);

    // Forçar reload após 2 segundos
    setTimeout(() => {
      console.log("🔄 Recarregando aplicação...");
      window.location.reload();
    }, 2000);
  } catch (error: any) {
    console.error("💥 ERRO NA LIMPEZA:", error);
    result.success = false;
    result.message = `❌ Erro: ${error.message}`;
    result.details.errors.push(`Erro crítico: ${error.message}`);
  }

  return result;
};

async function cleanFirebaseAuth(result: CleanupResult): Promise<void> {
  try {
    console.log("🔥 Verificando Firebase Auth...");

    const { auth } = await import("../firebase/config");

    if (auth?.currentUser?.email) {
      const currentEmail = auth.currentUser.email.toLowerCase();
      console.log("👤 Utilizador Firebase atual:", currentEmail);

      if (
        PROBLEMATIC_EMAILS.some((email) => email.toLowerCase() === currentEmail)
      ) {
        console.log("🚨 UTILIZADOR PROBLEMÁTICO DETECTADO! Forçando logout...");
        result.details.emailsFound.push(currentEmail);

        const { signOut } = await import("firebase/auth");
        await signOut(auth);

        result.details.emailsRemoved.push(currentEmail);
        result.details.systemsCleaned.push("Firebase Auth");
        console.log("✅ Logout do Firebase executado");
      }
    }

    // Limpar persistência do Firebase
    try {
      const { setPersistence, browserSessionPersistence } = await import(
        "firebase/auth"
      );
      if (auth) {
        await setPersistence(auth, browserSessionPersistence);
        console.log("✅ Persistência do Firebase limpa");
      }
    } catch (error) {
      console.warn("⚠️ Erro ao limpar persistência do Firebase:", error);
    }
  } catch (error: any) {
    console.warn("⚠️ Erro no Firebase Auth:", error);
    result.details.errors.push(`Firebase Auth: ${error.message}`);
  }
}

async function cleanLocalStorage(result: CleanupResult): Promise<void> {
  console.log("💾 Limpando localStorage...");

  const userKeys = [
    "app-users",
    "mock-users",
    "users",
    "saved-users",
    "currentUser",
    "mock-current-user",
    "savedLoginCredentials",
    "userPreferences",
    "authState",
    "loginState",
    "github-users",
    "git-users",
    "repository-users",
    "collaborators",
    "team-members",
  ];

  for (const key of userKeys) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        let parsedData = JSON.parse(data);
        let modified = false;

        if (Array.isArray(parsedData)) {
          // Array de utilizadores
          const originalLength = parsedData.length;
          parsedData = parsedData.filter((user: any) => {
            const userEmail = user.email?.toLowerCase();
            if (
              userEmail &&
              PROBLEMATIC_EMAILS.some(
                (email) => email.toLowerCase() === userEmail,
              )
            ) {
              result.details.emailsFound.push(userEmail);
              result.details.emailsRemoved.push(userEmail);
              console.log(`🗑️ Removendo ${userEmail} de ${key}`);
              modified = true;
              return false; // Remover este utilizador
            }
            return true; // Manter outros utilizadores
          });

          if (modified) {
            localStorage.setItem(key, JSON.stringify(parsedData));
            result.details.systemsCleaned.push(`localStorage:${key}`);
            console.log(
              `✅ ${key} limpo: ${originalLength} → ${parsedData.length} utilizadores`,
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
            result.details.emailsFound.push(userEmail);
            result.details.emailsRemoved.push(userEmail);
            localStorage.removeItem(key);
            result.details.systemsCleaned.push(`localStorage:${key}`);
            console.log(`🗑️ Removido utilizador único ${userEmail} de ${key}`);
          }
        }
      }
    } catch (error: any) {
      console.warn(`⚠️ Erro ao processar ${key}:`, error);
      result.details.errors.push(`localStorage ${key}: ${error.message}`);
    }
  }

  // Limpar chaves do Firebase que possam conter dados dos utilizadores
  const allKeys = Object.keys(localStorage);
  const firebaseKeys = allKeys.filter(
    (key) =>
      key.toLowerCase().includes("firebase") ||
      key.startsWith("firebase:") ||
      key.startsWith("__firebase"),
  );

  for (const key of firebaseKeys) {
    try {
      localStorage.removeItem(key);
      result.details.systemsCleaned.push(`localStorage:${key}`);
      console.log(`🗑️ Removida chave Firebase: ${key}`);
    } catch (error: any) {
      console.warn(`⚠️ Erro ao remover ${key}:`, error);
    }
  }
}

async function cleanSessionStorage(result: CleanupResult): Promise<void> {
  try {
    const itemCount = sessionStorage.length;
    sessionStorage.clear();
    result.details.systemsCleaned.push("sessionStorage");
    console.log(`🧹 sessionStorage limpo (${itemCount} itens removidos)`);
  } catch (error: any) {
    console.warn("⚠️ Erro ao limpar sessionStorage:", error);
    result.details.errors.push(`sessionStorage: ${error.message}`);
  }
}

async function cleanIndexedDB(result: CleanupResult): Promise<void> {
  try {
    if (!("indexedDB" in window)) {
      console.log("🗃️ IndexedDB não disponível");
      return;
    }

    console.log("🗃️ Limpando IndexedDB...");
    const databases = await indexedDB.databases();

    let cleanedCount = 0;
    for (const db of databases) {
      if (
        db.name &&
        (db.name.includes("firebase") ||
          db.name.includes("auth") ||
          db.name.includes("leirisonda"))
      ) {
        try {
          const deleteReq = indexedDB.deleteDatabase(db.name);
          await new Promise((resolve, reject) => {
            deleteReq.onsuccess = () => {
              cleanedCount++;
              console.log(`✅ IndexedDB ${db.name} removido`);
              resolve(true);
            };
            deleteReq.onerror = () => reject(deleteReq.error);
            deleteReq.onblocked = () => resolve(true); // Continuar mesmo se bloqueado
          });
        } catch (error) {
          console.warn(`⚠️ Erro ao remover IndexedDB ${db.name}:`, error);
        }
      }
    }

    if (cleanedCount > 0) {
      result.details.systemsCleaned.push(`IndexedDB (${cleanedCount} bases)`);
    }
  } catch (error: any) {
    console.warn("⚠️ Erro no IndexedDB:", error);
    result.details.errors.push(`IndexedDB: ${error.message}`);
  }
}

async function recreateSuperAdmin(result: CleanupResult): Promise<void> {
  console.log("🛡️ Recriando super admin...");

  try {
    // Super admin para app-users
    const superAdmin = {
      id: 1,
      name: "Gonçalo Fonseca",
      email: SUPER_ADMIN_EMAIL,
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

    localStorage.setItem("app-users", JSON.stringify([superAdmin]));

    // Super admin para mock-users
    const mockSuperAdmin = {
      uid: "admin-1",
      email: SUPER_ADMIN_EMAIL,
      password: "19867gsf",
      name: "Gonçalo Fonseca",
      role: "super_admin",
      active: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("mock-users", JSON.stringify([mockSuperAdmin]));

    result.details.systemsCleaned.push("Super admin recriado");
    console.log("✅ Super admin recriado em todos os sistemas");
  } catch (error: any) {
    console.error("❌ Erro ao recriar super admin:", error);
    result.details.errors.push(`Super admin: ${error.message}`);
    throw error;
  }
}

function dispatchCleanupEvents(): void {
  try {
    window.dispatchEvent(new CustomEvent("usersUpdated"));
    window.dispatchEvent(new CustomEvent("authStateChanged"));
    window.dispatchEvent(new CustomEvent("problematicUsersRemoved"));
    console.log("📡 Eventos de limpeza disparados");
  } catch (error) {
    console.warn("⚠️ Erro ao disparar eventos:", error);
  }
}

// Função para execução automática se necessário
export const executeCleanupNow = () => {
  console.log("🚀 Executando limpeza de utilizadores problemáticos agora...");
  return executeCompleteCleanup();
};

// Security: Execute cleanup automatically when module is loaded to ensure blocked users cannot access
// TEMPORARIAMENTE DESATIVADO - estava a eliminar utilizadores automaticamente
/*
setTimeout(() => {
  const currentUser = localStorage.getItem("currentUser");
  const mockCurrentUser = localStorage.getItem("mock-current-user");

  let shouldCleanup = false;

  // Check if any problematic user is currently logged in
  if (currentUser) {
    try {
      const parsed = JSON.parse(currentUser);
      if (
        parsed?.email &&
        PROBLEMATIC_EMAILS.some(
          (email) => email.toLowerCase() === parsed.email.toLowerCase(),
        )
      ) {
        shouldCleanup = true;
      }
    } catch (e) {
      // Invalid JSON, clean it up
      shouldCleanup = true;
    }
  }

  if (mockCurrentUser) {
    try {
      const parsed = JSON.parse(mockCurrentUser);
      if (
        parsed?.email &&
        PROBLEMATIC_EMAILS.some(
          (email) => email.toLowerCase() === parsed.email.toLowerCase(),
        )
      ) {
        shouldCleanup = true;
      }
    } catch (e) {
      // Invalid JSON, clean it up
      shouldCleanup = true;
    }
  }

  if (shouldCleanup) {
    console.log(
      "🚨 Problematic user detected on app load, executing cleanup...",
    );
    executeCompleteCleanup();
  }
}, 100);
*/
