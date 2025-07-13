/**
 * Utility to clean all Firebase data from localStorage
 * Removes all data related to Firebase and authentication
 */

export function cleanAllFirebaseData(): {
  removed: string[];
  errors: string[];
} {
  const removed: string[] = [];
  const errors: string[] = [];

  console.log("🧹 Iniciando limpeza completa dos dados Firebase...");

  try {
    // Lista de chaves conhecidas do Firebase e dados relacionados
    const firebaseKeys = [
      "firebase-config",
      "firebase-auth-token",
      "firebase-user",
      "firebase-settings",
      "mock-current-user",
      "currentUser",
      "authUser",
      "user-session",
      "firebase-persistence",
      "firebase-heartbeat-store",
      "firebase-installations-store",
    ];

    // Remover chaves específicas conhecidas
    firebaseKeys.forEach((key) => {
      try {
        if (localStorage.getItem(key) !== null) {
          localStorage.removeItem(key);
          removed.push(key);
          console.log(`🗑️ Removida chave: ${key}`);
        }
      } catch (error) {
        errors.push(`Erro ao remover ${key}: ${error}`);
        console.warn(`⚠️ Erro ao remover ${key}:`, error);
      }
    });

    // Procurar e remover todas as chaves que contenham "firebase", "auth", ou "AIza"
    const allKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        allKeys.push(key);
      }
    }

    allKeys.forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("firebase") ||
        lowerKey.includes("firestore") ||
        lowerKey.includes("auth") ||
        lowerKey.includes("aiza") ||
        key.startsWith("firebase:") ||
        key.startsWith("_firebase")
      ) {
        try {
          localStorage.removeItem(key);
          removed.push(key);
          console.log(`🗑️ Removida chave relacionada: ${key}`);
        } catch (error) {
          errors.push(`Erro ao remover ${key}: ${error}`);
          console.warn(`⚠️ Erro ao remover ${key}:`, error);
        }
      }
    });

    // Limpar também sessionStorage
    try {
      const sessionKeys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          sessionKeys.push(key);
        }
      }

      sessionKeys.forEach((key) => {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes("firebase") ||
          lowerKey.includes("firestore") ||
          lowerKey.includes("auth") ||
          lowerKey.includes("aiza")
        ) {
          try {
            sessionStorage.removeItem(key);
            removed.push(`sessionStorage:${key}`);
            console.log(`🗑️ Removida do sessionStorage: ${key}`);
          } catch (error) {
            errors.push(`Erro ao remover do sessionStorage ${key}: ${error}`);
          }
        }
      });
    } catch (error) {
      errors.push(`Erro ao limpar sessionStorage: ${error}`);
    }

    console.log(`✅ Limpeza concluída: ${removed.length} chaves removidas`);

    if (errors.length > 0) {
      console.warn(`⚠️ ${errors.length} erros durante a limpeza:`, errors);
    }

    return { removed, errors };
  } catch (error) {
    console.error("❌ Erro fatal durante limpeza:", error);
    errors.push(`Erro fatal: ${error}`);
    return { removed, errors };
  }
}

/**
 * Clean only specific Firebase authentication data
 */
export function cleanFirebaseAuthData(): {
  removed: string[];
  errors: string[];
} {
  const removed: string[] = [];
  const errors: string[] = [];

  console.log("🧹 Limpando dados de autenticação Firebase...");

  const authKeys = [
    "firebase-auth-token",
    "firebase-user",
    "authUser",
    "currentUser",
    "mock-current-user",
    "user-session",
  ];

  authKeys.forEach((key) => {
    try {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        removed.push(key);
        console.log(`🗑️ Removida chave de auth: ${key}`);
      }
    } catch (error) {
      errors.push(`Erro ao remover ${key}: ${error}`);
    }
  });

  return { removed, errors };
}

/**
 * Get a summary of all Firebase-related data currently stored
 */
export function getFirebaseDataSummary(): {
  found: string[];
  count: number;
} {
  const found: string[] = [];

  try {
    // Check localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes("firebase") ||
          lowerKey.includes("firestore") ||
          lowerKey.includes("auth") ||
          lowerKey.includes("aiza") ||
          key.startsWith("firebase:") ||
          key.startsWith("_firebase")
        ) {
          found.push(`localStorage:${key}`);
        }
      }
    }

    // Check sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes("firebase") ||
          lowerKey.includes("firestore") ||
          lowerKey.includes("auth") ||
          lowerKey.includes("aiza")
        ) {
          found.push(`sessionStorage:${key}`);
        }
      }
    }
  } catch (error) {
    console.warn("Erro ao verificar dados Firebase:", error);
  }

  return {
    found,
    count: found.length,
  };
}
