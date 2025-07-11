// Mock simples para dataPersistenceManager
export const dataPersistenceManager = {
  async diagnoseDataPersistence() {
    console.log("🔍 dataPersistenceManager - modo mock");
    return {
      working: true,
      issues: [],
      recommendations: [],
    };
  },

  async repairDataPersistence() {
    console.log("🔧 repairDataPersistence - modo mock");
    return true;
  },
};

export default dataPersistenceManager;
