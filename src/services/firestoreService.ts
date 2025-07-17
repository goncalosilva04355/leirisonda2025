// SERVIÇO CONVERTIDO PARA REST API - SEM SDK FIREBASE
import {
  saveToFirestoreRest,
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "../utils/firestoreRestApi";

export interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

export class FirestoreService {
  private static instance: FirestoreService;

  static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  // Save document to collection
  async saveDocument(
    collectionName: string,
    data: any,
  ): Promise<string | null> {
    try {
      const docId = data.id || `${collectionName}_${Date.now()}`;
      const success = await saveToFirestoreRest(collectionName, docId, data);

      if (success) {
        console.log("✅ Documento salvo via REST API:", docId);
        return docId;
      } else {
        console.error("❌ Falha ao salvar via REST API");
        return this.saveToLocalStorage(collectionName, data);
      }
    } catch (error: any) {
      console.error("❌ Erro ao salvar via REST API:", error);
      return this.saveToLocalStorage(collectionName, data);
    }
  }

  // Set document with specific ID
  async setDocument(
    collectionName: string,
    docId: string,
    data: any,
  ): Promise<boolean> {
    try {
      const success = await saveToFirestoreRest(collectionName, docId, data);
      if (success) {
        console.log("✅ Documento definido via REST API:", docId);
        return true;
      } else {
        console.error("❌ Falha ao definir via REST API");
        return this.saveToLocalStorageWithId(collectionName, docId, data);
      }
    } catch (error: any) {
      console.error("❌ Erro ao definir documento via REST API:", error);
      return this.saveToLocalStorageWithId(collectionName, docId, data);
    }
  }

  // Update document
  async updateDocument(
    collectionName: string,
    docId: string,
    data: any,
  ): Promise<boolean> {
    try {
      const updateData = { ...data, updatedAt: new Date().toISOString() };
      const success = await saveToFirestoreRest(
        collectionName,
        docId,
        updateData,
      );

      if (success) {
        console.log("✅ Documento atualizado via REST API:", docId);
        return true;
      } else {
        return this.updateLocalStorage(collectionName, docId, data);
      }
    } catch (error: any) {
      console.error("❌ Erro ao atualizar documento via REST API:", error);
      return this.updateLocalStorage(collectionName, docId, data);
    }
  }

  // Get single document
  async getDocument(
    collectionName: string,
    docId: string,
  ): Promise<FirestoreDocument | null> {
    try {
      const documents = await readFromFirestoreRest(collectionName);
      const document = documents.find((doc: any) => doc.id === docId);

      if (document) {
        console.log("✅ Documento encontrado via REST API:", docId);
        return document as FirestoreDocument;
      } else {
        console.log("Documento não encontrado via REST API:", docId);
        return this.getFromLocalStorage(collectionName, docId);
      }
    } catch (error: any) {
      console.error("❌ Erro ao buscar documento via REST API:", error);
      return this.getFromLocalStorage(collectionName, docId);
    }
  }

  // Get collection
  async getCollection(collectionName: string): Promise<FirestoreDocument[]> {
    try {
      const documents = await readFromFirestoreRest(collectionName);
      console.log(
        `✅ Coleção ${collectionName} obtida via REST API:`,
        documents.length,
      );
      return documents as FirestoreDocument[];
    } catch (error: any) {
      console.error("❌ Erro ao buscar coleção via REST API:", error);
      return this.getCollectionFromLocalStorage(collectionName);
    }
  }

  // Delete document
  async deleteDocument(
    collectionName: string,
    docId: string,
  ): Promise<boolean> {
    try {
      const success = await deleteFromFirestoreRest(collectionName, docId);

      if (success) {
        console.log("✅ Documento deletado via REST API:", docId);
        return true;
      } else {
        return this.deleteFromLocalStorage(collectionName, docId);
      }
    } catch (error: any) {
      console.error("❌ Erro ao deletar documento via REST API:", error);
      return this.deleteFromLocalStorage(collectionName, docId);
    }
  }

  // FALLBACK: LocalStorage methods
  private saveToLocalStorage(collectionName: string, data: any): string {
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const key = `firestore_${collectionName}`;
    const existing = JSON.parse(localStorage.getItem(key) || "{}");

    existing[id] = { ...data, id };
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

      existing[docId] = { ...data, id: docId };
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
        existing[docId] = { ...existing[docId], ...data, id: docId };
        localStorage.setItem(key, JSON.stringify(existing));
        console.log("💾 Documento atualizado no localStorage:", docId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Erro ao atualizar no localStorage:", error);
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
      console.error("❌ Erro ao buscar no localStorage:", error);
      return null;
    }
  }

  private getCollectionFromLocalStorage(
    collectionName: string,
  ): FirestoreDocument[] {
    try {
      const key = `firestore_${collectionName}`;
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      return Object.values(existing) as FirestoreDocument[];
    } catch (error) {
      console.error("❌ Erro ao buscar coleção no localStorage:", error);
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
      }
      return false;
    } catch (error) {
      console.error("❌ Erro ao deletar do localStorage:", error);
      return false;
    }
  }

  // Specific methods for different collections
  async createObra(obra: any): Promise<string | null> {
    return this.saveDocument("obras", obra);
  }

  async createManutencao(manutencao: any): Promise<string | null> {
    return this.saveDocument("manutencoes", manutencao);
  }

  async createPiscina(piscina: any): Promise<string | null> {
    return this.saveDocument("piscinas", piscina);
  }

  async createCliente(cliente: any): Promise<string | null> {
    return this.saveDocument("clientes", cliente);
  }

  async getUtilizadores(): Promise<FirestoreDocument[]> {
    return this.getCollection("users");
  }

  async getObras(): Promise<FirestoreDocument[]> {
    return this.getCollection("obras");
  }

  async getManutencoes(): Promise<FirestoreDocument[]> {
    return this.getCollection("manutencoes");
  }

  async getClientes(): Promise<FirestoreDocument[]> {
    return this.getCollection("clientes");
  }

  async getPiscinas(): Promise<FirestoreDocument[]> {
    return this.getCollection("piscinas");
  }

  async createUtilizador(user: any): Promise<string | null> {
    return this.saveDocument("users", user);
  }
}

// Singleton instance
export const firestoreService = FirestoreService.getInstance();
