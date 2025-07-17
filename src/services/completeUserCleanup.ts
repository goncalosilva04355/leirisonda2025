// SERVIÇO LIMPO SEM FIREBASE SDK - USA APENAS REST API E LOCALSTORAGE
import { saveToFirestoreRest, readFromFirestoreRest } from "../utils/firestoreRestApi";

export interface CompleteCleanupResult {
  success: boolean;
  message: string;
  details: {
    localStorageCleared: boolean;
    sessionStorageCleared: boolean;
    cookiesCleared: boolean;
    indexedDBCleared: boolean;
    currentUserLoggedOut: boolean;
    authPersistenceCleared: boolean;
    cacheCleared: boolean;
    totalItemsRemoved: number;
    errors: string[];
  };
}

export interface CleanupAnalysis {
  hasUserData: boolean;
  details: {
    localStorageKeys: string[];
    sessionStorageKeys: string[];
    cookies: string[];
    totalUserData: number;
    authUser: boolean;
    indexedDBDatabases: string[];
  };
}

class CompleteUserCleanupService {
  /**
   * Performs a complete cleanup of all user data and authentication
   * This is the nuclear option - removes EVERYTHING
   */
  async performCompleteCleanup(): Promise<CompleteCleanupResult> {
    console.log("🧹 INICIANDO LIMPEZA COMPLETA DO UTILIZADOR...");

    const result: CompleteCleanupResult = {
      success: false,
      message: "",
      details: {
        localStorageCleared: false,
        sessionStorageCleared: false,
        cookiesCleared: false,
        indexedDBCleared: false,
        currentUserLoggedOut: false,
        authPersistenceCleared: false,
        cacheCleared: false,
        totalItemsRemoved: 0,
        errors: [],
      },
    };

    try {
      // 1. Clear localStorage
      await this.clearLocalStorage(result);

      // 2. Clear sessionStorage
      await this.clearSessionStorage(result);

      // 3. Clear cookies
      await this.clearCookies(result);

      // 4. Clear IndexedDB
      await this.clearIndexedDB(result);

      // 5. Clear caches
      await this.clearCaches(result);

      // 6. Clear mock authentication
      await this.clearMockAuth(result);

      result.success = true;
      result.message = "✅ Limpeza completa realizada com sucesso";

      console.log("✅ LIMPEZA COMPLETA CONCLUÍDA:", result);
      return result;
    } catch (error: any) {
      console.error("❌ ERRO NA LIMPEZA COMPLETA:", error);
      result.message = `❌ Erro na limpeza: ${error.message}`;
      result.details.errors.push(`Complete cleanup error: ${error.message}`);
      return result;
    }
  }

  /**
   * Clears all localStorage data
   */
  private async clearLocalStorage(
    result: CompleteCleanupResult,
  ): Promise<void> {
    try {
      console.log("🧹 Limpando localStorage...");

      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
        result.details.totalItemsRemoved++;
      });

      result.details.localStorageCleared = true;
      console.log(
        `✅ localStorage limpo: ${keysToRemove.length} itens removidos`,
      );
    } catch (error: any) {
      console.error("❌ Erro ao limpar localStorage:", error);
      result.details.errors.push(`localStorage: ${error.message}`);
    }
  }

  /**
   * Clears all sessionStorage data
   */
  private async clearSessionStorage(
    result: CompleteCleanupResult,
  ): Promise<void> {
    try {
      console.log("🧹 Limpando sessionStorage...");

      const keysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        sessionStorage.removeItem(key);
        result.details.totalItemsRemoved++;
      });

      result.details.sessionStorageCleared = true;
      console.log(
        `✅ sessionStorage limpo: ${keysToRemove.length} itens removidos`,
      );
    } catch (error: any) {
      console.error("❌ Erro ao limpar sessionStorage:", error);
      result.details.errors.push(`sessionStorage: ${error.message}`);
    }
  }

  /**
   * Clears browser cookies
   */
  private async clearCookies(result: CompleteCleanupResult): Promise<void> {
    try {
      console.log("🧹 Limpando cookies...");

      const cookies = document.cookie.split(";");
      let cookiesCleared = 0;

      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          // Clear cookie for all possible domains and paths
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
          cookiesCleared++;
          result.details.totalItemsRemoved++;
        }
      });

      result.details.cookiesCleared = true;
      console.log(`✅ Cookies limpos: ${cookiesCleared} cookies removidos`);
    } catch (error: any) {
      console.error("❌ Erro ao limpar cookies:", error);
      result.details.errors.push(`Cookies: ${error.message}`);
    }
  }

  /**
   * Clears IndexedDB databases
   */
  private async clearIndexedDB(result: CompleteCleanupResult): Promise<void> {
    try {
      console.log("🧹 Limpando IndexedDB...");

      if ("indexedDB" in window) {
        const databases = await indexedDB.databases();
        let dbsCleared = 0;

        for (const db of databases) {
          if (db.name) {
            try {
              const deleteRequest = indexedDB.deleteDatabase(db.name);
              await new Promise((resolve, reject) => {
                deleteRequest.onsuccess = () => resolve(void 0);
                deleteRequest.onerror = () => reject(deleteRequest.error);
              });
              dbsCleared++;
              result.details.totalItemsRemoved++;
              console.log(`✅ IndexedDB eliminado: ${db.name}`);
            } catch (dbError) {
              console.warn(`⚠️ Erro ao eliminar DB ${db.name}:`, dbError);
            }
          }
        }

        result.details.indexedDBCleared = true;
        console.log(`✅ IndexedDB limpo: ${dbsCleared} databases removidas`);
      }
    } catch (error: any) {
      console.error("❌ Erro ao limpar IndexedDB:", error);
      result.details.errors.push(`IndexedDB: ${error.message}`);
    }
  }

  /**
   * Clears browser caches
   */
  private async clearCaches(result: CompleteCleanupResult): Promise<void> {
    try {
      console.log("🧹 Limpando caches...");

      if ("caches" in window) {
        const cacheNames = await caches.keys();
        let cachesCleared = 0;

        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          cachesCleared++;
          result.details.totalItemsRemoved++;
          console.log(`✅ Cache eliminado: ${cacheName}`);
        }

        result.details.cacheCleared = true;
        console.log(`✅ Caches limpos: ${cachesCleared} caches removidos`);
      }
    } catch (error: any) {
      console.error("❌ Erro ao limpar caches:", error);
      result.details.errors.push(`Caches: ${error.message}`);
    }
  }

  /**
   * Clear mock authentication data
   */
  private async clearMockAuth(result: CompleteCleanupResult): Promise<void> {
    try {
      console.log("🧹 Limpando autenticação mock...");

      // Clear any remaining auth-related data
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userCredentials");
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      
      result.details.currentUserLoggedOut = true;
      result.details.authPersistenceCleared = true;
      
      console.log("✅ Autenticação mock limpa");
    } catch (error: any) {
      console.error("❌ Erro ao limpar autenticação mock:", error);
      result.details.errors.push(`Mock Auth: ${error.message}`);
    }
  }

  /**
   * Analyzes what user data exists before cleanup
   */
  async analyzeUserData(): Promise<CleanupAnalysis> {
    console.log("🔍 Analisando dados do utilizador...");

    const analysis: CleanupAnalysis = {
      hasUserData: false,
      details: {
        localStorageKeys: [],
        sessionStorageKeys: [],
        cookies: [],
        totalUserData: 0,
        authUser: false,
        indexedDBDatabases: [] as string[],
      },
    };

    try {
      // Check localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          analysis.details.localStorageKeys.push(key);
        }
      }

      // Check sessionStorage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          analysis.details.sessionStorageKeys.push(key);
        }
      }

      // Check cookies
      if (document.cookie) {
        analysis.details.cookies = document.cookie
          .split(";")
          .map((cookie) => cookie.split("=")[0].trim())
          .filter(Boolean);
      }

      // Check IndexedDB
      if ("indexedDB" in window) {
        try {
          const databases = await indexedDB.databases();
          analysis.details.indexedDBDatabases = databases
            .map((db) => db.name)
            .filter(Boolean) as string[];
        } catch (error) {
          console.warn("⚠️ Não foi possível listar IndexedDB databases");
        }
      }

      // Check for user-related data
      const userDataKeys = analysis.details.localStorageKeys.filter(
        (key) =>
          key.includes("user") ||
          key.includes("auth") ||
          key.includes("login") ||
          key.includes("works") ||
          key.includes("pools") ||
          key.includes("clients") ||
          key.includes("maintenance") ||
          key === "app-users" ||
          key === "currentUser" ||
          key === "isAuthenticated" ||
          key === "savedLoginCredentials" ||
          key.startsWith("firestore"),
      );

      analysis.details.totalUserData =
        userDataKeys.length +
        analysis.details.sessionStorageKeys.length +
        analysis.details.cookies.length +
        analysis.details.indexedDBDatabases.length;

      analysis.hasUserData = analysis.details.totalUserData > 0;

      console.log("🔍 Análise completa:", analysis);
      return analysis;
    } catch (error: any) {
      console.error("❌ Erro na análise:", error);
      return analysis;
    }
  }

  /**
   * Quick check if there's still user data after cleanup
   */
  async verifyCleanup(): Promise<boolean> {
    try {
      const analysis = await this.analyzeUserData();
      const stillHasData = analysis.hasUserData;

      if (stillHasData) {
        console.warn("⚠️ Ainda existem dados após limpeza:", analysis.details);
        return false;
      } else {
        console.log("✅ Limpeza verificada - nenhum dado restante");
        return true;
      }
    } catch (error: any) {
      console.error("❌ Erro na verificação:", error);
      return false;
    }
  }
}

  /**
   * Nuclear cleanup - alias for performCompleteCleanup
   */
  async nuclearUserCleanup(): Promise<CompleteCleanupResult> {
    return this.performCompleteCleanup();
  }
}

export const completeUserCleanupService = new CompleteUserCleanupService();