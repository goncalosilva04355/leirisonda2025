/**
 * Forçar inicialização imediata do Firebase para debug
 */

import { getFirebaseFirestoreAsync } from "../firebase/firestoreConfig";

async function forceInitialize() {
  try {
    console.log("🔄 Forçando inicialização do Firebase...");

    const db = await getFirebaseFirestoreAsync();

    if (db) {
      console.log("✅ Firebase Firestore inicializado com sucesso!");
      console.log("📊 Firestore instance:", db);

      // Expor globalmente para debug
      (window as any).firebaseDb = db;
      console.log("🔍 Firestore disponível em window.firebaseDb");
    } else {
      console.error("❌ Falha ao inicializar Firebase Firestore");
    }
  } catch (error) {
    console.error("❌ Erro ao forçar inicialização do Firebase:", error);
  }
}

// Executar imediatamente
forceInitialize();

// Também executar após 2 segundos para garantir
setTimeout(forceInitialize, 2000);

export { forceInitialize };
