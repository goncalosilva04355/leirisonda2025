// Mock simplificado para useUniversalDataSync
export const useUniversalDataSyncSafe = () => {
  console.log("🔄 useUniversalDataSync - modo mock");

  return {
    obras: [],
    piscinas: [],
    manutencoes: [],
    clientes: [],
    utilizadores: [],
    localizacoes: [],
    notificacoes: [],
    syncStatus: "idle",
    lastSync: null,
    isOnline: true,
    errors: [],
    syncAll: () => Promise.resolve(),
    forceSyncAll: () => Promise.resolve(),
    resetErrors: () => {},
    initializeSync: () => Promise.resolve(),
  };
};

export default useUniversalDataSyncSafe;
