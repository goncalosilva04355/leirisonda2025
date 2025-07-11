import { getFirebaseFirestore } from "../firebase/firestoreConfig";
import { db as fixedDb, checkFirebaseStatus } from "./firebaseDirectFix";
import { collection, getDocs, query, limit } from "firebase/firestore";

export async function debugFirestore() {
  console.log("🔍 Debugging Firebase Firestore...");

  try {
    const db = getFirebaseFirestore();

    if (!db) {
      console.error("❌ Firestore não inicializado");
      return false;
    }

    console.log("✅ Firestore inicializado");

    // Tentar listar coleções (esto pode não funcionar em regras restritivas)
    try {
      // Tentar ler uma coleção comum
      const testQuery = query(collection(db, "users"), limit(1));
      const snapshot = await getDocs(testQuery);
      console.log('✅ Consegui aceder à coleção "users"');
      console.log(`📊 Documentos encontrados: ${snapshot.size}`);
    } catch (error) {
      console.log('⚠️ Não consegui aceder à coleção "users":', error);
    }

    // Verificar outras coleções possíveis
    const commonCollections = ["obras", "utilizadores", "dados", "test"];

    for (const collectionName of commonCollections) {
      try {
        const testQuery = query(collection(db, collectionName), limit(1));
        const snapshot = await getDocs(testQuery);
        console.log(
          `✅ Coleção "${collectionName}": ${snapshot.size} documentos`,
        );
      } catch (error) {
        console.log(`⚠️ Coleção "${collectionName}" não acessível:`, error);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Erro no debug Firestore:", error);
    return false;
  }
}

// Executar debug automaticamente
setTimeout(() => {
  debugFirestore();
}, 2000);
