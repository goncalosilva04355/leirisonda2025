// Teste simples do Firestore
import { db } from "../firebase/simpleFirestore";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function testSimpleFirestore() {
  console.log("🧪 Testando Firestore simples...");

  try {
    // Teste 1: Verificar se db existe
    if (!db) {
      throw new Error("Firestore não inicializado");
    }

    console.log("✅ Firestore inicializado");

    // Teste 2: Listar coleções existentes
    const collections = ["obras", "utilizadores", "test"];

    for (const collectionName of collections) {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        console.log(
          `📊 Coleção '${collectionName}': ${querySnapshot.size} documentos`,
        );

        querySnapshot.forEach((doc) => {
          console.log(`   - ${doc.id}`);
        });
      } catch (error) {
        console.log(`⚠️ Erro ao aceder '${collectionName}':`, error);
      }
    }

    // Teste 3: Tentar escrever (se regras permitirem)
    try {
      const testRef = await addDoc(collection(db, "test"), {
        message: "Teste de conexão",
        timestamp: new Date(),
      });
      console.log("✅ Teste de escrita OK, ID:", testRef.id);
    } catch (writeError) {
      console.log("⚠️ Teste de escrita falhou (regras?):", writeError);
    }

    console.log("🎉 Firestore está funcional!");
    return true;
  } catch (error) {
    console.error("❌ Erro no teste Firestore:", error);
    return false;
  }
}

// Executar teste automaticamente
setTimeout(() => {
  testSimpleFirestore();
}, 2000);
