import { getSafeFirestore, isSafeFirestoreReady } from "./safeFirestore";
import { collection, getDocs, query, limit } from "firebase/firestore";

export async function debugFirestore() {
  console.log("🔍 Debugging Firebase Firestore (Safe Mode)...");

  try {
    // Verificar estado
    console.log("🔧 Estado Firestore seguro:", isSafeFirestoreReady());

    // Obter instância segura
    const db = await getSafeFirestore();

    if (!db) {
      console.error("❌ Firestore não inicializado - modo seguro falhou");
      console.log("💡 Soluções possíveis:");
      console.log(
        "1. Verificar se o Firestore está ativado no console Firebase",
      );
      console.log("2. Verificar regras de segurança do Firestore");
      console.log(
        "3. Verificar configuração do projeto (projectId: leiria-1cfc9)",
      );
      console.log(
        "4. Verificar se há conflitos com outras instâncias Firebase",
      );
      return false;
    }

    console.log("✅ Firestore inicializado (modo seguro)");
    console.log("📊 Projeto:", db.app?.options?.projectId || "N/A");

    // Teste básico de leitura
    console.log("🧪 Iniciando testes de coleções...");

    // Verificar coleções comuns
    const commonCollections = [
      "obras",
      "utilizadores",
      "users",
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

        // Se encontrou documentos, listar alguns detalhes
        if (snapshot.size > 0) {
          snapshot.forEach((doc) => {
            console.log(`   📄 Doc ID: ${doc.id}`);
          });
        }
      } catch (error) {
        console.log(`⚠️ Coleção "${collectionName}" não acessível:`, error);
      }
    }

    // Teste de escrita (se regras permitirem)
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const testDoc = doc(db, "debug_tests", "safe_connection_test");

      await setDoc(testDoc, {
        message: "Teste de conexão segura",
        timestamp: new Date().toISOString(),
        status: "OK",
        method: "safe-firestore",
      });

      console.log("✅ Teste de escrita: OK");
    } catch (writeError) {
      console.log("⚠️ Teste de escrita falhou:", writeError);
      console.log("💡 Verifique as regras de segurança do Firestore");
      console.log("💡 Regras sugeridas para teste:");
      console.log(`
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if true;
            }
          }
        }
      `);
    }

    console.log("✅ Debug Firestore completo");
    return true;
  } catch (error) {
    console.error("❌ Erro no debug Firestore:", error);

    // Se erro contém "getImmediate", dar dicas específicas
    if (error.toString().includes("getImmediate")) {
      console.log("💡 Erro getImmediate detectado:");
      console.log(
        "1. Pode haver conflito entre múltiplas inicializações Firebase",
      );
      console.log("2. Tenta recarregar a página");
      console.log("3. Verifica se há múltiplos scripts Firebase carregados");
    }

    return false;
  }
}

// Executar debug com delay maior para evitar conflitos
setTimeout(() => {
  debugFirestore();
}, 3000);

// Segunda tentativa se primeira falhar
setTimeout(() => {
  console.log("🔄 Segunda tentativa de debug (modo seguro)...");
  debugFirestore();
}, 6000);
