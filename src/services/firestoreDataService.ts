// Passo 3: Serviço de dados com Firestore
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  getFirebaseFirestore,
  isFirebaseFirestoreAvailable,
} from "../firebase/basicConfig";

// Interface para dados básicos
interface BaseData {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

class FirestoreDataService {
  private db: any = null;
  private isAvailable = false;

  constructor() {
    // Verificar disponibilidade do Firestore
    setTimeout(() => {
      this.db = getFirebaseFirestore();
      this.isAvailable = isFirebaseFirestoreAvailable();

      if (this.isAvailable) {
        console.log("🔥 FirestoreDataService: Ativo");
      } else {
        console.log("📱 FirestoreDataService: Modo local ativo");
      }
    }, 1000);
  }

  // Verificar se Firestore está disponível
  private checkAvailable(): boolean {
    if (!this.isAvailable || !this.db) {
      console.log("📱 Firestore não disponível - operação em modo local");
      return false;
    }
    return true;
  }

  // Adicionar documento
  async addDocument(
    collectionName: string,
    data: BaseData,
  ): Promise<string | null> {
    if (!this.checkAvailable()) return null;

    try {
      const docData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timestamp: Timestamp.now(),
      };

      const docRef = await addDoc(collection(this.db, collectionName), docData);
      console.log(`✅ Documento adicionado ao Firestore: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error(`❌ Erro ao adicionar documento:`, error);
      return null;
    }
  }

  // Obter todos os documentos
  async getDocuments(collectionName: string): Promise<any[]> {
    if (!this.checkAvailable()) return [];

    try {
      const q = query(
        collection(this.db, collectionName),
        orderBy("timestamp", "desc"),
      );

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`✅ ${documents.length} documentos obtidos do Firestore`);
      return documents;
    } catch (error) {
      console.error(`❌ Erro ao obter documentos:`, error);
      return [];
    }
  }

  // Atualizar documento
  async updateDocument(
    collectionName: string,
    docId: string,
    data: Partial<BaseData>,
  ): Promise<boolean> {
    if (!this.checkAvailable()) return false;

    try {
      const docRef = doc(this.db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
        timestamp: Timestamp.now(),
      });

      console.log(`✅ Documento atualizado no Firestore: ${docId}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao atualizar documento:`, error);
      return false;
    }
  }

  // Eliminar documento
  async deleteDocument(
    collectionName: string,
    docId: string,
  ): Promise<boolean> {
    if (!this.checkAvailable()) return false;

    try {
      await deleteDoc(doc(this.db, collectionName, docId));
      console.log(`✅ Documento eliminado do Firestore: ${docId}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao eliminar documento:`, error);
      return false;
    }
  }

  // Listener em tempo real
  onDocumentsChange(
    collectionName: string,
    callback: (docs: any[]) => void,
  ): () => void {
    if (!this.checkAvailable()) {
      // Retornar função vazia se Firestore não disponível
      return () => {};
    }

    try {
      const q = query(
        collection(this.db, collectionName),
        orderBy("timestamp", "desc"),
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(
          `🔄 ${documents.length} documentos atualizados em tempo real`,
        );
        callback(documents);
      });

      return unsubscribe;
    } catch (error) {
      console.error(`❌ Erro no listener:`, error);
      return () => {};
    }
  }

  // Verificar se está disponível
  isFirestoreAvailable(): boolean {
    return this.isAvailable && this.db !== null;
  }
}

// Exportar instância singleton
export const firestoreDataService = new FirestoreDataService();
export default firestoreDataService;
