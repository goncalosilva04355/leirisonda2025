import { getFirebaseFirestore } from "../firebase/firestoreConfig";
import { db as fixedDb, checkFirebaseStatus } from "./firebaseDirectFix";
import { collection, getDocs, query, limit } from "firebase/firestore";

export async function debugFirestore() {
  console.log("🔍 Debugging Firebase Firestore...");

  // Verificar estado da correção direta
  const status = checkFirebaseStatus();
  console.log("🔧 Estado da correção:", status);

  try {
    // Tentar primeiro com a correção direta
    let db = fixedDb;

    if (!db) {
      console.log("⚠️ Correção direta falhou, tentando método original...");
      db = getFirebaseFirestore();
    }

    if (!db) {
      console.error(
        "❌ Firestore não inicializado - ambos os métodos falharam",
      );
      console.log("💡 Soluções possíveis:");
      console.log(
        "1. Verificar se o Firestore está ativado no console Firebase",
      );
      console.log("2. Verificar regras de segurança do Firestore");
      console.log(
        "3. Verificar configuração do projeto (projectId: leiria-1cfc9)",
      );
      return false;
    }

    console.log("✅ Firestore inicializado");
    console.log("📊 Projeto:", db.app.options.projectId);

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
    const commonCollections = [
      "obras",
      "utilizadores",
      "dados",
      "test",
      "system_tests",
    ];

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

    // Teste de escrita simples (se regras permitirem)
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const testDoc = doc(db, "debug_tests", "connection_test");

      await setDoc(testDoc, {
        message: "Teste de conexão",
        timestamp: new Date().toISOString(),
        status: "OK",
      });

      console.log("✅ Teste de escrita: OK");
    } catch (writeError) {
      console.log("⚠️ Teste de escrita falhou:", writeError);
      console.log("💡 Verifique as regras de segurança do Firestore");
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

// Executar novamente após 5 segundos se primeiro falhou
setTimeout(() => {
  console.log("🔄 Segunda tentativa de debug...");
  debugFirestore();
}, 5000);
