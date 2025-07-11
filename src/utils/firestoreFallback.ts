// Fallback para funções existentes que usam Firestore
import { getSafeFirestore, withSafeFirestore } from "./safeFirestore";

// Substituto seguro para getFirebaseFirestore
export async function getFirebaseFirestoreSafe() {
  try {
    return await getSafeFirestore();
  } catch (error) {
    console.warn("⚠️ Fallback: Firestore não disponível", error);
    return null;
  }
}

// Substituto seguro para operações Firestore
export async function safeFirestoreOperation<T>(
  operation: (db: any) => Promise<T>,
  operationName: string = "operação",
  fallbackValue?: T,
): Promise<T | null> {
  try {
    console.log(`🔧 Executando ${operationName} (modo seguro)...`);

    const result = await withSafeFirestore(operation, fallbackValue);

    if (result !== null) {
      console.log(`✅ ${operationName} concluída com sucesso`);
    } else {
      console.warn(`⚠️ ${operationName} falhou, usando fallback`);
    }

    return result;
  } catch (error) {
    console.error(`❌ Erro na ${operationName}:`, error);
    return fallbackValue ?? null;
  }
}

// Wrapper para coleções
export async function getSafeCollection(collectionName: string) {
  return withSafeFirestore(async (db) => {
    const { collection } = await import("firebase/firestore");
    return collection(db, collectionName);
  });
}

// Wrapper para documentos
export async function getSafeDocument(collectionName: string, docId: string) {
  return withSafeFirestore(async (db) => {
    const { doc } = await import("firebase/firestore");
    return doc(db, collectionName, docId);
  });
}

// Wrapper para queries
export async function executeSafeQuery(
  collectionName: string,
  queryFn?: (col: any) => any,
) {
  return withSafeFirestore(async (db) => {
    const { collection, getDocs } = await import("firebase/firestore");
    const col = collection(db, collectionName);
    const finalQuery = queryFn ? queryFn(col) : col;
    return await getDocs(finalQuery);
  });
}
