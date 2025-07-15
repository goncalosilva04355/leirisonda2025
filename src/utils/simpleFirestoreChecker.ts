/**
 * Verificador simplificado de coleções Firestore
 */

import { collection, getDocs } from "firebase/firestore";

interface SimpleCollectionStatus {
  name: string;
  exists: boolean;
  documentCount: number;
  error?: string;
}

export class SimpleFirestoreChecker {
  async checkAllCollections(): Promise<SimpleCollectionStatus[]> {
    console.log("🔍 Verificação simples de coleções Firestore...");

    const db = (window as any).simpleFirebaseDb;

    if (!db) {
      console.error("❌ Firebase simples não está disponível");
      return [];
    }

    const collections = [
      "works",
      "pools",
      "maintenance",
      "users",
      "clients",
      "locations",
      "notifications",
      "photos",
    ];

    const results: SimpleCollectionStatus[] = [];

    for (const collectionName of collections) {
      try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);

        results.push({
          name: collectionName,
          exists: snapshot.docs.length > 0,
          documentCount: snapshot.docs.length,
        });

        console.log(`✅ ${collectionName}: ${snapshot.docs.length} documentos`);
      } catch (error) {
        results.push({
          name: collectionName,
          exists: false,
          documentCount: 0,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });

        console.error(`❌ Erro em ${collectionName}:`, error);
      }
    }

    return results;
  }

  generateReport(results: SimpleCollectionStatus[]): void {
    console.group("📊 RELATÓRIO SIMPLES DE COLEÇÕES");

    const existing = results.filter((r) => r.exists).length;
    const total = results.length;

    console.log(`Status: ${existing}/${total} coleções com dados`);

    results.forEach((result) => {
      const status = result.exists ? "✅" : result.error ? "❌" : "⚪";
      const info = result.exists
        ? `${result.documentCount} docs`
        : result.error || "vazia";

      console.log(`${status} ${result.name}: ${info}`);
    });

    console.groupEnd();
  }
}

// Instanciar e expor globalmente
const simpleChecker = new SimpleFirestoreChecker();
(window as any).simpleFirestoreChecker = simpleChecker;

console.log(
  "🔧 Simple Firestore Checker disponível em window.simpleFirestoreChecker",
);
