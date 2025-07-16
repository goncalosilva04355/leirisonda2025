import { useState, useEffect, useCallback } from "react";
import {
  readFromFirestoreRest,
  saveToFirestoreRest,
} from "../utils/firestoreRestApi";

// Função para gerar IDs únicos e evitar colisões
let idCounter = 0;
const generateUniqueId = (prefix: string): string => {
  const timestamp = Date.now();
  const counter = ++idCounter;
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${counter}-${random}`;
};

export interface UniversalSyncState {
  obras: any[];
  manutencoes: any[];
  piscinas: any[];
  clientes: any[];
  totalItems: number;
  lastSync: string;
  isGloballyShared: boolean;
  isLoading: boolean;
  error: string | null;
  syncStatus: "disconnected" | "connecting" | "connected" | "syncing" | "error";
}

export interface UniversalSyncActions {
  // Obras
  addObra: (obra: any) => Promise<string>;
  updateObra: (id: string, obra: any) => Promise<void>;
  deleteObra: (id: string) => Promise<void>;

  // Manutenções
  addManutencao: (manutencao: any) => Promise<string>;
  updateManutencao: (id: string, manutencao: any) => Promise<void>;
  deleteManutencao: (id: string) => Promise<void>;

  // Piscinas
  addPiscina: (piscina: any) => Promise<string>;
  updatePiscina: (id: string, piscina: any) => Promise<void>;
  deletePiscina: (id: string) => Promise<void>;

  // Clientes
  addCliente: (cliente: any) => Promise<string>;
  updateCliente: (id: string, cliente: any) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;

  // Sync
  forceSyncAll: () => Promise<void>;
  resetSync: () => Promise<void>;
}

/**
 * FIXED VERSION OF useUniversalDataSync
 * Simplified and more robust to prevent React errors
 */
export function useUniversalDataSyncFixed(): UniversalSyncState &
  UniversalSyncActions {
  // Initialize with simple initial state - safe for SSR
  const [state, setState] = useState<UniversalSyncState>(() => ({
    obras: [],
    manutencoes: [],
    piscinas: [],
    clientes: [],
    totalItems: 0,
    lastSync: "",
    isGloballyShared: false,
    isLoading: false,
    error: null,
    syncStatus: "disconnected",
  }));

  // Safe localStorage access
  const safeGetLocalStorage = useCallback(
    (key: string, defaultValue = "[]") => {
      try {
        if (typeof window === "undefined" || !window.localStorage) {
          return JSON.parse(defaultValue);
        }
        const item = localStorage.getItem(key);
        if (!item) return JSON.parse(defaultValue);
        const parsed = JSON.parse(item);
        return Array.isArray(parsed) ? parsed : JSON.parse(defaultValue);
      } catch (error) {
        console.warn(`⚠️ Error reading localStorage key "${key}":`, error);
        return JSON.parse(defaultValue);
      }
    },
    [],
  );

  // Safe localStorage write
  const safeSetLocalStorage = useCallback((key: string, value: any) => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return false;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`⚠️ Error writing localStorage key "${key}":`, error);
      return false;
    }
  }, []);

  // Load initial data FROM FIRESTORE (development = production)
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const loadData = async () => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        syncStatus: "connecting",
      }));

      try {
        console.log(
          "��� Carregando dados do Firestore (desenvolvimento = produção)...",
        );

        // Tentar carregar do Firestore primeiro
        const [
          obrasFirestoreRaw,
          manutencaoFirestoreRaw,
          piscinasFirestoreRaw,
          clientesFirestoreRaw,
        ] = await Promise.all([
          readFromFirestoreRest("obras"),
          readFromFirestoreRest("manutencoes"),
          readFromFirestoreRest("piscinas"),
          readFromFirestoreRest("clientes"),
        ]);

        // Use let so we can modify arrays for deduplication
        let obrasFirestore = obrasFirestoreRaw;
        let manutencaoFirestore = manutencaoFirestoreRaw;
        let piscinasFirestore = piscinasFirestoreRaw;
        let clientesFirestore = clientesFirestoreRaw;

        // Se temos dados do Firestore, usar esses
        if (
          obrasFirestore.length > 0 ||
          manutencaoFirestore.length > 0 ||
          piscinasFirestore.length > 0 ||
          clientesFirestore.length > 0
        ) {
          console.log("✅ Dados carregados do Firestore:", {
            obras: obrasFirestore.length,
            manutencoes: manutencaoFirestore.length,
            piscinas: piscinasFirestore.length,
            clientes: clientesFirestore.length,
          });

          // ROBUST DEDUPLICATION - Remove ALL duplicates IMMEDIATELY
          const deduplicateRobust = (array: any[], name: string) => {
            if (!Array.isArray(array) || array.length === 0) return array;

            const seenIds = new Set();
            const duplicateIds = [];
            const unique = array.filter((item) => {
              if (!item || !item.id) {
                console.warn(`⚠️ Item sem ID em ${name}, removendo:`, item);
                return false;
              }

              if (seenIds.has(item.id)) {
                duplicateIds.push(item.id);
                console.warn(
                  `🗑️ DUPLICATE ${name.toUpperCase()} REMOVED:`,
                  item.id,
                );
                return false;
              }

              seenIds.add(item.id);
              return true;
            });

            if (duplicateIds.length > 0) {
              console.error(
                `🚨 ${name.toUpperCase()} DUPLICATES FOUND AND REMOVED:`,
                duplicateIds,
              );
              console.log(
                `✅ ${name} cleaned: ${unique.length}/${array.length} (removed ${duplicateIds.length})`,
              );
            }

            return unique;
          };

          // Apply ROBUST deduplication to ALL collections
          obrasFirestore = deduplicateRobust(obrasFirestore, "obra");
          manutencaoFirestore = deduplicateRobust(
            manutencaoFirestore,
            "manutenção",
          );
          piscinasFirestore = deduplicateRobust(piscinasFirestore, "piscina");
          clientesFirestore = deduplicateRobust(clientesFirestore, "cliente");

          console.log("🎯 ALL DATA DEDUPLICATED - FINAL COUNTS:", {
            obras: obrasFirestore.length,
            manutencoes: manutencaoFirestore.length,
            piscinas: piscinasFirestore.length,
            clientes: clientesFirestore.length,
          });

          // Também salvar no localStorage para backup
          safeSetLocalStorage("works", obrasFirestore);
          safeSetLocalStorage("maintenance", manutencaoFirestore);
          safeSetLocalStorage("pools", piscinasFirestore);
          safeSetLocalStorage("clients", clientesFirestore);

          setState({
            obras: obrasFirestore,
            manutencoes: manutencaoFirestore,
            piscinas: piscinasFirestore,
            clientes: clientesFirestore,
            totalItems:
              obrasFirestore.length +
              manutencaoFirestore.length +
              piscinasFirestore.length +
              clientesFirestore.length,
            lastSync: new Date().toISOString(),
            isGloballyShared: true,
            isLoading: false,
            error: null,
            syncStatus: "connected",
          });
          return;
        }

        console.log(
          "⚠️ Firestore vazio, carregando do localStorage como fallback...",
        );

        // Fallback para localStorage se Firestore estiver vazio
        const obras = safeGetLocalStorage("works");
        const manutencoes = safeGetLocalStorage("maintenance");
        const piscinas = safeGetLocalStorage("pools");
        const clientes = safeGetLocalStorage("clients");

        setState({
          obras,
          manutencoes,
          piscinas,
          clientes,
          totalItems:
            obras.length +
            manutencoes.length +
            piscinas.length +
            clientes.length,
          lastSync: new Date().toISOString(),
          isGloballyShared: true,
          isLoading: false,
          error: null,
          syncStatus: "connected",
        });
      } catch (error) {
        console.error("❌ Erro ao carregar dados do Firestore:", error);

        // Fallback para localStorage em caso de erro
        console.log("⚠️ Usando localStorage como fallback devido a erro...");
        const obras = safeGetLocalStorage("works");
        const manutencoes = safeGetLocalStorage("maintenance");
        const piscinas = safeGetLocalStorage("pools");
        const clientes = safeGetLocalStorage("clients");

        setState({
          obras,
          manutencoes,
          piscinas,
          clientes,
          totalItems:
            obras.length +
            manutencoes.length +
            piscinas.length +
            clientes.length,
          lastSync: new Date().toISOString(),
          isGloballyShared: true,
          isLoading: false,
          error: null,
          syncStatus: "connected",
        });
      }
    };

    loadData();

    // Listen for storage changes (only on client side)
    const handleStorageChange = (e: StorageEvent) => {
      if (["works", "maintenance", "pools", "clients"].includes(e.key || "")) {
        loadData();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, []); // FIXED: Empty dependencies to prevent infinite re-renders

  // Add obra function
  const addObra = useCallback(
    async (obraData: any): Promise<string> => {
      try {
        const id = obraData.id || generateUniqueId("obra");
        const obra = {
          ...obraData,
          id,
          createdAt: obraData.createdAt || new Date().toISOString(),
          sharedGlobally: true,
          visibleToAllUsers: true,
        };

        // DOUBLE CHECK: Verificar duplicados em localStorage E Firestore
        const existingObras = safeGetLocalStorage("works");
        const localWorkExists = existingObras.some(
          (w: any) => w.id === obra.id,
        );

        // Also check in current state to prevent duplicates in memory
        const stateWorkExists = state.obras.some((w: any) => w.id === obra.id);

        if (localWorkExists || stateWorkExists) {
          console.warn(
            "🚨 DUPLICADO DETECTADO - Obra já existe, ignorando:",
            obra.id,
          );
          return obra.id; // Return existing ID instead of creating duplicate
        }

        // EXTRA SAFETY: Check in Firestore as well
        try {
          const firestoreObras = await readFromFirestoreRest("obras");
          const firestoreWorkExists = firestoreObras.some(
            (w: any) => w.id === obra.id,
          );

          if (firestoreWorkExists) {
            console.warn(
              "🚨 DUPLICADO NO FIRESTORE - Obra já existe, ignorando:",
              obra.id,
            );
            return obra.id;
          }
        } catch (error) {
          console.warn(
            "⚠️ Não foi possível verificar duplicados no Firestore:",
            error,
          );
        }

        // Proceed with creation since no duplicates found
        // PRIMEIRO: Salvar no Firestore (desenvolvimento = produção)
        console.log("🔥 Salvando obra no Firestore:", obra.id);
        const firestoreSaved = await saveToFirestoreRest(
          "obras",
          obra.id,
          obra,
        );

        if (firestoreSaved) {
          console.log("✅ Obra salva no Firestore com sucesso");
        } else {
          console.warn(
            "⚠️ Falha ao salvar no Firestore, continuando com localStorage",
          );
        }

        // SEGUNDO: Atualizar localStorage (backup)
        const updatedObras = [...existingObras, obra];
        safeSetLocalStorage("works", updatedObras);

        setState((prev) => ({
          ...prev,
          obras: updatedObras,
          totalItems: prev.totalItems + 1,
        }));

        // Trigger update event (only on client side)
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("obrasUpdated", {
              detail: { data: updatedObras, collection: "obras" },
            }),
          );
        }

        return obra.id;
      } catch (error) {
        console.error("❌ Error adding obra:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  // Add manutenção function
  const addManutencao = useCallback(
    async (manutencaoData: any): Promise<string> => {
      try {
        const id = manutencaoData.id || generateUniqueId("manutencao");
        const manutencao = {
          ...manutencaoData,
          id,
          createdAt: manutencaoData.createdAt || new Date().toISOString(),
          sharedGlobally: true,
          visibleToAllUsers: true,
        };

        const existingManutencoes = safeGetLocalStorage("maintenance");
        const maintenanceExists = existingManutencoes.some(
          (m: any) => m.id === manutencao.id,
        );

        if (maintenanceExists) {
          console.warn(
            "🚨 Manutenção com ID duplicado detectada, ignorando:",
            manutencao.id,
          );
          return manutencao.id;
        }

        if (!maintenanceExists) {
          // PRIMEIRO: Salvar no Firestore (desenvolvimento = produção)
          console.log("🔥 Salvando manutenção no Firestore:", manutencao.id);
          const firestoreSaved = await saveToFirestoreRest(
            "manutencoes",
            manutencao.id,
            manutencao,
          );

          if (firestoreSaved) {
            console.log("✅ Manutenção salva no Firestore com sucesso");
          } else {
            console.warn(
              "⚠️ Falha ao salvar manutenção no Firestore, continuando com localStorage",
            );
          }

          // SEGUNDO: Atualizar localStorage (backup)
          const updatedManutencoes = [...existingManutencoes, manutencao];
          safeSetLocalStorage("maintenance", updatedManutencoes);

          setState((prev) => ({
            ...prev,
            manutencoes: updatedManutencoes,
            totalItems: prev.totalItems + 1,
          }));

          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("manutencoesUpdated", {
                detail: { data: updatedManutencoes, collection: "manutencoes" },
              }),
            );
          }
        }

        return id;
      } catch (error) {
        console.error("❌ Error adding manutenção:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  // Add piscina function
  const addPiscina = useCallback(
    async (piscinaData: any): Promise<string> => {
      try {
        const id = piscinaData.id || generateUniqueId("piscina");
        const piscina = {
          ...piscinaData,
          id,
          createdAt: piscinaData.createdAt || new Date().toISOString(),
          sharedGlobally: true,
          visibleToAllUsers: true,
        };

        const existingPiscinas = safeGetLocalStorage("pools");
        const piscinaExists = existingPiscinas.some(
          (p: any) => p.id === piscina.id,
        );

        if (!piscinaExists) {
          // PRIMEIRO: Salvar no Firestore (desenvolvimento = produção)
          console.log("🔥 Salvando piscina no Firestore:", piscina.id);
          const firestoreSaved = await saveToFirestoreRest(
            "piscinas",
            piscina.id,
            piscina,
          );

          if (firestoreSaved) {
            console.log("✅ Piscina salva no Firestore com sucesso");
          } else {
            console.warn(
              "⚠️ Falha ao salvar piscina no Firestore, continuando com localStorage",
            );
          }

          // SEGUNDO: Atualizar localStorage (backup)
          const updatedPiscinas = [...existingPiscinas, piscina];
          safeSetLocalStorage("pools", updatedPiscinas);

          setState((prev) => ({
            ...prev,
            piscinas: updatedPiscinas,
            totalItems: prev.totalItems + 1,
          }));

          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("piscinasUpdated", {
                detail: { data: updatedPiscinas, collection: "piscinas" },
              }),
            );
          }
        }

        return id;
      } catch (error) {
        console.error("❌ Error adding piscina:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  // Add cliente function
  const addCliente = useCallback(
    async (clienteData: any): Promise<string> => {
      try {
        const id = clienteData.id || generateUniqueId("cliente");
        const cliente = {
          ...clienteData,
          id,
          createdAt: clienteData.createdAt || new Date().toISOString(),
          sharedGlobally: true,
          visibleToAllUsers: true,
        };

        const existingClientes = safeGetLocalStorage("clients");
        const clienteExists = existingClientes.some(
          (c: any) => c.id === cliente.id,
        );

        if (!clienteExists) {
          // PRIMEIRO: Salvar no Firestore (desenvolvimento = produção)
          console.log("🔥 Salvando cliente no Firestore:", cliente.id);
          const firestoreSaved = await saveToFirestoreRest(
            "clientes",
            cliente.id,
            cliente,
          );

          if (firestoreSaved) {
            console.log("✅ Cliente salvo no Firestore com sucesso");
          } else {
            console.warn(
              "⚠️ Falha ao salvar cliente no Firestore, continuando com localStorage",
            );
          }

          // SEGUNDO: Atualizar localStorage (backup)
          const updatedClientes = [...existingClientes, cliente];
          safeSetLocalStorage("clients", updatedClientes);

          setState((prev) => ({
            ...prev,
            clientes: updatedClientes,
            totalItems: prev.totalItems + 1,
          }));

          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("clientesUpdated", {
                detail: { data: updatedClientes, collection: "clientes" },
              }),
            );
          }
        }

        return id;
      } catch (error) {
        console.error("❌ Error adding cliente:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  // Placeholder functions for update/delete operations
  const updateObra = useCallback(
    async (id: string, data: any): Promise<void> => {
      console.log("updateObra called:", id, data);
    },
    [],
  );

  const deleteObra = useCallback(
    async (id: string): Promise<void> => {
      try {
        console.log("🗑️ Eliminando obra:", id);

        // PRIMEIRO: Eliminar do Firestore (desenvolvimento = produção)
        try {
          const { deleteFromFirestoreRest } = await import(
            "../utils/firestoreRestApi"
          );
          const firestoreDeleted = await deleteFromFirestoreRest("obras", id);

          if (firestoreDeleted) {
            console.log("✅ Obra eliminada do Firestore com sucesso");
          } else {
            console.warn(
              "⚠️ Falha ao eliminar do Firestore, continuando com localStorage",
            );
          }
        } catch (firestoreError) {
          console.warn(
            "⚠️ Erro no Firestore, continuando com localStorage:",
            firestoreError,
          );
        }

        // SEGUNDO: Eliminar do localStorage
        const existingObras = safeGetLocalStorage("works");
        const updatedObras = existingObras.filter(
          (obra: any) => obra.id !== id,
        );
        safeSetLocalStorage("works", updatedObras);

        // TERCEIRO: Atualizar estado
        setState((prev) => ({
          ...prev,
          obras: updatedObras,
          totalItems: prev.totalItems - 1,
        }));

        // Trigger update event
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("obrasUpdated", {
              detail: { data: updatedObras, collection: "obras" },
            }),
          );
        }

        console.log("✅ Obra eliminada com sucesso:", id);
      } catch (error) {
        console.error("❌ Erro ao eliminar obra:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  const updateManutencao = useCallback(
    async (id: string, data: any): Promise<void> => {
      console.log("updateManutencao called:", id, data);
    },
    [],
  );

  const deleteManutencao = useCallback(
    async (id: string): Promise<void> => {
      try {
        console.log("🗑️ Eliminando manutenção:", id);

        // PRIMEIRO: Eliminar do Firestore
        try {
          const { deleteFromFirestoreRest } = await import(
            "../utils/firestoreRestApi"
          );
          const firestoreDeleted = await deleteFromFirestoreRest(
            "manutencoes",
            id,
          );

          if (firestoreDeleted) {
            console.log("✅ Manutenção eliminada do Firestore com sucesso");
          }
        } catch (firestoreError) {
          console.warn("⚠️ Erro no Firestore:", firestoreError);
        }

        // SEGUNDO: Eliminar do localStorage
        const existingManutencoes = safeGetLocalStorage("maintenance");
        const updatedManutencoes = existingManutencoes.filter(
          (maint: any) => maint.id !== id,
        );
        safeSetLocalStorage("maintenance", updatedManutencoes);

        // TERCEIRO: Atualizar estado
        setState((prev) => ({
          ...prev,
          manutencoes: updatedManutencoes,
          totalItems: prev.totalItems - 1,
        }));

        // Trigger update event
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("manutencoesUpdated", {
              detail: { data: updatedManutencoes, collection: "manutencoes" },
            }),
          );
        }

        console.log("✅ Manutenção eliminada com sucesso:", id);
      } catch (error) {
        console.error("❌ Erro ao eliminar manutenção:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  const updatePiscina = useCallback(
    async (id: string, data: any): Promise<void> => {
      console.log("updatePiscina called:", id, data);
    },
    [],
  );

  const deletePiscina = useCallback(
    async (id: string): Promise<void> => {
      try {
        console.log("🗑️ Eliminando piscina:", id);

        // PRIMEIRO: Eliminar do Firestore
        try {
          const { deleteFromFirestoreRest } = await import(
            "../utils/firestoreRestApi"
          );
          const firestoreDeleted = await deleteFromFirestoreRest(
            "piscinas",
            id,
          );

          if (firestoreDeleted) {
            console.log("✅ Piscina eliminada do Firestore com sucesso");
          }
        } catch (firestoreError) {
          console.warn("⚠️ Erro no Firestore:", firestoreError);
        }

        // SEGUNDO: Eliminar do localStorage
        const existingPiscinas = safeGetLocalStorage("pools");
        const updatedPiscinas = existingPiscinas.filter(
          (piscina: any) => piscina.id !== id,
        );
        safeSetLocalStorage("pools", updatedPiscinas);

        // TERCEIRO: Atualizar estado
        setState((prev) => ({
          ...prev,
          piscinas: updatedPiscinas,
          totalItems: prev.totalItems - 1,
        }));

        // Trigger update event
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("piscinasUpdated", {
              detail: { data: updatedPiscinas, collection: "piscinas" },
            }),
          );
        }

        console.log("✅ Piscina eliminada com sucesso:", id);
      } catch (error) {
        console.error("❌ Erro ao eliminar piscina:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  const updateCliente = useCallback(
    async (id: string, data: any): Promise<void> => {
      console.log("updateCliente called:", id, data);
    },
    [],
  );

  const deleteCliente = useCallback(
    async (id: string): Promise<void> => {
      try {
        console.log("🗑️ Eliminando cliente:", id);

        // PRIMEIRO: Eliminar do Firestore
        try {
          const { deleteFromFirestoreRest } = await import(
            "../utils/firestoreRestApi"
          );
          const firestoreDeleted = await deleteFromFirestoreRest(
            "clientes",
            id,
          );

          if (firestoreDeleted) {
            console.log("✅ Cliente eliminado do Firestore com sucesso");
          }
        } catch (firestoreError) {
          console.warn("⚠️ Erro no Firestore:", firestoreError);
        }

        // SEGUNDO: Eliminar do localStorage
        const existingClientes = safeGetLocalStorage("clients");
        const updatedClientes = existingClientes.filter(
          (cliente: any) => cliente.id !== id,
        );
        safeSetLocalStorage("clients", updatedClientes);

        // TERCEIRO: Atualizar estado
        setState((prev) => ({
          ...prev,
          clientes: updatedClientes,
          totalItems: prev.totalItems - 1,
        }));

        // Trigger update event
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("clientesUpdated", {
              detail: { data: updatedClientes, collection: "clientes" },
            }),
          );
        }

        console.log("✅ Cliente eliminado com sucesso:", id);
      } catch (error) {
        console.error("❌ Erro ao eliminar cliente:", error);
        throw error;
      }
    },
    [safeGetLocalStorage, safeSetLocalStorage],
  );

  const forceSyncAll = useCallback(async (): Promise<void> => {
    console.log("🔄 forceSyncAll: Forçando sincronização com Firestore...");
    setState((prev) => ({ ...prev, isLoading: true, syncStatus: "syncing" }));

    try {
      // Recarregar todos os dados do Firestore
      const [
        obrasFirestoreRaw,
        manutencaoFirestoreRaw,
        piscinasFirestoreRaw,
        clientesFirestoreRaw,
      ] = await Promise.all([
        readFromFirestoreRest("obras"),
        readFromFirestoreRest("manutencoes"),
        readFromFirestoreRest("piscinas"),
        readFromFirestoreRest("clientes"),
      ]);

      // Use let so we can modify arrays for deduplication
      let obrasFirestore = obrasFirestoreRaw;
      let manutencaoFirestore = manutencaoFirestoreRaw;
      let piscinasFirestore = piscinasFirestoreRaw;
      let clientesFirestore = clientesFirestoreRaw;

      console.log("✅ forceSyncAll: Dados atualizados do Firestore:", {
        obras: obrasFirestore.length,
        manutencoes: manutencaoFirestore.length,
        piscinas: piscinasFirestore.length,
        clientes: clientesFirestore.length,
      });

      // Deduplicate data before using
      const deduplicate = (array: any[], name: string) => {
        const seenIds = new Set();
        const unique = array.filter((item) => {
          if (seenIds.has(item.id)) {
            console.warn(
              `🗑️ forceSyncAll: Removing duplicate ${name}:`,
              item.id,
            );
            return false;
          }
          seenIds.add(item.id);
          return true;
        });
        if (unique.length < array.length) {
          console.log(
            `✅ forceSyncAll: ${name} duplicates removed. Unique: ${unique.length}/${array.length}`,
          );
        }
        return unique;
      };

      obrasFirestore = deduplicate(obrasFirestore, "obra");
      manutencaoFirestore = deduplicate(manutencaoFirestore, "manutenção");
      piscinasFirestore = deduplicate(piscinasFirestore, "piscina");
      clientesFirestore = deduplicate(clientesFirestore, "cliente");

      // Atualizar localStorage
      safeSetLocalStorage("works", obrasFirestore);
      safeSetLocalStorage("maintenance", manutencaoFirestore);
      safeSetLocalStorage("pools", piscinasFirestore);
      safeSetLocalStorage("clients", clientesFirestore);

      // Atualizar estado
      setState({
        obras: obrasFirestore,
        manutencoes: manutencaoFirestore,
        piscinas: piscinasFirestore,
        clientes: clientesFirestore,
        totalItems:
          obrasFirestore.length +
          manutencaoFirestore.length +
          piscinasFirestore.length +
          clientesFirestore.length,
        lastSync: new Date().toISOString(),
        isGloballyShared: true,
        isLoading: false,
        error: null,
        syncStatus: "connected",
      });
    } catch (error) {
      console.error("❌ forceSyncAll: Erro na sincronização:", error);
      setState((prev) => ({
        ...prev,
        error: "Erro na sincronização",
        isLoading: false,
        syncStatus: "error",
      }));
    }
  }, [safeGetLocalStorage, safeSetLocalStorage]);

  const resetSync = useCallback(async (): Promise<void> => {
    console.log("🔄 resetSync called");
  }, []);

  return {
    // State
    ...state,

    // Actions
    addObra,
    updateObra,
    deleteObra,
    addManutencao,
    updateManutencao,
    deleteManutencao,
    addPiscina,
    updatePiscina,
    deletePiscina,
    addCliente,
    updateCliente,
    deleteCliente,
    forceSyncAll,
    resetSync,
  };
}
