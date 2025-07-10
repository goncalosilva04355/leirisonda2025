// Global Data Share Service - Fallback when Firestore is not available
// This service provides a safe fallback when Firebase Firestore is not enabled

export interface SharedDataState {
  pools: any[];
  works: any[];
  maintenance: any[];
  clients: any[];
  lastSync: string;
  sharedGlobally: true;
}

/**
 * Fallback service when Firestore is not available
 * All operations return safely without errors
 */
class GlobalDataShareService {
  private isInitialized = false;

  /**
   * Always returns false since Firestore is not available
   */
  async initialize(): Promise<boolean> {
    console.log(
      "📱 Firestore não disponível - usando modo local exclusivamente",
    );
    this.isInitialized = false;
    return false;
  }

  /**
   * Safe fallback - does nothing when Firestore is not available
   */
  async startRealtimeSync(callbacks: {
    onPoolsChange: (pools: any[]) => void;
    onWorksChange: (works: any[]) => void;
    onMaintenanceChange: (maintenance: any[]) => void;
    onClientsChange: (clients: any[]) => void;
  }): Promise<void> {
    console.log("📱 Realtime sync não disponível - dados permanecem locais");
    // Call callbacks with empty arrays to prevent errors
    callbacks.onPoolsChange([]);
    callbacks.onWorksChange([]);
    callbacks.onMaintenanceChange([]);
    callbacks.onClientsChange([]);
  }

  /**
   * Safe fallback - does nothing
   */
  stopRealtimeSync(): void {
    console.log("📱 Realtime sync parado (modo local)");
  }

  /**
   * Safe fallback - returns false
   */
  async syncPools(pools: any[]): Promise<boolean> {
    console.log("📱 Pool sync não disponível - dados permanecem locais");
    return false;
  }

  /**
   * Safe fallback - returns false
   */
  async syncWorks(works: any[]): Promise<boolean> {
    console.log("📱 Works sync não disponível - dados permanecem locais");
    return false;
  }

  /**
   * Safe fallback - returns false
   */
  async syncMaintenance(maintenance: any[]): Promise<boolean> {
    console.log("📱 Maintenance sync não disponível - dados permanecem locais");
    return false;
  }

  /**
   * Safe fallback - returns false
   */
  async syncClients(clients: any[]): Promise<boolean> {
    console.log("📱 Clients sync não disponível - dados permanecem locais");
    return false;
  }

  /**
   * Safe fallback - returns empty state
   */
  async getSharedState(): Promise<SharedDataState | null> {
    console.log("📱 Shared state não disponível - usando dados locais");
    return null;
  }

  /**
   * Safe fallback - returns false
   */
  async clearAllSharedData(): Promise<boolean> {
    console.log(
      "📱 Clear shared data não disponível - dados permanecem locais",
    );
    return false;
  }

  /**
   * Safe fallback - returns false
   */
  isReady(): boolean {
    return false;
  }
}

// Export singleton instance
export const globalDataShareService = new GlobalDataShareService();
export default globalDataShareService;
