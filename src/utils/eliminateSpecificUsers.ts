/**
 * Script para eliminar usuários específicos pelos emails fornecidos
 * Emails alvo: yrzamr01@gmail.com, alexkamaryta@gmail.com, davidcarreiraa92@gmail.com
 */

const TARGET_EMAILS = [
  "yrzamr01@gmail.com",
  "alexkamaryta@gmail.com",
  "davidcarreiraa92@gmail.com",
];

const SUPER_ADMIN_EMAIL = "gongonsilva@gmail.com";

export interface EliminationResult {
  success: boolean;
  message: string;
  details: {
    usersFound: string[];
    usersEliminated: string[];
    errors: string[];
    systemsCleaned: string[];
  };
}

export const eliminateSpecificUsers = async (): Promise<EliminationResult> => {
  console.log("🎯 INICIANDO ELIMINAÇÃO DE USUÁRIOS ESPECÍFICOS...");
  console.log("📧 Emails alvo:", TARGET_EMAILS);

  const result: EliminationResult = {
    success: false,
    message: "",
    details: {
      usersFound: [],
      usersEliminated: [],
      errors: [],
      systemsCleaned: [],
    },
  };

  try {
    // 1. FIREBASE AUTH - Forçar logout se algum desses usuários estiver logado
    await cleanFirebaseAuth(result);

    // 2. LOCALSTORAGE - Limpar de todas as chaves de usuários
    await cleanLocalStorage(result);

    // 3. SESSIONSTORAGE - Limpar completamente
    await cleanSessionStorage(result);

    // 4. INDEXEDDB - Limpar bases do Firebase
    await cleanIndexedDB(result);

    // 5. Recriar apenas o super admin
    await recreateSuperAdmin(result);

    // 6. Forçar eventos de atualização
    dispatchCleanupEvents();

    result.success = true;
    result.message = `✅ USUÁRIOS ELIMINADOS! Removidos: ${result.details.usersEliminated.join(", ")}`;

    console.log("🎉 ELIMINAÇÃO ESPECÍFICA CONCLUÍDA!");
    console.log("📊 Resultado:", result);

    // Forçar reload após 2 segundos
    setTimeout(() => {
      console.log("🔄 Recarregando para garantir estado limpo...");
      window.location.reload();
    }, 2000);
  } catch (error: any) {
    console.error("💥 ERRO NA ELIMINAÇÃO:", error);
    result.success = false;
    result.message = `❌ Erro: ${error.message}`;
    result.details.errors.push(`Erro crítico: ${error.message}`);
  }

  return result;
};

async function cleanFirebaseAuth(result: EliminationResult): Promise<void> {
  try {
    console.log("🔥 Verificando Firebase Auth...");

    const { auth } = await import("../firebase/config");

    if (auth && auth.currentUser) {
      const currentEmail = auth.currentUser.email;
      console.log("👤 Usuário Firebase atual:", currentEmail);

      if (currentEmail && TARGET_EMAILS.includes(currentEmail.toLowerCase())) {
        console.log(
          "🚨 USUÁRIO ALVO DETECTADO NO FIREBASE AUTH! Forçando logout...",
        );
        result.details.usersFound.push(currentEmail);

        const { signOut } = await import("firebase/auth");
        await signOut(auth);

        result.details.usersEliminated.push(currentEmail);
        result.details.systemsCleaned.push("Firebase Auth");
        console.log("✅ Usuário deslogado do Firebase");
      }
    }

    // Limpar persistência do Firebase Auth
    try {
      const { setPersistence, browserSessionPersistence } = await import(
        "firebase/auth"
      );
      if (auth) {
        await setPersistence(auth, browserSessionPersistence);
        console.log("✅ Persistência do Firebase Auth limpa");
      }
    } catch (error) {
      console.warn("⚠️ Erro ao limpar persistência:", error);
    }
  } catch (error: any) {
    console.warn("⚠️ Erro no Firebase Auth:", error);
    result.details.errors.push(`Firebase Auth: ${error.message}`);
  }
}

async function cleanLocalStorage(result: EliminationResult): Promise<void> {
  console.log("💾 Limpando localStorage...");

  // Buscar todas as chaves que podem conter usuários
  const userKeys = [
    "app-users",
    "mock-users",
    "users",
    "saved-users",
    "currentUser",
    "mock-current-user",
    "savedLoginCredentials",
  ];

  for (const key of userKeys) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsedData = JSON.parse(data);

        if (Array.isArray(parsedData)) {
          // Array de usuários
          const originalLength = parsedData.length;
          const filteredUsers = parsedData.filter((user: any) => {
            const userEmail = user.email?.toLowerCase();
            if (userEmail && TARGET_EMAILS.includes(userEmail)) {
              result.details.usersFound.push(userEmail);
              result.details.usersEliminated.push(userEmail);
              console.log(`🗑️ Removendo ${userEmail} de ${key}`);
              return false; // Remover este usuário
            }
            return true; // Manter outros usuários
          });

          if (filteredUsers.length !== originalLength) {
            localStorage.setItem(key, JSON.stringify(filteredUsers));
            result.details.systemsCleaned.push(`localStorage:${key}`);
            console.log(
              `✅ ${key} limpo: ${originalLength} → ${filteredUsers.length} usuários`,
            );
          }
        } else if (parsedData.email) {
          // Usuário único
          const userEmail = parsedData.email.toLowerCase();
          if (TARGET_EMAILS.includes(userEmail)) {
            result.details.usersFound.push(userEmail);
            result.details.usersEliminated.push(userEmail);
            localStorage.removeItem(key);
            result.details.systemsCleaned.push(`localStorage:${key}`);
            console.log(`🗑️ Removido usuário único ${userEmail} de ${key}`);
          }
        }
      }
    } catch (error: any) {
      console.warn(`⚠️ Erro ao processar ${key}:`, error);
      result.details.errors.push(`localStorage ${key}: ${error.message}`);
    }
  }

  // Limpar também qualquer chave relacionada ao Firebase que possa ter dados dos usuários
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

async function cleanSessionStorage(result: EliminationResult): Promise<void> {
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

async function cleanIndexedDB(result: EliminationResult): Promise<void> {
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
            deleteReq.onblocked = () => resolve(true); // Continue mesmo se bloqueado
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

async function recreateSuperAdmin(result: EliminationResult): Promise<void> {
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
    window.dispatchEvent(new CustomEvent("specificUsersEliminated"));
    console.log("📡 Eventos de limpeza disparados");
  } catch (error) {
    console.warn("⚠️ Erro ao disparar eventos:", error);
  }
}
