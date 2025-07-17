// HOOK CONVERTIDO PARA REST API - SEM SDK FIREBASE
import { useState, useEffect, useCallback } from "react";
import {
  saveToFirestoreRest,
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "../utils/firestoreRestApi";

export interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

export interface UseFirestoreOptions {
  collection: string;
  autoLoad?: boolean;
}

/**
 * Hook genérico para usar REST API do Firestore
 */
export function useFirestore<T extends FirestoreDocument = FirestoreDocument>(
  options: UseFirestoreOptions,
) {
  const { collection, autoLoad = false } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📖 Carregando ${collection} via REST API`);
      const result = await readFromFirestoreRest(collection);
      setData(result as T[]);
      console.log(`✅ ${collection} carregado:`, result.length);
    } catch (err: any) {
      console.error(`❌ Erro ao carregar ${collection}:`, err);
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }, [collection]);

  // Save document
  const saveDocument = useCallback(
    async (document: Partial<T>): Promise<string> => {
      try {
        console.log(`💾 Guardando documento em ${collection}:`, document.id);
        const id = document.id || `${collection}_${Date.now()}`;
        const success = await saveToFirestoreRest(collection, id, document);

        if (success) {
          // Update local state
          setData((prev) => {
            const index = prev.findIndex((item) => item.id === id);
            if (index >= 0) {
              // Update existing
              const newData = [...prev];
              newData[index] = { ...document, id } as T;
              return newData;
            } else {
              // Add new
              return [...prev, { ...document, id } as T];
            }
          });
          console.log(`✅ Documento guardado em ${collection}:`, id);
          return id;
        } else {
          throw new Error("Falha ao guardar documento");
        }
      } catch (err: any) {
        console.error(`❌ Erro ao guardar em ${collection}:`, err);
        throw err;
      }
    },
    [collection],
  );

  // Delete document
  const deleteDocument = useCallback(
    async (id: string): Promise<void> => {
      try {
        console.log(`🗑️ Eliminando documento de ${collection}:`, id);
        const success = await deleteFromFirestoreRest(collection, id);

        if (success) {
          // Update local state
          setData((prev) => prev.filter((item) => item.id !== id));
          console.log(`✅ Documento eliminado de ${collection}:`, id);
        } else {
          throw new Error("Falha ao eliminar documento");
        }
      } catch (err: any) {
        console.error(`❌ Erro ao eliminar de ${collection}:`, err);
        throw err;
      }
    },
    [collection],
  );

  // Get document by ID
  const getDocument = useCallback(
    (id: string): T | undefined => {
      return data.find((item) => item.id === id);
    },
    [data],
  );

  // Filter documents
  const filterDocuments = useCallback(
    (predicate: (doc: T) => boolean): T[] => {
      return data.filter(predicate);
    },
    [data],
  );

  // Auto load on mount
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  return {
    data,
    loading,
    error,
    loadData,
    saveDocument,
    deleteDocument,
    getDocument,
    filterDocuments,
    refresh: loadData,
  };
}

export default useFirestore;
