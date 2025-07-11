// Mock simples para autoSyncService
export const autoSyncService = {
  async startAutoSync() {
    console.log("🔄 autoSyncService.startAutoSync - modo mock");
    return Promise.resolve();
  },

  async stopAutoSync() {
    console.log("⏹️ autoSyncService.stopAutoSync - modo mock");
    return Promise.resolve();
  },

  async forceSyncAfterOperation(
    collectionName: string,
    operation: string,
    data?: any,
  ) {
    console.log(
      `🔄 autoSyncService.forceSyncAfterOperation - ${operation} em ${collectionName} - modo mock`,
    );
    return Promise.resolve();
  },

  isActive: false,

  getStatus() {
    return {
      active: false,
      lastSync: null,
      errors: [],
    };
  },
};

export default autoSyncService;
