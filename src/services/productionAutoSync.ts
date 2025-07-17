// SERVIÇO CONVERTIDO PARA REST API - SEM SDK FIREBASE
import { autoSyncService } from "./autoSyncService";
import { readFromFirestoreRest } from "../utils/firestoreRestApi";

class ProductionAutoSync {
  private isInitialized = false;
  private syncInterval: NodeJS.Timeout | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log("🚀 Inicializando ProductionAutoSync com REST API...");

    try {
      await this.enableProductionSync();
      this.isInitialized = true;
      console.log("✅ ProductionAutoSync inicializado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar ProductionAutoSync:", error);
    }
  }

  private async enableProductionSync(): Promise<void> {
    console.log("🔄 Testando conectividade REST API...");

    // Test REST API connection
    const apiReady = await this.waitForRestAPI(30000); // 30 seconds

    if (!apiReady) {
      console.error("❌ REST API não respondeu a tempo - tentando mesmo assim");
    } else {
      console.log("✅ REST API está funcionando!");
    }

    // Start sync regardless
    await this.startSyncWithRetry();
  }

  private async waitForRestAPI(timeout: number): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        await readFromFirestoreRest("test");
        console.log("✅ REST API está pronto!");
        return true;
      } catch (error) {
        // API not ready yet
      }

      console.log("🔄 Aguardando REST API...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return false;
  }

  private async startSyncWithRetry(): Promise<void> {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log(`🔄 Tentativa ${retries + 1} de iniciar sync...`);

        // Start periodic sync
        this.startPeriodicSync();

        console.log("✅ Sync iniciado com sucesso");
        return;
      } catch (error) {
        retries++;
        console.error(`❌ Erro na tentativa ${retries}:`, error);

        if (retries < maxRetries) {
          console.log(`⏳ Aguardando antes de tentar novamente...`);
          await new Promise((resolve) => setTimeout(resolve, 5000 * retries));
        }
      }
    }

    console.error("❌ Falha ao iniciar sync após todas as tentativas");
  }

  private startPeriodicSync(): void {
    // Clear existing interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Start new interval - sync every 5 minutes
    this.syncInterval = setInterval(
      () => {
        this.performSync();
      },
      5 * 60 * 1000,
    );

    // Perform initial sync
    this.performSync();
  }

  private async performSync(): Promise<void> {
    try {
      console.log("🔄 Realizando sincronização automática...");

      // Test if autoSyncService is available
      if (
        autoSyncService &&
        typeof autoSyncService.performSync === "function"
      ) {
        await autoSyncService.performSync();
        console.log("✅ Sincronização automática concluída");
      } else {
        console.log("⚠️ AutoSyncService não disponível");
      }
    } catch (error) {
      console.error("❌ Erro na sincronização automática:", error);
    }
  }

  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    console.log("🛑 ProductionAutoSync parado");
  }
}

export const productionAutoSync = new ProductionAutoSync();
