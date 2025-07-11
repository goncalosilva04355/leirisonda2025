// Mock simples para useDataSyncSimple
export const useDataSyncSimple = () => {
  console.log("🔄 useDataSyncSimple - modo mock");

  return {
    syncStatus: "idle",
    lastSync: null,
    performSync: () => Promise.resolve(),
    isOnline: true,
    errors: [],
  };
};

export default useDataSyncSimple;
