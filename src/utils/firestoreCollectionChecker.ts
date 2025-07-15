/**
 * Verificador de coleções Firestore
 * Verifica se as coleções necessárias existem e têm dados
 */

import { getFirebaseFirestore } from "../firebase/firestoreConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

interface CollectionStatus {
  name: string;
  exists: boolean;
  documentCount: number;
  sampleData?: any;
  error?: string;
}

export class FirestoreCollectionChecker {
  private db = getFirebaseFirestore();

  // Lista de coleções necessárias
  private requiredCollections = [
    "works", // obras
    "pools", // piscinas
    "maintenance", // manutenções
    "users", // utilizadores
    "clients", // clientes
    "locations", // localizações
    "notifications", // notificações
    "photos", // fotografias
    "relatorios", // relatórios
  ];

  async checkAllCollections(): Promise<CollectionStatus[]> {
    console.log("🔍 Verificando coleções Firestore...");

    if (!this.db) {
      console.error("❌ Firestore não está disponível");
      return [];
    }

    const results: CollectionStatus[] = [];

    for (const collectionName of this.requiredCollections) {
      try {
        const status = await this.checkCollection(collectionName);
        results.push(status);
      } catch (error) {
        results.push({
          name: collectionName,
          exists: false,
          documentCount: 0,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }

    return results;
  }

  private async checkCollection(
    collectionName: string,
  ): Promise<CollectionStatus> {
    try {
      const collectionRef = collection(this.db, collectionName);
      const snapshot = await getDocs(collectionRef);

      const documents = snapshot.docs;
      const documentCount = documents.length;

      // Pegar uma amostra do primeiro documento
      const sampleData = documents.length > 0 ? documents[0].data() : null;

      return {
        name: collectionName,
        exists: documentCount > 0,
        documentCount,
        sampleData: sampleData ? Object.keys(sampleData) : undefined, // Só as chaves para não expor dados
      };
    } catch (error) {
      return {
        name: collectionName,
        exists: false,
        documentCount: 0,
        error: error instanceof Error ? error.message : "Erro na verificação",
      };
    }
  }

  async createSampleData(): Promise<void> {
    console.log("📝 Criando dados de exemplo para inicializar coleções...");

    if (!this.db) {
      console.error("❌ Firestore não está disponível");
      return;
    }

    try {
      // Criar documento de exemplo em cada coleção para garantir que existem
      const sampleData = {
        works: {
          id: "sample_work",
          title: "Obra de Exemplo",
          status: "pendente",
          createdAt: new Date().toISOString(),
          type: "sample",
        },
        pools: {
          id: "sample_pool",
          name: "Piscina de Exemplo",
          status: "ativa",
          createdAt: new Date().toISOString(),
          type: "sample",
        },
        maintenance: {
          id: "sample_maintenance",
          description: "Manutenção de Exemplo",
          status: "pendente",
          createdAt: new Date().toISOString(),
          type: "sample",
        },
        users: {
          id: "sample_user",
          name: "Utilizador de Exemplo",
          email: "exemplo@teste.com",
          role: "user",
          active: true,
          createdAt: new Date().toISOString(),
          type: "sample",
        },
        clients: {
          id: "sample_client",
          name: "Cliente de Exemplo",
          email: "cliente@exemplo.com",
          createdAt: new Date().toISOString(),
          type: "sample",
        },
        locations: {
          id: "sample_location",
          name: "Localização de Exemplo",
          address: "Rua de Exemplo, 123",
          createdAt: new Date().toISOString(),
          type: "sample",
        },
        notifications: {
          id: "sample_notification",
          title: "Notificação de Exemplo",
          message: "Esta é uma notificação de exemplo",
          read: false,
          createdAt: new Date().toISOString(),
          type: "sample",
        },
        photos: {
          id: "sample_photo",
          url: "https://example.com/photo.jpg",
          description: "Foto de Exemplo",
          createdAt: new Date().toISOString(),
          type: "sample",
        },
        relatorios: {
          id: "sample_report",
          title: "Relatório de Exemplo",
          content: "Conteúdo do relatório de exemplo",
          createdAt: new Date().toISOString(),
          type: "sample",
        },
      };

      for (const [collectionName, data] of Object.entries(sampleData)) {
        try {
          const docRef = doc(this.db, collectionName, data.id);
          await setDoc(docRef, data);
          console.log(
            `✅ Coleção '${collectionName}' inicializada com dados de exemplo`,
          );
        } catch (error) {
          console.error(
            `❌ Erro ao criar dados de exemplo para '${collectionName}':`,
            error,
          );
        }
      }

      console.log(
        "✅ Todas as coleções foram inicializadas com dados de exemplo",
      );
    } catch (error) {
      console.error("❌ Erro geral ao criar dados de exemplo:", error);
    }
  }

  generateReport(results: CollectionStatus[]): void {
    console.group("📊 RELATÓRIO DE COLEÇÕES FIRESTORE");

    console.log(`Total de coleções verificadas: ${results.length}`);

    const existingCollections = results.filter((r) => r.exists);
    const emptyCollections = results.filter((r) => !r.exists && !r.error);
    const errorCollections = results.filter((r) => r.error);

    console.log(`✅ Coleções com dados: ${existingCollections.length}`);
    console.log(`⚪ Coleções vazias: ${emptyCollections.length}`);
    console.log(`❌ Coleções com erro: ${errorCollections.length}`);

    console.log("\n📋 Detalhes por coleção:");

    results.forEach((result) => {
      const status = result.exists ? "✅" : result.error ? "❌" : "⚪";
      const info = result.exists
        ? `${result.documentCount} docs, campos: [${result.sampleData?.join(", ")}]`
        : result.error || "vazia";

      console.log(`${status} ${result.name}: ${info}`);
    });

    console.groupEnd();
  }
}

// Instanciar verificador
const checker = new FirestoreCollectionChecker();

// Expor globalmente para debug
(window as any).firestoreChecker = checker;

console.log("🔍 Firestore Collection Checker disponível. Use:");
console.log(
  "  window.firestoreChecker.checkAllCollections() - verificar coleções",
);
console.log(
  "  window.firestoreChecker.createSampleData() - criar dados de exemplo",
);

export default FirestoreCollectionChecker;
