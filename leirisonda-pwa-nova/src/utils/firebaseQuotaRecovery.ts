/**
 * Firebase Quota Recovery Utility
 *
 * Este utilitário permite recuperar operações do Firebase que foram
 * bloqueadas devido a proteções de quota excedida.
 */

export class FirebaseQuotaRecovery {
  private static readonly QUOTA_FLAGS = [
    "firebase-quota-exceeded",
    "firebase-quota-check-time",
    "firebase-emergency-shutdown",
    "firebase-emergency-time",
    "firebase-circuit-breaker",
    "firebase-quota-cooldown",
  ];

  /**
   * Verifica se há flags de quota ativas que estão bloqueando o Firebase
   */
  static checkQuotaStatus(): {
    isBlocked: boolean;
    blockedFlags: string[];
    hoursUntilRecovery?: number;
    recommendation: string;
  } {
    const blockedFlags: string[] = [];
    let hoursUntilRecovery: number | undefined;

    for (const flag of this.QUOTA_FLAGS) {
      const value = localStorage.getItem(flag);
      if (value === "true" || value) {
        blockedFlags.push(flag);
      }
    }

    // Calcular tempo até recuperação se quota foi excedida
    const quotaCheckTime = localStorage.getItem("firebase-quota-check-time");
    if (quotaCheckTime) {
      const lastCheck = new Date(quotaCheckTime);
      const now = new Date();
      const hoursElapsed =
        (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);
      hoursUntilRecovery = Math.max(0, 24 - hoursElapsed);
    }

    const isBlocked = blockedFlags.length > 0;

    let recommendation = "Firebase operações normais";
    if (isBlocked) {
      if (hoursUntilRecovery && hoursUntilRecovery > 0) {
        recommendation = `Aguardar ${hoursUntilRecovery.toFixed(1)} horas ou limpar flags manualmente`;
      } else {
        recommendation = "Limpar flags de quota para reativar Firebase";
      }
    }

    return {
      isBlocked,
      blockedFlags,
      hoursUntilRecovery,
      recommendation,
    };
  }

  /**
   * Limpa todas as flags de quota e reativa o Firebase
   */
  static clearAllQuotaFlags(): void {
    console.log("🧹 Limpando todas as flags de quota do Firebase...");

    for (const flag of this.QUOTA_FLAGS) {
      localStorage.removeItem(flag);
    }

    // Resetar contadores no syncManager se existir
    if (typeof window !== "undefined" && (window as any).syncManager) {
      const syncManager = (window as any).syncManager;
      syncManager.quotaErrorCount = 0;
      syncManager.circuitBreakerOpen = false;
      syncManager.lastQuotaError = null;
    }

    console.log("✅ Todas as flags de quota foram removidas");
    console.log("🔄 Firebase deve estar reativado agora");
  }

  /**
   * Recuperação manual do Firebase com confirmação
   */
  static manualRecovery(): boolean {
    const status = this.checkQuotaStatus();

    if (!status.isBlocked) {
      console.log("✅ Firebase já está ativo - nenhuma recuperação necessária");
      return true;
    }

    const confirm = window.confirm(
      `🔄 RECUPERAÇÃO DO FIREBASE\n\n` +
        `Flags bloqueadas: ${status.blockedFlags.join(", ")}\n` +
        `Recomendação: ${status.recommendation}\n\n` +
        `Continuar com a recuperação manual?`,
    );

    if (confirm) {
      this.clearAllQuotaFlags();

      // Forçar refresh da página para recarregar configurações
      const shouldRefresh = window.confirm(
        "✅ Flags removidas!\n\nRefrescar a página para aplicar mudanças?",
      );

      if (shouldRefresh) {
        window.location.reload();
      }

      return true;
    }

    return false;
  }

  /**
   * Recuperação automática segura
   */
  static autoRecovery(): boolean {
    const status = this.checkQuotaStatus();

    if (!status.isBlocked) {
      return true;
    }

    // Se passou tempo suficiente desde o último erro de quota
    if (
      status.hoursUntilRecovery !== undefined &&
      status.hoursUntilRecovery <= 0
    ) {
      console.log(
        "⏰ Tempo de cooldown expirou - recuperando automaticamente...",
      );
      this.clearAllQuotaFlags();
      return true;
    }

    // Se não há flags críticas de emergência, pode tentar recuperar
    const hasCriticalFlags = status.blockedFlags.some(
      (flag) => flag.includes("emergency") || flag.includes("circuit-breaker"),
    );

    if (!hasCriticalFlags) {
      console.log(
        "🔄 Nenhuma flag crítica detectada - recuperando automaticamente...",
      );
      this.clearAllQuotaFlags();
      return true;
    }

    console.log("⚠️ Flags críticas presentes - recuperação manual necessária");
    return false;
  }

  /**
   * Diagnosticar problemas de quota em detalhes
   */
  static diagnoseQuotaIssues(): void {
    console.group("🔍 DIAGNÓSTICO DE QUOTA FIREBASE");

    const status = this.checkQuotaStatus();
    console.log("Status geral:", status);

    // Mostrar todos os itens do localStorage relacionados ao Firebase
    const firebaseItems: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes("firebase")) {
        firebaseItems[key] = localStorage.getItem(key);
      }
    }

    console.log("Itens Firebase no localStorage:", firebaseItems);

    // Verificar variáveis de ambiente
    console.log("Variáveis de ambiente:", {
      NETLIFY: import.meta.env.NETLIFY,
      VITE_IS_NETLIFY: import.meta.env.VITE_IS_NETLIFY,
      VITE_FORCE_FIREBASE: import.meta.env.VITE_FORCE_FIREBASE,
      DEV: import.meta.env.DEV,
    });

    console.groupEnd();
  }

  /**
   * Monitorar status de quota em tempo real
   */
  static startQuotaMonitoring(intervalMs: number = 30000): () => void {
    console.log("📊 Iniciando monitoramento de quota Firebase...");

    const checkAndReport = () => {
      const status = this.checkQuotaStatus();
      if (status.isBlocked) {
        console.warn("⚠️ Firebase bloqueado por quota:", status);
      }
    };

    // Verificação inicial
    checkAndReport();

    // Verificação periódica
    const interval = setInterval(checkAndReport, intervalMs);

    // Retorna função para parar o monitoramento
    return () => {
      clearInterval(interval);
      console.log("🛑 Monitoramento de quota parado");
    };
  }
}

// Exportar função de recuperação rápida
export const recoverFirebaseQuota = () =>
  FirebaseQuotaRecovery.manualRecovery();

// Exportar função de diagnóstico rápido
export const diagnoseFirebase = () =>
  FirebaseQuotaRecovery.diagnoseQuotaIssues();

// Auto-recovery na inicialização se não há flags críticas
export const autoRecoverOnInit = () => {
  console.log("🚀 Verificando se Firebase precisa de recuperação...");
  const recovered = FirebaseQuotaRecovery.autoRecovery();

  if (recovered) {
    console.log("✅ Firebase recuperado com sucesso");
  } else {
    console.log("⚠️ Firebase precisa de recuperação manual");
    console.log("💡 Use recoverFirebaseQuota() para recuperar manualmente");
  }

  return recovered;
};

export default FirebaseQuotaRecovery;
