import { useState, useEffect, useCallback } from "react";
import {
  firestoreService,
  type FirestoreDocument,
} from "../services/firestoreService";

interface UseFirestoreOptions {
  collection: string;
  docId?: string;
  autoLoad?: boolean;
}

interface UseFirestoreReturn<T = any> {
  data: T | null;
  documents: T[];
  loading: boolean;
  error: string | null;
  save: (data: Partial<T>) => Promise<string | null>;
  update: (docId: string, data: Partial<T>) => Promise<boolean>;
  deleteDoc: (docId: string) => Promise<boolean>;
  loadDocument: (docId: string) => Promise<void>;
  loadCollection: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFirestore<T extends FirestoreDocument = FirestoreDocument>(
  options: UseFirestoreOptions,
): UseFirestoreReturn<T> {
  const { collection: collectionName, docId, autoLoad = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocument = useCallback(
    async (documentId: string) => {
      if (!documentId) return;

      setLoading(true);
      setError(null);

      try {
        const doc = await firestoreService.getDocument(
          collectionName,
          documentId,
        );
        setData(doc as T);
      } catch (err: any) {
        console.error("Erro ao carregar documento:", err);
        setError(err.message || "Erro ao carregar documento");
      } finally {
        setLoading(false);
      }
    },
    [collectionName],
  );

  const loadCollection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const docs = await firestoreService.getCollection(collectionName);
      setDocuments(docs as T[]);
    } catch (err: any) {
      console.error("Erro ao carregar coleção:", err);
      setError(err.message || "Erro ao carregar coleção");
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const save = useCallback(
    async (saveData: Partial<T>): Promise<string | null> => {
      setLoading(true);
      setError(null);

      try {
        const docId = await firestoreService.addDocument(
          collectionName,
          saveData,
        );

        if (docId) {
          // Atualizar lista se estivermos carregando uma coleção
          if (!docId && documents.length > 0) {
            await loadCollection();
          }

          console.log("✅ Documento salvo com sucesso:", docId);
          return docId;
        } else {
          setError("Erro ao salvar documento");
          return null;
        }
      } catch (err: any) {
        console.error("Erro ao salvar:", err);
        setError(err.message || "Erro ao salvar");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [collectionName, documents.length, loadCollection],
  );

  const update = useCallback(
    async (updateDocId: string, updateData: Partial<T>): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const success = await firestoreService.updateDocument(
          collectionName,
          updateDocId,
          updateData,
        );

        if (success) {
          // Atualizar dados locais se é o documento atual
          if (docId === updateDocId && data) {
            setData({ ...data, ...updateData } as T);
          }

          // Atualizar lista se estivermos carregando uma coleção
          if (documents.length > 0) {
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.id === updateDocId ? ({ ...doc, ...updateData } as T) : doc,
              ),
            );
          }

          console.log("✅ Documento atualizado com sucesso:", updateDocId);
          return true;
        } else {
          setError("Erro ao atualizar documento");
          return false;
        }
      } catch (err: any) {
        console.error("Erro ao atualizar:", err);
        setError(err.message || "Erro ao atualizar");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [collectionName, docId, data, documents],
  );

  const deleteDoc = useCallback(
    async (deleteDocId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const success = await firestoreService.deleteDocument(
          collectionName,
          deleteDocId,
        );

        if (success) {
          // Limpar dados se é o documento atual
          if (docId === deleteDocId) {
            setData(null);
          }

          // Remover da lista se estivermos carregando uma coleção
          if (documents.length > 0) {
            setDocuments((prev) =>
              prev.filter((doc) => doc.id !== deleteDocId),
            );
          }

          console.log("✅ Documento deletado com sucesso:", deleteDocId);
          return true;
        } else {
          setError("Erro ao deletar documento");
          return false;
        }
      } catch (err: any) {
        console.error("Erro ao deletar:", err);
        setError(err.message || "Erro ao deletar");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [collectionName, docId, documents],
  );

  const refresh = useCallback(async () => {
    if (docId) {
      await loadDocument(docId);
    } else {
      await loadCollection();
    }
  }, [docId, loadDocument, loadCollection]);

  // Auto-carregar dados quando necessário
  useEffect(() => {
    if (autoLoad) {
      if (docId) {
        loadDocument(docId);
      } else {
        loadCollection();
      }
    }
  }, [autoLoad, docId, loadDocument, loadCollection]);

  return {
    data,
    documents,
    loading,
    error,
    save,
    update,
    deleteDoc,
    loadDocument,
    loadCollection,
    refresh,
  };
}

// Hook específico para usuários
export function useUsers() {
  return useFirestore<{
    id?: string;
    name: string;
    email: string;
    role: string;
    createdAt?: any;
    updatedAt?: any;
  }>({
    collection: "users",
    autoLoad: true,
  });
}

// Hook específico para obras
export function useObras() {
  return useFirestore<{
    id?: string;
    nome: string;
    descricao?: string;
    status: string;
    responsavel?: string;
    dataInicio?: string;
    dataFim?: string;
    createdAt?: any;
    updatedAt?: any;
  }>({
    collection: "obras",
    autoLoad: true,
  });
}

// Hook específico para relatórios
export function useRelatorios() {
  return useFirestore<{
    id?: string;
    titulo: string;
    tipo: string;
    conteudo: string;
    obraId?: string;
    autorId?: string;
    createdAt?: any;
    updatedAt?: any;
  }>({
    collection: "relatorios",
    autoLoad: true,
  });
}
