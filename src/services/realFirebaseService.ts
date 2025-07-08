// Stub Firebase service - Firebase removed, provides empty implementations

class RealFirebaseService {
  async initialize() {
    return false;
  }

  async syncAllData() {
    return {
      users: [],
      pools: [],
      maintenance: [],
      works: [],
      clients: [],
    };
  }

  async testConnection() {
    return false;
  }

  async migrateAllDataToGlobalSharing() {
    return false;
  }
}

export const realFirebaseService = new RealFirebaseService();
