// Sincronização automática inteligente que se adapta à estabilidade do Firebase
import { authService } from "./firebaseAuthService";

interface SyncState {
  isFirebaseStable: boolean;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  lastSuccessTime: number;
  autoSyncEnabled: boolean;
  retryDelay: number;
}

class IntelligentFirebaseSyncService {
  private state: SyncState = {
    isFirebaseStable: false,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    lastSuccessTime: 0,
    autoSyncEnabled: false,
    retryDelay: 5000, // Começar com 5 segundos
  };

  private syncInterval: NodeJS.Timeout | null = null;
  private stabilityTestInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startStabilityTesting();
  }

  // Testar estabilidade Firebase de forma inteligente
  private startStabilityTesting(): void {
    console.log("🧠 Iniciando teste de estabilidade Firebase...");

    // Testar estabilidade a cada 60 segundos
    this.stabilityTestInterval = setInterval(() => {
      this.testFirebaseStability();
    }, 60000);

    // Teste inicial após 3 segundos
    setTimeout(() => this.testFirebaseStability(), 3000);
  }

  private async testFirebaseStability(): Promise<void> {
    if (!navigator.onLine) {
      this.markFirebaseUnstable("Offline");
      return;
    }

    try {
      console.log("🔍 Testando estabilidade Firebase...");

      // Teste simples: tentar inicializar sem operações complexas
      const isInitialized = await authService.forceReinitialize();

      if (isInitialized) {
        this.markFirebaseSuccess();
      } else {
        this.markFirebaseFailure("Inicialização falhou");
      }
    } catch (error) {
      this.markFirebaseFailure(`Erro: ${error}`);
    }
  }

  private markFirebaseSuccess(): void {
    this.state.consecutiveSuccesses++;
    this.state.consecutiveFailures = 0;
    this.state.lastSuccessTime = Date.now();
    this.state.retryDelay = Math.max(5000, this.state.retryDelay * 0.8); // Reduzir delay

    // Firebase é considerado estável após 3 sucessos consecutivos
    if (this.state.consecutiveSuccesses >= 3 && !this.state.isFirebaseStable) {
      console.log("✅ Firebase detectado como ESTÁVEL - habilitando auto-sync");
      this.state.isFirebaseStable = true;
      this.enableAutoSync();
    }

    console.log(
      `🟢 Firebase estável: ${this.state.consecutiveSuccesses} sucessos`,
    );
  }

  private markFirebaseFailure(reason: string): void {
    this.state.consecutiveFailures++;
    this.state.consecutiveSuccesses = 0;
    this.state.retryDelay = Math.min(300000, this.state.retryDelay * 1.5); // Aumentar delay, max 5min

    // Firebase é considerado instável após 2 falhas consecutivas
    if (this.state.consecutiveFailures >= 2 && this.state.isFirebaseStable) {
      console.log(
        "⚠️ Firebase detectado como INSTÁVEL - desabilitando auto-sync",
      );
      this.state.isFirebaseStable = false;
      this.disableAutoSync();
    }

    console.log(
      `🔴 Firebase instável: ${reason} (${this.state.consecutiveFailures} falhas)`,
    );
  }

  private enableAutoSync(): void {
    if (this.state.autoSyncEnabled) return;

    console.log("🚀 HABILITANDO sincronização automática!");
    this.state.autoSyncEnabled = true;

    // Iniciar sincronização automática a cada 30 segundos
    this.syncInterval = setInterval(() => {
      this.performIntelligentSync();
    }, 30000);

    // Sincronização inicial
    setTimeout(() => this.performIntelligentSync(), 2000);
  }

  private disableAutoSync(): void {
    if (!this.state.autoSyncEnabled) return;

    console.log(
      "⏸️ DESABILITANDO sincronização automática (Firebase instável)",
    );
    this.state.autoSyncEnabled = false;

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private async performIntelligentSync(): Promise<void> {
    if (!this.state.isFirebaseStable || !navigator.onLine) {
      return;
    }

    try {
      console.log("🔄 Sincronização automática inteligente iniciando...");

      // Importar serviços dinamicamente para evitar dependências circulares
      const { hybridDataSync } = await import("./hybridDataSync");
      const { robustLoginService } = await import("./robustLoginService");

      // Verificar se há utilizador logado
      const currentUser = robustLoginService.getCurrentUser();
      if (!currentUser) {
        console.log("ℹ️ Sem utilizador logado - sync cancelado");
        return;
      }

      // Tentar sincronização
      await hybridDataSync.performBackgroundSync();

      this.markFirebaseSuccess();
      console.log("✅ Sincronização automática concluída");
    } catch (error) {
      console.warn("⚠️ Erro na sincronização automática:", error);
      this.markFirebaseFailure(`Sync error: ${error}`);
    }
  }

  // API pública para forçar sincronização
  async forceSyncIfStable(): Promise<{ success: boolean; message: string }> {
    if (!navigator.onLine) {
      return { success: false, message: "Sem conexão à internet" };
    }

    if (!this.state.isFirebaseStable) {
      return {
        success: false,
        message: "Firebase instável. Aguardando estabilização...",
      };
    }

    try {
      await this.performIntelligentSync();
      return { success: true, message: "Sincronização manual concluída" };
    } catch (error) {
      return {
        success: false,
        message: "Erro na sincronização. Dados seguros localmente.",
      };
    }
  }

  // Obter estado atual
  getState(): SyncState & { nextTestIn: number } {
    const now = Date.now();
    const nextTestIn =
      this.state.lastSuccessTime > 0
        ? Math.max(0, 60000 - (now - this.state.lastSuccessTime))
        : 0;

    return {
      ...this.state,
      nextTestIn,
    };
  }

  // Método para tentar ativar Firebase manualmente
  async tryActivateFirebase(
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🎯 Tentando ativar Firebase manualmente...");

      // Tentar login
      const loginResult = await authService.signIn(email, password, true);

      if (loginResult.success) {
        this.markFirebaseSuccess();
        return {
          success: true,
          message: "Firebase ativado! Sincronização automática habilitada.",
        };
      }

      // Se login falhar, tentar criar conta
      const signupResult = await authService.signUp(email, password);

      if (signupResult.success) {
        this.markFirebaseSuccess();
        return {
          success: true,
          message:
            "Conta Firebase criada! Sincronização automática habilitada.",
        };
      }

      return {
        success: false,
        message:
          "Firebase não conseguiu processar. Sistema local continua funcional.",
      };
    } catch (error) {
      this.markFirebaseFailure(`Manual activation failed: ${error}`);
      return {
        success: false,
        message: "Firebase temporariamente indisponível. Sistema local ativo.",
      };
    }
  }

  // Destruir serviço
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    if (this.stabilityTestInterval) {
      clearInterval(this.stabilityTestInterval);
    }
  }
}

export const intelligentFirebaseSync = new IntelligentFirebaseSyncService();
export default intelligentFirebaseSync;
