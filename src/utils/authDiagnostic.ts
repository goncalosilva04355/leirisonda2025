// Utilitário para diagnosticar e corrigir problemas de autenticação

export interface AuthDiagnosticResult {
  status: "success" | "warning" | "error";
  message: string;
  details?: string;
  fix?: () => Promise<void>;
}

export class AuthDiagnostic {
  static async runFullDiagnostic(): Promise<AuthDiagnosticResult[]> {
    const results: AuthDiagnosticResult[] = [];

    // 1. Verificar localStorage
    try {
      localStorage.setItem("__test__", "test");
      localStorage.removeItem("__test__");
      results.push({
        status: "success",
        message: "localStorage disponível e funcional",
      });
    } catch (error: any) {
      results.push({
        status: "error",
        message: "localStorage não disponível",
        details: error.message,
        fix: async () => {
          console.warn(
            "localStorage não está disponível. Verificar modo privado ou configurações do navegador.",
          );
        },
      });
    }

    // 2. Verificar dados de autenticação existentes
    try {
      const currentUser = localStorage.getItem("currentUser");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (currentUser && isAuthenticated === "true") {
        const user = JSON.parse(currentUser);
        results.push({
          status: "success",
          message: `Usuário autenticado encontrado: ${user.email}`,
          details: `Role: ${user.role}, Ativo: ${user.active}`,
        });
      } else {
        results.push({
          status: "warning",
          message: "Nenhum usuário autenticado encontrado",
          fix: async () => {
            // Limpar dados inválidos
            localStorage.removeItem("currentUser");
            localStorage.removeItem("isAuthenticated");
          },
        });
      }
    } catch (error: any) {
      results.push({
        status: "error",
        message: "Erro ao verificar dados de autenticação",
        details: error.message,
        fix: async () => {
          localStorage.removeItem("currentUser");
          localStorage.removeItem("isAuthenticated");
        },
      });
    }

    // 3. Verificar serviço de autenticação
    try {
      const { authServiceWrapperSafe } = await import(
        "../services/authServiceWrapperSafe"
      );
      const authorizedEmails = authServiceWrapperSafe.getAuthorizedEmails();

      results.push({
        status: "success",
        message: `Serviço de autenticação carregado. Emails autorizados: ${authorizedEmails.join(", ")}`,
      });
    } catch (error: any) {
      results.push({
        status: "error",
        message: "Erro ao carregar serviço de autenticação",
        details: error.message,
      });
    }

    // 4. Verificar Firebase (não crítico)
    try {
      const { isFirebaseReady } = await import("../firebase/leiriaConfig");
      const firebaseReady = isFirebaseReady();

      if (firebaseReady) {
        results.push({
          status: "success",
          message: "Firebase inicializado e funcional",
        });
      } else {
        results.push({
          status: "warning",
          message: "Firebase não inicializado (normal antes do login)",
          details: "Firebase será inicializado após login bem-sucedido",
        });
      }
    } catch (error: any) {
      results.push({
        status: "warning",
        message: "Firebase não disponível",
        details: "Aplicação funcionará apenas com localStorage",
        fix: async () => {
          console.log("Firebase não disponível - modo offline ativo");
        },
      });
    }

    return results;
  }

  static async fixAllIssues(): Promise<boolean> {
    console.log(
      "🔧 Iniciando correção automática de problemas de autenticação...",
    );

    try {
      const results = await this.runFullDiagnostic();
      let fixesApplied = 0;

      for (const result of results) {
        if (
          result.fix &&
          (result.status === "error" || result.status === "warning")
        ) {
          try {
            await result.fix();
            fixesApplied++;
            console.log(`✅ Correção aplicada: ${result.message}`);
          } catch (error) {
            console.error(`❌ Falha na correção: ${result.message}`, error);
          }
        }
      }

      console.log(`🎉 Correção completa: ${fixesApplied} correções aplicadas`);
      return fixesApplied > 0;
    } catch (error) {
      console.error("�� Erro durante correção automática:", error);
      return false;
    }
  }

  static async testLogin(
    email: string = "gongonsilva@gmail.com",
    password: string = "123456",
  ): Promise<boolean> {
    try {
      console.log(`🧪 Testando login: ${email}`);

      const { authServiceWrapperSafe } = await import(
        "../services/authServiceWrapperSafe"
      );
      const result = await authServiceWrapperSafe.login(email, password, false);

      if (result.success) {
        console.log("✅ Teste de login bem-sucedido");
        return true;
      } else {
        console.error("❌ Teste de login falhou:", result.error);
        return false;
      }
    } catch (error) {
      console.error("❌ Erro no teste de login:", error);
      return false;
    }
  }

  static async emergencyReset(): Promise<void> {
    console.log("🚨 Iniciando reset de emergência...");

    try {
      // Limpar todos os dados de autenticação
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("rememberMe");
      sessionStorage.removeItem("savedLoginCredentials");

      // Limpar dados temporários
      localStorage.removeItem("firebase-quota-exceeded");
      localStorage.removeItem("firebase-emergency-shutdown");

      console.log("✅ Reset de emergência completo");
    } catch (error) {
      console.error("❌ Erro no reset de emergência:", error);
    }
  }
}

// Executar diagnóstico automático na inicialização
if (typeof window !== "undefined") {
  window.addEventListener("load", async () => {
    try {
      console.log("🔍 Executando diagnóstico automático de autenticação...");
      const results = await AuthDiagnostic.runFullDiagnostic();

      const errors = results.filter((r) => r.status === "error");
      const warnings = results.filter((r) => r.status === "warning");

      if (errors.length > 0) {
        console.warn(`⚠️ ${errors.length} erros de autenticação detectados`);
        // Tentar correção automática
        await AuthDiagnostic.fixAllIssues();
      } else if (warnings.length > 0) {
        console.log(
          `💡 ${warnings.length} avisos de autenticação (não críticos)`,
        );
      } else {
        console.log("✅ Sistema de autenticação está funcionando corretamente");
      }
    } catch (error) {
      console.error("❌ Erro no diagnóstico automático:", error);
    }
  });
}

export default AuthDiagnostic;
