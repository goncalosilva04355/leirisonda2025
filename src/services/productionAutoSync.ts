// Serviço de sincronização automática para produção
import { autoSyncService } from "./autoSyncService";
import { isFirestoreReady } from "../firebase/firestoreConfig";

export class ProductionAutoSyncService {
  private isInitialized = false;
  private retryCount = 0;
  private maxRetries = 10;
  private retryInterval = 3000; // 3 segundos

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    console.log("🚀 ProductionAutoSync: Inicializando...");

    // Em produção, sempre tentar ativar sincronização
    const isProduction = !(import.meta as any).env?.DEV;

    if (isProduction) {
      console.log(
        "🔥 MODO PRODUÇÃO DETECTADO - Ativando sincronização automática",
      );
      await this.enableProductionSync();
    } else if ((import.meta as any).env?.VITE_FORCE_FIREBASE) {
      console.log(
        "🔥 DESENVOLVIMENTO com Firebase forçado - Ativando sincronização",
      );
      await this.enableDevelopmentSync();
    } else {
      console.log("📱 DESENVOLVIMENTO - Sincronização automática desativada");
    }
  }

  private async enableProductionSync(): Promise<void> {
    console.log("🔄 Aguardando Firestore estar pronto...");

    // Aguardar Firestore com timeout
    const firestoreReady = await this.waitForFirestore(30000); // 30 segundos

    if (!firestoreReady) {
      console.error(
        "❌ Firestore não ficou pronto a tempo - tentando mesmo assim",
      );
    }

    await this.startSyncWithRetry();
  }

  private async enableDevelopmentSync(): Promise<void> {
    // Aguardar menos tempo em desenvolvimento
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (isFirestoreReady()) {
      await this.startSyncWithRetry();
    } else {
      console.log("⚠️ Firestore não disponível em desenvolvimento");
    }
  }

  private async waitForFirestore(timeout: number): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (isFirestoreReady()) {
        console.log("✅ Firestore está pronto!");
        return true;
      }

      console.log("🔄 Aguardando Firestore...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return false;
  }

  private async startSyncWithRetry(): Promise<void> {
    while (this.retryCount < this.maxRetries && !this.isInitialized) {
      this.retryCount++;

      try {
        console.log(
          `🔄 Tentativa ${this.retryCount}/${this.maxRetries} - Ativando sincronização...`,
        );

        await autoSyncService.startAutoSync();

        this.isInitialized = true;
        console.log("✅ SINCRONIZAÇÃO AUTOMÁTICA ATIVADA COM SUCESSO!");

        // Marcar no localStorage que foi ativada
        localStorage.setItem("production-sync-enabled", "true");
        localStorage.setItem(
          "production-sync-timestamp",
          Date.now().toString(),
        );

        // Disparar evento para notificar a UI
        window.dispatchEvent(
          new CustomEvent("productionSyncActivated", {
            detail: { timestamp: Date.now() },
          }),
        );

        break;
      } catch (error) {
        console.error(`❌ Tentativa ${this.retryCount} falhou:`, error);

        if (this.retryCount < this.maxRetries) {
          console.log(
            `🔄 Tentando novamente em ${this.retryInterval / 1000}s...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, this.retryInterval),
          );

          // Aumentar intervalo progressivamente
          this.retryInterval = Math.min(this.retryInterval * 1.2, 10000);
        } else {
          console.error(
            "❌ Todas as tentativas falharam - sincronização não pôde ser ativada",
          );

          // Mesmo assim marcar como tentativa feita
          localStorage.setItem("production-sync-attempted", "true");
          localStorage.setItem("production-sync-failed", "true");
        }
      }
    }
  }

  // Forçar nova tentativa de sincronização
  public async forceRetry(): Promise<void> {
    console.log("🔄 Forçando nova tentativa de sincronização...");
    this.retryCount = 0;
    this.isInitialized = false;
    await this.startSyncWithRetry();
  }

  // Verificar se sincronização está ativa
  public isActive(): boolean {
    return this.isInitialized && autoSyncService.isAutoSyncActive();
  }

  // Obter status da sincronização
  public getStatus(): {
    isActive: boolean;
    retryCount: number;
    lastEnabled: string | null;
    lastAttempt: string | null;
  } {
    return {
      isActive: this.isActive(),
      retryCount: this.retryCount,
      lastEnabled: localStorage.getItem("production-sync-timestamp"),
      lastAttempt: localStorage.getItem("production-sync-attempted"),
    };
  }
}

// Instância singleton
export const productionAutoSync = new ProductionAutoSyncService();

// Inicializar automaticamente quando o módulo for carregado
setTimeout(() => {
  if (!productionAutoSync.isActive()) {
    console.log("🔄 Auto-retry da sincronização após 10 segundos...");
    productionAutoSync.forceRetry();
  }
}, 10000);
