/**
 * Correção rápida para problemas Firebase em dispositivos móveis
 * Resolve conflitos de autenticação e problemas de quota
 */

export const mobileFirebaseQuickFix = {
  /**
   * Detecta se há problemas Firebase no dispositivo móvel
   */
  detectProblems(): boolean {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return false;

    // Verificar flags de problema
    const hasQuotaIssues =
      localStorage.getItem("firebase-quota-exceeded") === "true";
    const hasEmergencyShutdown =
      localStorage.getItem("firebase-emergency-shutdown") === "true";

    // Verificar múltiplos iframes Firebase
    const firebaseIframes = document.querySelectorAll(
      'iframe[src*="firebaseapp.com"]',
    );
    const hasMultipleProjects = firebaseIframes.length > 1;

    // Verificar conflitos de domínio
    const hasConflictingDomains = Array.from(firebaseIframes).some((iframe) => {
      const src = iframe.getAttribute("src") || "";
      return (
        (src.includes("leiria-1cfc9") && src.includes("leirisonda-16f8b")) ||
        (document.querySelector('iframe[src*="leiria-1cfc9"]') &&
          document.querySelector('iframe[src*="leirisonda-16f8b"]'))
      );
    });

    console.log("📱 Firebase mobile diagnostic:", {
      isMobile,
      hasQuotaIssues,
      hasEmergencyShutdown,
      hasMultipleProjects,
      hasConflictingDomains,
      totalIframes: firebaseIframes.length,
    });

    return (
      hasQuotaIssues ||
      hasEmergencyShutdown ||
      hasMultipleProjects ||
      hasConflictingDomains
    );
  },

  /**
   * Aplica correção rápida para problemas Firebase mobile
   */
  applyQuickFix(): { success: boolean; message: string } {
    try {
      console.log("🔧 Aplicando correção rápida Firebase mobile...");

      // 1. Limpar todas as flags de proteção/erro
      const flagsToRemove = [
        "firebase-quota-exceeded",
        "firebase-quota-check-time",
        "firebase-emergency-shutdown",
        "firebase-circuit-breaker",
        "firebase-conflict-detected",
        "firebase-auth-error",
        "firebase-persistence-error",
      ];

      flagsToRemove.forEach((flag) => {
        localStorage.removeItem(flag);
      });

      // 2. Remover iframes Firebase duplicados
      const firebaseIframes = document.querySelectorAll(
        'iframe[src*="firebaseapp.com"]',
      );
      let removedCount = 0;

      // Manter apenas o primeiro iframe (projeto principal)
      for (let i = 1; i < firebaseIframes.length; i++) {
        firebaseIframes[i].remove();
        removedCount++;
      }

      // 3. Limpar cache Firebase no sessionStorage
      Object.keys(sessionStorage).forEach((key) => {
        if (key.includes("firebase") || key.includes("auth")) {
          sessionStorage.removeItem(key);
        }
      });

      // 4. Configurar modo móvel otimizado
      localStorage.setItem("mobile-optimized", "true");
      localStorage.setItem("firebase-mobile-mode", "enabled");
      localStorage.setItem("mobile-fix-applied", new Date().toISOString());

      // 5. Disparar evento para notificar componentes
      window.dispatchEvent(
        new CustomEvent("mobileFirebaseFixed", {
          detail: {
            timestamp: new Date().toISOString(),
            removedIframes: removedCount,
            flagsRemoved: flagsToRemove.length,
          },
        }),
      );

      console.log("✅ Correção móvel aplicada:", {
        removedIframes: removedCount,
        flagsCleared: flagsToRemove.length,
      });

      return {
        success: true,
        message: `✅ Correção aplicada! ${removedCount} conflitos resolvidos. Agora use password "123".`,
      };
    } catch (error: any) {
      console.error("❌ Erro na correção mobile:", error);
      return {
        success: false,
        message: `❌ Erro: ${error.message}. Tente recarregar a página.`,
      };
    }
  },

  /**
   * Aplica um reset completo para casos extremos
   */
  applyFullReset(): { success: boolean; message: string } {
    try {
      console.log("🚨 Aplicando reset completo Firebase mobile...");

      // Limpar TUDO relacionado com Firebase
      Object.keys(localStorage).forEach((key) => {
        if (
          key.includes("firebase") ||
          key.includes("auth") ||
          key.includes("quota") ||
          key.includes("sync") ||
          key.includes("circuit")
        ) {
          localStorage.removeItem(key);
        }
      });

      // Remover TODOS os iframes
      const allIframes = document.querySelectorAll("iframe");
      let removedCount = 0;
      allIframes.forEach((iframe) => {
        const src = iframe.getAttribute("src") || "";
        if (src.includes("firebase") || src.includes("auth")) {
          iframe.remove();
          removedCount++;
        }
      });

      // Configurar flags de reset
      localStorage.setItem("full-mobile-reset", new Date().toISOString());
      localStorage.setItem("firebase-disabled", "true");
      localStorage.setItem("local-mode-only", "true");

      return {
        success: true,
        message: `🚨 Reset completo! ${removedCount} elementos removidos. Use password "123" para login local.`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `❌ Reset falhou: ${error.message}`,
      };
    }
  },

  /**
   * Utilitário para testar login com password padrão
   */
  testLocalLogin(email: string): {
    email: string;
    password: string;
    hint: string;
  } {
    return {
      email: email || "teste@leirisonda.com",
      password: "123",
      hint: "Use password '123' para qualquer utilizador durante problemas Firebase",
    };
  },
};

export default mobileFirebaseQuickFix;
