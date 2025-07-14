import { getFirebaseFirestoreAsync } from "../firebase/firestoreConfig";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// Sistema que garante que TODOS os dados são salvos no Firestore
class UniversalFirestoreSync {
  private db: any = null;
  private initialized = false;
  private operationQueue: any[] = [];
  private isProcessingQueue = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      console.log("🔥 Inicializando Universal Firestore Sync...");

      // Aguardar Firestore estar pronto
      let attempts = 0;
      while (!this.db && attempts < 10) {
        this.db = await getFirebaseFirestoreAsync();
        if (!this.db) {
          console.log(
            `⏳ Tentativa ${attempts + 1}/10 - aguardando Firestore...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          attempts++;
        }
      }

      if (this.db) {
        this.initialized = true;
        console.log("✅ Universal Firestore Sync inicializado!");

        // Processar operações pendentes
        this.processQueue();
      } else {
        console.error("❌ Falha ao inicializar Firestore após 10 tentativas");
      }
    } catch (error) {
      console.error(
        "❌ Erro na inicialização Universal Firestore Sync:",
        error,
      );
    }
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.operationQueue.length === 0) return;

    this.isProcessingQueue = true;
    console.log(
      `🔄 Processando ${this.operationQueue.length} operações pendentes...`,
    );

    while (this.operationQueue.length > 0) {
      const operation = this.operationQueue.shift();
      try {
        await this.executeOperation(operation);
      } catch (error) {
        console.error("❌ Erro ao processar operação da fila:", error);
      }
    }

    this.isProcessingQueue = false;
    console.log("✅ Fila de operações processada");
  }

  private async executeOperation(operation: any) {
    if (!this.db) {
      console.warn("⚠️ Firestore não disponível, recolocando na fila");
      this.operationQueue.push(operation);
      return;
    }

    const { type, collectionName, data, docId } = operation;

    try {
      switch (type) {
        case "add":
          const docRef = await addDoc(collection(this.db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            syncedAt: serverTimestamp(),
          });
          console.log(
            `✅ [${collectionName}] Documento adicionado: ${docRef.id}`,
          );
          return docRef.id;

        case "set":
          await setDoc(doc(this.db, collectionName, docId), {
            ...data,
            updatedAt: serverTimestamp(),
            syncedAt: serverTimestamp(),
            ...(data.createdAt ? {} : { createdAt: serverTimestamp() }),
          });
          console.log(`✅ [${collectionName}] Documento definido: ${docId}`);
          return docId;

        case "update":
          await updateDoc(doc(this.db, collectionName, docId), {
            ...data,
            updatedAt: serverTimestamp(),
            syncedAt: serverTimestamp(),
          });
          console.log(`✅ [${collectionName}] Documento atualizado: ${docId}`);
          return docId;
      }
    } catch (error) {
      console.error(`❌ Erro na operação ${type} em ${collectionName}:`, error);
      throw error;
    }
  }

  // Função principal para adicionar dados
  async addData(collectionName: string, data: any): Promise<string> {
    const operation = {
      type: "add",
      collectionName,
      data: {
        ...data,
        id: data.id || Date.now().toString(),
        localCreatedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    if (this.initialized && this.db) {
      try {
        return await this.executeOperation(operation);
      } catch (error) {
        console.warn("⚠️ Falha na escrita direta, adicionando à fila");
        this.operationQueue.push(operation);
      }
    } else {
      console.log("📦 Firestore não pronto, adicionando à fila");
      this.operationQueue.push(operation);
    }

    // Sempre salvar no localStorage como backup
    this.saveToLocalStorage(collectionName, operation.data);
    return operation.data.id;
  }

  // Função para definir dados com ID específico
  async setData(
    collectionName: string,
    docId: string,
    data: any,
  ): Promise<string> {
    const operation = {
      type: "set",
      collectionName,
      docId,
      data: {
        ...data,
        id: docId,
        localUpdatedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    if (this.initialized && this.db) {
      try {
        return await this.executeOperation(operation);
      } catch (error) {
        console.warn("⚠️ Falha na escrita direta, adicionando à fila");
        this.operationQueue.push(operation);
      }
    } else {
      console.log("📦 Firestore não pronto, adicionando à fila");
      this.operationQueue.push(operation);
    }

    // Sempre salvar no localStorage como backup
    this.saveToLocalStorageWithId(collectionName, docId, operation.data);
    return docId;
  }

  // Função para atualizar dados
  async updateData(
    collectionName: string,
    docId: string,
    data: any,
  ): Promise<string> {
    const operation = {
      type: "update",
      collectionName,
      docId,
      data: {
        ...data,
        localUpdatedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    if (this.initialized && this.db) {
      try {
        return await this.executeOperation(operation);
      } catch (error) {
        console.warn("⚠️ Falha na atualização direta, adicionando à fila");
        this.operationQueue.push(operation);
      }
    } else {
      console.log("📦 Firestore não pronto, adicionando à fila");
      this.operationQueue.push(operation);
    }

    // Sempre atualizar no localStorage como backup
    this.updateLocalStorage(collectionName, docId, operation.data);
    return docId;
  }

  // Métodos específicos para cada tipo de dados
  async saveObra(data: any): Promise<string> {
    console.log("🏗️ Salvando obra no Firestore...");
    return await this.addData("obras", data);
  }

  async savePiscina(data: any): Promise<string> {
    console.log("🏊 Salvando piscina no Firestore...");
    return await this.addData("piscinas", data);
  }

  async saveManutencao(data: any): Promise<string> {
    console.log("🔧 Salvando manutenção no Firestore...");
    return await this.addData("manutencoes", data);
  }

  async saveCliente(data: any): Promise<string> {
    console.log("👤 Salvando cliente no Firestore...");
    return await this.addData("clientes", data);
  }

  async saveUtilizador(data: any): Promise<string> {
    console.log("👥 Salvando utilizador no Firestore...");
    return await this.addData("utilizadores", data);
  }

  // Fallback para localStorage
  private saveToLocalStorage(collectionName: string, data: any): void {
    try {
      const key = `firestore_${collectionName}`;
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      existing[data.id] = data;
      localStorage.setItem(key, JSON.stringify(existing));
      console.log(`💾 [${collectionName}] Salvo no localStorage: ${data.id}`);
    } catch (error) {
      console.error("❌ Erro ao salvar no localStorage:", error);
    }
  }

  private saveToLocalStorageWithId(
    collectionName: string,
    docId: string,
    data: any,
  ): void {
    try {
      const key = `firestore_${collectionName}`;
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      existing[docId] = data;
      localStorage.setItem(key, JSON.stringify(existing));
      console.log(`💾 [${collectionName}] Salvo no localStorage: ${docId}`);
    } catch (error) {
      console.error("❌ Erro ao salvar no localStorage:", error);
    }
  }

  private updateLocalStorage(
    collectionName: string,
    docId: string,
    data: any,
  ): void {
    try {
      const key = `firestore_${collectionName}`;
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      if (existing[docId]) {
        existing[docId] = { ...existing[docId], ...data };
        localStorage.setItem(key, JSON.stringify(existing));
        console.log(
          `💾 [${collectionName}] Atualizado no localStorage: ${docId}`,
        );
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar localStorage:", error);
    }
  }

  // Status e diagnóstico
  getStatus() {
    return {
      initialized: this.initialized,
      hasFirestore: !!this.db,
      queueLength: this.operationQueue.length,
      isProcessing: this.isProcessingQueue,
    };
  }

  // Forçar retry da inicialização
  async forceRetry() {
    console.log("🔄 Forçando retry da inicialização...");
    this.initialized = false;
    this.db = null;
    await this.initialize();
  }
}

// Instância singleton
export const universalFirestoreSync = new UniversalFirestoreSync();

// Funções de conveniência para usar em toda a app
export const saveToFirestore = {
  obra: (data: any) => universalFirestoreSync.saveObra(data),
  piscina: (data: any) => universalFirestoreSync.savePiscina(data),
  manutencao: (data: any) => universalFirestoreSync.saveManutencao(data),
  cliente: (data: any) => universalFirestoreSync.saveCliente(data),
  utilizador: (data: any) => universalFirestoreSync.saveUtilizador(data),
  custom: (collection: string, data: any) =>
    universalFirestoreSync.addData(collection, data),
};

// Export default
export default universalFirestoreSync;
