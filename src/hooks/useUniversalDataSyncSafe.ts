import { useState, useEffect } from "react";

// Simplified safe version without complex dependencies
export function useUniversalDataSyncSafe() {
  const [state, setState] = useState({
    obras: [],
    manutencoes: [],
    piscinas: [],
    clientes: [],
    totalItems: 0,
    lastSync: "",
    isGloballyShared: true,
    isLoading: false,
    error: null,
    syncStatus: "disconnected" as const,
  });

  // Simple actions that won't cause errors
  const actions = {
    addObra: async (obra: any) => "",
    updateObra: async (id: string, obra: any) => {},
    deleteObra: async (id: string) => {},
    addManutencao: async (manutencao: any) => "",
    updateManutencao: async (id: string, manutencao: any) => {},
    deleteManutencao: async (id: string) => {},
    addPiscina: async (piscina: any) => "",
    updatePiscina: async (id: string, piscina: any) => {},
    deletePiscina: async (id: string) => {},
    addCliente: async (cliente: any) => "",
    updateCliente: async (id: string, cliente: any) => {},
    deleteCliente: async (id: string) => {},
    syncData: async () => {},
    forceSyncAll: async () => {},
    resetSync: async () => {},
  };

  return { ...state, ...actions };
}
