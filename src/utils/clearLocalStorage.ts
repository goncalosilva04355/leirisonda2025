/**
 * Utilitário para limpar COMPLETAMENTE o localStorage
 * Parte da implementação de partilha global - nunca mais usar localStorage
 */

export function clearAllLocalStorage(): void {
  console.log("🧹 LIMPANDO LOCALSTORAGE COMPLETAMENTE");
  console.log("❌ LOCALSTORAGE: Nunca mais será usado");

  // Lista de todas as chaves que podem existir
  const keysToRemove = [
    // Dados da aplicação
    "pools",
    "works",
    "maintenance",
    "clients",

    // Dados de utilizadores
    "users",
    "user",
    "currentUser",
    "userSession",

    // Configurações
    "firebase",
    "firebaseConfig",
    "settings",
    "preferences",

    // Estados de sincronização
    "lastSync",
    "syncData",
    "crossUserDataMigrated",
    "lastCrossUserSync",

    // Autenticação
    "auth",
    "authToken",
    "loginData",
    "sessionData",

    // Cache
    "cache",
    "tempData",
    "backup",

    // Flags de sistema
    "quotaExceeded",
    "emergencyShutdown",
    "syncEnabled",
  ];

  // Remover chaves específicas
  keysToRemove.forEach((key) => {
    try {
      localStorage.removeItem(key);
      console.log(`🗑️ Removido: ${key}`);
    } catch (error) {
      console.warn(`⚠️ Erro ao remover ${key}:`, error);
    }
  });

  // Limpar tudo (fallback)
  try {
    localStorage.clear();
    console.log("🧹 localStorage.clear() executado");
  } catch (error) {
    console.warn("⚠️ Erro no localStorage.clear():", error);
  }

  console.log("✅ LOCALSTORAGE COMPLETAMENTE LIMPO");
  console.log("🌐 AGORA APENAS DADOS PARTILHADOS GLOBALMENTE");
}

/**
 * Bloquear tentativas de usar localStorage
 */
export function blockLocalStorageUsage(): void {
  console.log("🚫 BLOQUEANDO USO DE LOCALSTORAGE");

  // Interceptar tentativas de setItem
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key: string, value: string) {
    console.warn(
      `🚫 BLOQUEADO: Tentativa de usar localStorage.setItem('${key}')`,
    );
    console.warn("🌐 USE APENAS: globalDataShare para dados partilhados");

    // Não permitir armazenamento de dados da aplicação
    if (["pools", "works", "maintenance", "clients", "users"].includes(key)) {
      throw new Error(
        `❌ localStorage bloqueado para '${key}' - use globalDataShare`,
      );
    }

    // Permitir apenas dados essenciais do sistema
    if (key.startsWith("system_") || key.startsWith("browser_")) {
      return originalSetItem.call(this, key, value);
    }

    console.warn(`⚠️ localStorage.setItem('${key}') foi ignorado`);
  };

  console.log("✅ localStorage bloqueado para dados da aplicação");
}

/**
 * Inicializar sistema sem localStorage
 */
export function initializeWithoutLocalStorage(): void {
  console.log("🚀 INICIALIZANDO SISTEMA SEM LOCALSTORAGE");

  // Limpar tudo primeiro
  clearAllLocalStorage();

  // Bloquear uso futuro
  blockLocalStorageUsage();

  // Configurar flag global
  window.__GLOBAL_DATA_SHARE_ONLY__ = true;

  console.log("✅ SISTEMA INICIALIZADO: Apenas dados partilhados globalmente");
  console.log("🌐 TODOS OS UTILIZADORES VEEM OS MESMOS DADOS");
}

// Executar automaticamente quando importado
if (typeof window !== "undefined") {
  initializeWithoutLocalStorage();
}
