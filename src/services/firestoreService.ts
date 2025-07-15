import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestoreAsync } from "../firebase/firestoreConfig";

export interface FirestoreDocument {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  [key: string]: any;
}

export class FirestoreService {
  private static instance: FirestoreService;
  private db: any = null;

  private constructor() {}

  static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  private async getDb() {
    if (!this.db) {
      this.db = await getFirebaseFirestoreAsync();
      if (!this.db) {
        console.warn(
          "Firestore não está disponível - usando fallback localStorage",
        );
        return null;
      }
    }
    return this.db;
  }

  // Salvar um documento com ID automático
  async addDocument(collectionName: string, data: any): Promise<string | null> {
    try {
      const db = await this.getDb();
      if (!db) {
        // Fallback para localStorage
        return this.saveToLocalStorage(collectionName, data);
      }

      const docData = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, collectionName), docData);
      console.log("✅ Documento salvo no Firestore:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Erro ao salvar no Firestore:", error);
      // Fallback para localStorage
      return this.saveToLocalStorage(collectionName, data);
    }
  }

  // Salvar um documento com ID específico
  async setDocument(
    collectionName: string,
    docId: string,
    data: any,
  ): Promise<boolean> {
    try {
      const db = await this.getDb();
      if (!db) {
        return this.saveToLocalStorageWithId(collectionName, docId, data);
      }

      const docData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      // Se não existe createdAt, adicionar
      if (!data.createdAt) {
        docData.createdAt = Timestamp.now();
      }

      await setDoc(doc(db, collectionName, docId), docData);
      console.log("✅ Documento definido no Firestore:", docId);
      return true;
    } catch (error) {
      console.error("❌ Erro ao definir documento no Firestore:", error);
      return this.saveToLocalStorageWithId(collectionName, docId, data);
    }
  }

  // Atualizar um documento existente
  async updateDocument(
    collectionName: string,
    docId: string,
    data: any,
  ): Promise<boolean> {
    try {
      const db = await this.getDb();
      if (!db) {
        return this.updateLocalStorage(collectionName, docId, data);
      }

      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(doc(db, collectionName, docId), updateData);
      console.log("✅ Documento atualizado no Firestore:", docId);
      return true;
    } catch (error) {
      console.error("❌ Erro ao atualizar documento no Firestore:", error);
      return this.updateLocalStorage(collectionName, docId, data);
    }
  }

  // Buscar um documento por ID
  async getDocument(
    collectionName: string,
    docId: string,
  ): Promise<FirestoreDocument | null> {
    try {
      const db = await this.getDb();
      if (!db) {
        return this.getFromLocalStorage(collectionName, docId);
      }

      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as FirestoreDocument;
      } else {
        console.log("Documento não encontrado no Firestore:", docId);
        return null;
      }
    } catch (error) {
      console.error("❌ Erro ao buscar documento no Firestore:", error);
      return this.getFromLocalStorage(collectionName, docId);
    }
  }

  // Buscar todos os documentos de uma coleção
  async getCollection(collectionName: string): Promise<FirestoreDocument[]> {
    try {
      const db = await this.getDb();
      if (!db) {
        return this.getCollectionFromLocalStorage(collectionName);
      }

      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents: FirestoreDocument[] = [];

      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
        } as FirestoreDocument);
      });

      console.log(
        `✅ ${documents.length} documentos encontrados na coleção ${collectionName}`,
      );
      return documents;
    } catch (error) {
      console.error("��� Erro ao buscar coleção no Firestore:", error);
      return this.getCollectionFromLocalStorage(collectionName);
    }
  }

  // Deletar um documento
  async deleteDocument(
    collectionName: string,
    docId: string,
  ): Promise<boolean> {
    try {
      const db = await this.getDb();
      if (!db) {
        return this.deleteFromLocalStorage(collectionName, docId);
      }

      await deleteDoc(doc(db, collectionName, docId));
      console.log("✅ Documento deletado do Firestore:", docId);
      return true;
    } catch (error) {
      console.error("❌ Erro ao deletar documento do Firestore:", error);
      return this.deleteFromLocalStorage(collectionName, docId);
    }
  }

  // Métodos de fallback para localStorage
  private saveToLocalStorage(collectionName: string, data: any): string {
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const key = `firestore_${collectionName}`;
    const existing = JSON.parse(localStorage.getItem(key) || "{}");

    existing[id] = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify(existing));
    console.log("💾 Documento salvo no localStorage:", id);
    return id;
  }

  private saveToLocalStorageWithId(
    collectionName: string,
    docId: string,
    data: any,
  ): boolean {
    try {
      const key = `firestore_${collectionName}`;
      const existing = JSON.parse(localStorage.getItem(key) || "{}");

      existing[docId] = {
        ...data,
        id: docId,
        updatedAt: new Date().toISOString(),
      };

      if (!existing[docId].createdAt) {
        existing[docId].createdAt = new Date().toISOString();
      }

      localStorage.setItem(key, JSON.stringify(existing));
      console.log("💾 Documento definido no localStorage:", docId);
      return true;
    } catch (error) {
      console.error("❌ Erro ao salvar no localStorage:", error);
      return false;
    }
  }

  private updateLocalStorage(
    collectionName: string,
    docId: string,
    data: any,
  ): boolean {
    try {
      const key = `firestore_${collectionName}`;
      const existing = JSON.parse(localStorage.getItem(key) || "{}");

      if (existing[docId]) {
        existing[docId] = {
          ...existing[docId],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(key, JSON.stringify(existing));
        console.log("💾 Documento atualizado no localStorage:", docId);
        return true;
      } else {
        console.log("Documento não encontrado no localStorage:", docId);
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar localStorage:", error);
      return false;
    }
  }

  private getFromLocalStorage(
    collectionName: string,
    docId: string,
  ): FirestoreDocument | null {
    try {
      const key = `firestore_${collectionName}`;
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      return existing[docId] || null;
    } catch (error) {
      console.error("❌ Erro ao buscar do localStorage:", error);
      return null;
    }
  }

  private getCollectionFromLocalStorage(
    collectionName: string,
  ): FirestoreDocument[] {
    try {
      const key = `firestore_${collectionName}`;
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      return Object.values(existing);
    } catch (error) {
      console.error("❌ Erro ao buscar coleção do localStorage:", error);
      return [];
    }
  }

  private deleteFromLocalStorage(
    collectionName: string,
    docId: string,
  ): boolean {
    try {
      const key = `firestore_${collectionName}`;
      const existing = JSON.parse(localStorage.getItem(key) || "{}");

      if (existing[docId]) {
        delete existing[docId];
        localStorage.setItem(key, JSON.stringify(existing));
        console.log("💾 Documento deletado do localStorage:", docId);
        return true;
      } else {
        console.log("Documento não encontrado no localStorage:", docId);
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao deletar do localStorage:", error);
      return false;
    }
  }
}

// Instância singleton
export const firestoreService = FirestoreService.getInstance();
