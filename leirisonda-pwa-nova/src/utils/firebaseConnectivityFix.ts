/**
 * Diagnóstico e correção completa de conectividade Firebase
 * Resolve problemas de sync, auth e regras
 */

export class FirebaseConnectivityFix {
  /**
   * Diagnóstico completo de conectividade
   */
  static async runDiagnostic(): Promise<{
    status: "success" | "warning" | "error";
    issues: string[];
    fixes: string[];
    recommendations: string[];
  }> {
    console.log("🔍 INICIANDO DIAGNÓSTICO COMPLETO DE CONECTIVIDADE");

    const issues: string[] = [];
    const fixes: string[] = [];
    const recommendations: string[] = [];

    try {
      // 1. Verificar conectividade básica
      const networkTest = await this.testNetworkConnectivity();
      if (!networkTest.success) {
        issues.push("❌ Problema de rede básica");
        fixes.push("🌐 Verificar conexão à internet");
      }

      // 2. Verificar Firebase Services
      const firebaseTest = await this.testFirebaseServices();
      if (!firebaseTest.success) {
        issues.push("❌ Firebase Services não disponíveis");
        fixes.push("🔥 Reinicializar Firebase");
      }

      // 3. Verificar autenticação
      const authTest = await this.testAuthentication();
      if (!authTest.success) {
        issues.push("❌ Problema de autenticação");
        fixes.push("🔐 Corrigir autenticação");
      }

      // 4. Verificar regras Firestore
      const rulesTest = await this.testFirestoreRules();
      if (!rulesTest.success) {
        issues.push("❌ Regras Firestore bloqueando acesso");
        fixes.push("📋 Atualizar regras Firestore");
      }

      // 5. Determinar status geral
      let status: "success" | "warning" | "error" = "success";
      if (issues.length > 2) {
        status = "error";
      } else if (issues.length > 0) {
        status = "warning";
      }

      // 6. Gerar recomendações
      if (issues.length === 0) {
        recommendations.push("✅ Sistema funcionando corretamente");
      } else {
        recommendations.push("🔧 Aplicar correções sugeridas");
        recommendations.push("⏰ Aguardar 2-3 minutos após aplicar correções");
        recommendations.push("🔄 Fazer refresh da página após correções");
      }

      return {
        status,
        issues,
        fixes,
        recommendations,
      };
    } catch (error: any) {
      console.error("❌ Erro no diagnóstico:", error);
      return {
        status: "error",
        issues: [`❌ Erro no diagnóstico: ${error.message}`],
        fixes: ["🔧 Executar correção de emergência"],
        recommendations: ["⚠️ Contactar suporte se o problema persistir"],
      };
    }
  }

  /**
   * Teste de conectividade de rede básica
   */
  private static async testNetworkConnectivity(): Promise<{
    success: boolean;
    details: string;
  }> {
    try {
      // Verificar se navigator.onLine está true
      if (!navigator.onLine) {
        return { success: false, details: "Dispositivo offline" };
      }

      // Tentar fetch a um serviço externo
      const response = await fetch("https://www.google.com/favicon.ico", {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-cache",
      });

      return { success: true, details: "Conectividade OK" };
    } catch (error: any) {
      return { success: false, details: `Erro de rede: ${error.message}` };
    }
  }

  /**
   * Teste de serviços Firebase
   */
  private static async testFirebaseServices(): Promise<{
    success: boolean;
    details: string;
  }> {
    try {
      const { getDB, getAuthService } = await import("../firebase/config");

      // Testar Firestore
      const db = await getDB();
      if (!db) {
        return { success: false, details: "Firestore não inicializado" };
      }

      // Testar Auth
      const auth = await getAuthService();
      if (!auth) {
        return { success: false, details: "Firebase Auth não inicializado" };
      }

      return { success: true, details: "Firebase Services OK" };
    } catch (error: any) {
      return { success: false, details: `Erro Firebase: ${error.message}` };
    }
  }

  /**
   * Teste de autenticação
   */
  private static async testAuthentication(): Promise<{
    success: boolean;
    details: string;
  }> {
    try {
      const { authService } = await import("../services/authService");

      // Verificar se há um usuário logado
      const currentUser = await authService.getCurrentUserProfile();

      if (!currentUser) {
        return { success: false, details: "Nenhum usuário autenticado" };
      }

      return {
        success: true,
        details: `Usuário autenticado: ${currentUser.name}`,
      };
    } catch (error: any) {
      return { success: false, details: `Erro autenticação: ${error.message}` };
    }
  }

  /**
   * Teste de regras Firestore
   */
  private static async testFirestoreRules(): Promise<{
    success: boolean;
    details: string;
  }> {
    try {
      const { getDB } = await import("../firebase/config");
      const db = await getDB();

      if (!db) {
        return { success: false, details: "Firestore não disponível" };
      }

      const { doc, getDoc, setDoc, deleteDoc } = await import(
        "firebase/firestore"
      );

      // Teste de leitura
      try {
        const testDoc = doc(db, "__test__", "connectivity-test");
        await getDoc(testDoc);
      } catch (readError: any) {
        if (readError.code === "permission-denied") {
          return { success: false, details: "Regras bloqueando leitura" };
        }
      }

      // Teste de escrita
      try {
        const testDoc = doc(db, "__test__", "connectivity-test");
        await setDoc(testDoc, {
          test: true,
          timestamp: new Date().toISOString(),
        });

        // Limpar documento de teste
        await deleteDoc(testDoc);
      } catch (writeError: any) {
        if (writeError.code === "permission-denied") {
          return { success: false, details: "Regras bloqueando escrita" };
        }
      }

      return { success: true, details: "Regras Firestore OK" };
    } catch (error: any) {
      return { success: false, details: `Erro regras: ${error.message}` };
    }
  }

  /**
   * Aplicar correções automáticas
   */
  static async applyAutomaticFixes(): Promise<{
    success: boolean;
    message: string;
  }> {
    console.log("🔧 APLICANDO CORREÇÕES AUTOMÁTICAS...");

    try {
      // 1. Reinicializar Firebase
      await this.reinitializeFirebase();

      // 2. Limpar cache problemático
      await this.clearProblematicCache();

      // 3. Forçar nova conexão
      await this.forceNewConnection();

      return {
        success: true,
        message: "✅ Correções aplicadas com sucesso! Faça refresh da página.",
      };
    } catch (error: any) {
      console.error("❌ Erro ao aplicar correções:", error);
      return {
        success: false,
        message: `❌ Erro ao aplicar correções: ${error.message}`,
      };
    }
  }

  /**
   * Reinicializar Firebase
   */
  private static async reinitializeFirebase(): Promise<void> {
    try {
      const { reinitializeFirebase } = await import("../firebase/config");
      await reinitializeFirebase();
      console.log("✅ Firebase reinicializado");
    } catch (error) {
      console.warn("⚠️ Erro ao reinicializar Firebase:", error);
    }
  }

  /**
   * Limpar cache problemático
   */
  private static async clearProblematicCache(): Promise<void> {
    try {
      // Limpar apenas sessionStorage (manter localStorage para dados)
      sessionStorage.clear();

      // Limpar cache específico do Firebase
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          if (
            cacheName.includes("firebase") ||
            cacheName.includes("firestore")
          ) {
            await caches.delete(cacheName);
          }
        }
      }

      console.log("✅ Cache problemático limpo");
    } catch (error) {
      console.warn("⚠️ Erro ao limpar cache:", error);
    }
  }

  /**
   * Forçar nova conexão
   */
  private static async forceNewConnection(): Promise<void> {
    try {
      // Forçar desconexão e reconexão
      const { getDB } = await import("../firebase/config");
      const db = await getDB();

      if (db) {
        const { disableNetwork, enableNetwork } = await import(
          "firebase/firestore"
        );

        // Desconectar temporariamente
        await disableNetwork(db);

        // Aguardar um pouco
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Reconectar
        await enableNetwork(db);

        console.log("✅ Nova conexão forçada");
      }
    } catch (error) {
      console.warn("⚠️ Erro ao forçar nova conexão:", error);
    }
  }

  /**
   * Verificação rápida de status
   */
  static async quickStatusCheck(): Promise<{
    isOnline: boolean;
    firebaseReady: boolean;
    userAuthenticated: boolean;
    canReadFirestore: boolean;
    canWriteFirestore: boolean;
  }> {
    const status = {
      isOnline: navigator.onLine,
      firebaseReady: false,
      userAuthenticated: false,
      canReadFirestore: false,
      canWriteFirestore: false,
    };

    try {
      // Verificar Firebase
      const { isFirebaseReady } = await import("../firebase/config");
      status.firebaseReady = isFirebaseReady();

      // Verificar autenticação
      const { authService } = await import("../services/authService");
      const currentUser = await authService.getCurrentUserProfile();
      status.userAuthenticated = !!currentUser;

      // Verificar Firestore (se possível)
      if (status.firebaseReady && status.userAuthenticated) {
        const rulesTest = await this.testFirestoreRules();
        status.canReadFirestore = rulesTest.success;
        status.canWriteFirestore = rulesTest.success;
      }
    } catch (error) {
      console.warn("Erro na verificação rápida:", error);
    }

    return status;
  }
}
